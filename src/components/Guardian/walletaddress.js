import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Platform, BackHandler, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';
import bip39 from 'react-native-bip39';
import { VirgilCrypto } from 'virgil-crypto';
import axios from 'axios';
import StatusBar from '../common/statusbar';
import AppStatusBar from '../common/appstatusbar';
import theme from '../common/theme';
import Loader from '../common/loader';
const crypto = require('react-native-crypto');

var Copy = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png";
export default class WalletAddress extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activity: "",
			loaded: false,
			mnemonic: '',
			mnemonicArray: null,
			wallet_id: ""
		};

		this.generateKeyPair = this.generateKeyPair.bind(this);
	}

	componentWillMount() {
		this.setState({activity: "Creating a trusted device"}, () => {
			requestAnimationFrame(()=>this.generateGuardianMnemonic(), 0);
		})
		}


		generateGuardianMnemonic(){
			const promise = bip39.generateMnemonic();
			promise.then((result)=>{
				this.setState({mnemonic : result});
				this.generateKeyPair();
			});
		}

		generateKeyPair() {
			const virgilCrypto = new VirgilCrypto();
			let account = {};
			account.mnemonic = this.state.mnemonic;
			const seed = bip39.mnemonicToSeedHex(this.state.mnemonic);
			account.seed = seed;
			const keyPair = virgilCrypto.generateKeysFromKeyMaterial(seed);
			const privateKeyData = virgilCrypto.exportPrivateKey(keyPair.privateKey);
			const publicKeyData = virgilCrypto.exportPublicKey(keyPair.publicKey);
			const privateKey = privateKeyData.toString('base64');
			const publicKey = publicKeyData.toString('base64');
			const privateKeyHash = this.createHash(privateKey)
			account.publicKey = publicKey;
			account.privateKey = privateKey;
			account.privateKeyHash = privateKeyHash;
			account.username = this.props.username;
			account = JSON.stringify(account);
			let details = {};
			details.private_key_hash = privateKeyHash;
			details.public_key = publicKey;
			details.user_name = this.props.username;
			this.storeData(account);
			this.sendUserDetails(details);
		}

		sendUserDetails = async (details) => {
			try {
				var self = this;
				axios({
						method: 'post',
						url: 'http://206.189.137.43:4013/create_wallet',
						data: details
					})
					.then(function (response) {
						self.setState({wallet_id: response.data.wallet_id})
							self.storeWalletID(response.data.wallet_id);
							self.setState({ loaded: true })
							Actions.guardiantabs();
							Actions.guardianprofile();

					})
					.catch(function (error) {
					});
			}
			catch(error) {
				Toast.showWithGravity("Network Error", Toast.LONG, Toast.CENTER);
			}
		}
		createHash(data) {
			const hash = crypto.createHash('sha256');
			hash.update(data);
			const privateKeyHash = hash.digest('hex');
			return privateKeyHash;
		}
		storeData = async (data) => {
			try {
					await AsyncStorage.setItem('@UserData', data);
					await AsyncStorage.setItem('@AccountStatus', "LoggedIn");
					await AsyncStorage.setItem('@Guardian', "true");
				} catch (error) {
				}
		}
		storeWalletID = async (data) => {
			try {
					await AsyncStorage.setItem('@WalletID', data);
				} catch (error) {
				}
		}

	render() {
		if(!this.state.loaded) {
						return(<Loader activity={this.state.activity} />);
				}
		else {
		return(
			<View style={styles.container}>
				<StatusBar bColor={theme.dark} />
				<AppStatusBar bColor={theme.dark} center={true} text="Wallet Addresses" textColor={theme.white} />
				<View style={styles.headingContainer}>
					<Text style={styles.headingText}>Wallet Address</Text>
				</View>
				<View style={styles.addressHeadingFlex}>
					<Text style={styles.addressHeadingText}>Public</Text>
					<View style={styles.copyContainer}>
						<TouchableOpacity>
							<Image style={styles.copyIcon} source={{uri: Copy}} />
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.addressContainer}>
					<Text style={styles.addressText}>rw34tgf89xkjb4i3hg74yc349ycb4unvbtb4yv354cuyb38</Text>
				</View>
			</View>
		);
	}
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
	    backgroundColor: theme.white,
	    alignItems: 'center'
	},
	headingContainer: {
		width: '90%',
		flex: 0.1,
		justifyContent: 'flex-end'
	},
	headingText: {
		fontFamily: theme.font500,
		fontWeight: Platform.OS === 'ios' ? '500' : '400',
		fontSize: 18
	},
	addressHeadingFlex: {
		flex: 0.12,
		flexDirection: 'row',
		alignItems: 'center',
		width: '90%'
	},
	addressHeadingText: {
		fontFamily: theme.font500,
		fontWeight: Platform.OS === 'ios' ? '500' : '400',
		fontSize: 16
	},
	copyContainer: {
		flex: 1,
		alignItems: 'flex-end',
		opacity: 0.6
	},
	copyIcon: {
		width: 16,
		height: 16
	},
	addressContainer: {
		width: '90%',
		marginVertical: 0,
	},
	addressText: {
		fontFamily: theme.font,
		fontSize: 16,
		color: theme.black,
		opacity: 0.8
	}
})
