import React from 'react';
import { StyleSheet, Alert,Text,NetInfo, View, Image,Platform, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, BackHandler, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { BarIndicator, WaveIndicator } from 'react-native-indicators';
import axios from 'axios';
import Drawer from 'react-native-drawer';
import Button from '../../common/button';
import StatusBar from '../../common/statusbar';
import AppStatusBar from '../../common/appstatusbar';
import Toast from 'react-native-simple-toast';
import theme from '../../common/theme';
import Loader from '../../common/loader';
import Menu from '../../../../images/menu.png';
import User from '../../../../images/user.png';
import WalletCoinItem from './walletcoinitem';

var icon = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/internetConnectivity.png";

export default class Auth extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			activity: "",
			asset_data: "",
			mode: ""
		};
	}
	componentWillMount() {

		NetInfo.isConnected.fetch().then(isConnected => {
     if(isConnected){
				 this.setState({activity: "Authenticating User"}, () => {
		 			requestAnimationFrame(()=>this.authenticateUser(), 0);
		 		})
		 }

		 else{
			 this.setState({loaded:true});
			 Alert.alert(
			 'Internet connection required',
			 'You need to have an internet connection to access Coinsafe.',
				 [
					 {text: 'Try Again', onPress: async () => {
						 try {
								 Actions.auth();
							 } catch (error) {
								 console.log(error)
							 }
				 }
			 }
				 ]
			 )

		 }

		});

	}
	authenticateUser = async () => {
      try {
            const value = await AsyncStorage.getItem('@AccountStatus');
						const changePin = await AsyncStorage.getItem('@ChangePin');
						const recovery = await AsyncStorage.getItem('@RecoveryInitiated');
						var guardian = await AsyncStorage.getItem('@Guardian');

						if(changePin == "true") {
							Actions.createpin({mode : "changePin"});
						}

						else {

							if(recovery === "true") {
								Actions.postlogin();
								Actions.enterpin({recovery : "true",loggedIn : "true"});

							}

							else if(guardian == "true"){
								Actions.postlogin();
								Actions.enterpin({guardian:"true",loggedIn : "true"});
							}

						else if(value == 'LoggedIn'){

									Actions.postlogin();
									Actions.enterpin({loggedIn : "true"});

							}

							else {
								Actions.firstscreen();
							}
						}

        }
      catch(error) {

        }
}



	render () {
		if(!this.state.loaded) {
            return(<Loader activity={this.state.activity} />);
        }
        else {
			return (

							<Text></Text>

			);
		}
	}
}
const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
  mainOverlay: { backgroundColor: 'black', opacity: 0},
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
		fontSize: 16,
		textAlign: 'center',
		color: "red",
		maxWidth: '65%',
		marginTop: 20
	},
	buttonContainer: {
		width: '100%',
		alignItems: 'center'
	}
});
