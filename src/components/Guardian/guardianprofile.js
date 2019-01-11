import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  BackHandler,
  AsyncStorage
} from "react-native";
import { Actions } from "react-native-router-flux";
import Toast from "react-native-simple-toast";
import axios from "axios";
import StatusBar from "../common/statusbar";
import AppStatusBar from "../common/appstatusbar";
import theme from "../common/theme";
import Loader from "../common/loader";
var Copy = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/copy.png";
export default class GuardianProfile extends React.Component {
  componentDidMount() {
    var backCount = 0;
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton() {
    backCount = backCount + 1;
    if (backCount === 1) {
      Toast.showWithGravity("Press again to EXIT", Toast.LONG, Toast.BOTTOM);
    } else {
      backCount = 0;
      BackHandler.exitApp();
      return true;
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar bColor={theme.dark} />
        <AppStatusBar
          bColor={theme.dark}
          center={true}
          text="Wal Addresses"
          textColor={theme.white}
        />
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Wall Address</Text>
        </View>
        <View style={styles.addressHeadingFlex}>
          <Text style={styles.addressHeadingText}>Public</Text>
          <View style={styles.copyContainer}>
            <TouchableOpacity>
              <Image style={styles.copyIcon} source={{ uri: Copy }} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>
            rw34tgf89xkjb4i3hg74yc349ycb4unvbtb4yv354cuyb38
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.white,
    alignItems: "center"
  },
  headingContainer: {
    width: "90%",
    flex: 0.1,
    justifyContent: "flex-end"
  },
  headingText: {
    fontFamily: theme.font500,
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 18
  },
  addressHeadingFlex: {
    flex: 0.12,
    flexDirection: "row",
    alignItems: "center",
    width: "90%"
  },
  addressHeadingText: {
    fontFamily: theme.font500,
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16
  },
  copyContainer: {
    flex: 1,
    alignItems: "flex-end",
    opacity: 0.6
  },
  copyIcon: {
    width: 16,
    height: 16
  },
  addressContainer: {
    width: "90%",
    marginVertical: 0
  },
  addressText: {
    fontFamily: theme.font,
    fontSize: 16,
    color: theme.black,
    opacity: 0.8
  }
});
