import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, BackHandler, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { BarIndicator, WaveIndicator } from 'react-native-indicators';
import axios from 'axios';
import Drawer from 'react-native-drawer';
import StatusBar from '../../common/statusbar';
import AppStatusBar from '../../common/appstatusbar';
import theme from '../../common/theme';
import Loader from '../../common/loader';
import Menu from '../../../../images/menu.png';
import User from '../../../../images/user.png';
import WalletCoinItem from './walletcoinitem';

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
		this.setState({activity: "Authenticating User"}, () => {
			requestAnimationFrame(()=>this.authenticateUser(), 0);
		})
	}
	authenticateUser = async () => {
      try {
            const value = await AsyncStorage.getItem('@AccountStatus');
						const changePin = await AsyncStorage.getItem('@ChangePin');
						const recovery = await AsyncStorage.getItem('@RecoveryInitiated');

						if(changePin == "true") {
							Actions.createpin({mode : "changePin"});
						}

						else {

							if(recovery === "true") {
								Actions.postlogin();
								Actions.enterpin();

							}

						else if(value == 'LoggedIn'){

									Actions.postlogin();
									Actions.enterpin();

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
					<View style={styles.container}>
						<StatusBar bColor={theme.dark} />
						<AppStatusBar bColor={theme.dark} center={true} text="Wallets" textColor={theme.white} />
						<View style={styles.totalBalanceContainer}>
							<Text style={styles.totalBalanceText}>$ 26,052.34</Text>
						</View>
						<ScrollView style={{flex: 1, width: '100%'}}>
							<View style={styles.mainContainer}>
								<View style={{height: 3}} />
								<WalletCoinItem lighticon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/Group+378.png" icon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/Group+380.png" name="Bitcoin" value="5,78,168.98" amount="1.5624" symbol="BTC" onWalletOpen={this.onWalletOpen} />
								<View style={{height: 3}} />
								<WalletCoinItem lighticon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/Group+377.png" icon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/Group+379.png" name="Ethereum" value="45,400.98" amount="1456.2" symbol="ETH" onWalletOpen={this.onWalletOpen} />
								<View style={{height: 3}} />
								<WalletCoinItem lighticon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/light_icons/lmonerol.png" icon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/monero.png" name="Monero" value="13,903.13" amount="12.4523" symbol="XMR" onWalletOpen={this.onWalletOpen} />
								<View style={{height: 3}} />
								<WalletCoinItem lighticon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/gusd_light.png" icon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/gusd_dark.png" name="Gemini Dollar" value="13,903.13" amount="13.556" symbol="GUSD" onWalletOpen={this.onWalletOpen} />
								<View style={{height: 3}} />
								<WalletCoinItem lighticon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/dai_light.png" icon="https://s3.ap-south-1.amazonaws.com/maxwallet-images/dai_dark.png" name="Dai" value="5,78,168.98" amount="12.4523" symbol="DAI" onWalletOpen={this.onWalletOpen} />
								<View style={{height: 3}} />
							</View>
						</ScrollView>
					</View>
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
		width: '100%',
	    backgroundColor: theme.white,
	    alignItems: 'center'
	},
	mainContainer: {
		flex: 1,
		width: '100%',
		marginTop: 6
	},
	totalBalanceContainer: {
		height: 50,
		width: '100%',
		backgroundColor: theme.dark,
		alignItems: 'center',
		justifyContent: 'flex-start',
		borderBottomRightRadius: 25,
		borderBottomLeftRadius: 25,
	},
	totalBalanceText: {
		fontFamily: theme.font500,
		fontSize: 22,
		color: theme.white
	}
});
