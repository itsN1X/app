import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity
} from "react-native";
import theme from "../common/theme";


const QRcode = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/QRcode.png";
const receive = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/receive.png";
const send = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/send.png";

class DummyWalletItem extends Component {
    render() {
        return (
            <View style={styles.walletWrapper}>
                <View style={styles.upperflex}>
                    <View style={{alignItems:'center'}}>
                        <Image source={{ uri : this.props.imageURI}}
                            style={{ width: 50, height: 50}}
                        />
                    </View>
                    <View style={{ paddingTop: 10, alignItems:'center',justifyContent:'center'}}>
                        <Text style={{ color:'white', fontFamily:theme.font, fontSize:18 }}>{this.props.coinName}</Text>
                    </View>
                    <View style={{ paddingTop: 10, alignItems:'center',justifyContent:'center'}}>
                        <Text style={{ color:'white', fontFamily:theme.font300, fontWeight:'300', fontSize:36 }}>{this.props.coinAmount}</Text>
                    </View>
                    <View style={{ paddingTop: 5, alignItems:'center',justifyContent:'center'}}>
                        <Text style={{ color:'white', fontFamily:theme.font300, fontWeight:'300', fontSize:14 }}>{this.props.coinValue}</Text>
                    </View>
                </View>
                <View style={styles.lowerflex}>
                    <Image source={{ uri : QRcode}}
                            style={{ width: 150, height: 150}}
                        />
                </View>
                <View style={styles.buttonflex}>
                    <TouchableOpacity style={styles.buttonWrap}>
                        <Image source={{ uri : receive}}
                            style={styles.buttonImage}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonWrap}>
                        <Image source={{ uri : send}}
                            style={styles.buttonImage}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.exploreWrap}>
                    <TouchableOpacity>
                    <Text style={{color:'white', fontFamily:theme.font}}>
                        Explore
                    </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
export default DummyWalletItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    walletWrapper : {
        flex:1, 
        width: Dimensions.get('window').width * 0.75,
        marginRight: 30,
        backgroundColor:theme.dark,
        borderRadius:10,
        padding:20
    },
    upperflex : {
        flex:2,
        alignItems:'center',
        justifyContent:'center'
    },
    lowerflex : {
        flex:2,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonflex : {
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    buttonWrap : {
        margin:5
    },
    buttonImage : {
        width: 60, 
        height: 60
    },
    exploreWrap : {
        height:25,
        alignItems:'center',
        justifyContent:'center'
    }

});