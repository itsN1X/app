import React from 'react';
import { StyleSheet, Text, View, Image, Platform, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView, Clipboard, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import Loader from '../../../common/loader';
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

var Unconfirmed = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/reject.png";
var Confirmed = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/accept.png";
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
            		Toast.showWithGravity("No Requests Found!", Toast.LONG, Toast.CENTER);
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
		}
		console.log(decryptedTrustData);
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
					data.from_public_key = trustData[j].user_public_key;
					data.new_public_key = recoveryData[i].new_public_key;
					console.log("My Secret: ",trustData[j].secret);
					console.log("PublicKey: ",recoveryData[i].new_public_key);
					data.secret = this.encryptData(trustData[j].secret, recoveryData[i].new_public_key);
					console.log(data.secret);
					data.request_id = recoveryData[i].request_id;
					data.logged_on = recoveryData[i].logged_on;
					console.log(data);
					requestList.push(data);
				}
				else {}
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
			this.setState({loaded: true})
			var account = JSON.parse(value);
			if(guardian === "true") {
				this.setState({pendingRequestsTitle : "@"+account.username});
			}
			else {
				this.setState({pendingRequestsTitle : "Recovery Requests"});
			}
			this.fetchRequests(account);
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
					{this.props.back ? <AppStatusBar bColor={theme.dark} left={true} Back={Back} leftFunction={this.goBack} center={true} text="Requests" textColor={theme.white} /> : <AppStatusBar bColor={theme.dark} center={true} text={this.state.pendingRequestsTitle} textColor={theme.white} />}
					<ScrollView style={styles.scrollView}>
					{/*}	<View style={styles.requestsContainer}>
							{this.state.requestList.map((value, i) => {
				               return(<View style={{height: 141, width: '100%', alignItems: 'center'}} key={i}><RequestItem onCopy={this.writeToClipboard} from_public_key={value.from_public_key} user_public_key={value.user_public_key} secret={value.secret} date={value.logged_on} new_public_key={value.new_public_key} request_id={value.request_id} /><View style={styles.line} /></View>);
				             })}
						</View>*/}
						<View style={styles.pendingRequestsContainer}>
							<View style={styles.pendingRequestsTitlewrap}>
								<Text style={styles.pendingRequestsTitle}> Pending Requests </Text>
							</View>
							<View style={styles.requestwrapper}>
								<View style={styles.leftflex}>
									<View style={styles.namewrap}>
										<Text style={styles.symbol}>@</Text>
										<Text style={styles.name}>naman</Text>
									</View>
									<View style={styles.datewrap}>
										<Text style={styles.dateTitle}>Requested on</Text>
										<Text style={styles.date}>22-07-2018 </Text>
									</View>
								</View>
								<View style={styles.rightflex}>
									<TouchableOpacity style={styles.reject}>
										<Image
											style={{width: 40, height: 40, opacity:0.5}}
											source={{uri: Unconfirmed}}
										/>
									</TouchableOpacity>
									<TouchableOpacity style={styles.accept}>
										<Image
											style={{width: 40, height: 40, opacity:0.5}}
											source={{uri: Confirmed}}
										/>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.requestwrapper}>
								<View style={styles.leftflex}>
									<View style={styles.namewrap}>
										<Text style={styles.symbol}>@</Text>
										<Text style={styles.name}>naman</Text>
									</View>
									<View style={styles.datewrap}>
										<Text style={styles.dateTitle}>Requested on</Text>
										<Text style={styles.date}>22-07-2018 </Text>
									</View>
								</View>
								<View style={styles.rightflex}>
									<TouchableOpacity style={styles.reject}>
										<Image
										style={{width: 40, height: 40, opacity:0.5}}
											source={{uri: Unconfirmed}}
										/>
									</TouchableOpacity>
									<TouchableOpacity style={styles.accept}>
										<Image
										style={{width: 40, height: 40, opacity:0.5}}
											source={{uri: Confirmed}}
										/>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.requestwrapper}>
								<View style={styles.leftflex}>
									<View style={styles.namewrap}>
										<Text style={styles.symbol}>@</Text>
										<Text style={styles.name}>naman</Text>
									</View>
									<View style={styles.datewrap}>
										<Text style={styles.dateTitle}>Requested on</Text>
										<Text style={styles.date}>22-07-2018 </Text>
									</View>
								</View>
								<View style={styles.rightflex}>
									<TouchableOpacity style={styles.reject}>
										<Image
										style={{width: 40, height: 40, opacity:0.5}}
											source={{uri: Unconfirmed}}
										/>
									</TouchableOpacity>
									<TouchableOpacity style={styles.accept}>
										<Image
										style={{width: 40, height: 40, opacity:0.5}}
											source={{uri: Confirmed}}
										/>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.requestwrapper}>
								<View style={styles.leftflex}>
									<View style={styles.namewrap}>
										<Text style={styles.symbol}>@</Text>
										<Text style={styles.name}>naman</Text>
									</View>
									<View style={styles.datewrap}>
										<Text style={styles.dateTitle}>Requested on</Text>
										<Text style={styles.date}>22-07-2018 </Text>
									</View>
								</View>
								<View style={styles.rightflex}>
									<TouchableOpacity style={styles.reject}>
										<Image
										style={{width: 40, height: 40, opacity:0.5}}

											source={{uri: Unconfirmed}}
										/>
									</TouchableOpacity>
									<TouchableOpacity style={styles.accept}>
										<Image
										style={{width: 40, height: 40, opacity:0.5}}

											source={{uri: Confirmed}}
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>

						<View style={styles.walletIProtectContainer}>
							<View style={styles.walletIProtectTitlewrap}>
								<Text style={styles.walletIProtectTitle}> Wallets I Protect</Text>
							</View>
							<View style={styles.protectwrapper}>
								<View style={styles.leftflex}>
									<View style={styles.namewrap}>
										<Text style={styles.symbol}>@</Text>
										<Text style={styles.name}>naman</Text>
									</View>
									<View style={styles.datewrap}>
										<Text style={styles.dateTitle}>Since</Text>
										<Text style={styles.date}>22-07-2018 </Text>
									</View>
								</View>
								<View style={styles.rightflex}>
									<TouchableOpacity style={styles.accept}>
										<Image
											style={{width: 30, height: 30}}
											source={{uri: Protected}}
										/>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.protectwrapper}>
								<View style={styles.leftflex}>
									<View style={styles.namewrap}>
										<Text style={styles.symbol}>@</Text>
										<Text style={styles.name}>naman</Text>
									</View>
									<View style={styles.datewrap}>
										<Text style={styles.dateTitle}>Since</Text>
										<Text style={styles.date}>22-07-2018 </Text>
									</View>
								</View>
								<View style={styles.rightflex}>
									<TouchableOpacity style={styles.accept}>
										<Image
											style={{width: 30, height: 30}}
											source={{uri: Protected}}
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>
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
		marginBottom:20
	},
	protectwrapper : {
		flexDirection:'row',
		alignItems:'center',
		marginBottom:10,
		height:50
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
	leftflex : {
		flex:1
	},
	rightflex : {
		flexDirection:'row',
		alignItems:'center'
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
		backgroundColor:theme.grey,
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
});
