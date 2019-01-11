import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  BackHandler,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  TextInput,
  AsyncStorage,
  Clipboard
} from "react-native";
import { Actions } from "react-native-router-flux";
import { BarIndicator } from "react-native-indicators";
import Toast from "react-native-simple-toast";
import axios from "axios";
import theme from "../../common/theme";
import Button from "../../common/button";
import StatusBar from "../../common/statusbar";
import AppStatusBar from "../../common/appstatusbar";

var Tick = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/anmtick.gif";
var Copy = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png";

export default class TransactionSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      loaded: false,
      response: {
        result: {
          amount: "",
          confirmations: "",
          blockhash: "",
          blockindex: ""
        }
      },
      clicked: false
    };
    this.getDetails = this.getDetails.bind(this);
  }
  gotoMainScreen() {
    Actions.popTo("mainscreen");
    requestAnimationFrame(() => {
      Actions.refresh();
    }, 0);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton = () => {
    Actions.popTo("mainscreen");
    requestAnimationFrame(() => {
      Actions.refresh();
    }, 0);
    return true;
  };

  componentWillMount() {
    this.getDetails();
    this.setState({ id: this.props.id });
  }
  writeToClipboard = async () => {
    await Clipboard.setString(this.state.id);
    Toast.showWithGravity("Copied to Clipboard!", Toast.LONG, Toast.CENTER);
  };
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
          self.setState({
            response: response.data,
            clicked: true,
            loaded: true
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    } catch (error) {
      alert(error);
    }
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
          <StatusBar bColor={theme.black} />
          <View style={styles.container}>
            <View style={styles.upperFlex}>
              <View style={styles.gifFlex}>
                <Image source={{ uri: Tick }} style={styles.gif} />
              </View>
              <View style={styles.textFlex}>
                <Text style={styles.sentText}>Transaction Successful</Text>
              </View>
            </View>
            <View style={styles.lowerFlex}>
              <View style={styles.lowerCard}>
                <View style={styles.cardContent}>
                  <View style={styles.contentHeading}>
                    <Text style={styles.contentHeadingText}>
                      Transaction ID
                    </Text>
                  </View>
                  <View style={styles.contentTextContainer}>
                    <Text style={styles.contentText}>{this.state.id}</Text>
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
                </View>
                <View style={styles.dandi} />
                <View style={styles.cardContent}>
                  <View style={styles.contentHeading}>
                    <Text style={styles.contentHeadingText}>Total Amount</Text>
                  </View>
                  <View style={styles.contentTextContainer}>
                    <Text style={styles.contentText}>
                      {Math.abs(this.state.response.result.details[0].amount)}{" "}
                      BTC
                    </Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.gotoMainScreen}
                  >
                    <Text style={styles.buttonText}>DONE</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    width: "100%",
    backgroundColor: theme.black,
    alignItems: "center"
  },
  upperFlex: {
    flex: 0.65,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  gifFlex: {
    flex: 0.8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  gif: {
    width: 300,
    height: 300
  },
  textFlex: {
    flex: 0.2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  sentText: {
    position: "absolute",
    bottom: 60,
    fontFamily: theme.font,
    color: theme.white,
    fontSize: 24
  },
  lowerFlex: {
    flex: 0.35,
    width: "100%",
    alignItems: "center"
  },
  lowerCard: {
    height: "100%",
    width: "90%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    backgroundColor: theme.white
  },
  cardContent: {
    marginTop: 15,
    marginBottom: 10,
    flex: 0.35,
    width: "90%"
  },
  contentHeading: {
    flex: 0.4
  },
  contentTextContainer: {
    flex: 0.6,
    flexDirection: "row"
  },
  contentHeadingText: {
    fontFamily: theme.Lato,
    color: theme.darkgrey,
    fontSize: 14
  },
  contentText: {
    flex: 0.9,
    fontFamily: theme.Lato,
    color: theme.black,
    fontSize: 16
  },
  dandi: {
    height: 1,
    width: "20%",
    backgroundColor: theme.darkgrey
  },
  copyIcon: {
    width: 23,
    height: 23
  },
  buttonContainer: {
    flex: 0.3,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  button: {
    height: "70%",
    width: "70%",
    borderRadius: 100,
    backgroundColor: theme.dark,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontFamily: theme.Lato,
    color: theme.white,
    fontSize: 14
  }
});
