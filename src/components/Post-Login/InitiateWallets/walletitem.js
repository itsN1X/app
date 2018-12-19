import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import BitcoinDark from '../../../../images/coins/dark/bitcoin.png';
import SelectedTick from '../../../../images/tick-inside-circle-light.png';
import theme from '../../common/theme';

export default class WalletItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: false,
			Icon: ""
		}
		this.selectWallet = this.selectWallet.bind(this);
	}
	componentWillMount() {
		this.setState({ Icon: this.props.dark });

		if(this.props.name == "Bitcoin") {
			this.setState({ selected: true, Icon: this.props.light })
		}
	}
	selectWallet() {
		if(this.state.selected) {
       		this.setState({ selected: false, Icon: this.props.dark });
       	}
       	else {
       		this.setState({ selected: true, Icon: this.props.light })
       	}
	}
	render () {
		let bgColor;
		let textColor;
		if (this.state.selected) {
			bgColor = theme.dark;
			textColor = theme.white;
		}
		else {
			bgColor = theme.grey;
			textColor = theme.black;
		}
		return (
			<View style={styles.walletItemContainer}>
				<TouchableOpacity style={[styles.walletItem, {backgroundColor: bgColor}]} onPress={this.selectWallet}>
					<View style={styles.upperFlex}>
						<View style={styles.coinIconContainer}>
							<Image source={{uri: this.state.Icon}} style={styles.coinIcon} />
						</View>
						<View style={styles.coinNameContainer}>
							<Text style={[styles.coinNameText, {color: textColor}]}>{this.props.name.toUpperCase()}</Text>
						</View>
					</View>
					<View style={styles.lowerFlex}>
						<View style={{flex: 0.11}} />
						<Text style={[styles.coinPriceText, {color: textColor}]}>1 {this.props.symbol} = {this.props.value} {this.props.currency}</Text>
					</View>
					{this.state.selected ? <View style={styles.selectedImageContainer}>
												<Image style={styles.selectedIcon} source={SelectedTick} />
										   </View> : null}
				</TouchableOpacity>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	walletItemContainer: {
		height: 110,
		width: '100%',
		justifyContent: 'center'
	},
	walletItem: {
		flex: 0.9,
		width: '100%',
		borderRadius: 10,
		backgroundColor: theme.grey,
	},
	upperFlex: {
		flex: 0.5,
		marginTop: 5,
		alignItems: 'center',
		flexDirection: 'row'
	},
	coinIconContainer: {
		flex: 0.17,
		alignItems: 'flex-end'
	},
	coinIcon: {
		width: 25,
		height: 25
	},
	coinNameContainer: {
		flex: 0.8,
		marginLeft: 8
	},
	coinNameText: {
		fontFamily: theme.font,
		color: theme.dark,
		fontSize: 14
	},
	lowerFlex: {
		flex: 0.5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	coinPriceText: {
		flex: 0.8,
		fontFamily: theme.font,
		fontWeight: '300',
		color: theme.dark,
		fontSize: 20,
		marginBottom: 12
	},
	selectedImageContainer: {
		position: 'absolute',
		top: 8,
		right: 8
	},
	selectedIcon: {
		width: 25,
		height: 25
	}
});
