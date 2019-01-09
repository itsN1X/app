import React from 'react';
import { StyleSheet,BackHandler, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, TextInput, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { BarIndicator } from 'react-native-indicators';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import StatusBar from '../common/statusbar';
import Back from '../../../images/darkback.png';
import theme from '../common/theme';
import Button from '../common/button';
import Loader from '../common/loader';
import AppStatusBar from '../common/appstatusbar';
import { VirgilCrypto } from 'virgil-crypto';
import bip39 from 'react-native-bip39';
const crypto = require('react-native-crypto');

export default class Restore extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			mnemonic: "",
			activity: ""
		};
		this.generateKeyPair = this.generateKeyPair.bind(this);
		this.verifyEmail = this.verifyEmail.bind(this);
		this.authenticateUser = this.authenticateUser.bind(this);
		this.onConfirm = this.onConfirm.bind(this);
	}

	onUnfocus() {
		Keyboard.dismiss();
	}

	componentWillMount() {
		this.setState({loaded: true});
	}

	componentDidMount() {
				BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		}

	componentWillUnmount() {
				BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		}

	handleBackButton = () =>  {
		 Actions.pop();
		 return true;
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
		let details = {};
		details.private_key_hash = privateKeyHash;
		details.public_key = publicKey;
		this.authenticateUser(details, account);
	}

	componentWillReceiveProps() {
		this.setState({loaded: true});
	}

	createHash(data) {
		const hash = crypto.createHash('sha256');
		hash.update(data);
		const privateKeyHash = hash.digest('hex');
		return privateKeyHash;
	}

	authenticateUser(details, account) {
		console.log(details)
		try {
			var self = this;
			axios({
			    method: 'post',
			    url: 'http://206.189.137.43:4013/login',
			    data: details
		    })
		    .then(function (response) {
		    	if(response.data.flag === 143 && response.data.result.wallet_id !== null) {
						account.username = response.data.result.user_name;
						account = JSON.stringify(account);
						self.storeWalletID(response.data.result.wallet_id, account);
		    		Actions.postlogintabs();
		    		Actions.wallets();
		    		Actions.refresh({ user_data: account, loggedIn: true, wallet_id: response.data.result.wallet_id, new: false });
		    	}
		    	else {
		    		Toast.showWithGravity("Invalid Mnemonic Seed", Toast.LONG, Toast.CENTER);
		    		self.setState({loaded: true});
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

	storeWalletID = async (wallet_id, account) => {
		console.log(account);
		try {
		    await AsyncStorage.setItem('@WalletID', wallet_id);
		    await AsyncStorage.setItem('@UserData', account);
		    await AsyncStorage.setItem('@AccountStatus', "LoggedIn");
		  } catch (error) {
		    console.log(error)
		  }
	}

	onConfirm() {
		this.setState({loaded: false, activity: "Authenticating User"}, () => {
			requestAnimationFrame(() => this.generateKeyPair(), 0);
		})
	}

	goBack() {
		Actions.pop();
	}

	verifyEmail() {
		var type= "verify";
		Actions.enteremail({mode:type});
	}

	render () {
		if(!this.state.loaded) {
            return(<Loader activity={this.state.activity} />);
        }
        else {
			return (
				<TouchableWithoutFeedback onPress={ this.onUnfocus }>
				  <View style={styles.container}>
				  	<StatusBar />
					<AppStatusBar left={true} Back="https://s3.ap-south-1.amazonaws.com/maxwallet-images/darkback.png" leftFunction={this.goBack} bColor={theme.white} />
					<ScrollView style={{ height: '100%', width: '100%'}}>
					  <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={"padding"}>
						<View style={{height: Dimensions.get('window').height-90, width: '100%', alignItems: 'center'}}>
							<View style={styles.textFlex}>
								<View style={styles.mainTextContainer}>
									<Text style={styles.mainText}>Restore</Text>
								</View>
								<View style={styles.secondaryTextContainer}>
									<Text style={styles.secondaryText}>Enter your Mnemonic Seed</Text>
								</View>
							</View>
							<KeyboardAvoidingView keyboardVerticalOffset={100} behavior={"padding"} style={styles.inputContainerFlex}>
								<View style={styles.inputFlex}>
									<TextInput
										editable={true}
										multiline={true}
										autoCapitalize='none'
										style={styles.wordInput}
										returnKeyType="next"
										numberOfLines={5}
										value={this.state.mnemonic}
										underlineColorAndroid='transparent'
										onChangeText={(text) => this.setState({mnemonic: text})}
								 />
								</View>
							</KeyboardAvoidingView>
							<View style={styles.nextButtonContainer}>
								<Button bColor = {theme.dark} onPress={this.onConfirm}>
									<Text style={styles.nextText}>Restore Wallet</Text>
								</Button>
							</View>
						</View>
					  </KeyboardAvoidingView>
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
	    alignItems: 'center',
	    backgroundColor: theme.white
	},
	textFlex: {
		height: 160,
		width: '80%',
		alignItems: 'flex-start',
		justifyContent: 'center'
	},
	mainTextContainer: {
		flex: 0.75,
		justifyContent: 'center'
	},
	mainText: {
		fontFamily: theme.font,
		color: theme.black,
		fontWeight: '100',
		fontSize: 50
	},
	secondaryTextContainer: {
		flex: 0.25,
		justifyContent: 'center'
	},
	secondaryText: {
		fontFamily: theme.font,
		color: theme.black,
		fontWeight: '200',
		fontSize: 16
	},
	inputContainerFlex: {
		height: 200,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%'
	},
	inputFlex: {
		height: 160,
		width: '80%',
		borderRadius: 5,
		borderWidth: 1,
		textAlign: 'center',
		borderColor: theme.black,
		alignItems: 'center',
		justifyContent: 'center'
	},
	wordInput: {
		width: '70%',
		height: 150,
		letterSpacing: 1,
		opacity: 0.9,
		fontFamily: theme.Lato,
		fontSize: 18,
		color: theme.dark,
	},
	forgottenButtonContainer: {
		position: 'absolute',
		bottom: 100,
		marginBottom: 10,
	  	width: '100%',
	  	justifyContent: 'flex-end',
	  	alignItems: 'center',
	},
	nextButtonContainer: {
		position: 'absolute',
		bottom: 10,
	  	width: '100%',
	  	justifyContent: 'flex-end',
	  	alignItems: 'center',
	},
	forgottenText: {
		fontFamily: theme.font,
		fontSize: 16,
		color: theme.dark,
		textDecorationLine: 'underline'
	},
	nextText: {
		fontFamily: theme.font,
		fontWeight: '300',
		fontSize: 20,
		color: theme.white
	},
});
