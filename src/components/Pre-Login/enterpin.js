import React from 'react';
import { StyleSheet, Text, TextInput, View, Image,AsyncStorage, ActivityIndicator, Keyboard, TouchableOpacity, Dimensions, ImageBackground, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import { Actions } from 'react-native-router-flux';
import bip39 from 'react-native-bip39';
import Toast from 'react-native-simple-toast';
import { VirgilCrypto } from 'virgil-crypto';
import StatusBar from '../common/statusbar';
import theme from '../common/theme';
import Go from '../../../images/go.png';
import Background from '../../../images/background.png';
const Cryptr = require('cryptr');

let wrongPinCount = 0;
let enterPinCount = 0;

export default class EnterPin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pinCode: "",
			mnemonic: "",
      pin:"",
			mode: ""
		};

		this.getPinLength = this.getPinLength.bind(this);
	}

	componentWillMount(){
		this.updateCountFirst();
	}

	updateCountFirst(){
		enterPinCount = 0;
	}

	componentDidMount() {
				BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		}

	componentWillUnmount() {
				BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	}

	handleBackButton = () =>  {
			if(this.props.loggedIn == "true"){
				enterPinCount = enterPinCount + 1;
				if(enterPinCount === 1) {
					Toast.showWithGravity('Press again to EXIT', Toast.LONG, Toast.BOTTOM)
				}
				else if(enterPinCount > 1) {
					enterPinCount = null;
					BackHandler.exitApp();
				}
			}

			else {
				Actions.profile();
			}
		 return true;
	}

	getPinLength(){
		let len = this.state.pinCode;
		if (len.length == 4) {
		this.decryptPinData(len);
		}
	}

	storeData = async () => {
			try {
					await AsyncStorage.setItem('@ChangePin', "true");
				}
			catch(error) {

				}
	}

	decryptPinData = async (pin) => {
			try {
						const pinData = await AsyncStorage.getItem('@pinData');
						const cryptr = new Cryptr(pin);
						let data = cryptr.decrypt(pinData);
						if(bip39.validateMnemonic(data)){
							wrongPinCount = 0;
							if(this.props.mode == 'backupphrase'){
								if(this.props.guardian === "true"){
									Actions.guardiantabs();
									Actions.backupphrase();
								}
								else {
									Actions.profile();
									Actions.backupphrase();
								}
							}
							else if(this.props.mode == 'viewkeys'){
								Actions.profile();
								Actions.viewkeys();
							}
							else if (this.props.guardian == "true") {
									Actions.guardiantabs();
									Actions.pendingrequests();
							}
							else if(this.props.recovery == "true") {
								Actions.postlogin();
	            	Actions.recoveryrequests();
							}
							else if(this.props.mode == "changePin"){
								this.storeData();
									Actions.prelogin();
									Actions.createpin();
							}
							else{
								Actions.postlogintabs();
								Actions.wallets();
							}
						}
						else {
							wrongPinCount++;
							if(wrongPinCount == 10){
								Toast.showWithGravity('You are being logged out.', Toast.LONG, Toast.CENTER);
								this.logout();
							}
							else{
								Toast.showWithGravity('Attempts Left: '+ (10 - wrongPinCount), Toast.LONG, Toast.CENTER);
							}
						}
				}
			catch(error) {
				}
 }

  logout = async () => {
	 try {
			await AsyncStorage.clear();
			Actions.prelogin();
			Actions.auth();
		} catch (error) {
			console.log(error)
		}
  }

 render () {
		const pin = this.state.pinCode;
		var enableButton;
		if(pin.length === 4) {
			enableButton = true;
		}
		else {
			enableButton = false;
		}
		return (
			<View style={styles.container}>
				<ImageBackground style={styles.bgImage} source={Background}>
					<View style={styles.headingContainer}>
		    			<Text style={styles.headingText}>
		    				Enter Pin
		    			</Text>
		    		</View>
		    		<View style={styles.pinContainer}>
		    			<TextInput
		    				style={styles.pinInput}
		    				secureTextEntry
		    				autoFocus = {true}
		    				keyboardAppearance="dark"
		    				keyboardType="number-pad"
		    				value={this.state.pinCode}
		    				maxLength={4}
		    				placeholderTextColor="rgba(255,255,255,0.15)"
		    				onChangeText={(text) => this.setState({pinCode: text})}
		    			/>
		    		</View>
		    		<KeyboardAvoidingView keyboardVerticalOffset={Platform.select({ios: 0, android: 500})} behavior= {(Platform.OS === 'ios')? "padding" : null} style={{position: 'absolute', bottom: 0, right: 0}}>
			    		<TouchableOpacity style={styles.goIconContainer} onPress={this.getPinLength}>
			    			<Image style={styles.goIcon} source={{uri: "https://s3.ap-south-1.amazonaws.com/maxwallet-images/go.png"}} />
			    		</TouchableOpacity>
		    		</KeyboardAvoidingView>
		    	</ImageBackground>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		height: '100%',
	    backgroundColor: theme.dark,
	    alignItems: 'center'
	},
	bgImage: {
	    width: '100%',
	    height: '100%',
	},
	headingContainer: {
		width: '100%',
		height: 200,
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	headingText: {
		fontFamily: theme.font300,
		fontWeight: '400',
		fontSize: 24,
		color: theme.white
	},
	subHeadingText: {
		paddingTop: 30,
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 18,
		color: theme.white
	},
	pinContainer: {
		width: '100%',
		height: 150,
		alignItems: 'center',
		justifyContent: 'center'
	},
	pinInput: {
		fontFamily: theme.Lato,
		borderBottomColor: "rgba(255,255,255,0.15)",
		borderBottomWidth: 3,
		textAlign: 'center',
		fontSize: 26,
		width: '50%',
		color: theme.white
	},
	goIconContainer: {
		width: '100%',
		paddingVertical: 25,
		paddingHorizontal: 25,
		alignItems: 'center',
		justifyContent: 'center'
	},
	goIcon: {
		width: 55,
		height: 55,
	}
});
