import React , { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions, BackHandler, ImageBackground, AsyncStorage, Animated, Easing } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ElevatedView from 'react-native-elevated-view';
import Drawer from 'react-native-drawer';
import axios from 'axios';
import SideBar from '../Sidedrawer/drawercontent';
import Toast from 'react-native-simple-toast';
import theme from '../../common/theme';
import NoFunds from './nofunds';
import Loader from '../../common/loader';
import AppStatusBar from '../../common/appstatusbar';
import TransactionHistory from './transactionhistory';
import StatusBar from '../../common/statusbar';

var Exchange = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/exchange.png";
var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";
var Notification = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/notification.png";
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

    componentDidMount() {
          BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
      }
      componentWillUnmount() {
          BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
      }
      handleBackButton = () =>  {
        Actions.postlogintabs();
        Actions.wallets();
       return true;
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

      // console.error(coinData[0].address);
        coinAddress = {};
        coinAddress.addresses = [coinData[0].address];
        coinAddress.asset_id = coinData[0].asset_id;
        try {
            var self = this;
            axios({
                method: 'post',
                url: 'http://206.189.137.43:4013/receive_coins',
                data: coinAddress
            })
            .then(function (response) {
               const balance = (response.data.balanceHistory.balance);
               self.setState({ address: coinData[0].address, privateKey: coinData[0].privateKey, balance: balance, receiving: false, loaded: true, transactions: response.data.transactions, receiving: false, utxo: response.data.balanceHistory.utxo, loaded: true });

            })
            .catch(function (error) {
              Toast.showWithGravity("Internet connection required!", Toast.LONG, Toast.CENTER);
            });
        }
        catch(error) {
            alert(error);
        }
    }
    getCoinData = async () => {
      try {
            const value = await AsyncStorage.getItem('@CoinsData');
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
                        <Animated.View style={{flex:1}}>
                            <ImageBackground style={styles.upperFlex} source={{uri: Background}}>
                                {Platform.OS === 'ios' ? <View style={styles.statusbar} /> : null}
                                <View style={styles.contentContainer}>
                                    <View style={styles.headerIconsFlex}>
                                        <View style={styles.menuIconFlex}>
                                            <TouchableOpacity onPress={this.goBack}>
                                                <Image style={styles.backIcon} source={{uri: Back}} />
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Image style={styles.notificationIcon} source={{uri: Notification}} />
                                            </TouchableOpacity>
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
                                        <Text style={styles.valueText}>${((this.state.currencyValue * (this.state.balance*100000000))/100000000).toFixed(3)}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.refreshContainer} onPress={this.onRefresh}>
                                    <Animated.Image style={[styles.refreshIcon, {transform:[{rotate: spin}]}]} source={{uri: Refresh}} />
                                </TouchableOpacity>
                            </ImageBackground>

                            <View style={styles.lowerflex}>
                                <View style={styles.sendRecieve}>
                                    <TouchableOpacity onPress={this.receiveCoins} style={styles.recieveButtonContainer}>
                                        <ElevatedView elevation={0} style={styles.recieveButton}>
                                            <Text style={styles.recieveText}>Receive</Text>
                                        </ElevatedView>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.sendCoins} style={styles.sendButtonContainer}>
                                        <ElevatedView elevation={0} style={styles.sendButton}>
                                            <Text style={styles.sendText}>Send</Text>
                                        </ElevatedView>
                                    </TouchableOpacity>
                                </View>


                                <TransactionHistory transactions={this.state.transactions} symbol={this.state.currencySymbol} />

                                {this.state.balance == 0 ? null : (
                                <View style={styles.viewMoreContainer}>
                                    <TouchableOpacity onPress={this.openTransactions}>
                                        <Text style={styles.viewMoreText}>
                                            View More
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={styles.line} />
                                </View>
                                )}
                            </View>
                </Animated.View>

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
        backgroundColor: theme.dark
    },
    upperFlex: {
        flex: 5,
        position: 'relative',
        width: '100%',
        backgroundColor: theme.dark,
        alignItems: 'center',
    },
    lowerflex : {
        flex: 5,
    },
    statusbar: {
        height: statusBarHeight,
        width: '100%',
    },
    contentContainer: {
        position:'relative',
        height: '100%',
        width: '90%',
    },
    headerIconsFlex: {
        height:70,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    menuIconFlex: {
        width:'100%',
        flexDirection:'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    backIcon: {
        height: 25,
        width: 25
    },
    notificationIcon: {
        height: 30,
        width: 30
    },
    iconNameFlex: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        marginVertical:15
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
        marginBottom:10,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row'
    },
    amountText: {
        color: 'white',
        fontSize: 48,
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
        width: '100%',
        justifyContent: 'flex-start',
        marginBottom:10
    },
    valueText: {
        color: 'white',
        fontSize: 16,
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
        paddingTop: 10,
        backgroundColor:'white'
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
        backgroundColor: theme.dark,
        alignItems: 'center',
        borderRadius: 10,
    },
    sendButton : {
        width: '95%',
        marginVertical: 8,
        backgroundColor: theme.dark,
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 10,
    },
    recieveText : {
        color: 'white',
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
        paddingBottom:5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'white'
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
