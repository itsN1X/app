import React from 'react';
import { StyleSheet, Text, TextInput, View, Image, ActivityIndicator, Keyboard, TouchableOpacity, Dimensions, ImageBackground, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import { Actions } from 'react-native-router-flux';
import bip39 from 'react-native-bip39';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import { VirgilCrypto } from 'virgil-crypto';
import StatusBar from '../common/statusbar';
import theme from '../common/theme';
import Go from '../../../images/go.png';
import Background from '../../../images/background.png';

export default class Username extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			mnemonic: "",
			mode : ""
		};
		this.generateKeyPair = this.generateKeyPair.bind(this);
		this.checkUserName = this.checkUserName.bind(this);
	}

	componentDidMount() {
				BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		}

	componentWillUnmount() {
				BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		}

	handleBackButton = () =>  {
			Actions.popTo('firstscreen');
				return true;
	}

	checkUserName(){
		let details = {};
		let username = this.state.username.replace('@','');
		username = username.trim();

		if(username.includes("@") || username.includes(" ")){
		Toast.showWithGravity("Enter a valid username", Toast.LONG, Toast.CENTER);
		}
		else {
			username = username.replace(/ +/g, "");
			username = username.replace('@','');
			username = username.toLowerCase();
			details.user_name = username;
			details.status = "0";
			this.fetchUsernameDetails(details);
		}
	}

	fetchUsernameDetails = async (details) => {
		try {
			var self = this;
			axios({
					method: 'post',
					url: 'http://206.189.137.43:4013/add_friends',
					data: details
				})
				.then(function (response) {
					let flag = parseInt(response.data.flag);
					if(response.data.flag == 144) {
						if(self.props.mode == "wallet"){
							Actions.createpin({mode : "wallet", username: self.state.username.replace('@','')});
						}
						else {
							Actions.createpin({mode : "guardian", username : self.state.username.replace('@','')});
						}
					}
					else {
					 	Toast.showWithGravity("Username not available", Toast.LONG, Toast.CENTER);
					}
				})
				.catch(function (error) {
						Toast.showWithGravity("Internet connection required!", Toast.LONG, Toast.CENTER);
				});
		}
		catch(error) {
			Toast.showWithGravity("Network Error", Toast.LONG, Toast.CENTER);
		}
	}

	generateKeyPair() {
	    const promise = bip39.generateMnemonic();
	    let Mode = this.props.mode;
		  promise.then((result)=>{
		  Actions.walletseed({mnemonic: result, mode: Mode});
		})
	}

	render () {
		return (
			<View style={styles.container}>
				<ImageBackground style={styles.bgImage} source={Background}>
					<View style={styles.headingContainer}>
		    			<Text style={styles.headingText}>
		    				Type a username
		    			</Text>
		    		</View>
		    		<View style={styles.pinContainer}>
		    			<TextInput
		    				style={styles.pinInput}
		    				autoFocus = {true}
								maxLength={34}
		    				keyboardAppearance="dark"
		    				value={this.state.username.length == 0 ? "@" : this.state.username}
		    				placeholderTextColor="rgba(255,255,255,0.15)"
								placeholder="@"
		    				onChangeText={(text) => {
									this.setState({username:text})
								}
								}
		    			/>

		    		</View>
		    		<KeyboardAvoidingView keyboardVerticalOffset={Platform.select({ios: 0, android: 500})} behavior= {(Platform.OS === 'ios')? "padding" : null} style={{position: 'absolute', bottom: 0, right: 0}}>
			    		<TouchableOpacity style={styles.goIconContainer} onPress={this.checkUserName}>
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
		fontWeight: '300',
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
		textAlign: 'left',
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
