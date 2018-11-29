import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView } from 'react-native';
import theme from '../../../common/theme';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
const crypto = require('react-native-crypto');
const VirgilCrypto =require('virgil-crypto');
const virgilCrypto = new VirgilCrypto.VirgilCrypto();

var Copy = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png";
var Accept = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/accept.png";

export default class RequestItem extends React.Component {
	copyToClipboard(from_public_key) {
		this.props.onCopy(from_public_key);
	}
	onApprove = async () => {
		var data = {};
		data.publicKey = this.props.user_public_key;
		data.request_id = this.props.request_id;
		data.trust_data = this.props.secret;
		console.log(data);
		try {
            axios({
                method: 'post',
                url: 'http://159.65.153.3:7001/recovery_key/update_recovery_trust_data',
                data: data
            })
            .then(function (response) {
            	console.log(response);
            	Actions.refresh();
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        catch(error) {
            console.log(error);
        }
	}
	render() {
		return (
				<View style={styles.requestItem}>
					<View style={styles.upperFlex}>
						<Text style={styles.addressText}>{this.props.from_public_key}</Text>
						<View style={styles.copyIconContainer}>
							<TouchableOpacity onPress={() => this.copyToClipboard(this.props.from_public_key)}>
								<Image style={styles.copyIcon} source={{uri: Copy}} />
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.lowerFlex}>
						<View>
							<Text style={styles.daysText}>{this.props.date}</Text>
						</View>
						<View style={styles.acceptIconContainer}>
							<TouchableOpacity style={styles.acceptButton} onPress={this.onApprove}>
								<Text style={styles.acceptText}>Approve</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
		);
	}
}
const styles = StyleSheet.create({
	requestItem: {
		height: 140,
		width: '90%',
	},
	upperFlex: {
		flex: 0.5,
		width: '100%',
		alignItems: 'flex-end',
		flexDirection: 'row'
	},
	addressText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 14,
		maxWidth: '80%'
	},
	copyIconContainer: {
		flex: 1,
		marginBottom: 10,
		alignItems: 'flex-end'
	},
	copyIcon: {
		width: 18,
		height: 18
	},
	lowerFlex: { 
		marginTop: 15,
		flex: 0.5,
		width: '100%',
		flexDirection: 'row'
	},
	daysText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 13,
		color: theme.darkgrey
	},
	acceptIconContainer: {
		flex: 1,
		alignItems: 'flex-end',
		justifyContent: 'center'
	},
	acceptButton: {
		width: 100,
		height: 35,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.dark
	},
	acceptText: {
		fontFamily: theme.Lato,
		fontWeight: '300',
		fontSize: 12,
		color: theme.white
	}
});