import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, TextInput, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import bip39 from 'react-native-bip39';
import Toast from 'react-native-simple-toast';
import { VirgilCrypto } from 'virgil-crypto';
import axios from 'axios';
import Loader from '../common/loader';
import StatusBar from '../common/statusbar';
import Back from '../../../images/darkback.png';
import theme from '../common/theme';
import Button from '../common/button';
import AppStatusBar from '../common/appstatusbar';
const crypto = require('react-native-crypto');

let mnemonicArray;
let placeholder1;
let placeholder2;

export default class Verification extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activity: "",
			loaded: true,
			mnemonic: '',
			mnemonicArray: null,
			word1: "",
			word2: "",
			rand1: null,
			rand2: null,
			wallet_id: ""
		};
		this.onConfirm = this.onConfirm.bind(this);
		this.setWord = this.setWord.bind(this);
		this.generateKeyPair = this.generateKeyPair.bind(this);
		this.sendUserDetails = this.sendUserDetails.bind(this);
	}
	componentWillMount() {
		mnemonicArray = this.props.mnemonic.split(' ');
		this.setState({ mnemonic: this.props.mnemonic,  mnemonicArray: mnemonicArray});
		if(this.props.mode === "guardian" ) {
			this.generateKeyPair();
		}
		else {
				this.getRandomNumbers();
		}

	}
	onUnfocus() {
		Keyboard.dismiss();
	}
	generateKeyPair() {
		const virgilCrypto = new VirgilCrypto();
		let account = {};
		account.mnemonic = this.state.mnemonic;
		const seed = bip39.mnemonicToSeedHex(this.state.mnemonic);
		account.seed = seed;
		const keyPair = virgilCrypto.generateKeysFromKeyMaterial(seed);
		const privateKeyData = virgilCrypto.exportPrivateKey(keyPair.privateKey);
		const publicKeyData = virgilCrypto.exportPublicKey(keyPair.publicKey);
		const privateKey = privateKeyData.toString('base64');
		const publicKey = publicKeyData.toString('base64');
		const privateKeyHash = this.createHash(privateKey)
		account.publicKey = publicKey;
		account.privateKey = privateKey;
		account.privateKeyHash = privateKeyHash;
		account = JSON.stringify(account);
		let details = {};
		details.private_key_hash = privateKeyHash;
		details.public_key = publicKey;
		this.storeData(account);
		this.sendUserDetails(details);
	}
	sendUserDetails = async (details) => {
		try {
			var self = this;
			axios({
			    method: 'post',
			    url: 'http://206.189.137.43:4013/create_wallet',
			    data: details
		    })
		    .then(function (response) {
		    	self.setState({wallet_id: response.data.wallet_id})
		        self.storeWalletID(response.data.wallet_id);
		        if(self.props.mode === "guardian") {
		        	Actions.guardiantabs({wallet_id: response.data.wallet_id});
		        }
		        else {
		        	Actions.postlogin();
		        	Actions.initiatewallets({wallet_id: response.data.wallet_id});
		        }

		    })
		    .catch(function (error) {
		    });
		}
		catch(error) {
			Toast.showWithGravity("Network Error", Toast.LONG, Toast.CENTER);
		}
	}
	createHash(data) {
		const hash = crypto.createHash('sha256');
		hash.update(data);
		const privateKeyHash = hash.digest('hex');
		return privateKeyHash;
	}
	storeData = async (data) => {
		try {
		    await AsyncStorage.setItem('@UserData', data);
		    await AsyncStorage.setItem('@AccountStatus', "LoggedIn");
		   	if(this.props.mode === "guardian") {
		   		await AsyncStorage.setItem('@Guardian', "true");
		   	}
		  } catch (error) {
		  }
	}
	storeWalletID = async (data) => {
		try {
		    await AsyncStorage.setItem('@WalletID', data);
		  } catch (error) {
		  }
	}
	getData = async () => {
	  try {
	    const value = await AsyncStorage.getItem('@UserData');
		}
		catch(error) {
		}
	}
	onConfirm() {
		const word1 = this.state.word1.toLowerCase();
		const word2 = this.state.word2.toLowerCase();
		if( (this.state.mnemonicArray[this.state.rand1 - 1] === word1) && (this.state.mnemonicArray[this.state.rand2 - 1] === word2) ) {
			this.setState({loaded: false, activity: "Initializing Wallet"}, () => {
				requestAnimationFrame(() => this.generateKeyPair(), 0);
			});
		}
		else {
			Toast.showWithGravity("Words do not match", Toast.LONG, Toast.CENTER);
		}
	}
	goBack() {
		Actions.pop();
	}
	getRandomNumbers() {
		let rand1;
		let rand2;
		rand1 = Math.floor(Math.random() * 6) + 1;
		rand2 = Math.floor(Math.random() * (12 - 6)) + 7;
		this.setState({ rand1: rand1, rand2: rand2 });
		placeholder1 = "Enter word #" + rand1;
		placeholder2 = "Enter word #" + rand2;
	}
	setWord(index, text) {
		if(index===1) {
			var word1 = text;
			word1 = word1.trim();
			this.setState({ word1 });
		}
		else {
			var word2 = text;
			word2 = word2.trim();
			this.setState({ word2 });
		}
	}
	render () {
		if(!this.state.loaded) {
            return(<Loader activity={this.state.activity} />)
        }
        else {
            return (
				<TouchableWithoutFeedback onPress={ this.onUnfocus }>
				  <View style={styles.container}>
				  	<StatusBar />
					<AppStatusBar left={true} Back="https://s3.ap-south-1.amazonaws.com/maxwallet-images/darkback.png" leftFunction={this.goBack} bColor={theme.white} />
					<ScrollView style={{ height: '100%', width: '100%'}}>
						<View style={{height: Dimensions.get('window').height-90, width: '100%', alignItems: 'center'}}>
							<View style={styles.textFlex}>
								<View style={styles.mainTextContainer}>
									<Text style={styles.mainText}>Verification</Text>
								</View>
							</View>
							<KeyboardAvoidingView keyboardVerticalOffset={100} behavior={"padding"} style={styles.inputContainerFlex}>
								<View style={styles.inputHeading}>
									<Text style={styles.inputHeadingText}>{placeholder1}</Text>
								</View>
								<View style={styles.inputFlex}>
									<TextInput
										autoCapitalize='none'
										value = {this.state.word1}
										style = {styles.wordInput}
										returnKeyType = "next"
										maxLength = {12}
										underlineColorAndroid = 'transparent'
										onChangeText={(text) => this.setWord(1, text)}
									/>
								</View>
								<View style={styles.inputHeading}>
									<Text style={styles.inputHeadingText}>{placeholder2}</Text>
								</View>
								<View style={styles.inputFlex}>
									<TextInput
										autoCapitalize='none'
										value = {this.state.word2}
										style = {styles.wordInput}
										returnKeyType = "done"
										maxLength = {12}
										underlineColorAndroid = 'transparent'
										onChangeText={(text) => this.setWord(2, text)}
									/>
								</View>
							</KeyboardAvoidingView>
							<View style={styles.emptyFlex} />
							<View style={styles.nextButtonContainer}>
								<Button bColor = {theme.dark} onPress={this.onConfirm}>
									<Text style={styles.nextText}>Confirm</Text>
								</Button>
							</View>
						</View>
					</ScrollView>
				  </View>
				</TouchableWithoutFeedback>
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
	navFlex: {
		flex: 0.12,
		width: '87%',
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	backIcon: {
		width: 35,
		height: 35
	},
	textFlex: {
		flex: 0.2,
		width: '80%',
		alignItems: 'flex-start',
		justifyContent: 'center'
	},
	mainTextContainer: {
		flex: 0.6,
		justifyContent: 'center'
	},
	mainText: {
		fontFamily: theme.font,
		color: theme.black,
		fontWeight: '100',
		fontSize: 40
	},
	secondaryTextContainer: {
		flex: 0.4,
		justifyContent: 'center'
	},
	secondaryText: {
		fontFamily: theme.font,
		color: theme.black,
		fontWeight: '200',
		fontSize: 16
	},
	inputContainerFlex: {
		marginTop: 30,
		flex: 0.42,
		width: '100%',
		alignItems: 'center',
	},
	inputHeading: {
		flex: 0.2,
		justifyContent: 'flex-end',
		width: '80%',
	},
	inputHeadingText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 14,
		color: theme.darkgrey
	},
	inputFlex: {
		flex: 0.3,
		width: '80%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	wordInput: {
		width: '100%',
		height: 45,
		borderBottomWidth: 0.6,
		letterSpacing: 1,
		borderBottomColor: theme.dark,
		opacity: 0.9,
		fontFamily: theme.Lato,
		fontSize: 18,
		color: theme.dark,
	},
	emptyFlex: {
		flex: 0.23
	},
	nextButtonContainer: {
	  	flex: 0.2,
	  	width: '100%',
	  	marginBottom: 15,
	  	justifyContent: 'flex-end',
	  	alignItems: 'center',
	},
	nextButton: {
		width: '90%',
		flex: 0.6,
		backgroundColor: theme.dark,
		justifyContent: 'center',
	  	alignItems: 'center',
	  	borderRadius: 5
	},
	nextText: {
		fontFamily: theme.font,
		fontWeight: '300',
		fontSize: 20,
		color: theme.white
	},
});
