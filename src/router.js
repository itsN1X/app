import React from 'react';
import { Text, Image, View, Dimensions, StyleSheet } from 'react-native';
import { Scene, Router, Stack } from 'react-native-router-flux';
import theme from './components/common/theme';
import FirstScreen from './components/Pre-Login/firstscreen';
import Eth from './components/Pre-Login/eth';
import WalletSeed from './components/Pre-Login/walletseed';
import CreatePin from './components/Pre-Login/createpin';
import Username from './components/Pre-Login/username';
import ConfirmPin from './components/Pre-Login/confirmpin';
import EnterPin from './components/Pre-Login/enterpin';
import Dummy from './components/Pre-Login/dummy';
import Modal from './components/Pre-Login/modal';
import WalletAddress from './components/Guardian/walletaddress';
import GuardianProfile from './components/Guardian/guardianprofile';
import GetStarted from './components/Guardian/getstarted';
import Verification from './components/Pre-Login/verification';
import Restore from './components/Pre-Login/restore';
import KeychainExample from './components/Pre-Login/keychain';
import InitiateWallets from './components/Post-Login/InitiateWallets/initiatewallets';
import Wallets from './components/Post-Login/Wallets/wallets';
import Auth from './components/Post-Login/Wallets/auth';
import BackupPhrase from './components/Post-Login/BackupPhrase/backupphrase';
import Profile from './components/Post-Login/Profile/profile';
import ViewKeys from './components/Post-Login/Profile/viewkeys';
import EnterEmail from './components/Post-Login/Profile/KeyRecovery/enteremail';
import EnterOTP from './components/Post-Login/Profile/KeyRecovery/enterotp';
import RecoveryRequests from './components/Post-Login/Profile/KeyRecovery/recoveryrequests';
import ChooseFriends from './components/Post-Login/Profile/KeyRecovery/choosefriends';
import ShowMnemonic from './components/Post-Login/Profile/KeyRecovery/showmnemonic';
import PendingRequests from './components/Post-Login/Profile/KeyRecovery/pendingrequests';
import InitiateRecovery from './components/Post-Login/Profile/KeyRecovery/initiaterecovery';
import MainScreen from './components/Post-Login/Mainscreen/main';
import Send from './components/Post-Login/Send/send';
import ScanQR from './components/Post-Login/Send/scanqr';
import TransactionSuccess from './components/Post-Login/Send/transactionsuccess';
import TransactionInfo from './components/Post-Login/Mainscreen/transactioninfo';
import Recieve from './components/Post-Login/Recieve/recieve';
import Addresses from './components/Post-Login/Recieve/addresses';
import NewAddress from './components/Post-Login/Recieve/newaddress';
import Exchange from './components/Post-Login/Exchange/exchange';
import FullTransactionHistory from './components/Post-Login/Mainscreen/fulltransactionhistory';

const wallets = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/wallet_tab.png";
const settings = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/settings_tab.png";
const recovery = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/recovery_tab.png";
const recoveryInit = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/Recovery-new.png";
const exchange = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/exchange_tab.png";
const walletsSelected = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/wallet-selected_tab.png";
const settingsSelected = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/setting-selected_tab.png";
const recoverySelected = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/recovery-selected_tab.png";
const exchangeSelected = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/exchange-selected_tab.png";
const home = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/home_tab.png";
const getstarted = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/getstarted_tab.png";
const requests = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/requests_tab.png";



const SettingsGuradianIcon = ({ focused }) => {
	let Opacity;
	let Icon;
	if (focused) {
		Opacity = 1;
		Icon = settingsSelected;
	}
	else {
		Opacity = 0.5;
		Icon = settingsSelected;
	}
	return (
		<View>
			<View style={[styles.navBarIconContainer, {opacity: Opacity}]}>
				<Image style={styles.navBarIcon} source={{uri: Icon}} />
				<Text style={styles.navBarText}>Settings</Text>
			</View>
		</View>
	);
};
const WalletsIcon = ({ focused }) => {
	let Opacity;
	let Icon;
	if (focused) {
		Opacity = 1;
		Icon = walletsSelected;
	}
	else {
		Opacity = 1;
		Icon = wallets;
	}
	return (
		<View>
			<View style={[styles.navBarIconContainer, {opacity: Opacity}]}>
				<Image style={styles.navBarIcon} source={{uri: Icon}} />
				<Text style={styles.navBarText}>Wallets</Text>
			</View>
		</View>
	);
};
const ExchangeIcon = ({ focused }) => {
	let Opacity;
	if (focused) {
		Opacity = 1;
		Icon = exchangeSelected;
	}
	else {
		Opacity = 1;
		Icon = exchange;
	}
	return (
		<View>
			<View style={[styles.navBarIconContainer, {opacity: Opacity}]}>
				<Image style={styles.navBarIcon} source={{uri: Icon}} />
				<Text style={styles.navBarText}>Exchange</Text>
			</View>
		</View>
	);
};
const RecoveryIcon = ({ focused }) => {
	let Opacity;
	if (focused) {
		Opacity = 1;
		Icon = recoverySelected;
	}
	else {
		Opacity = 1;
		Icon = recoveryInit;
	}
	return (
		<View>
			<View style={[styles.navBarIconContainer, {opacity: Opacity}]}>
				<Image style={styles.navBarIcon} source={{uri: Icon}} />
				<Text style={styles.navBarText}>Recovery</Text>
			</View>
		</View>
	);
};
const SettingsIcon = ({ focused }) => {
	let Opacity;
	if (focused) {
		Opacity = 1;
		Icon = settingsSelected;
	}
	else {
		Opacity = 1;
		Icon = settings;
	}
	return (
		<View>
			<View style={[styles.navBarIconContainer, {opacity: Opacity}]}>
				<Image style={styles.navBarIcon} source={{uri: Icon}} />
				<Text style={styles.navBarText}>Settings</Text>
			</View>
		</View>
	);
};
const HomeIcon = ({ focused }) => {
	let Opacity;
	if (focused) {
		Opacity = 1;

	}
	else {
		Opacity = 0.5;
	}
	return (
		<View>
			<View style={[styles.navBarIconContainer, {opacity: Opacity}]}>
				<Image style={styles.navBarIcon} source={{uri: home}} />
				<Text style={styles.navBarText}>Home</Text>
			</View>
		</View>
	);
};
const RequestsIcon = ({ focused }) => {
	let Opacity;
	if (focused) {
		Opacity = 1;

	}
	else {
		Opacity = 0.5;
	}
	return (
		<View>
			<View style={[styles.navBarIconContainer, {opacity: Opacity}]}>
				<Image style={styles.navBarIcon} source={{uri: requests}} />
				<Text style={styles.navBarText}>Home</Text>
			</View>
		</View>
	);
};
const GetStartedIcon = ({ focused }) => {
	let Opacity;
	if (focused) {
		Opacity = 1;

	}
	else {
		Opacity = 0.5;
	}
	return (
		<View>
			<View style={[styles.navBarIconContainer, {opacity: Opacity}]}>
				<Image style={styles.navBarIcon} source={{uri: getstarted}} />
				<Text style={styles.navBarText}>Get Started</Text>
			</View>
		</View>
	);
};
const RouterComponent = () => {
	return (
		<Router>
			<Scene key="root">
				<Scene key="prelogin" hideNavBar panHandlers={null}>
					<Scene key="auth" component={Auth} hideNavBar panHandlers={null} initial/>
					<Scene key="walletaddress" component={WalletAddress}  hideNavBar panHandlers={null} />
					<Scene key="firstscreen" component={FirstScreen} hideNavBar panHandlers={null} />
					<Scene key="username" component={Username} hideNavBar panHandlers={null} />
					<Scene key="createpin" component={CreatePin} hideNavBar panHandlers={null} />
					<Scene key="eth" component={Eth} hideNavBar panHandlers={null} />
					<Scene key="confirmpin" component={ConfirmPin} hideNavBar panHandlers={null} />
					<Scene key="walletseed" component={WalletSeed} hideNavBar panHandlers={null} />
					<Scene key="verification" component={Verification} hideNavBar panHandlers={null} />
					<Scene key="restore" component={Restore} hideNavBar panHandlers={null} />
					<Scene key="enteremail" component={EnterEmail} panHandlers={null} hideNavBar />
					<Scene key="enterotp" component={EnterOTP} panHandlers={null} hideNavBar />
					<Scene key="choosefriends" component={ChooseFriends} panHandlers={null} hideNavBar />
					<Scene key="dummy" component={Dummy} hideNavBar panHandlers={null}/>
					<Scene key="modal" component={Modal} hideNavBar panHandlers={null} />
					<Scene key="keychain" component={KeychainExample} hideNavBar panHandlers={null} />
				</Scene>
				<Scene key="postlogin" panHandlers={null} hideNavBar>
				<Scene key="recoveryrequests" component={RecoveryRequests} hideNavBar panHandlers={null} />
				<Scene key="showmnemonic" component={ShowMnemonic} panHandlers={null} hideNavBar />
					<Scene key="initiatewallets" component={InitiateWallets} panHandlers={null} hideNavBar />
					<Scene key="enterpin" component={EnterPin} hideNavBar panHandlers={null}/>
					<Scene key="newaddress" component={NewAddress} hideNavBar panHandlers={null} />
				</Scene>
				<Scene key="postlogintabs" hideNavBar panHandlers={null} tabs tabBarStyle={{ flexDirection: 'row', height: 60, borderTopWidth: 1, borderColor: theme.grey, width: Dimensions.get('window').width, backgroundColor: "#FFF", shadowOffset: { width: 0, height: -2 }, shadowColor: 'black', shadowOpacity: 0.1}} showLabel={false} >
					<Stack key="wallets" hideNavBar icon={WalletsIcon} panHandlers={null}>
						<Scene key="walletsmain" component={Wallets} hideNavBar panHandlers={null}/>
						<Scene key="mainscreen" component={MainScreen} hideNavBar panHandlers={null} />
						<Scene key="fulltransactionhistory" component={FullTransactionHistory} hideNavBar panHandlers={null} />
						<Scene key="transactioninfo" component={TransactionInfo} hideNavBar panHandlers={null} />
						<Scene key="send" component={Send} hideNavBar panHandlers={null} />
						<Scene key="scanqr" component={ScanQR} hideNavBar panHandlers={null} />
						<Scene key="transactionsuccess" component={TransactionSuccess} hideNavBar panHandlers={null} />
						<Scene key="recieve" component={Recieve} hideNavBar panHandlers={null} />
					</Stack>
					<Scene key="exchange" component={Exchange} hideNavBar icon={ExchangeIcon} panHandlers={null} />
					<Stack key="keyrecovery" hideNavBar icon={RecoveryIcon} panHandlers={null}>
						<Scene key="initiaterecovery" component={InitiateRecovery} panHandlers={null} hideNavBar />
						<Scene key="enteremail" component={EnterEmail} panHandlers={null} hideNavBar />
						<Scene key="enterotp" component={EnterOTP} panHandlers={null} hideNavBar />
						<Scene key="choosefriends" component={ChooseFriends} panHandlers={null} hideNavBar />
					</Stack>
					<Stack key="profile" hideNavBar icon={SettingsIcon} panHandlers={null}>
						<Scene key="profilemain" component={Profile} panHandlers={null} hideNavBar/>
						<Scene key="viewkeys" component={ViewKeys} panHandlers={null} hideNavBar />
						<Scene key="pendingrequests" component={PendingRequests} back={true} panHandlers={null} hideNavBar />
						<Scene key="backupphrase" component={BackupPhrase} hideNavBar panHandlers={null} />
					</Stack>
				</Scene>
				<Scene key="guardiantabs" hideNavBar panHandlers={null} tabs tabBarStyle={{flexDirection: 'row', height: 60, borderTopWidth: 1, borderColor: theme.grey, width: Dimensions.get('window').width, backgroundColor: "#FFF", shadowOffset: { width: 0, height: -2 }, shadowColor: 'black', shadowOpacity: 0.1}} showLabel={false}>
					<Scene key="pendingrequests" component={PendingRequests} icon={RequestsIcon} back={false} panHandlers={null} hideNavBar />
					<Scene key="getstarted" component={GetStarted} icon={GetStartedIcon} panHandlers={null} hideNavBar />
					<Stack key="profile" hideNavBar icon={SettingsGuradianIcon} panHandlers={null}>
					<Scene key="profilemain" component={Profile} icon={SettingsGuradianIcon} panHandlers={null} hideNavBar/>
					<Scene key="backupphrase" component={BackupPhrase} hideNavBar panHandlers={null} />
					</Stack>
				</Scene>
			</Scene>
		</Router>
	);
}
const styles = StyleSheet.create({
	navBarIconContainer: {
		alignItems: 'center',
	},
	navBarIcon: {
		width: 23,
		height: 23
	},
	navBarText: {
		marginTop: 3,
		fontFamily: theme.font,
		fontSize: 10,
		color: theme.dark
	}
});
export default RouterComponent;
