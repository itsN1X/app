import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  AsyncStorage,
  BackHandler
} from "react-native";
import Loader from "../../common/loader";
import { Actions } from "react-native-router-flux";
import axios from "axios";
import StatusBar from "../../common/statusbar";
import theme from "../../common/theme";
import Button from "../../common/button";
import CurrencyPicker from "../../common/currencypicker";
import WalletItem from "./walletitem";
import BitcoinLight from "../../../../images/coins/light/bitcoin.png";
import BitcoinDark from "../../../../images/coins/dark/bitcoin.png";
import MoneroLight from "../../../../images/coins/light/monero.png";
import MoneroDark from "../../../../images/coins/dark/monero.png";
import EthereumLight from "../../../../images/coins/light/ethereum.png";
import EthereumDark from "../../../../images/coins/dark/ethereum.png";
import RippleLight from "../../../../images/coins/light/ripple.png";
import RippleDark from "../../../../images/coins/dark/ripple.png";
import ZcashLight from "../../../../images/coins/light/zcash.png";
import ZcashDark from "../../../../images/coins/dark/zcash.png";
import LitecoinLight from "../../../../images/coins/light/litecoin.png";
import LitecoinDark from "../../../../images/coins/dark/litecoin.png";
import StarcoinLight from "../../../../images/coins/light/starcoin.png";
import StarcoinDark from "../../../../images/coins/dark/starcoin.png";
import Down from "../../../../images/downdark.png";
var bitcoin = require("bitcore-lib");
var ethereum = require("ethereumjs-wallet-react-native");
const VirgilCrypto = require("virgil-crypto");
const virgilCrypto = new VirgilCrypto.VirgilCrypto();
let output = [];

export default class InitiateWallets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: "",
      pickerEnabled: false,
      wallet_id: "",
      userDetails: "",
      loaded: false,
      coinData: "",
      currency: "USD"
    };
    this.enablePicker = this.enablePicker.bind(this);
    this.disablePicker = this.disablePicker.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);
    this.createKeys = this.createKeys.bind(this);
    this.activateWallets = this.activateWallets.bind(this);
    this.getUserData = this.getUserData.bind(this);
  }
  componentWillMount = async () => {
    this.setState({ activity: "Initiating Wallets" });
    this.getUserData();
    try {
      var self = this;
      axios({
        method: "post",
        url: "http://206.189.137.43:4013/show_all_coins"
      })
        .then(function(response) {
          self.setState({ coinData: response.data.data, loaded: true });
        })
        .catch(function(error) {});
    } catch (error) {
      alert(error);
    }
  };
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton = () => {
    if (this.props.updateGuardian == "yes") {
      Actions.pop();
      Actions.guardiantabs();
      Actions.getstarted();
    }
    return true;
  };
  activateWallets() {
    this.setState(
      { loaded: false, activity: "Generating Crypto Wallets" },
      () => {
        requestAnimationFrame(() => this.createKeys(), 0);
      }
    );
  }
  gotoWallets() {
    Actions.wallets();
  }

  createKeys = async () => {
    var coinsArr = [];
    var encryptedReqArr = [];
    var privateKey = new bitcoin.PrivateKey();
    const privateKeyStr = privateKey.toString();

    var publicKey = privateKey.toPublicKey();
    const publicKeyStr = publicKey.toString();

    var address = publicKey.toAddress(bitcoin.Networks.testnet);
    const addressStr = address.toString();

    let BTCData = {};
    BTCData.asset_id = 1;
    BTCData.privateKey = privateKeyStr;
    BTCData.publicKey = publicKeyStr;
    BTCData.address = addressStr;
    BTCData.encryptedData = this.encryptData(JSON.stringify(BTCData));
    this.storeCoinData(BTCData, "1");
    coinsArr.push(BTCData);

    const wallet = await ethereum.generate();
    const ethPrivateKeyStr = wallet.getPrivateKeyString();
    const ethPublicKeyStr = wallet.getPublicKeyString();
    const ethAddressStr = wallet.getAddressString();

    let ETHData = {};
    ETHData.asset_id = 2;
    ETHData.privateKey = ethPrivateKeyStr;
    ETHData.publicKey = ethPublicKeyStr;
    ETHData.address = ethAddressStr;
    ETHData.encryptedData = this.encryptData(JSON.stringify(ETHData));
    this.storeCoinData(ETHData, "2");

    coinsArr.push(ETHData);

    var requestArr = [];
    for (i = 0; i < coinsArr.length; i++) {
      var data = {};

      data.asset_id = coinsArr[i].asset_id;
      data.asset_address = coinsArr[i].address;
      data.asset_data = coinsArr[i].encryptedData;
      requestArr.push(data);
    }

    this.storeEncryptedCoinData(JSON.stringify(requestArr));

    var reqData = {};
    reqData.wallet_id = this.props.wallet_id;
    if (reqData.wallet_id == undefined || reqData.wallet_id == null) {
      reqData.wallet_id = this.state.wallet_id;
    }

    var user = {
      wallet_id: reqData.wallet_id,
      request_arr: requestArr
    };

    this.sendCoinsData(user);
    if (this.props.updateGuardian == "yes") {
      this.updateGuardianStatus();
    }
    Actions.postlogintabs();
    Actions.wallets({
      new: true,
      coinData: this.state.coinData,
      user_data: this.state.userDetails,
      loggedIn: true,
      wallet_id: reqData.wallet_id
    });
  };

  storeEncryptedCoinData = async data => {
    try {
      await AsyncStorage.setItem("@CoinsData", data);
    } catch (error) {}
  };

  updateGuardianStatus = async () => {
    try {
      await AsyncStorage.setItem("@Guardian", "false");
    } catch (error) {}
  };
  encryptData(data) {
    var userDetails = this.state.userDetails;
    userDetails = JSON.parse(userDetails);
    const publicKeyStr = userDetails.publicKey;
    const publicKey = virgilCrypto.importPublicKey(publicKeyStr);
    const encryptedDataStr = virgilCrypto.encrypt(data, publicKey);
    const encryptedData = encryptedDataStr.toString("base64");
    return encryptedData;
  }
  sendCoinsData(data) {
    try {
      var self = this;
      axios({
        method: "post",
        url: "http://206.189.137.43:4013/initialise_coin",
        data: data
      })
        .then(function(response) {})
        .catch(function(error) {});
    } catch (error) {
      alert(error);
    }
  }
  storeCoinData = async (data, status) => {
    data = JSON.stringify(data);
    try {
      if (status == "1") {
        await AsyncStorage.setItem("@BTCData", data);
      } else {
        await AsyncStorage.setItem("@ETHData", data);
      }
    } catch (error) {}
  };
  getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem("@UserData");
      const wallet_id = await AsyncStorage.getItem("@WalletID");
      this.setState({ userDetails: value, wallet_id: wallet_id });
    } catch (error) {
      alert(error);
    }
  };
  enablePicker() {
    this.setState({ pickerEnabled: true });
  }
  disablePicker() {
    this.setState({ pickerEnabled: false });
    Keyboard.dismiss();
  }
  changeCurrency(value) {
    this.setState({ currency: value, pickerEnabled: false });
  }
  render() {
    let buttonHeight;
    if (
      Dimensions.get("window").height > 700 &&
      Dimensions.get("window").height < 830
    ) {
      buttonHeight = 80;
    } else if (Dimensions.get("window").height > 830) {
      buttonHeight = 85;
    } else {
      buttonHeight = 75;
    }
    if (!this.state.loaded) {
      return <Loader activity={this.state.activity} />;
    } else {
      return (
        <View style={styles.container}>
          <StatusBar />
          <ScrollView
            style={{ flex: 1, width: "100%" }}
            showsHorizontalScrollIndicator={false}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "flex-end",
                flex: 1
              }}
            >
              <View style={styles.mainContainer}>
                <View style={styles.mainHeadingContainer}>
                  <Text style={styles.mainHeadingText}>Select Coins</Text>
                </View>

                {this.state.coinData.map((value, i) => {
                  return (
                    <WalletItem
                      key={value.asset_id}
                      symbol={value.asset_symbol}
                      value={value.asset_value}
                      light={value.asset_icon_light}
                      dark={value.asset_icon_dark}
                      name={value.asset_name}
                      currency={this.state.currency}
                      selected={true}
                    />
                  );
                })}
              </View>
              {this.state.pickerEnabled ? (
                <CurrencyPicker
                  status={this.state.pickerEnabled}
                  changeCurrency={this.changeCurrency}
                />
              ) : null}
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.buttonStyle, { height: buttonHeight }]}
              onPress={this.activateWallets}
            >
              <Text style={styles.getStartedText}>Go</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.white,
    alignItems: "center"
  },
  mainContainer: {
    flex: 1,
    width: "85%",
    paddingBottom: 150
  },
  mainHeadingContainer: {
    position: "relative",
    height: 100,
    justifyContent: "flex-end"
  },
  mainHeadingText: {
    fontFamily: theme.font300,
    color: theme.dark,
    fontWeight: "300",
    fontSize: 32,
    marginBottom: 35
  },
  subHeadingContainer: {
    height: 80,
    justifyContent: "center"
  },
  subHeadingText: {
    fontFamily: theme.font300,
    color: theme.dark,
    fontWeight: "300",
    fontSize: 16
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    height: 100,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  buttonStyle: {
    width: "100%",
    backgroundColor: theme.dark,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.dark,
    borderRadius: 10
  },
  getStartedText: {
    fontFamily: theme.font,
    fontWeight: "300",
    fontSize: 20,
    color: theme.white
  }
});
