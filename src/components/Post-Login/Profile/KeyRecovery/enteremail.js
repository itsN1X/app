import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, TextInput, AsyncStorage, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import theme from '../../../common/theme';
import StatusBar from '../../../common/statusbar';
import AppStatusBar from '../../../common/appstatusbar';
import Button from '../../../common/button';

var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";

export default class EnterEmail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			mode: ""
		};
		this.getOTP = this.getOTP.bind(this);
		this.goBack = this.goBack.bind(this);
		this.registerEmail = this.registerEmail.bind(this);
		this.verifyEmail = this.verifyEmail.bind(this);
	}
	componentWillMount() {
		this.getUserPublicKey();
	}
	goBack() {
		if(this.props.mode==="verify") {
			Actions.popTo('restore');
		}
		else if(this.props.mode==="register") {
			Actions.pop();
		}
		else {}
	}


	onUnfocus() {
		Keyboard.dismiss();
	}

	validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
	getOTP() {
		if (!this.validateEmail(this.state.email)) {
		  Toast.showWithGravity('Enter valid email', Toast.LONG, Toast.CENTER)
		} else {
			if(this.props.mode==="verify") {
				this.verifyEmail();
			}
			else if(this.props.mode==="register") {
				this.registerEmail();
			}
			else {}
		}

	}
	getUserPublicKey = async () => {
		try {
		    var wallet_id = await AsyncStorage.getItem('@WalletID');
		    this.setState({ wallet_id: wallet_id, mode: this.props.mode });
		}
		catch (error) {
		    console.log(error)
		}
	}
	verifyEmail() {
		var self = this;
		var data = {};
		data.email = self.state.email;
		console.log(data);
		try {
            axios({
                method: 'post',
                url: 'http://206.189.137.43:4013/send_recovery_otp',
                data: data
            })
            .then(function (response) {
            	if(response.data.flag === 143) {
            		Toast.showWithGravity(response.data.log, Toast.LONG, Toast.CENTER);
            		Actions.enterotp({session_id: response.data.session_id, email: self.state.email, otp: response.data.otp, mode: self.props.mode})
            	}
            	else {
            		console.log(response)
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


	registerEmail() {
		var self = this;
		var data = {};
		data.email = self.state.email;
		data.wallet_id = self.state.wallet_id;
		console.log(data);
		try {
            axios({
                method: 'post',
                url: 'http://206.189.137.43:4013/send_otp',
                data: data
            })
            .then(function (response) {
            	if(response.data.flag === 143) {
            		Toast.showWithGravity(response.data.log, Toast.LONG, Toast.CENTER);
            		Actions.enterotp({session_id: response.data.session_id, email: self.state.email, otp: response.data.otp, mode: self.props.mode})
            	}
            	else {
            		console.log(response)
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
	render() {
		return (
			<TouchableWithoutFeedback onPress={ this.onUnfocus }>
				<View style={styles.container}>
					<StatusBar bColor={theme.dark} />
					<AppStatusBar bColor={theme.dark} left={true} Back={Back} leftFunction={this.goBack} center={true} text="Setup Recovery" textColor={theme.white} />
					<View style={styles.upperFlex}>
						<View style={styles.emailContainer}>
							<View style={styles.enterEmailHeading}>
								<Text style={styles.enterEmailText}>Enter Your Email ID</Text>
							</View>
							<View style={styles.emailInput}>
								<TextInput
									value={this.state.email}
									style={styles.wordInput}
									autoCapitalize='none'
									returnKeyType="next"
									onChangeText={(text) => this.setState({ email: text })}
									maxLength={30}
									underlineColorAndroid='transparent'
								/>
							</View>
						</View>
					</View>
					<View style={styles.lowerFlex}>
						<KeyboardAvoidingView keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 35} behavior={'padding'} style={{width: '100%', alignItems: 'center'}}>
							<Button bColor = {theme.dark} onPress={this.getOTP}>
								<Text style={styles.nextText}>Get OTP</Text>
							</Button>
						</KeyboardAvoidingView>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		height: '100%',
	    backgroundColor: theme.white,
	    alignItems: 'center'
	},
	upperFlex: {
		flex: 0.6,
		alignItems: 'center',
		width: '100%',
	},
	emailContainer: {
		marginTop: 30,
		height: 80,
		width: '90%'
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
		height: 55,
		borderBottomWidth: 0.6,
		borderBottomColor: "rgba(0,0,0,0.3)",
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 18,
		letterSpacing: 1,
		color: theme.dark,
	},
	lowerFlex: {
		flex: 0.4,
		marginBottom: 15,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'flex-end'
	}
});
