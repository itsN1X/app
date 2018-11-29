import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Dimensions, Clipboard, AsyncStorage, BackHandler } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { BarIndicator } from 'react-native-indicators';
import Toast from 'react-native-simple-toast';
import SeedItem from '../../Pre-Login/seeditem';
import StatusBar from '../../common/statusbar';
import AppStatusBar from '../../common/appstatusbar';
import theme from '../../common/theme';
import Button from '../../common/button';

var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";
var Copy = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png";
var mnemonic;
var mnemonicstr;

export default class BackupPhrase extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			mnemonic: ""
		};
		this.getMnemonic = this.getMnemonic.bind(this);
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
	componentWillMount() {
		this.getMnemonic();
	}
	getMnemonic = async () => {
		try{
			const value = await AsyncStorage.getItem('@UserData');
			mnemonicstr = JSON.parse(value);
			mnemonicstr = mnemonicstr.mnemonic;
			mnemonic = mnemonicstr.split(" ",12);
			console.log(mnemonic)
			this.setState({mnemonic: mnemonic, loaded: true});
		}
		catch(error) {
			console.log(error)
		}
	}

	writeToClipboard = async () => {
	  await Clipboard.setString(mnemonicstr);
	  Toast.showWithGravity('Copied to Clipboard!', Toast.LONG, Toast.CENTER)
	};
	goBack() {
		Actions.pop();
	}
	render() {
		if(!this.state.loaded) {
            return(<View style={{flex:1, backgroundColor: theme.white}}><BarIndicator color={theme.dark} size={50} count={5} /></View>)     
        }
        else {
			return (
				<View style={styles.container}>
					<StatusBar bColor={theme.white} />
					
					<View style={styles.mainFlex}>
						<View style={styles.textFlex}>
							<View style={styles.mainTextContainer}>
								<Text style={styles.mainText}>Wallet Seed</Text>
							</View>
						</View>
						<View style={styles.seedFlex}>
							<View style={styles.seedContainer}>
								<View style={styles.seed}>
									{mnemonic.map((value, i) => {
				                         return(<SeedItem key={i} index={i + 1} item={value}/>);
				                     })}
								</View>
								<TouchableOpacity style={styles.copyButton} onPress={this.writeToClipboard}>
									<Image style={styles.copyIcon} source={{uri: Copy}} />
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.lowerTextFlex}>
							<View style={styles.secondaryTextContainer}>
								<Text style={styles.secondaryText}>Write down your seed somewhere very safe, this is the only thing that can get you back in.</Text>
							</View>
						</View>
						<View style={styles.buttonFlex}>
							<Button bColor = {theme.dark} onPress={this.goBack}>
								<Text>Done</Text>
							</Button>
						</View>
					</View>
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
	mainFlex: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
	},
	textFlex: {
		flex: 0.2,
		width: '80%',
		marginTop: 10,
		alignItems: 'flex-start',
		justifyContent: 'center'
	},
	mainTextContainer: {
		flex: 1,
		justifyContent: 'center'
	},
	mainText: {
		marginTop: 20,
		fontFamily: theme.font,
		color: theme.black,
		fontWeight: '100',
		fontSize: 45
	},
	lowerTextFlex: {
		flex: 0.1,
		width: '80%',
		alignItems: 'flex-start',
		justifyContent: 'center'
	},
	secondaryTextContainer: {
		flex: 1,
		justifyContent: 'center'
	},
	secondaryText: {
		fontFamily: theme.font,
		color: theme.black,
		fontWeight: '100',
		fontSize: 16
	},
	seedFlex: {
		flex: 0.5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	seedContainer: {
		position: 'relative', 
		flex: 0.8,
		width: Dimensions.get('window').width,
		backgroundColor: theme.grey,
		alignItems: 'center',
		justifyContent: 'center'
	},
	seed: {
		flexDirection: 'row',
		width: '80%',
		//justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
	},
	copyButton: {
		position: 'absolute',
		backgroundColor: theme.white,
		padding: 10,
		borderRadius: 25,
		bottom: -20.5,
		right: 12,
		borderWidth: 1,
		borderColor: theme.dark
	},
	copyIcon: {
		width: 20,
		height: 20
	},
	buttonFlex: {
		flex: 0.2,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginBottom: 20
	}
});