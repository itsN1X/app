import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import theme from './theme';

export default class AppStatusBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			centerImage: false,
			left: "",
			right: "",
			centerIcon: ""
		}
	}
	componentWillMount() {
		this.setState({ centerImage : this.props.centerImage, centerIcon: this.state.centerIcon, left: this.props.Back, right: this.props.Forward })
	}
	render() {
		let elevation = 0;
		let textColor;
		if(this.props.elevation) {
			elevation = 3
		}
		if(this.state.centerImage) {
			centerContent = (<Image source={{uri: this.props.centerIcon}} style={styles.centerIcon} />)
		}
		else {
			centerContent = (<Text style={[styles.centerText, {color: this.props.textColor}]}>{this.props.text}</Text>)
		}
		return (
			<ElevatedView style={[styles.statusBar, {backgroundColor: this.props.bColor}]} elevation={elevation}>
				<TouchableOpacity style={styles.iconContainer} onPress={this.props.leftFunction}>
					{ this.props.left ? <Image style={styles.iconImage} source={{uri: this.state.left}} /> : null}
				</TouchableOpacity>
				<View style={styles.centerTextContainer}>
					{ this.props.center ? centerContent : null}
				</View>
				<TouchableOpacity style={styles.iconContainer} onPress={this.props.rightFunction}>
					{ this.props.right ? <Image style={styles.iconImage} source={{uri: this.state.right}} /> : null}
				</TouchableOpacity>
			</ElevatedView>
		);
	}
}
const styles = StyleSheet.create({
	statusBar: {
		backgroundColor: theme.white,
		height: 75,
		width: "100%",
		alignItems: 'center',
		flexDirection: 'row'
	},
	iconContainer: {
		flex: 1.3 / 6,
		alignItems: 'center',
		justifyContent: 'center',
	},
	centerIcon: {
		width: 32,
		height: 32
	},
	centerTextContainer: {
		flex: 3.4 / 6,
		alignItems: 'center'
	},
	centerText: {
		fontFamily: theme.font,
		color: theme.black,
		fontSize: 20
	},
	iconImage: {
		width: 30,
		height: 30
	}
});
