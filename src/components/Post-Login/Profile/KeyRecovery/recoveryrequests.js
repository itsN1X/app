import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, BackHandler, AsyncStorage, Clipboard} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { BarIndicator } from 'react-native-indicators';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import RecoveryRequestItem from './recoveryrequestitem';
import theme from '../../../common/theme';
import StatusBar from '../../../common/statusbar';
import AppStatusBar from '../../../common/appstatusbar';
import Button from '../../../common/button';

var Copy = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png";
var FloatingRefresh = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/float_refresh.png";
var backCount = 0;
export default class RecoveryRequests extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			requestList: [],
			friends:[],
			oldPublicKey: "",
			newPrivatekey: "",
			ready: false,
		};
		this.onRefresh = this.onRefresh.bind(this);
		this.recoverMnemonic = this.recoverMnemonic.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
	}
	componentWillMount() {
		this.getUserInfo();
	}
	onRefresh() {
		this.getRecoveryDetails(this.state.oldPublicKey)
	}
	getUserInfo = async () => {
		try{
			const oldPublicKey = await AsyncStorage.getItem('@OldPublicKey');
			const newPrivateKey = await AsyncStorage.getItem('@NewPrivateKey');
			const friends = await AsyncStorage.getItem('@Friends');

			this.setState({friends: JSON.parse(friends),oldPublicKey: oldPublicKey, newPrivateKey: newPrivateKey});
			this.getRecoveryDetails(oldPublicKey);
		}
		catch(error) {
			console.log(error)
		}
	}
	componentDidMount() {
				BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		}
		componentWillUnmount() {
				BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		}
		handleBackButton = () =>  {
			backCount = backCount + 1;
			if(backCount === 1) {
				Toast.showWithGravity('Press again to EXIT', Toast.LONG, Toast.BOTTOM)
			}
			else {
				BackHandler.exitApp();
			}
				return true;
		}


    writeToClipboard = async (address) => {
      await Clipboard.setString(address);
      Toast.showWithGravity('Copied to Clipboard!', Toast.LONG, Toast.CENTER)
    };
	getRecoveryDetails = async (publicKey) => {
		var data = {};
		data.publicKey = publicKey;
		try {
    		var self = this;
            axios({
                method: 'post',
                url: 'http://159.65.153.3:7001/recovery_key/fetch_recovery_trust_data',
                data: data
            })
            .then(function (response) {
								var approvals = 0;
                if(response.data.flag === 143) {
								var requestArr = response.data.result;
								var friends = self.state.friends;
								for(i=0 ; i < friends.length ; i++){
									if(friends[i].address == requestArr[i].user_public_key){
										requestArr[i].friendsHandle = friends[i].friendsHandle;
									}
								}

							for(j=0 ; j < requestArr.length ; j++){
								if(requestArr[j].trust_status == 1) {
									approvals++;
								}
							}

							if(requestArr.length == 3 && approvals == 2){
									self.setState({loaded: true,requestList: requestArr, ready: true});
							}

							else if(requestArr.length == 5 &&  approvals == 3) {
            		self.setState({loaded: true,requestList: requestArr, ready: true});
			        }
			        else {
			        	self.setState({loaded: true,requestList: requestArr, ready: false})
			        }
            	}
            	else {
            		Toast.showWithGravity(response.data.log, Toast.LONG, Toast.CENTER);
            		self.setState({loaded: true})
            	}
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        catch(error) {
            alert(error);
        }
	}
	recoverMnemonic() {
		this.setState({loaded: false}, () => {
			requestAnimationFrame(() => {Actions.showmnemonic({publicKey:this.state.oldPublicKey, privateKey: this.state.newPrivateKey, data: this.state.requestList })}, 0)
		});
	}
	render() {
		if(!this.state.loaded) {
            return(<View style={{flex:1, backgroundColor: theme.white}}><BarIndicator color={theme.dark} size={50} count={5} /></View>)
        }
        else {
			return (
				<View style={styles.container}>
					<StatusBar bColor={theme.white} />
					<AppStatusBar bColor={theme.dark} center={true} text="Recovery" textColor={theme.white} />
					<ScrollView style={styles.scrollView}>
						<View style={styles.requestsContainer}>
							{this.state.requestList.map((value, i) => {
			                      return(<RecoveryRequestItem key={i} id={i} onCopy={this.writeToClipboard} user_public_key={value.friendsHandle} status={value.trust_status} />);
							})}
						</View>
						{this.state.ready ? <View style={{height: 100, width: '100%'}}></View> : null}
					</ScrollView>
					{this.state.ready ?
						(<View style={styles.recoverButtonContainer}>
							<Button bColor={theme.dark} onPress={this.recoverMnemonic}>
								<Text style={styles.nextText}>Recover Mnemonic</Text>
							</Button>
						</View>):
						(<TouchableOpacity style={styles.refresh} onPress={this.onRefresh}>
							<Image style={styles.refreshIcon} source={{uri: FloatingRefresh}} />
						</TouchableOpacity>)}
				</View>
			);
		}
	}
}
const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.white,
		flex: 1,
		alignItems: 'center'
	},
	scrollView: {
		flex: 1,
		width: '100%',
	},
	requestsContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
	},
	refresh: {
		position: 'absolute',
		bottom: 20,
		right: 15,
	},
	refreshIcon: {
		width: 80,
		height: 80
	},
	recoverButtonContainer: {
		position: 'absolute',
		width: '100%',
		alignItems: 'center',
		bottom: 0,
		marginBottom: 15
	}

});
