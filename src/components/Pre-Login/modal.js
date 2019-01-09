import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import theme from '../common/theme';


const close = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/close.png";

export default class Popup extends React.Component {

    constructor() {
        super()
        this.state={
            showMe:false
        }
    }

render() {
		return (
			<View style={{flex:1, backgroundColor:theme.dark}}>
                <Modal
                transparent={true}
                visible={this.state.showMe}
                onRequestClose={() => console.warn("req is closed")}>
                    <View style={{flex:1, justifyContent:'flex-end'}}>
                        <View style={styles.wrap}>
                            <View style={styles.uppermodalflex}>
                                <View>
                                    <Text style={{fontFamily:theme.font, fontSize:14, marginBottom:5}}>You are Transfering</Text>
                                    <Text style={{fontFamily:theme.font500, fontSize:20}}>100 BTC</Text>
                                </View>
                                <View>
                                    <TouchableOpacity style={{alignItems:'flex-end'}} >
                                        <Image source={{ uri : close}} style={{width: 40, height: 40, opacity: 0.5}} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.lowermodalflex}>
                                <View style={styles.lineBorder}></View>
                                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                    <View>
                                        <Text style={{fontFamily:theme.font, fontSize:14, marginBottom:5}}>Amount</Text>
                                        <Text style={{fontFamily:theme.font500, fontSize:16}}>100 BTC</Text>
                                    </View>
                                    <View>
                                        <Text style={{}}>+</Text>
                                    </View>
                                    <View>
                                        <Text style={{fontFamily:theme.font, fontSize:14, marginBottom:5}}>Fees</Text>
                                        <Text style={{fontFamily:theme.font500, fontSize:16}}>0.0002 BTC</Text>
                                    </View>
                                    <View>
                                        <Text style={{}}>=</Text>
                                    </View>
                                    <View>
                                        <Text style={{fontFamily:theme.font, fontSize:14, marginBottom:5}}>Total</Text>
                                        <Text style={{fontFamily:theme.font500, fontSize:16}}>100.0002 BTC</Text>
                                    </View>
                                </View>
                                <View style={styles.lineBorder}></View>
                                <View>
                                    <View>
                                        <Text style={{fontFamily:theme.font, fontSize:12}}>To</Text>
                                        <Text style={{fontFamily:theme.font, fontSize:14, marginBottom:10}}>Tarun Gupta</Text>
                                    </View>
                                    <View>
                                        <Text style={{fontFamily:theme.font, fontSize:12}}>Coin</Text>
                                        <Text style={{fontFamily:theme.font, fontSize:14, marginBottom:10}}>Bitcoin (BTC)</Text>
                                    </View>
                                    <View>
                                        <Text style={{fontFamily:theme.font, fontSize:12}}>Public Addreee</Text>
                                        <Text style={{fontFamily:theme.font, fontSize:14, marginBottom:10}}>98s7fg9fd7g98df79df8vyhefsgydf9byhdfbuf</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.openWrap}>
                                <TouchableOpacity
                                    style={styles.open}
                                    onPress={() => {
                                    this.setState({
                                        showMe:false
                                    })
                                }}>
                                    <Text style={styles.openText}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={styles.openWrap}>
                    <TouchableOpacity
                        style={styles.open}
                        onPress={() => {
                            this.setState({
                                showMe:true
                            })
                        }}>
                        <Text style={styles.openText}>Click Here to open Modal</Text>
                    </TouchableOpacity>
                </View>
			</View>

		);
	}
}

const styles = StyleSheet.create({

    wrap : {
        backgroundColor:'white',
        height:450,
        justifyContent:'space-between',
        paddingHorizontal:40,
        paddingVertical:20
    },
    uppermodalflex : {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-start'
    },
    openWrap : {
        alignItems:'center',
        justifyContent:'center',
    },
    open : {
        backgroundColor:theme.dark,
        marginTop:30,
        height:55,
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        borderRadius:10
    },
    openText : {
        color:'white',
        fontSize:18,
        fontFamily:theme.font
    },
    lineBorder : {
        width:'100%',
        backgroundColor:theme.dark,
        height:1,
        opacity:0.2,
        marginVertical:20
    },
});
