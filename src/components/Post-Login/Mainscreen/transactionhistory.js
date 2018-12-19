import React , { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import Transaction from './transaction';
import theme from '../../common/theme';

export default class TransactionHistory extends Component {
    constructor(props){
        super(props);
        this.state = {
            transactions: "",
            address: ""
        }
    }
    componentWillMount() {
        this.setState({ transactions: this.props.transactions, address: this.props.address })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ transactions: nextProps.transactions })
    }
    render() {
        return (
            <View style={styles.TransactionHistoryWrapper}>
                <View style={{alignItems:"center",justifyContent:"center"}}>
                    <Text style={styles.heading}> {this.state.transactions.length == 0 ? "No Transactions":"Transaction History"}</Text>
                </View>
                <ScrollView>
                    <View>
                     {this.state.transactions.length == 0 ? null : (
                       <View style={styles.transactionHeading}>
                           <View style={{width: 16, height: 14}} />
                           <Text style={styles.nameHeading}>Transaction ID</Text>
                           <Text style={styles.amountHeading}>Amount ({this.props.symbol})</Text>
                       </View>
                     )}

                        {this.state.transactions.map((value, i) => {
                            var status;
                            var id = value.hash;
                            var minID = id.slice(0, 20);
                            minID = minID + "..";
                            var finalAmount = Math.abs((value.result / 100000000));
                            var amount = (value.out[0].value / 100000000);
                            var fee = (value.fee / 100000000);
                            if(value.result >= 0) {
                                status = "Received";
                            }
                            else {
                                status = "Sent";
                            }
                            return(<Transaction key={i} minID={minID} id={id} fee={fee} amount={amount} finalAmount={finalAmount} status={status} />);
                        })}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    TransactionHistoryWrapper : {
        height: 420,
        flex: 1,
        padding: 15,
        paddingBottom: 0,
        paddingTop: 20,
        backgroundColor: 'white'
    },
    heading : {
        fontSize: 18,
        color: theme.black,
        fontFamily: theme.font,
        marginBottom: 15,
        fontWeight: '400',
        alignItems:'center',
        justifyContent:'center'
    },
    transactionHeading : {
        flexDirection: 'row',
        paddingVertical: 7
    },
    nameHeading : {
        flex :0.7,
        fontSize: 14,
        opacity: 0.75,
        fontFamily: theme.font,
        fontWeight: '300',
        marginLeft: -13,
        marginRight: 14
    },
    amountHeading : {
        flex: 0.3,
        fontSize: 14,
        opacity: 0.75,
        fontFamily: theme.font,
        fontWeight: '300',
    }
});
