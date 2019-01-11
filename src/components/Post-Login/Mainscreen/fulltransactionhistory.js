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
  ImageBackground,
  BackHandler
} from "react-native";
import { Actions } from "react-native-router-flux";
import theme from "../../common/theme";
import TransactionHistory from "./transactionhistory";
import AppStatusBar from "../../common/appstatusbar";
import StatusBar from "../../common/statusbar";

var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";

export default class FullTransactionHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton() {
    this.goBack;
  }
  goBack() {
    Actions.pop();
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar bColor={theme.dark} />
        <AppStatusBar
          bColor={theme.dark}
          left={true}
          Back={Back}
          leftFunction={this.goBack}
          center={true}
          text="Transaction"
          textColor={theme.white}
        />
        <View style={{ flex: 1 }}>
          <TransactionHistory
            transactions={this.props.transactions}
            symbol={this.props.symbol}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.grey,
    width: "100%"
  }
});
