import React from 'react';
import { StyleSheet,BackHandler, Text, View, Image, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView, Clipboard, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { BarIndicator } from 'react-native-indicators';
import Toast from 'react-native-simple-toast';
import StatusBar from '../../common/statusbar';
import AppStatusBar from '../../common/appstatusbar';
import theme from '../../common/theme';
import Button from '../../common/button';

var Copy = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png";
var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";

export default class Profile extends React.Component {
	constructor(props){
        super(props);
        this.state = {
            loaded: false,
            privateKey: "",
            publicKey: ""
        }
    }
	componentWillMount() {
		this.getCoinData();
	}

	componentDidMount() {
				BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		}
		componentWillUnmount() {
				BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		}
		handleBackButton = () =>  {
				Actions.pop();
				return true;
		}
	goBack() {
		Actions.pop();
	}
	getCoinData = async () => {
      try {
            const value = await AsyncStorage.getItem('@BTC');
            var coinData = JSON.parse(value);
            this.setState({ privateKey: coinData.privateKey, publicKey: coinData.publicKey, loaded: true })
        }
      catch(error) {
            alert(error)
        }
    }
	writeToClipboard = async (address) => {
      await Clipboard.setString(address);
      Toast.showWithGravity('Copied to Clipboard!', Toast.LONG, Toast.CENTER)
    };
	render() {
		if(!this.state.loaded) {
            return(<View style={{flex:1, backgroundColor: theme.white}}><BarIndicator color={theme.dark} size={50} count={5} /></View>)
        }
        else {
			return (
				<View style={styles.container}>
					<StatusBar bColor={theme.dark}/>
					<AppStatusBar bColor={theme.dark} left={true} Back={Back} leftFunction={this.goBack} center={true} text="Crypto Keys" textColor={theme.white} />
					<ScrollView style={{flex: 1, width: '100%'}}>
						<View style={{flex: 1, width: '100%', alignItems: 'center'}}>
							<View style={styles.itemContainer}>
								<View style={styles.nameFlex}>
									<Text style={styles.nameText}>Bitcoin (BTC)</Text>
								</View>
								<View style={styles.headingContainer}>
									<Text style={styles.headingText}>Public</Text>
								</View>
								<View style={styles.addressContainer}>
									<Text style={styles.addressText}>{this.state.publicKey}</Text>
									<View style={styles.copyIconContainer}>
										<TouchableOpacity onPress={() => this.writeToClipboard(this.state.publicKey)}>
											<Image style={styles.copyIcon} source={{uri: Copy}} />
										</TouchableOpacity>
									</View>
								</View>
								<View style={styles.headingContainer}>
									<Text style={styles.headingText}>Private</Text>
								</View>
								<View style={[styles.addressContainer, {marginBottom: 15}]}>
									<Text style={styles.addressText}>{this.state.privateKey}</Text>
									<View style={styles.copyIconContainer}>
										<TouchableOpacity onPress={() => this.writeToClipboard(this.state.privateKey)}>
											<Image style={styles.copyIcon} source={{uri: Copy}} />
										</TouchableOpacity>
									</View>
								</View>
							</View>
							<View style={styles.greyline} />
						</View>
					</ScrollView>
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
	itemContainer: {
		width: '90%',
		height: 260,
	},
	greyline: {
		height: 0.7,
		width: '100%',
		backgroundColor: theme.darkgrey
	},
	nameFlex: {
		flex: 0.22,
		justifyContent: 'flex-end'
	},
	nameText: {
		fontFamily: theme.font,
		color: theme.black,
		fontSize: 20
	},
	headingContainer: {
		flex: 0.15,
		justifyContent: 'flex-end',
	},
	headingText: {
		fontFamily: theme.font,
		fontWeight: '300',
		color: theme.darkgrey,
		fontSize: 14
	},
	addressContainer: {
		flex: 0.225,
		alignItems: 'center',
		flexDirection: 'row'
	},
	addressText: {
		fontFamily: theme.Lato,
		maxWidth: '90%',
		fontWeight: '300',
		color: theme.black,
		fontSize: 15
	},
	copyIconContainer: {
		flex: 1,
		marginBottom: 15,
		alignItems: 'flex-end'
	},
	copyIcon: {
		width: 18,
		height: 18
	},
});
