import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, BackHandler } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import ElevatedView from 'react-native-elevated-view';
import theme from '../../common/theme';
import Loader from '../../common/loader';
import Button from '../../common/button';
import StatusBar from '../../common/statusbar';
import AppStatusBar from '../../common/appstatusbar';
var bitcoin = require('bitcore-lib');

var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";
var ScanQR = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/scanqr.png";
export default class Send extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activity: "",
			toAddress: "",
			fromAddress: "",
			utxo: "",
			privateKey: "",
			balance: "",
			loaded: false,
			amount: null,
			estValue: "129870",
			fees: "",
			feesBTC: ""
		};
		this.calculateFees = this.calculateFees.bind(this);
		this.signTransaction = this.signTransaction.bind(this);
		this.sendCoins = this.sendCoins.bind(this);
		this.sendTransactionHash = this.sendTransactionHash.bind(this);
	}
	goBack() {
		Actions.pop();
	}
	openScanner() {
		Actions.scanqr();
	}
	componentWillReceiveProps(nextProps) {
		requestAnimationFrame(() => {
			this.setState({ toAddress: nextProps.address });
			Keyboard.dismiss();
		});
	}
	componentWillMount() {
		this.setState({activity: "Calculating Network Fee"}, () => {
            requestAnimationFrame(()=>this.calculateFees(), 0);
        });
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
	calculateFees() {
		var utxo = this.props.utxo;
		var from = this.props.fromAddress;
		var txn = new bitcoin.Transaction();
		txn.from(utxo).to("mu76UABwqefXrV93cFbsEvH9eg11QYooau", 1000)       // Feed information about what unspent outputs one can use
		.change(from).sign(this.props.privateKey);		 					// Add an output with the given amount of satoshis
		var fees = txn.getFee();
		var feesBTC = fees / 100000000;
		console.log(fees);
		this.setState({balance: this.props.balance, feesBTC: feesBTC, fees: fees, loaded: true, utxo: this.props.utxo, fromAddress: this.props.fromAddress, privateKey: this.props.privateKey});
		/*try {
            var self = this;
            axios({
                method: 'post',
                url: 'http://206.189.137.43:4013/estimate_fees',
            })
            .then(function (response) {
            	console.log(self.props.utxo);
            	console.log(self.props.address);
            	console.log(self.props.privateKey);
                self.setState({fees: response.data.fees.feerate, loaded: true, utxo: self.props.utxo, fromAddress: self.props.address, privateKey: self.props.privateKey});
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        catch(error) {
            alert(error);
        }*/
	}
	sendCoins() {
		var privateKey = this.state.privateKey;
		var from = this.state.fromAddress;
		var to = this.state.toAddress;
		var feesBTC = this.state.feesBTC;
		var fees = this.state.fees;
		var utxo = this.state.utxo;
		var amountBTC = this.state.amount;
		amountBTC = Number(amountBTC);
		var amount = amountBTC * 100000000;
		if(!bitcoin.Address.isValid(to)) {
			Toast.showWithGravity('Enter a valid address', Toast.LONG, Toast.CENTER);
		}
		else {
			var total = amountBTC+feesBTC;
			var balance = this.state.balance;
			var diff = amountBTC-balance;
			console.log("Total Amount: ", total);
			console.log("Balance: ",balance);
			console.log("Diff: ",diff);
			if(amount-fees < 0 ) {
				Toast.showWithGravity('Amount should be greater than fee', Toast.LONG, Toast.CENTER);
				return true;
			}
			if(total > balance) {
				console.log("Invalid Amount")
				Toast.showWithGravity('Invalid Amount', Toast.LONG, Toast.CENTER);
				return true;
			}
			else {
				this.setState({loaded: false, activity: "Signing Transaction"}, () => {
					requestAnimationFrame(() => this.signTransaction(utxo, amount, from, privateKey, fees, to), 0)
				});
			}
		}
	}
	signTransaction(utxo, amount, from, privateKey, fees, to) {
		console.log(utxo)
		console.log(amount)
		console.log(from)
		console.log(privateKey)
		console.log("fees :",fees)
		var transaction = new bitcoin.Transaction();
		transaction.from(utxo).fee(fees).to(to, amount).change(from).sign(privateKey);                              // Feed information about what unspent outputs one can use
		            // Add an output with the given amount of satoshis
		transaction = transaction.toString()
		console.log(transaction);
		hash = {};
		hash.transaction_hash = transaction;
		console.log(hash);
		this.setState({activity: "Broadcasting Transaction"}, () => {
			requestAnimationFrame(() => this.sendTransactionHash(hash), 0)
		});
	}
	sendTransactionHash(hash) {
		try {
            axios({
                method: 'post',
                url: 'http://206.189.137.43:4013/send_coins',
                data: hash
            })
            .then(function (response) {
                console.log(response)
                Actions.transactionsuccess({id: response.data.result})
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        catch(error) {
            console.log(error);
        }
	}
	render() {
		var totalAmount;
		var feesBTC = this.state.feesBTC;
		var spendableColor;
		if(this.state.amount===0 || this.state.amount==="" || this.state.amount===null) {
			totalAmount = feesBTC;
			totalAmount = parseFloat(totalAmount);
		}
		else {
			var amount = this.state.amount;
			amount = parseFloat(amount);
			totalAmount = feesBTC + amount;
		}
		var amountLeft = this.state.balance - totalAmount;
		amountLeft = amountLeft.toFixed(6);
		totalAmount = totalAmount.toFixed(6);
		if(amountLeft > 0) {
			spendableColor = theme.dark;
		}
		else {
			spendableColor = '#FF0000';
		}
		if(!this.state.loaded) {
            return(<Loader activity={this.state.activity} />)
        }
        else {
			return (
				<View style={styles.container}>
					<StatusBar bColor={theme.dark} />
					<AppStatusBar left={true} Back={Back} leftFunction={this.goBack} bColor={theme.dark} center={true} text="Send" textColor={theme.white} />
					<ScrollView style={{ height: '100%', width: '100%'}}>
						<View style={{height: Dimensions.get('window').height-90, width: '100%', alignItems: 'center'}}>
							<View style={styles.upperFlex}>
								<View style={styles.upperContentContainer}>
									<View style={styles.addressContainer}>
										<View style={styles.enterAddressHeading}>
											<Text style={styles.enterAddressText}>Enter Address</Text>
										</View>
										<View style={styles.addressInput}>
											<TextInput
												multiline = {true}
			         							numberOfLines = {4}
												value={this.state.toAddress}
												style={styles.wordInput}
												returnKeyType="next"
												onChangeText={(text) => this.setState({ toAddress: text })}
												maxLength={110}
												underlineColorAndroid='transparent'
											/>
											<View style={styles.scanQRButton}>
												<TouchableOpacity onPress={this.openScanner}>
													<Image style={styles.scanQRIcon} source={{uri: ScanQR}} />
												</TouchableOpacity>
											</View>
										</View>
									</View>
								</View>
								<View style={styles.spendableContainer}>
									<Text style={[styles.spendableText, {color: spendableColor}]}>Spendable : {amountLeft} BTC</Text>
								</View>
							</View>
							<View style={styles.lowerFlex}>
								<KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={35} style={styles.inputFlexContainer}>
									<TextInput
										keyboardType="number-pad"
										value={this.state.amount}
										style={styles.amountInput}
										returnKeyType="done"
										placeholder="0.0"
										onChangeText={(text) => this.setState({ amount: text })}
										maxLength={14}
										underlineColorAndroid='transparent'
									/>
									<Text style={styles.estValueText}>Fee : {this.state.feesBTC} BTC     Total Amount : {totalAmount} BTC</Text>
								</KeyboardAvoidingView>
								<View style={styles.buttonFlexContainer}>
									<Button bColor={theme.dark} onPress={this.sendCoins}>
										Proceed
									</Button>
								</View>
							</View>
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
	upperFlex: {
		position: 'relative',
		height: 200,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	upperContentContainer: {
		marginTop: 25,
		width: '90%',
		flex: 1
	},
	addressContainer: {
		flex: 0.5,
		width: '100%'
	},
	enterAddressHeading: {
		flex: 0.3,
		alignItems: 'flex-start',
		justifyContent: 'center'
	},
	enterAddressText: {
		fontFamily: theme.font,
		fontSize: 14,
		color: theme.black,
		opacity: 0.6
	},
	addressInput: {
		position: 'relative',
		flexDirection: 'row',
		flex: 0.7,
		borderBottomWidth: 0.6,
		borderBottomColor: "rgba(0,0,0,0.6)",
		alignItems: 'flex-end'
	},
	wordInput: {
		width: '100%',
		height: 55,

		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 15,
		maxWidth: '90%',
		letterSpacing: 1,
		color: theme.dark,
	},
	scanQRButton: {
		position: 'absolute',
		right: 5,
		paddingVertical: 10,
	},
	scanQRIcon: {
		height: 27,
		width: 27
	},
	spendableContainer: {
		position: 'absolute',
		bottom: -10,
		height: 80,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	spendableText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 14,
		color: theme.dark
	},
	lowerFlex: {
		flex: 0.78,
		width: '100%'
	},
	inputFlexContainer: {
		flex: 0.6,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	amountInput: {
		width: '100%',
		textAlign: 'center',
		height: 120,
		opacity: 0.7,
		fontFamily: theme.Lato300,
		fontWeight: '300',
		fontSize: 90,
		color: theme.dark,
	},
	totalContainer: {
		flex: 0.2,
		width: '80%',
		justifyContent: 'center',
		alignItems: 'flex-start'
	},
	estValueText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 12,
		color: theme.black,
		paddingTop: 40,
	},
	buttonFlexContainer: {
		height: 100,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'flex-end',
		position: 'absolute',
		bottom: 0,
	},
});
