import React from 'react';
import { StyleSheet,Text, View, Image, Platform, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView, Clipboard, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import Loader from '../../../common/loader';
import Button from '../../../common/button';
import { BarIndicator } from 'react-native-indicators';
import Toast from 'react-native-simple-toast';
import RequestItem from './requestitem';
import StatusBar from '../../../common/statusbar';
import AppStatusBar from '../../../common/appstatusbar';
import theme from '../../../common/theme';
const crypto = require('react-native-crypto');
const VirgilCrypto =require('virgil-crypto');
const virgilCrypto = new VirgilCrypto.VirgilCrypto();

var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";
var sad = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/sad.png";
var guardian = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/gaurdian-man.png";
var Unconfirmed = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/reject.png";
var Confirmed = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/accept.png";
var Protected = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/confirmed.png";

export default class PendingRequests extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			pendingRequestsTitle: "",
			requestList: []
		};
	}
	goBack() {
		Actions.pop();
	}
	componentWillMount() {
		this.getAccountInfo();
	}
	componentWillReceiveProps() {
		this.setState({loaded: false})
		this.getAccountInfo();
	}

	copyToClipboard = async (str) => {
	  await Clipboard.setString(str);
	  Toast.showWithGravity('Copied to Clipboard!', Toast.LONG, Toast.CENTER)
	};
	fetchRequests = async (account) => {
		var data = {};
		data.publicKey = account.publicKey;
		console.log(data);
		const self = this;
		try {
            axios({
                method: 'post',
                url: 'http://159.65.153.3:7001/recovery_key/fetch_recovery_data',
                data: data
            })
            .then(function (response) {
            	console.log(response);
            	if(response.data.status === "0" || response.data.recoveryData.length === 0) {
            		self.setState({ loaded: true, requestList: [] });
            	}
            	else {
            		self.decryptTrustData(response.data, account);
            	}
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        catch(error) {
            console.log(error);
        }
	}
	decryptTrustData(data, account) {
		var decryptedTrustData = [];
		data.trustData;
		for( i = 0; i < data.trustData.length; i++) {
			decryptedTrustData[i] = this.decryptData(data.trustData[i].trust_data, account.privateKey);
		};
		this.checkRequests(decryptedTrustData, data.recoveryData, account.publicKey)
	}
	decryptData(encryptedData, privateKeyStr) {
		const privateKey = virgilCrypto.importPrivateKey(privateKeyStr);
		const decryptedDataStr = virgilCrypto.decrypt(encryptedData, privateKey);
		var decryptedData =  decryptedDataStr.toString('utf8');
		decryptedData = JSON.parse(decryptedData);
		return decryptedData;
	}
	checkRequests(trustData, recoveryData, publicKey) {
		var requestList = [];
		for(i = 0; i < recoveryData.length; i++) {
			for(j = 0; j < trustData.length; j++) {
				if(trustData[j].user_public_key === recoveryData[i].from_public_key) {
					data = {};
					data.user_public_key = publicKey;
					data.username = trustData[j].username;
					data.from_public_key = trustData[j].user_public_key;
					data.new_public_key = recoveryData[i].new_public_key;
					data.secret = this.encryptData(trustData[j].secret, recoveryData[i].new_public_key);
					data.request_id = recoveryData[i].request_id;
					data.logged_on = recoveryData[i].logged_on;
					requestList.push(data);
				}
			}
		}
		this.setState({loaded: true, requestList: requestList});
	}
	encryptData(messageToEncrypt, publicKeyStr) {
		const publicKey = virgilCrypto.importPublicKey(publicKeyStr);
		const encryptedDataStr = virgilCrypto.encrypt(messageToEncrypt, publicKey);
		const encryptedData =  encryptedDataStr.toString('base64');
		return encryptedData;
	}
	getAccountInfo = async () => {
		try{
			const value = await AsyncStorage.getItem('@UserData');
			var guardian = await AsyncStorage.getItem('@Guardian');
			var account = JSON.parse(value);
				this.setState({pendingRequestsTitle : "@"+account.username});



			this.setState({activity: "Fetching Requests"}, () => {
				requestAnimationFrame(()=>this.fetchRequests(account), 0);
			})

		}
		catch(error) {
			this.setState({loaded: true})
			global.NotificationUtils.showError(error);
		}
	}
	writeToClipboard = async (address) => {
      await Clipboard.setString(address);
      Toast.showWithGravity('Copied to Clipboard!', Toast.LONG, Toast.CENTER)
    };
	render() {
		if(!this.state.loaded) {
            return(<Loader activity="Fetching Recovery Requests"/>)
        }
        else {
			return (
				<View style={styles.container}>
					<StatusBar bColor={theme.dark} />
					{this.props.back ? <AppStatusBar bColor={theme.dark} left={true} Back={Back} leftFunction={this.goBack} center={true} text={this.state.pendingRequestsTitle} textColor={theme.white} /> : <AppStatusBar bColor={theme.dark} center={true} text={this.state.pendingRequestsTitle} textColor={theme.white} />}
					<ScrollView style={styles.scrollView}>
					{<View style={styles.requestsContainer}>
							{this.state.requestList.map((value, i) => {
				               return(<View style={{height: 141, width: '100%', alignItems: 'center'}} key={i}><RequestItem onCopy={this.writeToClipboard} from_public_key={value.from_public_key} user_name={value.username} user_public_key={value.user_public_key} secret={value.secret}  new_public_key={value.new_public_key} request_id={value.request_id} /><View style={styles.line} /></View>);
				             })}
						</View>}


						{this.state.requestList.length == 0 ?  (
							<View style={{height: Dimensions.get('window').height-160, flex:1, padding:'10%',alignItems:'center', justifyContent:'center'}}>
								<Image
									style={{width:150,height:150, opacity:0.75}}
									source={{uri: guardian}}
								/>
								<Text style={{fontSize:18, opacity:0.5, color:theme.dark, fontFamily:theme.font, marginTop:20}}>Oops, you dont have any request yet</Text>
								<View style={styles.recoverButtonContainer}>
								<Button bColor={theme.dark} onPress={() => this.copyToClipboard(this.state.pendingRequestsTitle.replace('@',''))}>
									<Text>Copy Username</Text>
								</Button>
								</View>
							</View>
						): null}

					{	/*<View style={styles.pendingRequestsContainer}>
							<View style={styles.pendingRequestsTitlewrap}>
								<Text style={styles.pendingRequestsTitle}> Pending Requests </Text>
							</View>
							<View style={styles.requestwrapper}>
								<View style={styles.topflex}>
									<View style={styles.namewrap}>
										<Text style={styles.symbol}>@</Text>
										<Text style={styles.name}>naman</Text>
									</View>
									<View style={styles.datewrap}>
										<Text style={styles.dateTitle}>Requested on</Text>
										<Text style={styles.date}>22-07-2018 </Text>
									</View>
								</View>
								<View style={styles.bottomflex}>
									<TouchableOpacity style={styles.reject}>
										<View style={styles.rejectIconWrapper}>
											<Image
												style={styles.rejectIcon}
												source={{uri: Unconfirmed}}
											/>
											<Text style={styles.rejectText}>Ignore</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity style={styles.accept}>
										<View style={styles.acceptIconWrapper}>
											<Image
												style={styles.acceptIcon}
												source={{uri: Confirmed}}
											/>
											<Text style={styles.acceptText}>Accept</Text>
										</View>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.requestwrapper}>
								<View style={styles.topflex}>
									<View style={styles.namewrap}>
										<Text style={styles.symbol}>@</Text>
										<Text style={styles.name}>naman</Text>
									</View>
									<View style={styles.datewrap}>
										<Text style={styles.dateTitle}>Requested on</Text>
										<Text style={styles.date}>22-07-2018 </Text>
									</View>
								</View>
								<View style={styles.bottomflex}>
									<TouchableOpacity style={styles.reject}>
										<View style={styles.rejectIconWrapper}>
											<Image
												style={styles.rejectIcon}
												source={{uri: Unconfirmed}}
											/>
											<Text style={styles.rejectText}>Ignore</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity style={styles.accept}>
										<View style={styles.acceptIconWrapper}>
											<Image
												style={styles.acceptIcon}
												source={{uri: Confirmed}}
											/>
											<Text style={styles.acceptText}>Accept</Text>
										</View>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.requestwrapper}>
								<View style={styles.topflex}>
									<View style={styles.namewrap}>
										<Text style={styles.symbol}>@</Text>
										<Text style={styles.name}>naman</Text>
									</View>
									<View style={styles.datewrap}>
										<Text style={styles.dateTitle}>Requested on</Text>
										<Text style={styles.date}>22-07-2018 </Text>
									</View>
								</View>
								<View style={styles.bottomflex}>
									<TouchableOpacity style={styles.reject}>
										<View style={styles.rejectIconWrapper}>
											<Image
												style={styles.rejectIcon}
												source={{uri: Unconfirmed}}
											/>
											<Text style={styles.rejectText}>Ignore</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity style={styles.accept}>
										<View style={styles.acceptIconWrapper}>
											<Image
												style={styles.acceptIcon}
												source={{uri: Confirmed}}
											/>
											<Text style={styles.acceptText}>Accept</Text>
										</View>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.requestwrapper}>
								<View style={styles.topflex}>
									<View style={styles.namewrap}>
										<Text style={styles.symbol}>@</Text>
										<Text style={styles.name}>naman</Text>
									</View>
									<View style={styles.datewrap}>
										<Text style={styles.dateTitle}>Requested on</Text>
										<Text style={styles.date}>22-07-2018 </Text>
									</View>
								</View>
								<View style={styles.bottomflex}>
									<TouchableOpacity style={styles.reject}>
										<View style={styles.rejectIconWrapper}>
											<Image
												style={styles.rejectIcon}
												source={{uri: Unconfirmed}}
											/>
											<Text style={styles.rejectText}>Ignore</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity style={styles.accept}>
										<View style={styles.acceptIconWrapper}>
											<Image
												style={styles.acceptIcon}
												source={{uri: Confirmed}}
											/>
											<Text style={styles.acceptText}>Accept</Text>
										</View>
									</TouchableOpacity>
								</View>
							</View>

						</View>

						<View style={styles.walletIProtectContainer}>
							<View style={styles.walletIProtectTitlewrap}>
								<Text style={styles.walletIProtectTitle}> Wallets I Protect</Text>
							</View>
							<View style={styles.protectwrapper}>
								<View style={styles.topflex}>
									<View style={styles.namewrap}>
										<Text style={styles.symbol}>@</Text>
										<Text style={styles.name}>naman</Text>
									</View>
									<View style={styles.datewrap}>
										<Text style={styles.dateTitle}>Since</Text>
										<Text style={styles.date}>22-07-2018 </Text>
									</View>
								</View>
							</View>
						</View>*/}
					</ScrollView>
				</View>
			);
		}
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
	    backgroundColor: theme.white,
	    alignItems: 'center',
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
	line: {
		height: 1,
		width: '100%',
		backgroundColor: theme.grey
	},
	pendingRequestsContainer : {
		flex:1,
		paddingVertical:20,
		paddingHorizontal:10
	},
	pendingRequestsTitlewrap : {
		alignItems:"center"
	},
	pendingRequestsTitle : {
		fontFamily: theme.font500,
		fontWeight: Platform.OS === 'ios' ? '500' : '400',
		fontSize: 22,
		color:theme.dark,
		marginBottom:25,
	},
	requestwrapper : {
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
		marginBottom:15,
		backgroundColor: theme.grey,
		paddingHorizontal:15,
		paddingVertical:15,
		borderRadius:10
	},
	protectwrapper : {
		flexDirection:'column',
		marginBottom:20,
		backgroundColor: theme.grey,
		paddingHorizontal:15,
		paddingVertical:15,
		borderRadius:10
	},
	namewrap : {
		flexDirection: 'row'
	},
	symbol : {
		fontSize:16,
		opacity:0.5,
		marginRight:2
	},
	name : {
		fontSize:20,
		fontFamily: theme.Lato
	},
	datewrap : {
		flexDirection:"row"
	},
	dateTitle : {
		fontSize:12,
		opacity:0.5,
		marginRight:5,
		fontStyle:"italic"
	},
	date :{
		fontSize:12,
		opacity:0.75,
	},
	topflex : {
		flex:1,
		flexDirection:"column",
		alignItems:'flex-start',
		justifyContent:'space-between',
	},
	bottomflex : {
		flexDirection:'row',
		alignItems:'flex-end',
		justifyContent:'flex-end',

	},
	acceptIconWrapper : {
		alignItems:'center',
	},
	acceptText : {
		fontFamily:theme.font
	},
	acceptIcon : {
		width:25,
		height:25
	},
	rejectIconWrapper : {
		alignItems:'center',
	},
	rejectText : {
		fontFamily:theme.font
	},
	rejectIcon : {
		width:25,
		height:25
	},
	accept : {
		height:50,
		width:50,
		alignItems:'center',
		justifyContent:'center'
	},
	reject : {
		height:50,
		width:50,
		alignItems:'center',
		justifyContent:'center',
		marginRight:10
	},
	walletIProtectContainer : {
		paddingVertical:20,
		paddingHorizontal:10
	},
	walletIProtectTitlewrap : {
		alignItems:"center"
	},
	walletIProtectTitle : {
		fontFamily: theme.font500,
		fontWeight: Platform.OS === 'ios' ? '500' : '400',
		fontSize: 22,
		marginBottom:25,
		color:theme.dark
	},
	recoverButtonContainer: {
		position: 'absolute',
		width: '100%',
		alignItems: 'center',
		bottom: 0,
		marginBottom: 15
	}
});
