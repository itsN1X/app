import QRCode from "react-native-qrcode";
import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  BackHandler,
  ImageBackground,
  AsyncStorage,
  Animated,
  Easing
} from "react-native";
import { Actions } from "react-native-router-flux";
import ElevatedView from "react-native-elevated-view";
import Drawer from "react-native-drawer";
import axios from "axios";
import SideBar from "../Sidedrawer/drawercontent";
import theme from "../../common/theme";
import Loader from "../../common/loader";
import AppStatusBar from "../../common/appstatusbar";
import TransactionHistory from "./transactionhistory";
import StatusBar from "../../common/statusbar";

var Exchange =
  "https://s3.ap-south-1.amazonaws.com/maxwallet-images/exchange.png";
var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";
var Background =
  "https://s3.ap-south-1.amazonaws.com/maxwallet-images/menubg.png";
var Refresh =
  "https://s3.ap-south-1.amazonaws.com/maxwallet-images/refresh.png";
export default class NoFunds extends Component {
  render() {
    return (
      <Animated.View
        style={{ flex: 1, paddingBottom: 5, backgroundColor: "white" }}
      >
        <ImageBackground style={styles.upperFlex} source={{ uri: Background }}>
          {Platform.OS === "ios" ? <View style={styles.statusbar} /> : null}
          <View style={styles.contentContainer}>
            <View style={styles.headerIconsFlex}>
              <View style={styles.menuIconFlex}>
                <TouchableOpacity onPress={this.goBack}>
                  <Image style={styles.backIcon} source={{ uri: Back }} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.4 }} />
              <View style={styles.exchangeIconFlex} />
            </View>
            <View style={styles.iconNameFlex}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity>
                  <Image
                    style={styles.walletIcon}
                    source={{ uri: this.state.currencyIcon }}
                  />
                </TouchableOpacity>
                <Text style={styles.iconNameText}>
                  {this.state.currencyName}
                </Text>
              </View>
            </View>
            <View style={styles.amountFlex}>
              <Text style={styles.amountText}>{this.state.balance}</Text>
            </View>
            <View style={styles.valueFlex}>
              <Text style={styles.valueText}>
                INR {this.state.currencyValue}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.refreshContainer}
            onPress={this.onRefresh}
          >
            <Animated.Image
              style={[styles.refreshIcon, { transform: [{ rotate: spin }] }]}
              source={{ uri: Refresh }}
            />
          </TouchableOpacity>

          <View style={styles.nofundWrapper}>
            <Text style={styles.nofund}>you have no funds in your wallet</Text>
            <Text style={styles.scanTitle}>Scan to Reveive Bitcoin</Text>
            <View style={styles.QRCodeFlex}>
              <QRCode
                value={this.state.address}
                size={250}
                bgColor="black"
                fgColor="white"
              />
            </View>
            <View style={styles.scanQRTextContainer}>
              <Text style={styles.scanQRText}>Scan the QR Code</Text>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  nofundWrapper: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "center"
  },
  QRCodeFlex: {
    backgroundColor: "white",
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center"
  },
  scanQRTextContainer: {
    flex: 0.15,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  scanQRText: {
    fontFamily: theme.font,
    fontSize: 16,
    color: theme.black
  },
  scanTitle: {
    marginBottom: 30,
    fontFamily: theme.font,
    fontWeight: "300",
    fontSize: 18,
    color: theme.black
  },
  nofund: {
    marginVertical: 20,
    fontFamily: theme.font,
    fontWeight: "300",
    fontSize: 16,
    color: theme.black,
    opacity: 0.75
  }
});
