import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Clipboard,
  AsyncStorage
} from "react-native";
import { Actions } from "react-native-router-flux";
import { BarIndicator } from "react-native-indicators";
import Toast from "react-native-simple-toast";
import bip39 from "react-native-bip39";
import axios from "axios";
import SeedItem from "../../../Pre-Login/seeditem";
import StatusBar from "../../../common/statusbar";
import AppStatusBar from "../../../common/appstatusbar";
import theme from "../../../common/theme";
import Button from "../../../common/button";
const Cryptr = require("cryptr");
const secrets = require("secret-sharing.js");
const crypto = require("react-native-crypto");
import { VirgilCrypto } from "virgil-crypto";

var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";
var Copy = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png";
var mnemonic;

export default class ShowMnemonic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      mnemonic: "",
      mnemonicstr: ""
    };
    this.recoverMnemonic = this.recoverMnemonic.bind(this);
    this.getShares = this.getShares.bind(this);
    this.writeToClipboard = this.writeToClipboard.bind(this);
    this.goBack = this.goBack.bind(this);
  }
  componentWillMount() {
    requestAnimationFrame(() => {
      this.recoverMnemonic();
    });
  }

  writeToClipboard = async () => {
    await Clipboard.setString(this.state.mnemonicstr);
    Toast.showWithGravity("Copied to Clipboard!", Toast.LONG, Toast.CENTER);
  };

  goBack() {
    this.logout();
  }

  generateKeyPair() {
    const virgilCrypto = new VirgilCrypto();
    let account = {};
    account.mnemonic = this.state.mnemonicstr;
    const seed = bip39.mnemonicToSeedHex(this.state.mnemonicstr);
    account.seed = seed;
    const keyPair = virgilCrypto.generateKeysFromKeyMaterial(seed);
    const privateKeyData = virgilCrypto.exportPrivateKey(keyPair.privateKey);
    const publicKeyData = virgilCrypto.exportPublicKey(keyPair.publicKey);
    const privateKey = privateKeyData.toString("base64");
    const publicKey = publicKeyData.toString("base64");
    const privateKeyHash = this.createHash(privateKey);
    account.publicKey = publicKey;
    account.privateKey = privateKey;
    account.privateKeyHash = privateKeyHash;
    let details = {};
    details.private_key_hash = privateKeyHash;
    details.public_key = publicKey;
    this.authenticateUser(details, account);
  }

  createHash(data) {
    const hash = crypto.createHash("sha256");
    hash.update(data);
    const privateKeyHash = hash.digest("hex");
    return privateKeyHash;
  }
  authenticateUser(details, account) {
    console.log(details);
    try {
      var self = this;
      axios({
        method: "post",
        url: "http://206.189.137.43:4013/login",
        data: details
      })
        .then(function(response) {
          if (
            response.data.flag === 143 &&
            response.data.result.wallet_id !== null
          ) {
            account.username = response.data.result.user_name;
            account = JSON.stringify(account);
            self.storeWalletID(response.data.result.wallet_id, account);
            Actions.postlogintabs();
            Actions.wallets();
            Actions.refresh({
              user_data: account,
              loggedIn: true,
              wallet_id: response.data.result.wallet_id,
              new: false
            });
          } else {
            Toast.showWithGravity(
              "Invalid Mnemonic Seed",
              Toast.LONG,
              Toast.CENTER
            );
            self.setState({ loaded: true });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    } catch (error) {
      alert(error);
    }
  }
  storeWalletID = async (wallet_id, account) => {
    try {
      await AsyncStorage.setItem("@WalletID", wallet_id);
      await AsyncStorage.setItem("@UserData", account);
      await AsyncStorage.setItem("@AccountStatus", "LoggedIn");
    } catch (error) {
      console.log(error);
    }
  };
  recoverMnemonic() {
    const shares = this.getShares();
    const cryptr = new Cryptr("Hello");
    var comb = secrets.combine(shares);
    var mnemonicstr = cryptr.decrypt(comb);
    mnemonic = mnemonicstr.split(" ", 12);
    if (bip39.validateMnemonic(mnemonicstr)) {
      this.setState({
        mnemonicstr: mnemonicstr,
        mnemonic: mnemonic,
        loaded: true,
        validateMnemonic: true
      });
    } else {
      this.setState({
        mnemonic: mnemonic,
        loaded: true,
        validateMnemonic: true
      });
      Toast.showWithGravity(
        "Sorry, Not a valid Mnemonic!",
        Toast.LONG,
        Toast.CENTER
      );
    }
  }
  getShares() {
    var shares = [];

    for (i = 0; i < this.props.data.length; i++) {
      if (this.props.data[i].trust_status == 1) {
        var decryptedData = this.decryptData(
          this.props.data[i].trust_data,
          this.props.privateKey
        );
        shares.push(decryptedData);
      }
    }

    return shares;
  }
  logout = async () => {
    try {
      await AsyncStorage.setItem("@RecoveryInitiated", "false");
      this.setState({ loaded: false, activity: "Authenticating User" }, () => {
        requestAnimationFrame(() => this.generateKeyPair(), 0);
      });
    } catch (error) {
      console.log(error);
    }
  };
  decryptData(encryptedData, privateKeyStr) {
    const virgilCrypto = new VirgilCrypto();
    const privateKey = virgilCrypto.importPrivateKey(privateKeyStr);
    const decryptedDataStr = virgilCrypto.decrypt(encryptedData, privateKey);
    var decryptedData = decryptedDataStr.toString("utf8");

    return decryptedData;
  }
  render() {
    if (!this.state.loaded) {
      return (
        <View style={{ flex: 1, backgroundColor: theme.white }}>
          <BarIndicator color={theme.dark} size={50} count={5} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar bColor={theme.white} />

          <View style={styles.mainFlex}>
            <View style={styles.textFlex}>
              <View style={styles.mainTextContainer}>
                <Text style={styles.mainText}>Wallet Seed</Text>
              </View>
            </View>
            <View style={styles.seedFlex}>
              <View style={styles.seedContainer}>
                <View style={styles.seed}>
                  {this.state.validateMnemonic &&
                    mnemonic.map((value, i) => {
                      return <SeedItem key={i} index={i + 1} item={value} />;
                    })}
                </View>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={this.writeToClipboard}
                >
                  <Image style={styles.copyIcon} source={{ uri: Copy }} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.lowerTextFlex}>
              <View style={styles.secondaryTextContainer}>
                <Text style={styles.secondaryText}>
                  Write down your seed somewhere very safe, this is the only
                  thing that can get you back in.
                </Text>
              </View>
            </View>
            <View style={styles.buttonFlex}>
              <Button bColor={theme.dark} onPress={this.goBack}>
                <Text>Login with Mnemonic</Text>
              </Button>
            </View>
          </View>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    alignItems: "center"
  },
  mainFlex: {
    flex: 1,
    width: "100%",
    alignItems: "center"
  },
  textFlex: {
    flex: 0.2,
    width: "80%",
    marginTop: 10,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  mainTextContainer: {
    flex: 1,
    justifyContent: "center"
  },
  mainText: {
    marginTop: 20,
    fontFamily: theme.font,
    color: theme.black,
    fontWeight: "100",
    fontSize: 45
  },
  lowerTextFlex: {
    flex: 0.1,
    width: "80%",
    alignItems: "flex-start",
    justifyContent: "center"
  },
  secondaryTextContainer: {
    flex: 1,
    justifyContent: "center"
  },
  secondaryText: {
    fontFamily: theme.font,
    color: theme.black,
    fontWeight: "100",
    fontSize: 16
  },
  seedFlex: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center"
  },
  seedContainer: {
    position: "relative",
    flex: 0.8,
    width: Dimensions.get("window").width,
    backgroundColor: theme.grey,
    alignItems: "center",
    justifyContent: "center"
  },
  seed: {
    flexDirection: "row",
    width: "80%",
    //justifyContent: 'center',
    alignItems: "center",
    flexWrap: "wrap"
  },
  copyButton: {
    position: "absolute",
    backgroundColor: theme.white,
    padding: 10,
    borderRadius: 25,
    bottom: -20.5,
    right: 12,
    borderWidth: 1,
    borderColor: theme.dark
  },
  copyIcon: {
    width: 20,
    height: 20
  },
  buttonFlex: {
    flex: 0.2,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20
  }
});
