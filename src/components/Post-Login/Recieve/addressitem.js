import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView } from 'react-native';
import theme from '../../common/theme';
import Tick from '../../../../images/tick.png';

let itemOpacity;

export default class AddressItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			address: "9vM8zCYGPixbfqvJuxA9UQUP2dKG8HQnZ7avxMRLMBkjbCFeNToeiKaBgXXU2hC98jYanv6UUQTVoTTisUoHyWB4V3hnMW",
			addressType: "",
			itemOpacity: 1,
		}
		this.setSelected = this.setSelected.bind(this);
	}
	componentWillMount() {
		this.setState({ addressType: this.props.addressType, selected: this.props.selected, index: this.props.index })
	}
	setSelected() {
		this.setState({ selected: !this.state.selected }), () => {
			if(this.state.selected) {
				this.state.itemOpacity=1;
			}
			else {
				this.state.itemOpacity=0.3;
			}
		}
	}
	render() {
		return (
			<TouchableOpacity onPress={() => this.setSelected()} style={[styles.addressItemContainer, {opacity: this.state.itemOpacity}]}>
				<View style={styles.addressItemContent}>
					<View style={styles.addressHeadingContainer}>
						<View style={styles.headingContainer}>
							<Text style={styles.addressHeadingText}>{this.state.addressType}</Text>
						</View>
						<View style={styles.tickContainer}>
							{this.state.selected ? (<Image style={styles.tickIcon} source={Tick} />) : null} 
						</View> 
					</View>
					<View style={styles.addressContainer}>
						<Text style={styles.addressText}>{this.state.address}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}
const styles = StyleSheet.create({
	addressItemContainer: {
		height: 120,
		width: '100%',
		alignItems: 'center',
		marginVertical: 14,
	},
	addressItemContent: {
		flex: 1,
		width: '90%',
	},
	addressHeadingContainer: {
		flex: 0.35,
		justifyContent: 'center',
		flexDirection: 'row'
	},
	addressContainer: {
		flex: 0.65,
		justifyContent: 'center',
		alignItems: 'center'
	},
	headingContainer: {
		flex: 0.8,
		justifyContent: 'center',
	},
	addressHeadingText: {
		fontFamily: theme.font,
		fontSize: 18,
		color: theme.black,
	},
	tickContainer: {
		flex: 0.2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	tickIcon: {
		width: 25,
		height: 25
	},
	addressText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 13,
		letterSpacing: 1,
		color: theme.black,
	}
})