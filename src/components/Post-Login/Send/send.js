import React from 'react';
import { StyleSheet, Text, View, AsyncStorage,Image, ActivityIndicator, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, BackHandler } from 'react-native';
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
			feesBTC: "",
			finalUtxo:""
		};
		this.calculateUtxo = this.calculateUtxo.bind(this);
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
		this.setState({activity: "Fetching Details"}, () => {
            requestAnimationFrame(()=>this.getCoinData(), 0);
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

		getCoinData = async () => {
			try {
						const value = await AsyncStorage.getItem('@CoinsData');
						var coinData = JSON.parse(value);
						this.getBalance(coinData);
				}
			catch(error) {
						alert(error)
				}
		}

		getBalance (coinData) {
				coinAddress = {};
				coinAddress.addresses = [coinData[0].address];
				coinAddress.asset_id = coinData[0].asset_id;
				try {
						var self = this;
						axios({
								method: 'post',
								url: 'http://206.189.137.43:4013/receive_coins',
								data: coinAddress
						})
						.then(function (response) {

							 self.setState({  utxo: response.data.balanceHistory.utxo});
							 self.calculateMax();

						})
						.catch(function (error) {
							Toast.showWithGravity("Internet connection required!", Toast.LONG, Toast.CENTER);
						});
				}
				catch(error) {
						alert(error);
				}
		}

		calculateUtxo() {
		var Unit = bitcoin.Unit;

		let utxo = this.state.utxo;
		let amount = 	Unit.fromBTC(this.state.amount).satoshis;
		let final_utxo = [];
		let lessers = [];
		let greaters = [];

		for (var i=0 ; i< utxo.length ; i++){
        if ( Unit.fromBTC(utxo[i].amount).satoshis < amount) {
        	lessers.push(utxo[i])
        }
        else {
        	greaters.push(utxo[i])
        }
		}

		if (greaters.length !== 0) {

				greaters.sort(function(a, b) {
				    return  Unit.fromBTC(a.amount).satoshis -  Unit.fromBTC(b.amount).satoshis;
				});

				var min_greater = greaters[0];
				change = Unit.fromBTC(min_greater.amount).satoshis - amount;

				final_utxo.push(min_greater);
		}

		else {

					var accum = 0

				lessers.sort(function(a, b) {
				    return Unit.fromBTC(a.amount).satoshis - Unit.fromBTC(b.amount).satoshis;
				});
					for (var a= lessers.length-1 ; a >= 0; a--){
						final_utxo.push(lessers[a])
						accum = accum + Unit.fromBTC(lessers[a].amount).satoshis ;
						if (accum >= amount) {
							change = accum - amount
							break ;
						}
					}

			if(accum <= amount){
				final_utxo = [];
			}

	}

	return final_utxo;










		// var utxo = this.props.utxo;
		// var from = this.props.fromAddress;
		// var txn = new bitcoin.Transaction();
		// txn.from(utxo).to("mu76UABwqefXrV93cFbsEvH9eg11QYooau", 1000)       // Feed information about what unspent outputs one can use
		// .change(from).sign(this.props.privateKey);		 					// Add an output with the given amount of satoshis
		// var fees = txn.getFee();
		// var feesBTC = fees / 100000000;
		// console.log(fees);
		// this.setState({balance: this.props.balance, feesBTC: feesBTC, fees: fees, loaded: true, utxo: this.props.utxo, fromAddress: this.props.fromAddress, privateKey: this.props.privateKey});
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


	calculateMax(){
		var Unit = bitcoin.Unit;
		let utxo = this.state.utxo;
		var privateKey = this.props.privateKey;
		var from = this.props.fromAddress;
		var to = from;
		let amount = 0 ;

		for (var i=0 ; i< utxo.length ; i++){
			amount +=  Unit.fromBTC(utxo[i].amount).satoshis;
		}

		if(utxo.length){
			var transaction = new bitcoin.Transaction();

			transaction.from(utxo).to(to, amount).change(from);

			let size = transaction._estimateSize();

			let estimatedFees =  transaction._estimateFee(size,amount, 1000);

			estimatedFees *= 2;

			let maxBalance =  Unit.fromSatoshis(amount - estimatedFees).to(Unit.BTC);

			if(maxBalance > 0){
				this.setState({maxAmount:maxBalance, loaded:true});
			}
			else {
				this.setState({maxAmount:0, loaded:true});
			}


		}

		else{
				this.setState({maxAmount:0, loaded:true});
		}


	}
	sendCoins() {

		var Unit = bitcoin.Unit;
		var privateKey = this.props.privateKey;
		var from = this.props.fromAddress;
		var to = this.state.toAddress;
		var amount = Unit.fromBTC(this.state.amount).satoshis;
		var maxAmount = Unit.fromBTC(this.state.maxAmount).satoshis;

		if(!bitcoin.Address.isValid(to)) {
			Toast.showWithGravity('Enter a valid address', Toast.LONG, Toast.CENTER);
		}

		else if(amount > maxAmount){
			Toast.showWithGravity('Enter a valid amount', Toast.LONG, Toast.CENTER);
		}

		else if(maxAmount == 0){
			Toast.showWithGravity('Zero Balance', Toast.LONG, Toast.CENTER);
		}

		else {
				let utxo = this.calculateUtxo();
				this.setState({loaded: false, activity: "Signing Transaction"}, () => {
					requestAnimationFrame(() => this.signTransaction(utxo, amount, from, privateKey,to), 0)
				});

		}
	}
	signTransaction(utxo, amount, from, privateKey, to) {
		var Unit = bitcoin.Unit;

		var transaction = new bitcoin.Transaction();

		transaction.from(utxo).to(to, amount).change(from);

		let size = transaction._estimateSize();

		let estimatedFees =  transaction._estimateFee(size,amount, 1000);
		let balance = Unit.fromBTC(this.props.balance).satoshis;

		if((amount + estimatedFees) > balance){
			Toast.showWithGravity('Amount should not be greater than balance', Toast.LONG, Toast.CENTER);
			this.setState({loaded:true});
		}

		else if(amount <= estimatedFees ){
			Toast.showWithGravity('Amount should be greater than fee', Toast.LONG, Toast.CENTER);
			this.setState({loaded:true});
		}


		else if((amount - estimatedFees) <= 0){
		Toast.showWithGravity('Amount should be greater than fee', Toast.LONG, Toast.CENTER);
		this.setState({loaded:true});
		}

		else{
			transaction.fee(estimatedFees);
			transaction.sign(privateKey);
			transaction = transaction.toString();
			hash = {};
			hash.transaction_hash = transaction;
			hash.address = from;
			hash.amount = Unit.fromSatoshis(amount).to(Unit.BTC);


			this.setState({activity: "Broadcasting Transaction"}, () => {
				requestAnimationFrame(() => this.sendTransactionHash(hash), 0)
			});
		}

	}
	sendTransactionHash(hash) {
		try {
            axios({
                method: 'post',
                url: 'http://206.189.137.43:4013/send_coins',
                data: hash
            })
            .then(function (response) {
								if(response.data.flag == 144){
									Toast.showWithGravity("There is some problem from our end.", Toast.LONG, Toast.CENTER);
									Actions.popTo("mainscreen");
								}
								else{
									Actions.transactionsuccess({id: response.data.result})
								}
            })
            .catch(function (error) {
							Toast.showWithGravity("Internet connection required!", Toast.LONG, Toast.CENTER);
						  Actions.pop();
            });
        }
        catch(error) {
            console.log(error);
        }
	}
	render() {

			spendableColor = theme.dark;

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
							</View>
							<View>
								<Text>Spendable Amount: {" "+this.state.maxAmount}</Text>
							</View>
							<View style={styles.lowerFlex}>

								<KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={35} style={styles.inputFlexContainer}>
									<TextInput
										keyboardType="numeric"
										value={this.state.amount}
										style={styles.amountInput}
										returnKeyType="done"
										placeholder="0.0"
										onChangeText={(text) => this.setState({ amount: text })}
										maxLength={14}
										underlineColorAndroid='transparent'
									/>

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
		borderBottomColor: "red",
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
