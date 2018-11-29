import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import theme from '../common/theme';
import Button from '../common/button';
import StatusBar from '../common/statusbar';
import AppStatusBar from '../common/appstatusbar';
import Back from '../../../images/lightback.png';

export default class ScanQR extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			focused: false
		};
		this.isFocused = this.isFocused.bind(this);
		this.isUnfocused = this.isUnfocused.bind(this);
	}
	isFocused() {
		this.setState({focused: true})
	}
	isUnfocused() {
		this.setState({focused: false})
	}
	render() {
		return (
			<View style={styles.container}>
				  {this.state.focused ? null : <QRCodeScanner
			        onRead={(e) => this.onSuccess(e)}
			        showMarker />}
      			<KeyboardAvoidingView behavior={'padding'} style={styles.bakchodi}>
      				<View style={styles.inputFlexContainer}>
									<TextInput
										keyboardType="numeric"
										style={styles.amountInput}
										returnKeyType="done"
										placeholder="0.0"
										onChangeText={(text) => this.setState({ amount: text })}
										maxLength={14}
										onSubmitEditing={this.isUnfocused}
										underlineColorAndroid='transparent'
										onFocus={this.isFocused}
									/>
								</View>
      			</KeyboardAvoidingView>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
	    backgroundColor: theme.black,
	    alignItems: 'center',
	    justifyContent: 'center'
	},
	bakchodi: {
		height: '45%',
		width: '100%',
		backgroundColor: 'red',
		alignItems: 'center',
	    justifyContent: 'center'
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
});
