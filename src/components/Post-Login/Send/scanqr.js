import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Dimensions, BackHandler } from 'react-native';
import { Actions } from 'react-native-router-flux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import theme from '../../common/theme';

var Cancel = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/cancel.png";
var QrCode = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/qrcodescan.png";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default class ScanQR extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			key: ''
		};
		this.handleBackButton = this.handleBackButton.bind(this);
	}
	componentWillReceiveProps() {
		console.log("Update");
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
	}
	componentDidMount() {
		console.log("Mount");
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentWillUnmount() {
    	console.log("UnMount")
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        this.goBack();
    }
	onSuccess(e) {
		 Actions.pop()
			requestAnimationFrame(() => {
			      Actions.refresh({
			        address: e.data
			      })
			});
  	}
  	goBack() {
		Actions.pop();
	}
	render() {
		return (
			<View style={styles.container}>
		          <QRCodeScanner
			        onRead={(e) => this.onSuccess(e)}
			        showMarker
			        cameraStyle={{ height: SCREEN_HEIGHT }}
			        customMarker={<View style={styles.rectangleContainer}>
						            <View style={styles.topOverlay}>
						            	<TouchableOpacity onPress={this.goBack} style={styles.cancelButtonContainer}>
								          	<Image style={styles.cancelIcon} source={{uri: Cancel}} />
								        </TouchableOpacity>
						            </View>
						            <View style={{ flexDirection: "row" }}>
						              <View style={styles.leftAndRightOverlay} />
						              <View style={styles.rectangle}>
						              	<View style={styles.scanBar} />
						              </View>
						              <View style={styles.leftAndRightOverlay} />
						            </View>
						            <View style={styles.bottomOverlay} />
						          </View>
						        }
				/>
			</View>
		);
	}
}
const overlayColor = "rgba(0,0,0,0.5)";  // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "white";

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "#FFFFFF";

const iconScanColor = "blue";

const styles = StyleSheet.create({
	container: {
		flex: 1,
	    backgroundColor: theme.black,
	    alignItems: 'center',
	    justifyContent: 'center'
	},
	rectangleContainer: {
	    flex: 1,
	    alignItems: "center",
	    justifyContent: "center",
	    backgroundColor: "transparent"
	},
	rectangle: {
	  height: rectDimensions,
	  width: rectDimensions,
	  borderWidth: rectBorderWidth,
	  borderColor: rectBorderColor,
	  alignItems: "center",
	  justifyContent: "center",
	  backgroundColor: "transparent"
	},
	topOverlay: {
	  flex: 1,
	  height: SCREEN_WIDTH,
	  width: SCREEN_WIDTH,
	  backgroundColor: overlayColor,
	  justifyContent: "center",
	  alignItems: "center"
	},
	bottomOverlay: {
	  flex: 1,
	  height: SCREEN_WIDTH,
	  width: SCREEN_WIDTH,
	  backgroundColor: overlayColor,
	  paddingBottom: SCREEN_WIDTH * 0.25
	},
	leftAndRightOverlay: {
	  height: SCREEN_WIDTH * 0.65,
	  width: SCREEN_WIDTH,
      backgroundColor: overlayColor
	},
	scanBar: {
	  width: scanBarWidth,
	  height: scanBarHeight,
	  backgroundColor: scanBarColor
	},
	cancelButtonContainer: {
		position: 'absolute', 
		left: 30,
		top: 30
	},
	cancelIcon: {
		width: 25,
		height: 25
	},
	qrIconContainer: {
		flex: 0.5,
		alignItems: 'center',
	    justifyContent: 'flex-end',
	},
	qrIcon: {
		width: 35,
		height: 35
	},
	bottomContentContainer: {
		width: '100%',
		padding: 10,
		flexDirection: 'row',
		backgroundColor: "#363636"
	},
	bottomText: {
		flex: 0.5,
		textAlign: "right",
		fontFamily: theme.font,
		fontSize: 18,
		color: theme.white 
	}
});