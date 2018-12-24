import React from 'react';
import { StyleSheet, Text, BackHandler,View, Image, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, TextInput, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import { BarIndicator } from 'react-native-indicators';
import theme from '../../../common/theme';
import StatusBar from '../../../common/statusbar';
import AppStatusBar from '../../../common/appstatusbar';
import Button from '../../../common/button';
import CountDown from 'react-native-countdown-component';

var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";

export default class EnterOTP extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			email: "",
			public_key: "",
			otp: "",
			wallet_id: "",
			otpActive:true
		};
		this.authenticateOTP = this.authenticateOTP.bind(this);
	}
	componentWillMount() {
		if(this.props.mode==="register") {
			this.getUserPublicKey();
		}
		else {
			this.setState({ email: this.props.email, session_id: this.props.session_id, loaded: true })
		}
	}








	getUserPublicKey = async () => {
		try {
		    var data = await AsyncStorage.getItem('@UserData');
		   	data = JSON.parse(data);
		    this.setState({ public_key: data.publicKey, email: this.props.email, session_id: this.props.session_id, loaded: true });
		}
		catch (error) {
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
			Actions.popTo('enteremail');
		 return true;
		}
	goBack() {
		Actions.pop();
	}
	authenticateOTP() {
		this.setState({otpActive:false});
		if(this.props.mode==="verify") {
			this.authenticateVerifyOTP();
		}
		else if(this.props.mode==="register") {
			this.authenticateRegisterOTP();
		}
		else {
			return true;
		}
	}
	authenticateRegisterOTP() {
		var self = this;
		var data={};
		data.otp = Number(this.state.otp);
		data.session_id = this.state.session_id;
		data.email = this.state.email;
		data.public_key = this.state.public_key;
		console.log(data)
		try {
            axios({
                method: 'post',
                url: 'http://206.189.137.43:4013/verify_otp',
                data: data
            })
            .then(function (response) {
            	if(response.data.flag === 143) {
            		Toast.showWithGravity(response.data.log, Toast.LONG, Toast.CENTER);
            		self.changeRecoveryStatus();
            		Actions.choosefriends({mode: self.props.mode});
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
	changeRecoveryStatus = async () => {
		try {
			await AsyncStorage.setItem('@RecoveryStatus', "1");
		}
		catch(error) {
			Toast.showWithGravity(error, Toast.LONG, Toast.CENTER);
		}
	}
	authenticateVerifyOTP() {
		var self = this;
		var data={};
		data.otp = Number(self.state.otp);
		data.session_id = self.state.session_id;
		data.email = self.state.email;
		try {
            axios({
                method: 'post',
                url: 'http://206.189.137.43:4013/verify_recovery_otp',
                data: data
            })
            .then(function (response) {
            	if(response.data.flag === 143) {
            		Toast.showWithGravity(response.data.log, Toast.LONG, Toast.CENTER);
            		console.log(response);
            		Actions.choosefriends({mode: self.props.mode, old_public_key: response.data.result.public_key, wallet_id: response.data.result.wallet_id});
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
	render() {
		if(!this.state.loaded) {
            return(<View style={{flex:1, backgroundColor: theme.white}}><BarIndicator color={theme.dark} size={50} count={5} /></View>)
        }
        else {
			return (
				<View style={styles.container}>
					<StatusBar bColor={theme.dark} />
					<AppStatusBar bColor={theme.dark} left={true} Back={Back} leftFunction={this.goBack} center={true} text={this.props.mode == "verify" ? "Key Recovery" : "Setup Recovery"} textColor={theme.white} />
					<View style={styles.upperFlex}>
					<CountDown
							until={300}
							digitTxtColor={theme.dark}
							 onFinish={() => this.state.otpActive ? Actions.enteremail({mode : this.props.mode}) :null}
							 timeToShow={['M', 'S']}

								digitBgColor={'#fff'}
								 labelS={''}
								 labelM={''}
							 //on Press call
							 size={20}
				 />
						<View style={styles.emailContainer}>
							<View style={styles.enterEmailHeading}>
								<Text style={styles.enterEmailText}>Enter Verification Code</Text>
							</View>


							<View style={styles.emailInput}>
								<TextInput
									value={this.state.otp}
									style={styles.wordInput}
									autoCapitalize='none'
									keyboardType="numeric"
									returnKeyType="done"
									autoFocus={true}
									onChangeText={(text) => this.setState({ otp: text })}
									maxLength={6}
									underlineColorAndroid='transparent'
								/>
							</View>
						</View>
					</View>
					<View style={styles.lowerFlex}>
						<Button bColor = {theme.dark} onPress={this.authenticateOTP}>
							<Text style={styles.nextText}>Proceed</Text>
						</Button>
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
	upperFlex: {
		flex: 0.6,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
	},
	emailContainer: {
		height: 80,
		width: '90%',
		alignItems: 'center',
	},
	enterEmailHeading: {
		flex: 0.3,
		alignItems: 'flex-start',
		justifyContent: 'center'
	},
	enterEmailText: {
		fontFamily: theme.font,
		fontSize: 18,
		color: theme.black,
		opacity: 0.6
	},
	otpText: {
		fontFamily: theme.Lato,
		fontSize: 18,
		color: theme.black,
		opacity: 0.6
	},
	emailInput: {
		flex: 0.7,
		width: '30%',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	wordInput: {
		width: '100%',
		height: 70,
		borderBottomWidth: 0.6,
		borderBottomColor: "rgba(0,0,0,0.3)",
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 26,
		textAlign: 'center',
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
