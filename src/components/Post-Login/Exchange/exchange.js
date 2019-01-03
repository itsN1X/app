import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Animated, Easing, BackHandler } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';
import StatusBar from '../../common/statusbar';
import AppStatusBar from '../../common/appstatusbar';
import theme from '../../common/theme';
import Button from '../../common/button';
import Picker from '../../common/coinpicker';
import { isIphoneX } from 'react-native-iphone-x-helper';
var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";
var ExchangeIcon = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/exchangedark.png";

let endPoint = 1;
let buttonDisabled = false;
let buttonHeight;
let disabledText;
let buttonOpacity;

if(Dimensions.get('window').height > 700 && Dimensions.get('window').height < 830) {
    buttonHeight = 60;
}
else if(Dimensions.get('window').height > 830 ){
    buttonHeight = 65;
}
else {
    buttonHeight = 55;
}

export default class Exchange extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pickerFromValue: 'BTC',
			pickerToValue: 'ETH',
			side: "",
			pickerEnabled: false,
			rotated: false,
			amount: "",
			rate: "38.46153",
			spendable: "0.000000"
		}
		this.interchangeCoins = this.interchangeCoins.bind(this);
		this.enablePicker = this.enablePicker.bind(this);
		this.handleBackButton = this.handleBackButton.bind(this);
		this.disablePicker = this.disablePicker.bind(this);
		this.changeCoin = this.changeCoin.bind(this);
	}
  componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton = () => {
      Actions.postlogintabs();
      Actions.wallets();
      return true;
    }
	componentWillMount() {
    if (isIphoneX()) {
        this.setState({iphoneX:true});
    } else {
        this.setState({iphoneX:false});
    }

		this.spinValue = new Animated.Value(0)
	}
	interchangeCoins() {
		if(!this.state.rotated) {
			Animated.timing(this.spinValue,{
			    toValue: 1,
			    duration: 300,
			    easing: Easing.linear
			}).start();
		}
		else {
			Animated.timing(this.spinValue,{
			    toValue: 0,
			    duration: 300,
			    easing: Easing.linear
			}).start();


		}

    let temp = this.state.pickerFromValue;
    this.setState({ pickerToValue: temp, pickerFromValue: this.state.pickerToValue, rotated: !this.state.rotated });

	}
	changeEndPoint() {
		if(endPoint === 1) {
			endpoint = 0;
		}
		else {
			endpoint = 1;
		}
	}
	enablePicker(side) {
		this.setState({ pickerEnabled: true, side: side });
	}
	disablePicker() {
		this.setState({ pickerEnabled: false });
		Keyboard.dismiss();
	}
	changeCoin(value) {
		if( this.state.side === "to" ) {
			this.setState({ pickerToValue: value, pickerEnabled: false })
		}
		else {
			this.setState({ pickerFromValue: value, pickerEnabled: false })
		}
	}
	goBack() {
		Actions.pop();
	}
	onExchangePress() {
		Toast.showWithGravity("Exchange Feature Coming Soon", Toast.LONG, Toast.CENTER);
	}
	render() {
		const spin = this.spinValue.interpolate({
			  inputRange: [0, 1],
			  outputRange: ['0deg', '180deg']
			})
		if(this.state.pickerFromValue === this.state.pickerToValue) {
			disabledText="Please choose two different coins";
			buttonDisabled=true;
			buttonOpacity=0.3;
		}
		else {
			disabledText="";
			buttonDisabled=false;
			buttonOpacity=1;
		}
		return (
			<Animated.View style={styles.container}>
				<StatusBar bColor={theme.dark} />
				<AppStatusBar bColor={theme.dark} center={true} text="Exchange" textColor={theme.white} />
				<ScrollView style={{ height: '100%', width: '100%'}}>
						<View style={{height: Dimensions.get('window').height-130, width: '100%', alignItems: 'center'}}>
						<View style={styles.upperFlex}>
							<View style={styles.addressContainer}>
								<View style={styles.enterAddressHeading}>
									<Text style={styles.enterAddressText}>Enter Amount</Text>
								</View>
								<View style={styles.addressInput}>
									<TextInput
										value={this.state.amount}
										style={styles.wordInput}
										returnKeyType="next"
										keyboardAppearance="dark"
				    					keyboardType="number-pad"
										onChangeText={(text) => this.setState({ amount: text })}
										maxLength={15}
										underlineColorAndroid='transparent'
									/>
								</View>
							</View>
							<View style={styles.exchangeContainer}>
								<View style={styles.coinsContainer}>
									<TouchableOpacity style={styles.leftCoinContainer} onPress={() => this.enablePicker("from")}>
										<Text style={styles.coinText}>{this.state.pickerFromValue}</Text>
									</TouchableOpacity>
									<TouchableOpacity style={styles.exchangeImageContainer}>
										<Animated.Image style={[styles.exchangeIcon]} source={{uri: ExchangeIcon}} />
									</TouchableOpacity>
									<TouchableOpacity style={styles.rightCoinContainer} onPress={() => this.enablePicker("to")}>
										<Text style={styles.coinText}>{this.state.pickerToValue}</Text>
									</TouchableOpacity>
								</View>
								<View style={styles.noteContainer}>
									<Text style={styles.noteText}>Tap to change the currency</Text>
								</View>
							</View>
						</View>
						<View style={styles.lowerFlex}>
							<View style={styles.instantRateFlex}>
								<View style={styles.instantRateHeadingContainer}>
									<Text style={styles.instantRateHeadingText}>INSTANT RATE</Text>
								</View>
								<View style={styles.instantRateContainer}>
									<Text style={styles.instantRateText}>1 {this.state.pickerFromValue} = {this.state.rate} {this.state.pickerToValue}</Text>
								</View>
							</View>
							<View style={styles.spendableFlex}>
								<View style={styles.spendableHeadingContainer}>
									<Text style={styles.spendableHeadingText}>SPENDABLE</Text>
								</View>
								<View style={styles.spendableContainer}>
									<Text style={styles.spendableText}>{this.state.spendable} {this.state.pickerFromValue}</Text>
								</View>
							</View>
							<View style={styles.buttonFlex}>
								<Text style={styles.disabledText}>{disabledText}</Text>
								<TouchableOpacity disabled={buttonDisabled} onPress={this.onExchangePress} style = {[styles.buttonStyle, {backgroundColor: theme.dark, opacity: buttonOpacity, height: buttonHeight}]}>
						            <Text style= {styles.text}>Coming Soon</Text>
						        </TouchableOpacity>
                    {this.state.iphoneX &&
    									<View style={{height:20}}>

    									</View>
    								}
							</View>
							{this.state.pickerEnabled ? <Picker status={this.state.pickerEnabled} changeCoin={this.changeCoin} /> : null}
						</View>
					</View>
				</ScrollView>
			</Animated.View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
	    backgroundColor: theme.white,
	    alignItems: 'center'
	},
	upperFlex: {
		flex: 0.5,
		width: '100%',
		alignItems: 'center'
	},
	addressContainer: {
		flex: 0.5,
		width: '80%',
		marginTop: 35
	},
	enterAddressHeading: {
		flex: 0.3,
		alignItems: 'center',
		justifyContent: 'center'
	},
	enterAddressText: {
		fontFamily: theme.font,
		fontSize: 14,
		color: theme.black,
		opacity: 0.6
	},
	addressInput: {
		flex: 0.7,
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	wordInput: {
		width: '100%',
		height: 50,
		borderBottomWidth: 0.6,
		borderBottomColor: "rgba(0,0,0,0.6)",
		fontFamily: theme.Lato300,
		fontWeight: '300',
		fontSize: 18,
		color: theme.dark,
	},
	exchangeContainer: {
		flex: 0.5,
		width: '80%'
	},
	coinsContainer: {
		flex: 0.6,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'flex-start',
		flexDirection: 'row'
	},
	leftCoinContainer: {
		flex: 0.3,
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
	rightCoinContainer: {
		flex: 0.3,
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	coinText: {
		fontFamily: theme.Lato300,
		fontWeight: '300',
		fontSize: 26,
		color: theme.dark
	},
	exchangeImageContainer: {
		flex: 0.4,
		justifyContent: 'center',
		alignItems: 'center'
	},
	exchangeIcon: {
		height: 40,
		width: 40
	},
	noteContainer: {
		flex: 0.4,
		width: '100%',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	noteText: {
		fontFamily: theme.font,
		fontSize: 12,
		color: theme.black,
		opacity: 0.6
	},
	lowerFlex: {
		flex: 0.45,
		width: '100%',
		alignItems: 'center'
	},
	instantRateFlex: {
		flex: 0.32,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	buttonFlex: {
		flex: 0.34,
		marginBottom: 15,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	instantRateHeadingContainer: {
		flex: 0.2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	instantRateHeadingText: {
		fontFamily: theme.Lato,
		fontSize: 12,
		color: theme.black,
	},
	instantRateContainer: {
		flex: 0.3,
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	instantRateText: {
		fontFamily: theme.Lato300,
		fontWeight: '300',
		fontSize: 14,
		color: theme.black,
	},
	spendableFlex: {
		flex: 0.3,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	spendableHeadingContainer: {
		flex: 0.2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	spendableHeadingText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 12,
		color: theme.dark,
	},
	spendableContainer: {
		flex: 0.5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	spendableText: {
		fontFamily: theme.Lato300,
		fontWeight: '300',
		fontSize: 14,
		color: theme.dark,
	},
	buttonStyle: {
        width: '80%',
		backgroundColor: theme.dark,
		justifyContent: 'center',
	  	alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.dark,
	  	borderRadius: 10
    },
    text: {
        fontFamily: theme.font,
		fontSize: 18,
		color: theme.white
    },
    disabledText: {
    	fontFamily: theme.font,
    	fontSize: 12,
    	color: "#FF0000",
    	marginBottom: 3
    }
});
