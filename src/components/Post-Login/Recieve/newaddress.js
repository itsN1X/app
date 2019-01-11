import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView
} from "react-native";
import QRCode from "react-native-qrcode";
import { Actions } from "react-native-router-flux";
import theme from "../../common/theme";
import Button from "../../common/button";
import StatusBar from "../../common/statusbar";
import AppStatusBar from "../../common/appstatusbar";
import Back from "../../../../images/darkback.png";
import Note from "../../../../images/icon.png";

export default class NewAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address:
        "9vM8zCYGPixbfqvJuxA9UQUP2dKG8HQnZ7avxMRLMBkjbCFeNToeiKaBgXXU2hC98jYanv6UUQTVoTTisUoHyWB4V3hnMW",
      addressType: "Business Address",
      name: ""
    };
  }
  goBack() {
    Actions.pop();
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        <AppStatusBar
          left={true}
          Back={Back}
          leftFunction={this.goBack}
          center={true}
          text="Add New Address"
        />
        <View style={styles.upperFlex}>
          <View style={styles.addressContainer}>
            <View style={styles.enterAddressHeading}>
              <Text style={styles.enterAddressText}>Address Name</Text>
            </View>
            <View style={styles.addressInput}>
              <TextInput
                value={this.state.name}
                style={styles.wordInput}
                returnKeyType="next"
                onChangeText={text => this.setState({ name: text })}
                maxLength={50}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
        </View>
        <View style={styles.noteFlex}>
          <View style={styles.noteIconContainer}>
            <Image style={styles.noteIcon} source={Note} />
          </View>
          <View style={styles.noteTextContainer}>
            <Text style={styles.noteText}>
              Note: Please enter a unique name
            </Text>
          </View>
        </View>
        <View style={styles.addressFlex}>
          <Text style={styles.addressText}>{this.state.address}</Text>
        </View>
        <View style={styles.QRCodeFlex}>
          <QRCode
            value={this.state.address}
            size={200}
            bgColor="black"
            fgColor="white"
          />
        </View>
        <View style={styles.buttonFlex}>
          <Button bColor={theme.dark}>SAVE ADDRESS</Button>
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
  upperFlex: {
    flex: 0.2,
    width: "90%",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  addressContainer: {
    flex: 0.5,
    width: "100%"
  },
  enterAddressHeading: {
    flex: 0.3,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  enterAddressText: {
    fontFamily: theme.font,
    fontSize: 14,
    color: theme.black,
    opacity: 0.6
  },
  addressInput: {
    flex: 0.7,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  wordInput: {
    width: "100%",
    height: 40,
    borderBottomWidth: 0.6,
    borderBottomColor: "rgba(0,0,0,0.6)",
    fontFamily: theme.Lato,
    fontWeight: "300",
    fontSize: 15,
    color: theme.dark
  },
  noteFlex: {
    flex: 0.08,
    width: "90%",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row"
  },
  noteIconContainer: {
    flex: 0.1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  noteIcon: {
    width: 17,
    height: 17
  },
  noteTextContainer: {
    flex: 0.9,
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  noteText: {
    fontFamily: theme.font,
    fontSize: 11,
    color: theme.black,
    opacity: 0.8
  },
  addressFlex: {
    marginTop: 10,
    flex: 0.1,
    width: "90%",
    justifyContent: "center",
    alignItems: "center"
  },
  addressText: {
    fontFamily: theme.Lato,
    fontSize: 13,
    color: theme.black,
    opacity: 0.6
  },
  QRCodeFlex: {
    flex: 0.44,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonFlex: {
    flex: 0.16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});
