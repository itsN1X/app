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
						<View style={styles.requestsContainer}>
							{this.state.requestList.map((value, i) => {
				               return(<View style={{height: 141, width: '100%', alignItems: 'center'}} key={i}><RequestItem onCopy={this.writeToClipboard} from_public_key={value.from_public_key} user_public_key={value.user_public_key} secret={value.secret} date={value.logged_on} new_public_key={value.new_public_key} request_id={value.request_id} /><View style={styles.line} /></View>);
				             })}
						</View>
						<View style={styles.pendingRequestsContainer}>
							<Text style={styles.pendingRequestsTitle}> Pending Requests </Text>
							<View style={styles.requestwrapper}>
								<View style={styles.leftflex}>
									<Text style={styles.name}> @naman </Text>
									<Text style={styles.date}> 22-07-2018 </Text>
								</View>
								<View style={styles.rightflex}>
									<Text style={styles.reject}> X </Text>
									<Text style={styles.accept}> 7 </Text>
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
		paddingVertical:20,
		paddingHorizontal:10
	},
	pendingRequestsTitle : {
		fontFamily: theme.font500,
		fontWeight: Platform.OS === 'ios' ? '500' : '400',
		fontSize: 24
	},
	requestwrapper : {
		flexDirection:'row',
		alignItems:'center'
	},
	name : {
		fontSize:20
	},
	leftflex : {
		flex:1
	},
	rightflex : {
		flexDirection:'row',
		alignItems:'center'
	}
});
