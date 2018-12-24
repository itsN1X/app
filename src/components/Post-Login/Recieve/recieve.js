import React from 'react';
import { StyleSheet,BackHandler, Text, View, Image, ActivityIndicator, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, AsyncStorage, Clipboard } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';
import ElevatedView from 'react-native-elevated-view';
import QRCode from 'react-native-qrcode';
import theme from '../../common/theme';
import Loader from '../../common/loader';
import Button from '../../common/button';
import StatusBar from '../../common/statusbar';
import AppStatusBar from '../../common/appstatusbar';

var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/darkback.png";
var Scan = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/scan.png";
var Copy = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png";
var Change = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/reload.png";

export default class Recieve extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			address: "",
			addressType: "Business Address"
		};
	}
	goBack() {
		Actions.pop();
	}
	changeAddress() {
		Actions.addresses();
	}
	componentWillMount() {
		var self = this;
		this.setState({address: self.props.address});
	}
	componentDidMount() {
		setTimeout(() => {this.setState({loaded: true})}, 1500);
				BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		}
		componentWillUnmount() {
				BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		}
		handleBackButton = () =>  {
		 Actions.popTo("mainscreen");
		 return true;
		}

	writeToClipboard = async () => {
		await Clipboard.setString(this.state.address);
      	Toast.showWithGravity('Copied to Clipboard!', Toast.LONG, Toast.CENTER)
	}
	render() {
		return (
			<View style={styles.container}>


				{this.state.loaded ?
					 <View style={styles.lowerFlex}>
					<View style={styles.QRCodeFlex}>
						<QRCode
				          value={this.state.address}
				          size={200}
				        />
					</View>
				</View> :<View style={{zIndex: 999, position: 'absolute',width: '100%', height: '100%', backgroundColor: theme.white}}><Loader activity="Generating Address" /></View>}

				<StatusBar bColor={theme.grey} />

				<View style={styles.upperFlex}>
					<View style={styles.addressHeadingFlex}>
						<Text style={styles.addressHeadingText}>Address</Text>
					</View>
					<View style={styles.addressContainer}>
						<Text style={styles.addressText} onPress={this.writeToClipboard}>{this.state.address}</Text>
						<TouchableOpacity onPress={this.writeToClipboard} style={styles.copyWrapper}>
							<Image style={styles.copyIcon} source={{uri: Copy}} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	    backgroundColor: theme.white,
	    alignItems: 'center'
	},
	copyWrapper : {
		paddingVertical:5,
		paddingHorizontal:5
	},
	upperFlex: {
		height:100,
		width: '100%',
		alignItems: 'center',
		justifyContent:'flex-end',
		backgroundColor: theme.grey,
		paddingBottom:20
	},
	addressHeadingFlex: {
		marginBottom:10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	addressHeadingText: {
		fontFamily: theme.font,
		fontSize: 16,
		color: theme.dark,
		opacity:0.5
	},
	copyFlex: {
		flex: 1,
		alignItems: 'flex-end'
	},
	copyIcon: {
		width: 20,
		height: 20,
		marginRight:5
	},
	addressContainer: {
		flexDirection:'row',
		justifyContent: 'space-between',
		alignItems:'center',
		width:'90%'
	},
	addressText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 15,
		color: theme.black
	},
	lowerFlex: {
		flex: 1,
		width: '100%',
		alignItems: 'center'
	},
	QRCodeFlex: {
		flex: 0.9,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
