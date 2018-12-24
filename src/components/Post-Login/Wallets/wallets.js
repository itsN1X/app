import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, BackHandler, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { BarIndicator, WaveIndicator } from 'react-native-indicators';
import axios from 'axios';
import Drawer from 'react-native-drawer';
import StatusBar from '../../common/statusbar';
import Toast from 'react-native-simple-toast';
import AppStatusBar from '../../common/appstatusbar';
import theme from '../../common/theme';
import Loader from '../../common/loader';
import Menu from '../../../../images/menu.png';
import User from '../../../../images/user.png';
import WalletCoinItem from './walletcoinitem';
import SideBar from '../Sidedrawer/drawercontent';
const VirgilCrypto =require('virgil-crypto');
const virgilCrypto = new VirgilCrypto.VirgilCrypto();
var walletCount = 0;
export default class Wallets extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			activity: "",
			asset_data: "",
			coinData: "",
			balance:"",
			newData:[]
		};
		this.onWalletOpen = this.onWalletOpen.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);
		this.openDrawer = this.openDrawer.bind(this);
		this.saveData = this.saveData.bind(this);
		this.decryptData = this.decryptData.bind(this);
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
	}
	componentWillMount() {
		this.setState({activity: "Authenticating User"}, () => {
			requestAnimationFrame(()=>this.authenticateUser(), 0);
		})
	}

	componentDidMount() {
				BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		}
		componentWillUnmount() {
				BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		}
		handleBackButton = () =>  {
			walletCount = walletCount + 1;
			if(walletCount === 1) {
				Toast.showWithGravity('Press again to EXIT', Toast.LONG, Toast.BOTTOM)
			}
			else if(walletCount > 1) {
				walletCount = null;
				BackHandler.exitApp();
			}
				return true;
		}
	authenticateUser = async () => {
      try {
				 		walletCount = 0;
            const value = await AsyncStorage.getItem('@AccountStatus');
            const recovery = await AsyncStorage.getItem('@RecoveryInitiated');
            var wallet_id = await AsyncStorage.getItem('@WalletID');
            var user_data = await AsyncStorage.getItem('@UserData');
            var guardian = await AsyncStorage.getItem('@Guardian');
            if(recovery === "true") {
            	Actions.postlogin();
            	Actions.recoveryrequests();
            }
            else if(guardian === "true") {
            	Actions.guardiantabs();
							Actions.pendingrequests();
            }
            else {
            	if(!user_data) {
            		Actions.prelogin();
            		Actions.push('firstscreen');
            	}
            	else {
	            	if(value === 'LoggedIn' || this.props.loggedIn) {

	            		if(!this.props.wallet_id) {
	            			if(!wallet_id) {
	            				Actions.prelogin();
	            				Actions.push('firstscreen');
	            			}
	            			else {
	            				wallet_id = wallet_id;
	            			}
	            		}
	            		else {
	            			wallet_id = this.props.wallet_id;
	            		}
	            	if(this.props.new===true) {
	            		this.decryptData( this.props.coin_data, this.props.user_data )
	            	}
	            	this.setState({activity: "Fetching User Assets"}, () => {
						requestAnimationFrame(()=>this.getCoinData(wallet_id, user_data), 0);
					});
		            }
		            else if(!this.props.loggedIn) {
		            	Actions.prelogin();
		            	Actions.push('firstscreen');
		            }
		            else {
		            	Actions.prelogin();
		            	Actions.push('firstscreen');
		            }
	            }
	        }
        }
      catch(error) {
            console.log(error);
            Actions.push('firstscreen');
        }
    }
    getCoinData(wallet_id, user_data) {
    	var data = {};
    	data.wallet_id = wallet_id;
    	try {
    		var self = this;
            axios({
                method: 'post',
                url: 'http://206.189.137.43:4013/fetch_user_asset_data',
                data: data
            })
            .then(function (response) {

							if(response.data.result.length == 0){
									Actions.postlogin();
                	Actions.initiatewallets({wallet_id: wallet_id});
							}
							if(response.data.result.length > 0){
								self.decryptData(response.data.result, user_data , data.wallet_id)
							}
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        catch(error) {
            self.setState({loaded: true});
            alert("Network Error")
        }
    }
    decryptData(asset_data, user_data,wallet_id) {
			var coinsData = [];
    	var user_data = JSON.parse(user_data);
			var privateKey = virgilCrypto.importPrivateKey(user_data.privateKey);
			for(i =0 ; i < asset_data.length; i++){
				var smartData = {};
				const decryptedData = virgilCrypto.decrypt(asset_data[i].asset_data, privateKey);
        const decryptedMessage = decryptedData.toString('utf8');
				coinsData.push(JSON.parse(decryptedMessage));
			}
				this.fetchBalances(coinsData,wallet_id);
				this.setState({decryptedCoinsData:JSON.stringify(coinsData)});
        this.saveData(JSON.stringify(coinsData));
    }


	fetchBalances(coinsData,wallet_id){
		var user = {};
		user.wallet_id = wallet_id;
		user.addresses = [coinsData[0].address];
		try {
			var self = this;
			axios({
					method: 'post',
					url: 'http://206.189.137.43:4013/get_user_data',
					data:user
				})
				.then(function (response) {
					 self.setState({newData : response.data.assetData});
				})
				.catch(function (error) {
				});
		}
		catch(error) {
			alert(error);
		}
	}





	fetchPrices(){
			try {
				var self = this;
				axios({
				    method: 'post',
				    url: 'http://206.189.137.43:4013/show_all_coins',
			    })
			    .then(function (response) {
			       self.setState({ coinData: response.data.data});
			    })
			    .catch(function (error) {
			    });
			}
			catch(error) {
				alert(error);
			}
		}

    saveData = async (data) => {
    	try {
           await AsyncStorage.setItem('@CoinsData',data);
           this.setState({ loaded: true })
       }
       catch(error) {
           console.log(error)
       }
    }
    componentWillReceiveProps(nextProps) {
		if (nextProps.loggedIn === true) {
			if(nextProps.new === true) {
				this.decryptData(nextProps.coin_data, nextProps.user_data);
			}
			else {
				this.getCoinData(nextProps.wallet_id, nextProps.user_data);
			}
		}
		else {
			Actions.push('firstscreen');
		}
	}
	componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        return true;
    }
	gotoProfile() {
 		Actions.profile();
	}
	closeDrawer = () => {
		const self = this;
    	self._drawer.close()
  	};
  	openDrawer = () => {
  		const self = this;
    	self._drawer.open()
  	};
  	onWalletOpen(walleticon, walletname, walletsymbol, walletvalue, walletamount){
  		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  		Actions.mainscreen({ walleticon: walleticon, walletname: walletname, walletsymbol: walletsymbol, walletvalue: walletvalue, walletamount: walletamount })
  	}

		onReceiveOpen(address){
			BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
			Actions.recieve({ address: address});
		}

		onSendOpen(address,privateKey,balance,utxo){
			BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
			Actions.send({ utxo: utxo, fromAddress: address, privateKey: privateKey,balance });
		}

	render () {
		if(!this.state.loaded) {
            return(<Loader activity={this.state.activity} />);
        }
        else {
			return (
				<Drawer
			      ref={(ref) => { this._drawer = ref; }}
			      type="overlay"
			      content={<SideBar navigator={this._navigator} closeDrawer={this.closeDrawer} mainDrawer={false} />}
			      openDrawerOffset={0.2}
			      panCloseMask={0.35}
			      panOpenMask={0.2}
			      tapToClose={true}
			   	  tweenDuration={150}
			      closedDrawerOffset={-3}
			      panThreshold={0.05}
			      elevation={2}
			      styles={drawerStyles}
			      tweenHandler={(ratio) => ({
			        mainOverlay: { opacity: ratio / 1.5 },
			      })}
			      onClose={() => this.closeDrawer()}>
						<View style={styles.container}>
												<StatusBar bColor={theme.dark} />
												<AppStatusBar bColor={theme.dark} center={true} text="Wallets" textColor={theme.white} />
												<View style={{flex: 1, width: '100%'}} scrollEventThrottle={16}>
												<ScrollView style={{flex: 1, width: '100%'}}>
													<View style={styles.mainContainer}>
														<View style={{height: 3}} />
														{this.state.newData.map((value, i) => {
									                         return(<WalletCoinItem key={value.asset_id} symbol={value.asset_symbol} value={value.asset_value } amount={value.asset_balance || 0} lighticon={value.asset_icon_light} icon={value.asset_icon_dark} name={value.asset_name} currency={this.state.currency} onWalletOpen={this.onWalletOpen} />);
									                    })}
													<View style={{height: 3}} />
													</View>
												</ScrollView>
												</View>
											</View>
				</Drawer>
			);
		}
	}
}
//
// {this.state.coinData.map((value, i) => {
// 							 return(<WalletCoinItem key={value.asset_id} symbol={value.asset_symbol} value={value.asset_value} amount={1.23} lighticon={value.asset_icon_light} icon={value.asset_icon_dark} name={value.asset_name} currency={this.state.currency} onWalletOpen={this.onWalletOpen} />);
// 					})}
const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
  mainOverlay: { backgroundColor: 'black', opacity: 0},
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
	    backgroundColor: theme.white,
	    alignItems: 'center'
	},
	mainContainer: {
		flex: 1,
		width: '100%',
		marginTop: 6
	},
	totalBalanceContainer: {
		height: 50,
		width: '100%',
		// backgroundColor: theme.dark,
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	totalBalanceText: {
		fontFamily: theme.font500,
		fontSize: 24,
		color: theme.white
	}
});
