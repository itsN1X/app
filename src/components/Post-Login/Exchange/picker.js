import React , { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions, ImageBackground, Modal } from 'react-native';
import theme from '../../common/theme';

export default class Filters extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: true
		};
		this.onCoinSelect = this.onCoinSelect.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	componentWillMount() {
		this.setState({ modalVisible: this.props.status })
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ modalVisible: nextProps.status})
	}
	onCoinSelect(value) {
		this.props.changeCoin(value);
	}
	closeModal() {
		this.setState({ modalVisible: false })
	}
	render() {
		return(	
		<View style={{zIndex: 1000, backgroundColor: theme.dark, alignItems:'center'}}>
			<Modal
	          animationType="slide"
	          transparent={true}
	          onRequestClose={() => {
	            this.closeModal()
	          }}
	          visible={this.state.modalVisible}
	         >
	         	<View style={{height: 30, width: '100%', backgroundColor: theme.white}} />
	         	<ScrollView style={{backgroundColor: theme.white}}>
	         		<TouchableOpacity style={styles.coinItemContainer} onPress={() => this.onCoinSelect('BTC')}>
		         		<View style={styles.coinItem}>
		         			<View style={styles.coinNameContainer}>
		         				<Text style={styles.coinText}>BTC</Text>
		         			</View>
		         			<View style={styles.coinPriceContainer}>
		         				<Text style={styles.coinPriceText}>1232.44 INR</Text>
		         			</View>
		         		</View>
		         	</TouchableOpacity>
		         	<View style={styles.line} />
		         	<TouchableOpacity style={styles.coinItemContainer} onPress={() => this.onCoinSelect('ETH')}>
		         		<View style={styles.coinItem}>
		         			<View style={styles.coinNameContainer}>
		         				<Text style={styles.coinText}>ETH</Text>
		         			</View>
		         			<View style={styles.coinPriceContainer}>
		         				<Text style={styles.coinPriceText}>1232.44 INR</Text>
		         			</View>
		         		</View>
		         	</TouchableOpacity>
		         	<View style={styles.line} />
		         	<TouchableOpacity style={styles.coinItemContainer} onPress={() => this.onCoinSelect('XMR')}>
		         		<View style={styles.coinItem}>
		         			<View style={styles.coinNameContainer}>
		         				<Text style={styles.coinText}>XMR</Text>
		         			</View>
		         			<View style={styles.coinPriceContainer}>
		         				<Text style={styles.coinPriceText}>1232.44 INR</Text>
		         			</View>
		         		</View>
		         	</TouchableOpacity>
		         	<View style={styles.line} />
		         	<TouchableOpacity style={styles.coinItemContainer} onPress={() => this.onCoinSelect('ZEC')}>
		         		<View style={styles.coinItem}>
		         			<View style={styles.coinNameContainer}>
		         				<Text style={styles.coinText}>ZEC</Text>
		         			</View>
		         			<View style={styles.coinPriceContainer}>
		         				<Text style={styles.coinPriceText}>1232.44 INR</Text>
		         			</View>
		         		</View>
		         	</TouchableOpacity>
		         	<View style={styles.line} />
		         	<TouchableOpacity style={styles.coinItemContainer} onPress={() => this.onCoinSelect('XRP')}>
		         		<View style={styles.coinItem}>
		         			<View style={styles.coinNameContainer}>
		         				<Text style={styles.coinText}>XRP</Text>
		         			</View>
		         			<View style={styles.coinPriceContainer}>
		         				<Text style={styles.coinPriceText}>1232.44 INR</Text>
		         			</View>
		         		</View>
		         	</TouchableOpacity>
		         	<View style={styles.line} />
		         </ScrollView>
	        </Modal>
		</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.white,
		height: '100%',
		width: '100%',
		alignItems: 'center'
	},
	coinItemContainer: {
		width: '100%',
		height: 80,
		justifyContent: 'center',
		alignItems: 'center'
	},
	coinItem: {
		width: '80%',
		flexDirection: 'row',
		alignItems: 'center' 
	},
	coinNameContainer: {
		flex: 0.3,
	},
	coinText: {
		fontFamily: theme.Lato,
		fontSize: 18,
		letterSpacing: 0.5,
		color: theme.dark
	},
	coinPriceContainer: {
		flex: 0.7,
		alignItems: 'flex-end'
	},
	coinPriceText: {
		fontFamily: theme.Lato,
		fontSize: 18,
		letterSpacing: 0.5,
		color: theme.dark
	},
	line: {
		width: '100%',
		height: 0.5,
		opacity: 0.5,
		backgroundColor: theme.dark
	}
});
