import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import theme from '../../../common/theme';

var Copy = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png";

export default class FriendItem extends React.Component {
	copyToClipboard(address) {
		this.props.onCopy(address);
	}
	render() {
		return (
			<View style={styles.itemContainer}>
				<View style={styles.friendHeadingContainer}>
					<View>
						<Text style={styles.friendHeadingText}>Device {this.props.id}</Text>
					</View>
					{/*<TouchableOpacity style={styles.copyIconContainer} onPress={() => this.copyToClipboard(this.props.address)}>
						<Image style={styles.copyIcon} source={{uri: Copy}} />
						</TouchableOpacity>*/}
				</View>
				<View style={styles.friendAddressContainer}>
					<Text style={styles.friendAddressText}>@{this.props.address}</Text>
				</View>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	itemContainer: {
		height: 90,
		width: '85%',
		marginVertical: 5,
	},
	friendHeadingContainer: {
		flex: 0.4,
		alignItems: 'flex-end',
		flexDirection: 'row' 
	},
	copyIconContainer: {
		flex: 1,
		alignItems: 'flex-end'
	},
	copyIcon: {
		height: 18,
		width: 18
	},
	friendHeadingText: {
		fontFamily: theme.font,
		fontSize: 14,
		color: theme.black,
		opacity: 0.8
	},
	friendAddressContainer: {
		flex: 0.6,
		justifyContent: 'center'
	},
	friendAddressText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 14,
		color: theme.black
	},
})