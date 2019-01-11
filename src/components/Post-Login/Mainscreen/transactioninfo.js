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
  Clipboard,
  BackHandler
} from "react-native";
import { Actions } from "react-native-router-flux";
import Toast from "react-native-simple-toast";
import axios from "axios";
import theme from "../../common/theme";
import Loader from "../../common/loader";
import AppStatusBar from "../../common/appstatusbar";
import StatusBar from "../../common/statusbar";

var Copy = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png";
var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";
var Unconfirmed =
  "https://s3.ap-south-1.amazonaws.com/maxwallet-images/unconfirmed.png";
var Confirmed =
  "https://s3.ap-south-1.amazonaws.com/maxwallet-images/confirmed.png";

export default class TransactionInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: "",
      loaded: false,
      confirmations: "",
      id: "",
      amount: null,
      fee: null,
      total: null,
      date: "12/04/2018",
      status: "Unconfirmed",
      icon: null
    };
    this.getDetails = this.getDetails.bind(this);
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton = () => {
    Actions.popTo("mainscreen");
    return true;
  };
  componentWillMount() {
    this.getDetails();
  }
  getDetails() {
    data = {};
    data.transaction_id = this.props.id;
    try {
      var self = this;
      axios({
        method: "post",
        url: "http://206.189.137.43:4013/transaction_status",
        data: data
      })
        .then(function(response) {
          console.log(response);
          var status;
          var icon;
          const confirmations = response.data.result.confirmations;
          if (confirmations == 1) {
            (status = "Confirmation"), (icon = Confirmed);
          } else if (confirmations >= 2) {
            (status = "Confirmations"), (icon = Confirmed);
          } else {
            (status = "Confirmation"), (icon = Unconfirmed);
          }
          self.setState({
            confirmations: confirmations,
            icon: icon,
            status: status,
            id: self.props.id,
            amount: self.props.amount,
            fee: self.props.fee,
            total: self.props.finalAmount,
            loaded: true
          });
          //self.setState({response: response.data , clicked: true, loaded: true})
        })
        .catch(function(error) {
          console.log(error);
        });
    } catch (error) {
      alert(error);
    }
  }
  writeToClipboard = async () => {
    await Clipboard.setString(this.state.id);
    Toast.showWithGravity("Copied to Clipboard!", Toast.LONG, Toast.CENTER);
  };
  goBack() {
    Actions.pop();
  }
  render() {
    if (!this.state.loaded) {
      return <Loader activity="Fetching Transaction Details" />;
    } else {
      return (
        <View style={styles.container}>
          <StatusBar bColor={theme.dark} />
          <AppStatusBar
            bColor={theme.dark}
            left={true}
            Back={Back}
            leftFunction={this.goBack}
            center={true}
            text="Transaction Status"
            textColor={theme.white}
          />
          <View style={styles.upperFlex}>
            <View style={[styles.cardContent, { flex: 0.25, marginTop: 5 }]}>
              <View style={[styles.contentHeading, { flex: 0.4 }]}>
                <Text style={styles.contentHeadingText}>Transaction ID</Text>
                <TouchableOpacity
                  onPress={this.writeToClipboard}
                  style={{
                    flex: 0.1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Image style={styles.copyIcon} source={{ uri: Copy }} />
                </TouchableOpacity>
              </View>
              <View style={[styles.contentTextContainer, { flex: 0.6 }]}>
                <Text style={styles.contentText}>{this.state.id}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.contentHeading}>
                <Text style={styles.contentHeadingText}>
                  Total Amount (BTC)
                </Text>
              </View>
              <View style={styles.contentTextContainer}>
                <Text style={styles.contentText}>{this.state.total}</Text>
              </View>
            </View>
            <View style={[styles.lastCard, { marginBottom: 14 }]}>
              <View style={styles.statusFlex}>
                <View style={styles.contentHeading}>
                  <Text style={styles.contentHeadingText}>
                    Transaction Status
                  </Text>
                </View>
                <View style={styles.contentTextContainer}>
                  <Text style={styles.contentText}>
                    {this.state.confirmations} {this.state.status}{" "}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.lowerFlex}>
            <Image
              style={styles.statusIcon}
              source={{ uri: this.state.icon }}
            />
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
  upperFlex: {
    flex: 0.6,
    width: "100%",
    alignItems: "center",
    backgroundColor: theme.grey
  },
  cardContent: {
    flex: 0.19,
    width: "90%"
  },
  contentHeading: {
    flex: 0.45,
    flexDirection: "row",
    alignItems: "flex-end"
  },
  contentTextContainer: {
    flex: 0.55,
    justifyContent: "center"
  },
  contentHeadingText: {
    flex: 0.9,
    fontFamily: theme.Lato,
    color: theme.darkgrey,
    fontSize: 14
  },
  contentText: {
    fontFamily: theme.Lato,
    fontWeight: "300",
    color: theme.black,
    fontSize: 17
  },
  copyIcon: {
    width: 20,
    height: 20
  },
  lastCard: {
    flex: 0.19,
    width: "90%",
    flexDirection: "row"
  },
  dateFlex: {
    flex: 0.6
  },
  statusFlex: {
    flex: 0.4
  },
  lowerFlex: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center"
  },
  statusIcon: {
    height: 110,
    width: 110
  }
});
