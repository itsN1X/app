import React , { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions, ImageBackground, Modal } from 'react-native';
import theme from '../common/theme';

export default class Filters extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: true,
			currencies: [
			{
				id: 0,
				name: "INR"
			},
			{
				id: 1,
				name: "USD"
			},
			{
				id: 2,
				name: "EUR"
			},
			{
				id: 3,
				name: "RUB"
			},
			{
				id: 4,
				name: "XCD"
			},
			{
				id: 5,
				name: "AUD"
			},
			{
				id: 6,
				name: "CAD"
			},
			{
				id: 7,
				name: "AED"
			},
				]
		};
		this.onCurrencySelect = this.onCurrencySelect.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	componentWillMount() {
		this.setState({ modalVisible: this.props.status })
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ modalVisible: nextProps.status})
	}
	onCurrencySelect(value) {
		this.props.changeCurrency(value);
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
	         		<View style={styles.container}>
	         		{this.state.currencies.map((value, i) => {
                         return(<TouchableOpacity key={value.id} style={styles.pickerItemContainer} onPress={() => this.onCurrencySelect(value.name)}>
				         			<Text style={styles.pickerItemText}>{value.name}</Text>
				         		</TouchableOpacity>);
                    })}
		         	</View>
		         </ScrollView>
		         <TouchableOpacity style={styles.cancelButton} onPress={this.closeModal}>
		         	<Text style={styles.cancelText}>Cancel</Text>
		         </TouchableOpacity>
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
	pickerItemContainer: {
		width: '80%',
		height: 70,
		justifyContent: 'center'
	},
	pickerItemText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 18,
		color: theme.black
	},
	cancelButton: {
		position: 'absolute',
		bottom: 30,
		right: 27,
		padding: 10
	},
	cancelText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 18,
		color: 'red',
	}
});
