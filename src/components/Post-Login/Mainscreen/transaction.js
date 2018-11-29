import React , { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import theme from '../../common/theme';

var up = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/redup.png";
var down = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/down.png";

export default class Transaction extends Component {
    constructor(props){
        super(props);
        this.state = {
            hash: "",
            fee: "",
            amount: "",
            finalAmount: ""
        };
        this.openTransactionInfo = this.openTransactionInfo.bind(this);
    }
    componentWillMount() {
        this.setState({ id: this.props.id, fee: this.props.fee, amount: this.props.amount, finalAmount: this.props.finalAmount })
    }
    openTransactionInfo() {
        Actions.transactioninfo({id: this.state.id, fee: this.state.fee, amount: this.state.amount, finalAmount: this.state.finalAmount});
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ id: nextProps.id, fee: nextProps.fee, amount: nextProps.amount, finalAmount: nextProps.finalAmount })
    }
	render() {
		let statusImage;
		if(this.props.status === "Received")
		{
			statusImage = down;
		}
		else {
			statusImage = up;
		}
        return (
			<TouchableOpacity style={styles.transaction} onPress={this.openTransactionInfo}>
				<View style={styles.transactionArrowContainer}>
                    <Image source={{uri: statusImage}} style={styles.transactionArrowIcon}/>
                </View>
				<Text style={styles.name}>{this.props.minID}</Text>
				<Text style={styles.amount}>{this.props.finalAmount}</Text>
			</TouchableOpacity>
		);
    }
}
const styles = StyleSheet.create({
	transaction : {
        flexDirection: 'row',
        paddingVertical: 10
    },
    transactionArrowContainer : {
        alignItems: 'center',
        justifyContent: 'center'
    },
    transactionArrowIcon : {
        width: 16,
        height: 16
    },
    name : {
        flex: 0.75,
        fontSize: 16,
        fontFamily: theme.Lato,
        fontWeight: '100',
        alignItems: 'center',
        justifyContent: 'center'
    },
    amount : {
        flex: 0.3,
        fontSize: 14,
        fontFamily: theme.Lato,
        fontWeight: '100',
        alignItems: 'flex-start',
        justifyContent: 'center'
    }
});