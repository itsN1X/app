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
import theme from "../common/theme";
import Go from "../../../images/go.png";
import Background from "../../../images/background.png";

export default class ProfileAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pinCode: "",
      mnemonic: "",
      pin: ""
    };

    this.getPinLength = this.getPinLength.bind(this);
  }

  getPinLength() {
    let len = this.state.pinCode;
    if (len.length == 4) {
      Actions.profile();
    }
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
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>Enter Pin</Text>
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
    fontWeight: "300",
    fontSize: 45,
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
    fontSize: 40,
    width: "50%",
    color: theme.white
  },
  goIconContainer: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  goIcon: {
    width: 55,
    height: 55
  }
});
