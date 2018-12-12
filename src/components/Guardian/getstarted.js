import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, TextInput, AsyncStorage, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import theme from '../common/theme';
import StatusBar from '../common/statusbar';
import AppStatusBar from '../common/appstatusbar';
import Button from '../common/button';

const Getstarted = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/wallet_tab.png";

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
				<AppStatusBar bColor={theme.dark} center={true} text="Initiate Safe" textColor={theme.white} />
				<View style={styles.contentContainer}>
					<Image style={styles.centerImage} source={{uri: Getstarted}} />
					<View>
						<Text style={styles.centerText}>Initiate Safe</Text>
					</View>
				</View>
				<View style={styles.buttonContainer}>
					<Button bColor = {theme.dark} onPress={this.gotoSetupRecovery}>
						<Text>Initiate Safe</Text>
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
		width: 100,
		height: 100
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
	}
});
