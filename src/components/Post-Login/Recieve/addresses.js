import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView
} from "react-native";
import { Actions } from "react-native-router-flux";
import theme from "../../common/theme";
import Button from "../../common/button";
import StatusBar from "../../common/statusbar";
import AppStatusBar from "../../common/appstatusbar";
import Back from "../../../../images/darkback.png";
import AddressItem from "./addressitem";

export default class Addresses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address:
        "9vM8zCYGPixbfqvJuxA9UQUP2dKG8HQnZ7avxMRLMBkjbCFeNToeiKaBgXXU2hC98jYanv6UUQTVoTTisUoHyWB4V3hnMW",
      addressType: "Business Address"
    };
  }
  goBack() {
    Actions.pop();
  }
  newAddress() {
    Actions.newaddress();
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
          text="Addresses"
        />
        <View style={styles.addressesHeadingFlex}>
          <View style={styles.addressHeadingContainer}>
            <Text style={styles.addressHeadingText}>Saved Addresses</Text>
          </View>
        </View>
        <View style={styles.addressesContentFlex}>
          <ScrollView style={{ flex: 1 }}>
            <AddressItem addressType="Home Address" selected={this.state.one} />
            <AddressItem
              addressType="Business Address"
              selected={this.state.two}
            />
            <AddressItem
              addressType="Personal Address"
              selected={this.state.three}
            />
            <AddressItem
              addressType="Other Address"
              selected={this.state.four}
            />
          </ScrollView>
        </View>
        <View style={styles.buttonFlex}>
          <Button bColor={theme.dark} onPress={this.newAddress}>
            ADD NEW ADDRESS
          </Button>
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
  addressesHeadingFlex: {
    flex: 0.1,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.15)",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  addressHeadingContainer: {
    flex: 0.5,
    alignItems: "flex-start",
    justifyContent: "center",
    width: "90%"
  },
  addressHeadingText: {
    fontFamily: theme.font,
    fontSize: 14,
    color: theme.darkgrey
  },
  addressesContentFlex: {
    flex: 0.64,
    width: "100%"
  },
  buttonFlex: {
    flex: 0.16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});
