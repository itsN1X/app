import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView } from 'react-native';
import theme from '../../../common/theme';

var Copy = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png";
var Unconfirmed = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/unconfirmed.png";
var Confirmed = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/confirmed.png";

export default class RecoveryRequestItem extends React.Component {
 constructor(props) {
		super(props);
		this.copyToClipboard = this.copyToClipboard.bind(this);
	}

 copyToClipboard(public_key) {
		this.props.onCopy(public_key);
	}

 render() {
		var StatusIcon;
		var StatusText;
		if(this.props.status === 0) {
			StatusIcon = Unconfirmed;
			StatusText = "Pending";
		}
		else {
			StatusIcon = Confirmed;
			StatusText = "Approved";
		}
		return (
			<View style={styles.requestItem}>
				<View style={styles.headingContainer}>
					<Text style={styles.headingText}>Trusted Device {this.props.id + 1}</Text>
				</View>
				<View style={styles.friendAddressContainer}>
					<Text style={styles.friendAddressText}>@{this.props.user_public_key}</Text>
					<View style={styles.copyIconContainer}>
						<TouchableOpacity onPress={() => this.copyToClipboard(this.props.user_public_key)}>
							<Image style={styles.copyIcon} source={{uri: Copy}} />
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.headingContainer}>
					<Text style={styles.headingText}>Status</Text>
				</View>
				<View style={styles.statusContainer}>
					<Image style={styles.statusIcon} source={{uri: StatusIcon}} />
					<Text style={styles.statusText}>{StatusText}</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	requestItem: {
		marginTop: 5,
		marginBottom: 20,
		height: 160,
		width: '90%',
	},
	headingContainer: {
		height: 30,
		width: '100%',
		justifyContent: 'flex-end'
	},
	friendAddressContainer: {
		height: 60,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center'
	},
	friendAddressText: {
		fontFamily: theme.Lato,
		fontSize: 16,
		color: theme.black,
		maxWidth: '90%'
	},
	copyIconContainer: {
		flex: 1,
		alignItems: 'flex-end'
	},
	copyIcon: {
		width: 20,
		height: 20
	},
	headingText: {
		fontFamily: theme.Lato,
		fontSize: 14,
		color: theme.black,
		opacity: 0.4
	},
	statusContainer: {
		height: 40,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center'
	},
	statusIcon: {
		width: 18,
		height: 18,
		marginRight: 10,
	},
	statusText: {
		fontFamily: theme.Lato,
		fontSize: 15,
		color: theme.black,
	}
});
