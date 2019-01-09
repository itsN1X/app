import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Dimensions, ImageBackground, BackHandler, AsyncStorage, Platform } from 'react-native';
import Toast from 'react-native-simple-toast';
import { BarIndicator } from 'react-native-indicators';
import { Actions } from 'react-native-router-flux';
import { VirgilCrypto } from 'virgil-crypto';
import bip39 from 'react-native-bip39';
import theme from '../common/theme';
import Button from '../common/button';

let bgImage ="https://s3.ap-south-1.amazonaws.com/maxwallet-images/coinsafeBg.png";
let logoImage = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/logoLight.png";
var backCount = 0;
export default class FirstScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: true,
		};
	}


	componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

  componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

  handleBackButton() {
    	backCount = backCount + 1;
    	if(backCount === 1) {
    		Toast.showWithGravity('Press again to EXIT', Toast.LONG, Toast.BOTTOM)
    	}
    	else {
    		BackHandler.exitApp();
    	}
        return true;
  }

	gotoCreatePin() {
		Actions.username({mode: "wallet"});
	}

	gotoRestore() {
		Actions.createpin({mode : "restore"});
	}

	gotoGuardianView() {
		Actions.username({mode: "guardian"});
	}

	render() {
		if(!this.state.loaded) {
            return(<View style={{flex:1, backgroundColor: theme.white}}><BarIndicator color={theme.dark} size={50} count={5} /></View>)
        }
        else {
			return (
				<View style={styles.container}>
					<ImageBackground style={styles.bgImage}  source={{uri: bgImage}}>
						<View style={styles.logoFlex}>
							<Image style={styles.logoImage} source={{uri: logoImage}} />
						</View>
						<View style={styles.emptyFlex} />
						<View style={styles.buttonsFlex}>
							<View style={styles.walletButtonsFlex}>
								<View style={styles.walletButton}>
									<TouchableOpacity style={styles.createWalletButton} onPress={this.gotoCreatePin}>
										<Text style={styles.createWalletText}>Create</Text>
									</TouchableOpacity>
								</View>
								<View style={styles.walletButton}>
									<TouchableOpacity style={styles.restoreWalletButton} onPress={this.gotoRestore}>
										<Text style={styles.restoreWalletText}>Recover</Text>
									</TouchableOpacity>
								</View>
							</View>
							<View style={styles.contentContainer}>
							</View>
							<View style={styles.guardianContainer}>
								<TouchableOpacity style={styles.guardianTouch} onPress={this.gotoGuardianView}>
									<Text style={styles.guardianText}>BECOME A TRUSTED DEVICE</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ImageBackground>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	    backgroundColor: theme.white,
	    justifyContent: 'center'
	},
	bgImage: {
	    width: '100%',
	    height: '100%',
	},
	logoFlex: {
	  	flex: 0.3,
	  	justifyContent: 'center',
	  	alignItems: 'center'
	},
	logoImage: {
		width: 250,
		height: 50,
	},
	emptyFlex: {
		flex: 0.4,
	},
	buttonsFlex: {
	  	flex: 0.3,
	  	alignItems: 'center',
	  	justifyContent: 'flex-end',
	},
	walletButtonsFlex: {
		flex: 0.5,
		width: '95%',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	walletButton: {
		width: '50%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	createWalletButton: {
		width: '87%',
		height: 60,
		borderRadius: 12.5,
		backgroundColor: theme.white,
		alignItems: 'center',
		justifyContent: 'center',
	},
	createWalletText: {
		fontFamily: theme.font500,
		fontWeight: Platform.OS === 'ios' ? '500' : '400',
		fontSize: 20,
		color: theme.dark,
	},
	restoreWalletButton: {
		width: '87%',
		height: 60,
		borderRadius: 12.5,
		backgroundColor: theme.dark,
		borderWidth: 0.75,
		borderColor: theme.white,
		opacity: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	restoreWalletText: {
		fontFamily: theme.font500,
		fontWeight: Platform.OS === 'ios' ? '500' : '400',
		fontSize: 20,
		color: theme.white
	},
	contentContainer: {
		flex: 0.05,
		width: '100%',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	contentText: {
		fontFamily: theme.font,
		fontSize: 13,
		color: theme.darkgrey
	},
	guardianContainer: {
		flex: 0.32,
		width: '100%',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	guardianTouch: {
		height: 25,
		borderBottomColor: theme.white,
		borderBottomWidth: 2,
	},
	guardianText: {
		fontFamily: theme.font500,
		fontWeight: Platform.OS === 'ios' ? '500' : '400',
		fontSize: 16,
		color: theme.white
	}
});
