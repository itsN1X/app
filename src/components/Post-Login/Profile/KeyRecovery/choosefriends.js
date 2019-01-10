import React from 'react';
import { StyleSheet, Alert,Picker,BackHandler,Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, TextInput, AsyncStorage, Clipboard } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import ElevatedView from 'react-native-elevated-view';
import FriendItem from './frienditem';
import Loader from '../../../common/loader';
import theme from '../../../common/theme';
import SharmirPicker from '../../../common/shamirPicker';
import StatusBar from '../../../common/statusbar';
import AppStatusBar from '../../../common/appstatusbar';
import Button from '../../../common/button';
const crypto = require('react-native-crypto');
const Cryptr = require('cryptr');
const secrets = require('secret-sharing.js');
const VirgilCrypto =require('virgil-crypto');
const virgilCrypto = new VirgilCrypto.VirgilCrypto();

var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/darkback.png";
var arrow = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/down.png";

var friends;

export default class ChooseFriends extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activity: "",
			maxDevices:3,
			minDevices:2,
			shamirValue:"2/3",
			mode: "",
			pickerEnabled: false,
			loaded: false,
			mnemonic: "",
			address: "",
			wallet_id: "",
			old_public_key: "",
			new_public_key: "",
			new_private_key: "",
			publicKey: "",
			friends: [],
			length: 0,
			shares: "",
			friendsAdded: false,
			friendsPublickey: ""
		};
		this.onAddPress = this.onAddPress.bind(this);
		this.pushFriendData = this.pushFriendData.bind(this);
		this.getSecretParts = this.getSecretParts.bind(this);
		this.enablePicker = this.enablePicker.bind(this);
		this.getNewKeys = this.getNewKeys.bind(this);
		this.onSavePress = this.onSavePress.bind(this);
		this.createTrustData = this.createTrustData.bind(this);
		this.createRecoveryTrustData = this.createRecoveryTrustData.bind(this);
		this.sendTrustData = this.sendTrustData.bind(this);
		this.sendRecoveryTrustData = this.sendRecoveryTrustData.bind(this);
		this.writeToClipboard = this.writeToClipboard.bind(this);
	}
	componentWillMount() {
		if(this.props.mode==="register") {
			this.getMnemonic();
		}
		else {
			this.getNewKeys();
		}
	}


	componentDidMount() {
				BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		}
		componentWillUnmount() {
				BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		}
		handleBackButton = () =>  {
		if(this.props.mode == "register"){
			Actions.initiaterecovery();
		}
		else{
			Actions.popTo('enteremail');
		}
		 return true;
		}


	enablePicker() {
			this.setState({ pickerEnabled: true});
		}



	getNewKeys() {
		const keyPair = virgilCrypto.generateKeys();
		const privateKeyData = virgilCrypto.exportPrivateKey(keyPair.privateKey);
		const publicKeyData = virgilCrypto.exportPublicKey(keyPair.publicKey);
		const privateKey = privateKeyData.toString('base64');
		const publicKey = publicKeyData.toString('base64');
		this.setState({email: this.props.email, old_public_key: this.props.old_public_key, wallet_id: this.props.wallet_id, loaded: true, new_public_key: publicKey, new_private_key: privateKey});
		this.savePublicKey(this.props.old_public_key, privateKey);
	}
	savePublicKey = async (oldPublicKey, newPrivateKey) => {
		try {
			await AsyncStorage.setItem('@OldPublicKey', oldPublicKey);
			await AsyncStorage.setItem('@NewPrivateKey', newPrivateKey);
		}
		catch(error) {
			console.log(error);
		}
	}
	getMnemonic = async () => {
		try{
			const value = await AsyncStorage.getItem('@UserData');
			const mnemonicstr = JSON.parse(value);
			const mnemonic = mnemonicstr.mnemonic;
			this.setState({mnemonic: mnemonic, publicKey: mnemonicstr.publicKey, username: mnemonicstr.username, loaded: true});
		}
		catch(error) {
			console.log(error)
		}
	}
	goBack() {
		Actions.popTo('enteremail');
	}
	pushFriendData() {
		var friends = this.state.friends;
		var length = friends.length;
		var data = {};
		data.address = this.state.friendsPublickey;
		data.friendsHandle = this.state.friendsHandle;
		data.id = length + 1;
		friends.push(data);
		if(data.id === this.state.maxDevices) {
			this.setState({friends: friends, friendsAdded: true, length: data.id, address: ""});
		}
		else {
			this.setState({friends: friends, length: data.id, address: ""});
		}
	}
	getSecretParts(mnemonic){
		const cryptr = new Cryptr('Hello');
		const encryptedString = cryptr.encrypt(mnemonic);
		var shares = secrets.share(encryptedString, this.state.maxDevices, this.state.minDevices);
		return shares;
	}
	onAddPress() {
		const self = this;
		const friends = this.state.friends;


		for(i = 0; i < friends.length; i++) {
			if(this.state.address.replace('@','') === friends[i].friendsHandle) {
				Toast.showWithGravity('Device Already Added!', Toast.LONG, Toast.CENTER);
				return true;
			}
		}
		if(friends.length === this.state.maxDevices) {
			self.setState({friendsAdded: true});
		}
		var data = {};
		data.user_name = this.state.address.replace('@','');
		data.status = "1";
		try {
            axios({
                method: 'post',
                url: 'http://206.189.137.43:4013/add_friends',
                data: data
            })
            .then(function (response) {
            	if(response.data.flag === 143) {
            		Toast.showWithGravity("Trusted Device Added.", Toast.LONG,Toast.CENTER);
								self.setState({friendsPublickey : response.data.result[0].public_key, friendsHandle : response.data.result[0].user_name});
            		self.pushFriendData();
            	}
            	else {
            		Toast.showWithGravity(response.data.log, Toast.LONG, Toast.CENTER);
            		return true;
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
	writeToClipboard = async (address) => {
      await Clipboard.setString(address);
      Toast.showWithGravity('Copied to Clipboard!', Toast.LONG, Toast.CENTER)
    };
    onSavePress() {
    	if(this.props.mode==="verify") {
    		this.setState({loaded: false, activity: "Setting Up Request"}, () => {
				requestAnimationFrame(() => this.createRecoveryTrustData(), 0);
			});
		}
		else if(this.props.mode==="register") {
			this.setState({loaded: false, activity: "Setting Up Recovery"}, () => {
				requestAnimationFrame(() => this.createTrustData(), 0);
			});
		}
		else {
			return true;
		}
    }
    createTrustData() {
    	const friends = this.state.friends;
			const shares = this.getSecretParts(this.state.mnemonic);
    	var trust_data = [];
    	for (i = 0; i < friends.length; i++) {
    		var data = {};
    		data.user_public_key = friends[i].address;
    		var messageToEncrypt = {};
				messageToEncrypt.username = this.state.username;
  			messageToEncrypt.user_public_key = this.state.publicKey;
  			messageToEncrypt.secret = shares[i];
  			messageToEncrypt = JSON.stringify(messageToEncrypt);
    		data.encrypted_key_data = this.encryptData(messageToEncrypt, friends[i].address);
    		trust_data.push(data);
    	}
    	this.sendTrustData(trust_data);
    }
    encryptData(data, publicKeyStr) {
		const publicKey = virgilCrypto.importPublicKey(publicKeyStr);
		const encryptedDataStr = virgilCrypto.encrypt(data, publicKey);
		const encryptedData =  encryptedDataStr.toString('base64');
		return encryptedData;
	}
	sendTrustData(trust_data) {
		var trustData = {};
		trustData.trust_data = trust_data;
		const self = this;
		try {
            axios({
                method: 'post',
                url: 'http://159.65.153.3:7001/recovery_key/user_trust_data',
                data: trustData
            })
            .then(function (response) {
            	console.log(response);
            	if(response.data.flag === 143) {
            		Toast.showWithGravity("Setup Complete", Toast.LONG, Toast.CENTER);
            		self.changeRecoveryStatus();
            		Actions.initiaterecovery();
            	}
            	else {
            		Toast.showWithGravity(response.data.log, Toast.LONG, Toast.TOP, Toast.CENTER);
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
	changeRecoveryStatus = async () => {
		try {
			await AsyncStorage.setItem('@RecoveryStatus', "2");
		}
		catch(error) {
			Toast.showWithGravity(error, Toast.LONG, Toast.CENTER);
		}
	}
	createRecoveryTrustData() {
		const friends = this.state.friends;
		var trustData = [];
	    for(i=0 ; i<friends.length ; i++) {
			var dataObject = {};
			dataObject.user_public_key = friends[i].address;
			trustData.push(dataObject);
	    }
	    this.sendRecoveryTrustData(trustData);
	}
	sendRecoveryTrustData(trustData) {
		const self = this;
		var userData = {};
		userData.publicKey = self.state.old_public_key;
		userData.newPublicKey = self.state.new_public_key;
		userData.trust_data = trustData;
		try {
            axios({
                method: 'post',
                url: 'http://159.65.153.3:7001/recovery_key/user_recovery_trust_data',
                data: userData
            })
            .then(function (response) {
            	if(response.data.flag === 143) {
            		Toast.showWithGravity("Recovery Initiated", Toast.LONG, Toast.CENTER);
            		self.changeRequestRecoveryStatus();
            	}

							else if(response.data.flag === 144) {
								Toast.showWithGravity(response.data.log, Toast.LONG, Toast.CENTER);
								Actions.popTo('enteremail');
							}
            	else {
            		Toast.showWithGravity(response.data.log, Toast.LONG, Toast.CENTER);
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
	changeRequestRecoveryStatus = async () => {
		try {
			await AsyncStorage.setItem('@RecoveryInitiated', "true");
			await AsyncStorage.setItem('@Friends', JSON.stringify(this.state.friends));
			Actions.postlogin();
			Actions.recoveryrequests();
		}
		catch(error) {
			Toast.showWithGravity(error, Toast.LONG, Toast.CENTER);
		}
	}

	changeShamir(value){
		if(this.state.friends.length ){
			Alert.alert(
			'Cannot change after adding friends.',
			'',
				[
					{text: 'Continue', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
					{text: 'Reset', onPress: async () => {
						try {
								if(this.props.mode == "register"){
										Actions.choosefriends({mode: this.props.mode});
								}
								else{
										Actions.choosefriends(	{mode: this.props.mode, old_public_key:this.props.old_public_key, wallet_id: this.props.wallet_id});

								}

							} catch (error) {
								console.log(error)
					}
				}
			}
				]
			)
		}

		else{
			if(value == "2/3"){
				this.setState({shamirValue:value , maxDevices:3,minDevices:2});
			}

			else {
				this.setState({shamirValue:value , maxDevices:5,minDevices:3});
			}
		}

	}
	onUnfocus() {
		Keyboard.dismiss();
	}
	render() {
		var sectionHeight;
		var buttonopacity;
		if(this.state.friendsAdded) {
			buttonOpacity = 0.3;
		}
		else {
			buttonOpacity = 1;
		}
		if(Dimensions.get('window').height > 700 && Dimensions.get('window').height < 830) {
			sectionHeight = 450;
		}
		else if(Dimensions.get('window').height > 830 ){
			sectionHeight = 500;
		}
		else {
			sectionHeight = 400;
		}
		if(!this.state.loaded) {
            return(<Loader activity={this.state.activity}/>)
        }
        else {
			return (
					<View style={styles.container}>
						<StatusBar />
						<AppStatusBar  bColor={theme.dark} elevation={true} center={true} text="Add Trusted Devices" textColor={theme.white} />

						{this.state.friendsAdded ? null : <Picker
							selectedValue={this.state.shamirValue}
							style={{position:'absolute' , top : 30,left:0 , right:0}}
							onValueChange={(itemValue, itemIndex) => this.changeShamir(itemValue)}>
							<Picker.Item label="Shamir 2/3" value="2/3" />
							<Picker.Item label="Shamir 3/5" value="3/5" />
						</Picker> }



						<ScrollView keyboardShouldPersistTaps="always" style={ this.state.friendsAdded ? {flex: 1, width: '100%'} : {flex: 1, width: '100%',marginTop:120}}>
							<View style={{flex: 1, width: '100%', alignItems: 'center'}}>
						{this.state.friendsAdded ? null : (
							<View>
								<View style={styles.friendHeadingFlex}>
									<View style={styles.friendHeadingContainer}>
										<Text style={styles.friendHeadingText}>Added Devices</Text>
									</View>

									<View style={styles.friendNumberContainer}>
										<Text style={styles.friendNumberText}>{this.state.length}/{this.state.maxDevices}</Text>
									</View>
								</View>
							</View>

						)}

						{this.state.friendsAdded ? null : (
							<View style={styles.emailContainer}>
									<View style={styles.enterEmailHeading}>
										<Text style={styles.enterEmailText}>Enter Trusted Device Username</Text>
									</View>
									<View style={styles.emailInput}>
										<TextInput
											multiline={false}
											value={this.state.address.length == 0 ? "@" : this.state.address}
											style={styles.wordInput}
											autoCapitalize='none'
											returnKeyType="next"
											onChangeText={(text) => this.setState({ address: text})}
											maxLength={70}
											underlineColorAndroid='transparent'
										/>
									</View>
							</View>
						)}

						{this.state.friendsAdded ? null : (
							<View style={styles.addButtonFlex}>
	 						 <TouchableOpacity disabled={this.state.friendsAdded} style={[styles.addButton, {opacity: buttonOpacity}]} onPress={this.onAddPress}>
	 							 <Text style={styles.addText}>Add</Text>
	 						 </TouchableOpacity>
	 					 </View>
						)}


							<View style={[styles.friendsContainer, {minHeight: sectionHeight}]}>
									<View style={styles.friendsAddedHeadingContainer}>
										<Text style={styles.friendsAddedHeadingText}>Devices Added for Recovery</Text>
									</View>
									{this.state.friends.map((value, i) => {
				                         return(<FriendItem key={value.id} address={value.friendsHandle} id={value.id} onCopy={this.writeToClipboard} />);
									})}

							</View>
							</View>
						</ScrollView>
						<View style={styles.saveButtonContainer}>
							{this.state.friendsAdded ? <Button bColor = {theme.dark} onPress={this.onSavePress}>
								{this.props.mode==="register" ? <Text>Confirm</Text> : <Text>Save</Text>}
							</Button> : null}
						</View>
					</View>



			);
		}
	}
}
const styles = StyleSheet.create({
	container: {
		height: '100%',
	    backgroundColor: theme.white,
	    alignItems: 'center'
	},
	friendHeadingFlex: {
		width: '90%',
		justifyContent: 'flex-end',
		flexDirection: 'row'
	},
	friendHeadingContainer: {
		flex: 0.5,
		justifyContent: 'flex-end'
	},
	friendHeadingText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 20,
		color: theme.black
	},
	friendNumberContainer: {
		flex: 0.5,
		alignItems: 'flex-end',
		justifyContent: 'flex-end'
	},
	friendNumberText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 20,
		color: theme.black
	},
	emailContainer: {
		marginTop: 35,
		height: 80,
		width: '85%'
	},
	enterEmailHeading: {
		flex: 0.3,
		alignItems: 'flex-start',
		justifyContent: 'center'
	},
	enterEmailText: {
		fontFamily: theme.font,
		fontSize: 14,
		color: theme.black,
		opacity: 0.6
	},
	emailInput: {
		flex: 0.7,
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	wordInput: {
		width: '100%',
		height: 60,
		borderBottomWidth: 0.6,
		borderBottomColor: "rgba(0,0,0,0.3)",
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 14,
		letterSpacing: 1,
		color: theme.dark,
	},
	addButtonFlex: {
		height: 100,
		width: '85%',
		justifyContent: 'flex-end' ,
		alignItems: 'center',
		flexDirection: 'row'
	},
	addButton: {
		borderWidth: 0.1,
		borderRadius: 10,
		backgroundColor: theme.dark
	},
	addText: {
		fontFamily: theme.font,
		paddingVertical: 17,
		paddingHorizontal: 50,
		fontSize: 16,
		color: theme.white
	},
	friendsContainer: {
		width: '100%',
		height: 800,
		backgroundColor: theme.grey,
		alignItems: 'center',
	},
	friendsAddedHeadingContainer: {
		height: 60,
		width: '100%',
		marginBottom: 5,
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	friendsAddedHeadingText: {
		fontFamily: theme.font,
		fontSize: 16,
		color: theme.black,
		opacity: 0.8
	},
	saveNoteContainer: {
		height: 60,
		width: '85%',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	saveNoteText: {
		fontFamily: theme.font,
		fontSize: 16,
		textAlign: 'center',
		color: theme.black,
		opacity: 0.6
	},
	saveButtonContainer: {
		position:'absolute',
		bottom:0,
		height: 120,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
