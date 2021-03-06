import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  BackHandler
} from "react-native";
import { Actions } from "react-native-router-flux";
import bip39 from "react-native-bip39";
import { VirgilCrypto } from "virgil-crypto";
import StatusBar from "../common/statusbar";
import AppStatusBar from "../common/appstatusbar";
import theme from "../common/theme";
import Go from "../../../images/go.png";
import Background from "../../../images/background.png";

var Back = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/lightback.png";

export default class CreatePin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pinCode: "",
      mnemonic: "",
      username: ""
    };
    this.generateKeyPair = this.generateKeyPair.bind(this);
    this.getPinLength = this.getPinLength.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton = () => {
    if (this.props.mode == "wallet" || this.props.mode == "guardian") {
      Actions.popTo("username");
    } else Actions.popTo("firstscreen");

    return true;
  };

  goBack() {
    Actions.pop();
  }

  getPinLength() {
    let len = this.state.pinCode;
    let Mode = this.props.mode;
    if (len.length == 4) {
      Actions.confirmpin({
        pinCode: len,
        mode: Mode,
        guardianStatus: this.props.guardianStatus,
        username: this.props.username
      });
    }
  }

  generateKeyPair() {
    const promise = bip39.generateMnemonic();
    let Mode = this.props.mode;
    promise.then(result => {
      Actions.walletseed({ mnemonic: result, mode: Mode });
    });
  }
  render() {
    const pin = this.state.pinCode;
    var enableButton;
    if (pin.length === 4) {
      enableButton = true;
    } else {
      enableButton = false;
    }
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.bgImage} source={Background}>
          <StatusBar bColor={theme.dark} />
          <AppStatusBar
            left={true}
            Back={Back}
            leftFunction={this.goBack}
            bColor={theme.dark}
            center={true}
            text=""
            textColor={theme.white}
          />
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>Create Pin</Text>
          </View>
          <View style={styles.pinContainer}>
            <TextInput
              style={styles.pinInput}
              secureTextEntry
              autoFocus={true}
              keyboardAppearance="dark"
              keyboardType="number-pad"
              value={this.state.pinCode}
              maxLength={4}
              placeholderTextColor="rgba(255,255,255,0.15)"
              placeholder="****"
              onChangeText={text => this.setState({ pinCode: text })}
            />
          </View>
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ position: "absolute", bottom: 0, right: 0 }}
          >
            <TouchableOpacity
              style={styles.goIconContainer}
              onPress={this.getPinLength}
            >
              <Image
                style={styles.goIcon}
                source={{
                  uri:
                    "https://s3.ap-south-1.amazonaws.com/maxwallet-images/go.png"
                }}
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
    backgroundColor: theme.dark,
    alignItems: "center"
  },
  bgImage: {
    width: "100%",
    height: "100%"
  },
  headingContainer: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  headingText: {
    fontFamily: theme.font300,
    fontWeight: "400",
    fontSize: 24,
    color: theme.white
  },
  subHeadingText: {
    paddingTop: 30,
    fontFamily: theme.Lato,
    fontWeight: "300",
    fontSize: 18,
    color: theme.white
  },
  pinContainer: {
    width: "100%",
    height: 150,
    alignItems: "center",
    justifyContent: "center"
  },
  pinInput: {
    fontFamily: theme.Lato,
    borderBottomColor: "rgba(255,255,255,0.15)",
    borderBottomWidth: 3,
    textAlign: "center",
    fontSize: 26,
    width: "50%",
    color: theme.white
  },
  goIconContainer: {
    width: "100%",
    paddingVertical: 25,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center"
  },
  toolTip: {
    color: theme.white
  },
  goIcon: {
    width: 55,
    height: 55
  }
});
