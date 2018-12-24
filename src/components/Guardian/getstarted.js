import React from 'react';
import { StyleSheet, Text, BackHandler,View, Image, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, TextInput, AsyncStorage, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import theme from '../common/theme';
import StatusBar from '../common/statusbar';
import AppStatusBar from '../common/appstatusbar';
import Button from '../common/button';

const Getstarted = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/getStarted.png";

export default class GetStarted extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wallet_id: "",
			updateGuardian: ''
		};
		this.getWalletId = this.getWalletId.bind(this);
		this.gotoSetupRecovery = this.gotoSetupRecovery.bind(this);
	}
	componentWillMount() {
		this.getWalletId();
	}

	componentDidMount() {
				BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		}
		componentWillUnmount() {
				BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		}
		handleBackButton = () =>  {
			Actions.guardiantabs();
			Actions.pendingrequests();
		return true;

		}



	getWalletId = async () => {
		try {
			var wallet_id = await AsyncStorage.getItem('@WalletID');
			this.setState({wallet_id: wallet_id});
		}
		catch(error) {
			console.log(error);
		}
	}
	gotoSetupRecovery() {
		Actions.postlogin();
		Actions.initiatewallets({wallet_id: this.state.wallet_id, updateGuardian : 'yes'});
	}
	render() {
		return(
			<View style={styles.container}>
				<StatusBar bColor={theme.dark} />
				<AppStatusBar bColor={theme.dark} center={true} text="Get Started" textColor={theme.white} />
				<View style={styles.contentContainer}>
					<Image style={styles.centerImage} source={{uri: Getstarted}} />
					<Text style={styles.subtext}>Want to send and receive bitcoin & other cryptocurrencies?</Text>
				</View>
				<View style={styles.buttonContainer}>
					<Button bColor = {theme.dark} onPress={this.gotoSetupRecovery}>
						<Text>Get Started</Text>
					</Button>
				</View>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
	    backgroundColor: theme.white,
	},
	contentContainer: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
	    alignItems: 'center'
	},
	centerImage: {
		width: 150,
		height: 150
	},
	centerText: {
		fontFamily: theme.font500,
		fontWeight: Platform.OS === 'ios' ? '500' : '400',
		fontSize: 18,
		textAlign: 'center',
		color: theme.darkgrey,
		maxWidth: '50%',
		marginTop: 10
	},
	buttonContainer: {
		width: '100%',
		alignItems: 'center',
		bottom: 15
	},
	subtext : {
		fontFamily: theme.font500,
		fontSize: 16,
		textAlign: 'center',
		color: theme.dark,
		opacity:0.5,
		marginTop:10
	}
});
