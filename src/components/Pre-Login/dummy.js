import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import theme from '../common/theme';
import DummyWalletItem from './dummyWalletItem';

const bitcoin = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/coins/light/bitcoin.png";
const monero = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/coins/light/monero.png";
const ethereum = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/coins/light/ethereum.png";
const litecoin = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/coins/light/litecoin.png";

export default class ScanQR extends React.Component {

	render() {
		return (
			<View style={{flex:1}}>
				<View style={{height:100, justifyContent:'center', paddingLeft: 30}}>
					<Text style={{ fontSize: 36, fontFamily:theme.font }}>
						Wallets
					</Text>
				</View>
				<View style={{ flex:1,flexDirection:'column', paddingBottom:30, paddingLeft:30}}>
					<ScrollView
						horizontal={true}
						showsHorizontalScrollIndicator={false}
					>
						<DummyWalletItem coinName="Bitcoin" imageURI={bitcoin} coinAmount="123.093343" coinValue="62873648"
						/>
						<DummyWalletItem coinName="Monero" imageURI={monero} coinAmount="123.093343" coinValue="62873648"
						/>
						<DummyWalletItem coinName="Ethereum" imageURI={ethereum} coinAmount="123.093343" coinValue="62873648"
						/>
						<DummyWalletItem coinName="LiteCoin" imageURI={litecoin} coinAmount="123.093343" coinValue="62873648"
						/>
					</ScrollView>
				</View>
			</View>
			
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
