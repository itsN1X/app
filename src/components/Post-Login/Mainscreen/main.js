import React , { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions, BackHandler, ImageBackground, AsyncStorage, Animated, Easing } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ElevatedView from 'react-native-elevated-view';
import Drawer from 'react-native-drawer';
import axios from 'axios';
import SideBar from '../Sidedrawer/drawercontent';
import theme from '../../common/theme';
import Loader from '../../common/loader';
import AppStatusBar from '../../common/appstatusbar';
import TransactionHistory from './transactionhistory';
import StatusBar from '../../common/statusbar';

var Exchange = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/exchange.png";
var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";
var Background = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/menubg.png";
var Refresh = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/refresh.png";

export default class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            activity: "",
            rotated: false,
            loaded: false,
            coinData : "",
            balance : "",
            utxo: "",
            receiving: false,
            transactions: "",
            currencyName : this.props.walletname,
            currencyIcon : this.props.walleticon,
            currencySymbol: this.props.walletsymbol,
            currencyAmount : this.props.walletamount,
            estValueOutput : 'INR',
            currencyValue : this.props.walletvalue,
            currencyAddress : '1451vbhGF46516N4lKmnu87YH'
        };
        this.openTransactions = this.openTransactions.bind(this);
        this.sendCoins = this.sendCoins.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this.receiveCoins = this.receiveCoins.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.openDrawer = this.openDrawer.bind(this);
    }
    onRefresh() {
        this.spinValue = new Animated.Value(0);
        Animated.timing(this.spinValue,{
            toValue: 1,
            duration: 720,
            easing: Easing.linear
        }).start();
        this.getCoinData();
        this.setState({rotated: !this.state.rotated});
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        this.goBack();
    }
    componentWillMount() {
        this.spinValue = new Animated.Value(0);
        this.setState({activity: "Fetching Asset Details"}, () => {
            requestAnimationFrame(()=>this.getCoinData(), 0);
        });
    }
    componentWillReceiveProps(nextProps) {
        this.onRefresh();
    }
    closeDrawer() {
        const self = this;
        self._drawer.close()
    };
    openDrawer() {
        const self = this;
        self._drawer.open()
    };
    sendCoins() {
        const self = this;
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        Actions.send({ utxo: self.state.utxo, fromAddress: self.state.address, privateKey: self.state.privateKey, balance: self.state.balance });  
    }
    receiveCoins() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        Actions.recieve({ address: this.state.address });
    }
    openProfile() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        Actions.profile();
    }
    gotoExchange() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        Actions.exchange();
    }
    openTransactions() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        Actions.fulltransactionhistory({ transactions: this.state.transactions, symbol: this.state.currencySymbol })
    }
    goBack() {
        Actions.pop();
    }
    getBalance (coinData) {
        console.log(coinData);
        coinAddress = {};
        coinAddress.addresses = [coinData.address];
        try {
            var self = this;
            axios({
                method: 'post',
                url: 'http://206.189.137.43:4013/receive_coins',
                data: coinAddress
            })
            .then(function (response) {
               console.log(response);
               const balance = (response.data.result.wallet.final_balance / 100000000);
                self.setState({ address: coinData.address, privateKey: coinData.privateKey, balance: balance, receiving: false, loaded: true, transactions: response.data.result.txs, receiving: false, utxo: response.data.utxo, loaded: true });
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        catch(error) {
            alert(error);
        }
    }
    getCoinData = async () => {
      try {
            const value = await AsyncStorage.getItem('@BTC');
            var coinData = JSON.parse(value);
            this.getBalance(coinData);
        }
      catch(error) {
            alert(error)
        }
    }
    render() {
        const spin = this.spinValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg']
            })
        let statusBarHeight;
        if(Dimensions.get('window').height > 700 && Dimensions.get('window').height < 830) {
            statusBarHeight = 24;
        }
        else if(Dimensions.get('window').height > 830 ){
            statusBarHeight = 30;
        }
        else {
            statusBarHeight = 16;
        }
        if(!this.state.loaded) {
            return(<Loader activity={this.state.activity}/>)     
        }
        else {
            return (
                <Drawer
                  ref={(ref) => { this._drawer = ref; }}
                  type="overlay"
                  content={<SideBar navigator={this._navigator} closeDrawer={this.closeDrawer} mainDrawer={true} />}
                  openDrawerOffset={0.2}
                  panCloseMask={0.35}
                  panOpenMask={0.2}
                  tapToClose={true}
                  tweenDuration={150}
                  closedDrawerOffset={-3}
                  panThreshold={0.05}
                  elevation={2}
                  styles={drawerStyles}
                  tweenHandler={(ratio) => ({
                    mainOverlay: { opacity: ratio / 1.5 },
                  })}
                  onClose={() => this.closeDrawer()}>
                        <Animated.View style={{flex:1}}>
                            <ImageBackground style={styles.upperFlex} source={{uri: Background}}>
                                {Platform.OS === 'ios' ? <View style={styles.statusbar} /> : null}
                                <View style={styles.contentContainer}>
                                    <View style={styles.headerIconsFlex}>
                                        <View style={styles.menuIconFlex}>
                                            <TouchableOpacity onPress={this.goBack}>
                                                <Image style={styles.backIcon} source={{uri: Back}} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flex: 0.4}} />
                                        <View style={styles.exchangeIconFlex}>
                                        </View>
                                    </View>
                                    <View style={styles.iconNameFlex}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity>
                                                <Image style={styles.walletIcon} source={{uri: this.state.currencyIcon}} />
                                            </TouchableOpacity>
                                            <Text style={styles.iconNameText}>{this.state.currencyName}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.amountFlex}>
                                        <Text style={styles.amountText}>{this.state.balance}</Text>
                                    </View>
                                    <View style={styles.valueFlex}>
                                        <Text style={styles.valueText}>Est. Value    INR {this.state.currencyValue}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.refreshContainer} onPress={this.onRefresh}>
                                    <Animated.Image style={[styles.refreshIcon, {transform:[{rotate: spin}]}]} source={{uri: Refresh}} />
                                </TouchableOpacity>
                            </ImageBackground>
                            <View style={styles.sendRecieve}>
                                <TouchableOpacity onPress={this.receiveCoins} style={styles.recieveButtonContainer}>
                                    <ElevatedView elevation={5} style={styles.recieveButton}>
                                        <Text style={styles.recieveText}>RECEIVE</Text>
                                    </ElevatedView>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.sendCoins} style={styles.sendButtonContainer}>
                                    <ElevatedView elevation={5} style={styles.sendButton}>
                                        <Text style={styles.sendText}>SEND</Text>
                                    </ElevatedView>
                                </TouchableOpacity>
                            </View>
                        <TransactionHistory transactions={this.state.transactions} symbol={this.state.currencySymbol} />
                        <View style={styles.viewMoreContainer}>
                            <TouchableOpacity onPress={this.openTransactions}>
                                <Text style={styles.viewMoreText}>
                                    View More
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.line} /> 
                        </View>
                </Animated.View>
            </Drawer>
            );
        }
    }
}
const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
  mainOverlay: { backgroundColor: 'black', opacity: 0},
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark
    },
    upperFlex: {
        position: 'relative', 
        height: 280,
        width: '100%',
        backgroundColor: theme.dark,
        alignItems: 'center'
    },
    statusbar: {
        height: statusBarHeight,
        width: '100%',
    },
    contentContainer: {
        height: '100%',
        width: '90%',
    },
    headerIconsFlex: {
        flex: 0.25,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    menuIconFlex: {
        flex: 0.3,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    exchangeIconFlex: {
        flex: 0.3,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    backIcon: {
        height: 30,
        width: 30
    },
    exchangeIcon: {
        height: 40,
        width: 40
    },
    iconNameFlex: {
        flex: 0.22,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-end'
    },
    iconNameText: {
        color: 'white',
        fontSize: 25,
        marginLeft: 10,
        fontFamily: theme.font
    },
    walletIcon: {
        height: 45,
        width: 45
    },
    amountFlex: {
        flex: 0.28,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row'
    },
    amountText: {
        color: 'white',
        fontSize: 42,
        fontWeight: '300', 
        fontFamily: theme.Lato300
    },
    receivingText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '300', 
        fontFamily: theme.Lato300
    },
    valueFlex: {
        flex: 0.25,
        width: '100%',
        justifyContent: 'flex-start'
    },
    valueText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '300', 
        fontFamily: theme.Lato300
    },
    refreshContainer: {
        position: 'absolute', 
        bottom: 22,
        right: 24,
    },
    refreshIcon: {
        width: 28,
        height: 28
    },
    sendRecieve : {
        flexDirection: 'row',
        paddingVertical: 18,
        backgroundColor: 'white'
    },
    sendButtonContainer : {
        flex: 0.5,
        marginRight: 15,
        marginLeft: 7.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    recieveButtonContainer : {
        flex: 0.5,
        marginRight: 7.5,
        marginLeft: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    recieveButton : {
        width: '95%',
        marginVertical: 8,
        paddingVertical: 15,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 35,
    },
    sendButton : {
        width: '95%',
        marginVertical: 8,
        backgroundColor: theme.dark,
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 35,
    },
    recieveText : {
        color: theme.dark,
        fontSize: 16,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font
    },
    sendText : {
        color: 'white',
        fontSize: 16,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font
    },
    viewMoreContainer: {
        height: 35,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewMoreText: {
        color: theme.dark,
        fontSize: 16,
        fontFamily: theme.font,
    },
    line: {
        height: 1,
        marginTop: 3,
        width: '10%',
        backgroundColor: theme.dark
    }
});