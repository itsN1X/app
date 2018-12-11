import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Toast from 'react-native-simple-toast';
import theme from '../../common/theme';

export default class WalletCoinItem extends React.Component {
	onWalletPress(walleticon, walletname, walletsymbol, walletvalue, walletamount) {
		if(walletsymbol === "BTC") {
			this.props.onWalletOpen(walleticon, walletname, walletsymbol, walletvalue, walletamount);
		}
		else {
			Toast.showWithGravity("Coming Soon!", Toast.LONG, Toast.CENTER);
		}
	}
	render () {
		return (
			<View style={styles.walletItemContainer}>
				<TouchableOpacity onPress={() => this.onWalletPress(this.props.lighticon, this.props.name, this.props.symbol, this.props.value, this.props.amount)} style={styles.walletItem}>
					<View style={styles.contentContainer}>
						<View style={styles.upperContentFlex}>
							<View style={styles.coinImageContainer}>
								<Image style={styles.coinImage} source={{uri: this.props.icon}} />
							</View>
							<View style={styles.coinNameContainer}>
								<Text style={styles.coinNameText}>{this.props.name}</Text>
							</View>
							<View style={styles.coinAmountContainer}>
								<Text style={styles.coinAmountText}>{this.props.amount}</Text>
							</View>
						</View>
						<View style={styles.lowerContentFlex}>
							<View style={styles.coinValueContainer}>
								<Text style={styles.coinValueText}>{this.props.value}</Text>
							</View>
							<View style={styles.INRContainer}>
								<Text style={styles.INRText}>INR</Text>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	walletItemContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center'
	},
	walletItem: {
		height: 120,
		width: '90%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.grey,
		borderRadius: 10,
		borderBottomColor: theme.darkgrey,
		marginVertical:5
	},
	contentContainer: {
		height: '60%',
		width: '85%',
	},
	upperContentFlex: {
		flex: 0.6,
		alignItems: 'center',
		flexDirection: 'row'
	},
	lowerContentFlex: {
		flex: 0.4,
		alignItems: 'center',
		flexDirection: 'row'
	},
	coinImageContainer: {
		flex: 0.16,
		justifyContent: 'center',
		alignItems: 'flex-start'
	},
	coinImage: {
		width: 40,
		height: 40
	},
	coinNameContainer: {
		flex: 0.4,
		justifyContent: 'center',
		alignItems: 'flex-start'
	},
	coinNameText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 20,
		color: theme.dark
	},
	coinAmountContainer: {
		flex: 0.44,
		justifyContent: 'center',
		alignItems: 'flex-end'
	},
	coinAmountText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 22,
		color: theme.dark
	},
	coinValueContainer: {
		flex: 0.9,
		justifyContent: 'center',
		alignItems: 'flex-start'
	},
	coinValueText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 16,
		color: theme.dark
	},
	INRContainer: {
		flex: 0.1,
		justifyContent: 'center',
		alignItems: 'flex-end'
	},
	INRText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 16,
		color: theme.dark
	},
});
