import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView, Clipboard, AsyncStorage, BackHandler } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { BarIndicator } from 'react-native-indicators';
import Toast from 'react-native-simple-toast';
import CurrencyPicker from '../../common/currencypicker';
import StatusBar from '../../common/statusbar';
import AppStatusBar from '../../common/appstatusbar';
import theme from '../../common/theme';
import Button from '../../common/button';

var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";
var User = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/user.png";
var Next = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/next.png";
var Copy = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png";

export default class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pickerEnabled: false,
			currency: "USD",
			loaded: false,
			publicKey: "",
			privateKey: "",
			mode : ''
		}
		this.getAccountInfo = this.getAccountInfo.bind(this);
		this.enablePicker = this.enablePicker.bind(this);
		this.disablePicker = this.disablePicker.bind(this);
		this.changeCurrency = this.changeCurrency.bind(this);
	}
	componentWillMount() {
		this.getAccountInfo();
	}
	componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        return true;
    }
	goBack() {
		Actions.pop();
	}
	gotoRequests() {
		Actions.pendingrequests();
	}
	gotoViewKeys() {
		Actions.postlogin();
		Actions.enterpin({mode : 'viewkeys'});
	}
	gotoBackupPhrase() {
		Actions.postlogin();
		Actions.enterpin({mode : 'backupphrase'});
	}
	changeCurrency(value) {
		this.setState({ currency: value, pickerEnabled: false })
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
	getAccountInfo = async () => {
		try{
			const value = await AsyncStorage.getItem('@UserData');
			var account = JSON.parse(value);
			this.setState({publicKey: account.publicKey, privateKey: account.privateKey, loaded: true});
		}
		catch(error) {
			alert(error);
		}
	}
	copyToClipboard = async (address) => {
		await Clipboard.setString(address);
      	Toast.showWithGravity('Copied to Clipboard!', Toast.LONG, Toast.CENTER)
	}
	enablePicker() {
		this.setState({ pickerEnabled: true });
	}
	disablePicker() {
		this.setState({ pickerEnabled: false });
		Keyboard.dismiss();
	}
	render() {
		if(!this.state.loaded) {
            return(<View style={{flex:1, backgroundColor: theme.white}}><BarIndicator color={theme.dark} size={50} count={5} /></View>)
        }
        else {
			return (
				<View style={styles.container}>
					<StatusBar bColor={theme.dark}/>
					<AppStatusBar bColor={theme.dark} center={true} centerImage={true} centerIcon={User} />
					<ScrollView style={{ height: '100%', width: '100%'}}>
						<View style={{height: Dimensions.get('window').height-130, width: '100%', alignItems: 'center'}}>
							<View style={styles.addressFlex}>
								<View style={styles.addressContainer}>
									<View style={styles.addressHeadingContainer}>
										<Text style={styles.addressHeadingText}>Public Address ( Wallet )</Text>
										<View style={styles.copyIconContainer}>
											<TouchableOpacity onPress={() => this.copyToClipboard(this.state.publicKey)}>
												<Image style={styles.copyIcon} source={{uri: Copy}} />
											</TouchableOpacity>
										</View>
									</View>
									<View style={styles.personAddressContainer}>
										<Text style={styles.addressText}>{this.state.publicKey}</Text>
									</View>
								</View>
							</View>
							<View style={styles.greyline} />
							<TouchableOpacity style={styles.otherTabFlex} onPress={this.gotoViewKeys}>
								<View style={styles.otherTabContainer}>
									<View style={styles.tabHeadingFlex}>
										<Text style={styles.tabheadingText}>View Keys</Text>
									</View>
									<View style={styles.tabActionFlex}>
										<View style={styles.tabAction}>
											<Text style={styles.tabActionText}></Text>
										</View>
										<View style={styles.tabActionIconContainer}>
											<Image style={styles.tabActionIcon} source={{uri: Next}} />
										</View>
									</View>
								</View>
							</TouchableOpacity>
							<View style={styles.greyline} />
							<TouchableOpacity style={styles.otherTabFlex} onPress={this.gotoBackupPhrase}>
								<View style={styles.otherTabContainer}>
									<View style={styles.tabHeadingFlex}>
										<Text style={styles.tabheadingText}>Backup Phrase</Text>
									</View>
									<View style={styles.tabActionFlex}>
										<View style={styles.tabAction}>
											<Text style={styles.tabActionText}></Text>
										</View>
										<View style={styles.tabActionIconContainer}>
											<Image style={styles.tabActionIcon} source={{uri: Next}} />
										</View>
									</View>
								</View>
							</TouchableOpacity>
							<View style={styles.greyline} />
							<TouchableOpacity style={styles.otherTabFlex} onPress={this.gotoRequests}>
								<View style={styles.otherTabContainer}>
									<View style={styles.tabHeadingFlex}>
										<Text style={styles.tabheadingText}>Requests for Key Recovery</Text>
									</View>
									<View style={styles.tabActionFlex}>
										<View style={styles.tabAction}>
											<Text style={styles.tabActionText}></Text>
										</View>
										<View style={styles.tabActionIconContainer}>
											<Image style={styles.tabActionIcon} source={{uri: Next}} />
										</View>
									</View>
								</View>
							</TouchableOpacity>
							<View style={styles.greyline} />
							<TouchableOpacity style={styles.otherTabFlex}>
								<View style={styles.otherTabContainer}>
									<View style={styles.tabHeadingFlex}>
										<Text style={styles.tabheadingText}>PIN Change</Text>
									</View>
									<View style={styles.tabActionFlex}>
										<View style={styles.tabAction}>
											<Text style={styles.tabActionText}></Text>
										</View>
										<View style={styles.tabActionIconContainer}>
											<Image style={styles.tabActionIcon} source={{uri: Next}} />
										</View>
									</View>
								</View>
							</TouchableOpacity>
							<View style={styles.greyline} />
							<TouchableOpacity style={styles.otherTabFlex} onPress={this.enablePicker}>
								<View style={styles.otherTabContainer}>
									<View style={styles.tabHeadingFlex}>
										<Text style={styles.tabheadingText}>Change Currency</Text>
									</View>
									<View style={styles.tabActionFlex}>
										<View style={styles.tabAction}>
											<Text style={styles.tabActionText}>{this.state.currency}</Text>
										</View>
										<View style={styles.tabActionIconContainer}>
											<Image style={styles.tabActionIcon} source={{uri: Next}} />
										</View>
									</View>
								</View>
							</TouchableOpacity>
							<View style={styles.greyline} />
							<TouchableOpacity style={styles.otherTabFlex} onPress={this.logout}>
								<View style={styles.otherTabContainer}>
									<View style={[styles.tabHeadingFlex, {alignItems: 'center'}]}>
										<Text style={[styles.tabheadingText, {color: theme.netflixred}]}>Logout</Text>
									</View>
								</View>
							</TouchableOpacity>
						</View>
					</ScrollView>
					{this.state.pickerEnabled ? <CurrencyPicker status={this.state.pickerEnabled} changeCurrency={this.changeCurrency} /> : null}
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	    backgroundColor: theme.white,
	    alignItems: 'center'
	},
	addressFlex: {
		flex: 0.17,
		width: '100%',
		alignItems: 'center'
	},
	addressContainer: {
		width: '90%',
		flex: 1
	},
	addressHeadingContainer: {
		flex: 0.35,
		flexDirection: 'row',
		alignItems: 'flex-end'
	},
	addressHeadingText: {
		fontFamily: theme.font,
		fontSize: 15,
		color: theme.darkgrey
	},
	copyIconContainer: {
		flex: 1,
		alignItems: 'flex-end'
	},
	copyIcon: {
		width: 20,
		height: 20
	},
	greyline: {
		height: 0.5,
		width: '100%',
		backgroundColor: theme.darkgrey
	},
	personAddressContainer: {
		flex: 0.65,
		justifyContent: 'center'
	},
	addressText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 14,
		color: theme.black
	},
	otherTabFlex: {
		flex: 0.12,
		width: '100%',
		alignItems: 'center'
	},
	otherTabContainer: {
		flex: 1,
		width: '90%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	tabHeadingFlex: {
		flex: 0.7,
		justifyContent: 'flex-start'
	},
	tabheadingText: {
		fontFamily: theme.font,
		fontSize: 16,
		color: theme.black
	},
	tabActionFlex: {
		flex: 0.3,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	tabAction: {
		flex: 0.75,
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
	tabActionText: {
		fontFamily: theme.Lato,
		fontSize: 16,
		color: theme.darkgrey
	},
	tabActionIconContainer: {
		flex: 0.25,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	tabActionIcon: {
		width: 20,
		height: 20
	},
	buttonFlex: {
		flex: 0.42,
		marginBottom: 15,
		width: '100%',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	nextText: {
		fontFamily: theme.font,
		fontSize: 20,
		color: theme.white
	},
});
