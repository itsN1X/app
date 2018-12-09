import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, BackHandler, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { BarIndicator, WaveIndicator } from 'react-native-indicators';
import axios from 'axios';
import Drawer from 'react-native-drawer';
import StatusBar from '../../common/statusbar';
import AppStatusBar from '../../common/appstatusbar';
import theme from '../../common/theme';
import Loader from '../../common/loader';
import Menu from '../../../../images/menu.png';
import User from '../../../../images/user.png';
import WalletCoinItem from './walletcoinitem';
import SideBar from '../Sidedrawer/drawercontent';
const VirgilCrypto =require('virgil-crypto');
const virgilCrypto = new VirgilCrypto.VirgilCrypto();

export default class Wallets extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			activity: "",
			asset_data: ""
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
	authenticateUser = async () => {
      try {
            const value = await AsyncStorage.getItem('@AccountStatus');
            const recovery = await AsyncStorage.getItem('@RecoveryInitiated');
            var wallet_id = await AsyncStorage.getItem('@WalletID');
            var user_data = await AsyncStorage.getItem('@UserData');
            var guardian = await AsyncStorage.getItem('@Guardian');
            if(recovery === "true") {
            	Actions.prelogin();
            	Actions.recoveryrequests();
            }
            else if(guardian === "true") {
            	Actions.guardiantabs();
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
                console.log(response)
                if(response.data.flag === 404) {
                	Actions.postlogin();
                	Actions.initiatewallets({wallet_id: response.data.wallet_id});
                }
                else {
                	const assetData = response.data.result.asset_data;
                	self.decryptData(assetData, user_data)
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
    decryptData(asset_data, user_data) {
    	var user_data = JSON.parse(user_data);
        var privateKey = virgilCrypto.importPrivateKey(user_data.privateKey);
        const decryptedData = virgilCrypto.decrypt(asset_data, privateKey);
        const decryptedMessage = decryptedData.toString('utf8');
        console.log(decryptedMessage);
        var assetData = decryptedMessage;
        this.saveData(assetData);
    }
    saveData = async (data) => {
    	try {
           await AsyncStorage.setItem('@BTC',data);
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
						<View style={styles.totalBalanceContainer}>
							<Text style={styles.totalBalanceText}>$ 26,052.34</Text>
						</View>
						<ScrollView style={{flex: 1, width: '100%'}}>
							<View style={styles.mainContainer}>
								<View style={{height: 3}} />
								<WalletCoinItem lighticon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/Group+378.png" icon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/Group+380.png" name="Bitcoin" value="5,78,168.98" amount="1.5624" symbol="BTC" onWalletOpen={this.onWalletOpen} />
								<View style={{height: 3}} />
								<WalletCoinItem lighticon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/Group+377.png" icon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/Group+379.png" name="Ethereum" value="45,400.98" amount="1456.2" symbol="ETH" onWalletOpen={this.onWalletOpen} />
								<View style={{height: 3}} />
								<WalletCoinItem lighticon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/light_icons/lmonerol.png" icon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/monero.png" name="Monero" value="13,903.13" amount="12.4523" symbol="XMR" onWalletOpen={this.onWalletOpen} />
								<View style={{height: 3}} />
								<WalletCoinItem lighticon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/gusd_light.png" icon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/gusd_dark.png" name="Gemini Dollar" value="13,903.13" amount="13.556" symbol="GUSD" onWalletOpen={this.onWalletOpen} />
								<View style={{height: 3}} />
								<WalletCoinItem lighticon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/dai_light.png" icon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/dai_dark.png" name="Dai" value="5,78,168.98" amount="12.4523" symbol="DAI" onWalletOpen={this.onWalletOpen} />
								<View style={{height: 3}} />
							</View>
						</ScrollView>
					</View>
				</Drawer>
			);
		}
	}
}
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
		backgroundColor: theme.dark,
		alignItems: 'center',
		justifyContent: 'flex-start',
		borderBottomRightRadius: 25,
		borderBottomLeftRadius: 25,
	},
	totalBalanceText: {
		fontFamily: theme.font500,
		fontSize: 22,
		color: theme.white
	}
});
