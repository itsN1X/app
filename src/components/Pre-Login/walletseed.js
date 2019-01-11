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
import Toast from "react-native-simple-toast";
import { Actions } from "react-native-router-flux";
import SeedItem from "./seeditem";
import StatusBar from "../common/statusbar";
import Copy from "../../../images/copy.png";
import theme from "../common/theme";
import Button from "../common/button";

var mnemonic;

export default class WalletSeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonic: "",
      username: ""
    };
    this.seedVerification = this.seedVerification.bind(this);
  }
  componentWillMount() {
    this.setState({ mnemonic: this.props.mnemonic });
    mnemonic = this.props.mnemonic;
    mnemonic = mnemonic.split(" ", 12);
  }
  seedVerification() {
    Actions.verification({
      mnemonic: this.state.mnemonic,
      mode: this.props.mode,
      username: this.props.username
    });
  }
  writeToClipboard = async () => {
    await Clipboard.setString(this.state.mnemonic);
    Toast.showWithGravity("Copied to Clipboard!", Toast.LONG, Toast.CENTER);
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        <View style={styles.textFlex}>
          <View style={styles.mainTextContainer}>
            <Text style={styles.mainText}>Wallet Seed</Text>
          </View>
          <View style={styles.secondaryTextContainer}>
            <Text style={styles.secondaryText}>
              Write down your seed somewhere very safe.
            </Text>
          </View>
        </View>
        <View style={styles.seedFlex}>
          <View style={styles.seedContainer}>
            <View style={styles.seed}>
              {mnemonic.map((value, i) => {
                return <SeedItem key={i} index={i + 1} item={value} />;
              })}
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={this.writeToClipboard}
            >
              <Image
                style={styles.copyIcon}
                source={{
                  uri:
                    "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png"
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 0.2 }} />
        <View style={styles.buttonsFlex}>
          <View style={styles.walletButtonContainer}>
            <Button bColor={theme.dark} onPress={this.seedVerification}>
              <Text style={styles.createWalletText}>
                Yes, I have the seed with me
              </Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    alignItems: "center"
  },
  textFlex: {
    flex: 0.28,
    width: "80%",
    alignItems: "flex-start",
    justifyContent: "center"
  },
  mainTextContainer: {
    flex: 0.6,
    justifyContent: "center"
  },
  mainText: {
    marginTop: 20,
    fontFamily: theme.font,
    color: theme.black,
    fontWeight: "100",
    fontSize: 40
  },
  secondaryTextContainer: {
    flex: 0.4,
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
  buttonsFlex: {
    flex: 0.19,
    width: "100%",
    marginBottom: 20,
    justifyContent: "flex-end"
  },
  walletButtonContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  createWalletText: {
    fontFamily: theme.font,
    fontSize: 18,
    color: theme.white
  }
});
