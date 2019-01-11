import React from "react";
import {
  StyleSheet,
  BackHandler,
  Text,
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
  Platform
} from "react-native";
import { Actions } from "react-native-router-flux";
import Toast from "react-native-simple-toast";
import theme from "../../../common/theme";
import StatusBar from "../../../common/statusbar";
import AppStatusBar from "../../../common/appstatusbar";
import Button from "../../../common/button";
import Loader from "../../../common/loader";

SettingRecovery =
  "https://s3.ap-south-1.amazonaws.com/maxwallet-images/photo633.jpg";
const pending =
  "https://s3.ap-south-1.amazonaws.com/maxwallet-images/new/request.png";
export default class InitiateRecovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Status: "0",
      loaded: false
    };
    this.checkRecoveryStatus = this.checkRecoveryStatus.bind(this);
    this.gotoSetupRecovery = this.gotoSetupRecovery.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton = () => {
    Actions.postlogintabs();
    Actions.wallets();
    return true;
  };
  componentWillMount() {
    this.checkRecoveryStatus();
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.recovery === true) {
      this.setState({ loaded: true, Status: "2" });
    } else {
      this.checkRecoveryStatus();
    }
  }
  checkRecoveryStatus = async () => {
    try {
      var Status = await AsyncStorage.getItem("@RecoveryStatus");
      console.log(Status);
      if (Status == null || Status == undefined) {
        Status = "0";
      }
      this.setState({ loaded: true, Status: Status });
    } catch (error) {
      Toast.showWithGravity(error, Toast.LONG, Toast.TOP, Toast.CENTER);
    }
  };
  onEnter() {
    this.checkRecoveryStatus();
  }
  gotoSetupRecovery() {
    var self = this;
    var mode = "register";
    if (self.state.Status === "0") {
      Actions.enteremail({ mode: mode });
    } else if (self.state.Status === "1") {
      Actions.choosefriends({ mode: mode });
    } else {
      return true;
    }
  }

  goToPendingRequests() {
    Actions.pendingrequests();
  }

  render() {
    var buttonText;
    var infoText;
    if (!this.state.loaded) {
      return <Loader activity="Checking Recovery Status" />;
    } else {
      if (this.state.Status === "0") {
        infoText = "Keep your bitcoins safe, forever.";
        buttonText = "Get Started";
      } else if (this.state.Status === "1") {
        infoText = "Continue to complete your Key Recovery";
        buttonText = "Continue Recovery";
      } else if (this.state.Status === "2") {
        infoText = "Your coins are safe";
        buttonText = "Done";
      }
    }

    return (
      <View style={styles.container}>
        <StatusBar bColor={theme.dark} />
        <AppStatusBar
          bColor={theme.dark}
          right={true}
          Forward={pending}
          rightFunction={this.goToPendingRequests}
          center={true}
          text="Recovery"
          textColor={theme.white}
        />
        <View style={styles.contentContainer}>
          <Image style={styles.centerImage} source={{ uri: SettingRecovery }} />
          <View>
            <Text style={styles.centerText}>{infoText}</Text>
          </View>
        </View>
        {this.state.Status === "2" ? null : (
          <View style={styles.buttonContainer}>
            <Button bColor={theme.dark} onPress={this.gotoSetupRecovery}>
              <Text>{buttonText}</Text>
            </Button>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  centerImage: {
    width: 150,
    height: 150
  },
  centerText: {
    fontFamily: theme.font500,
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    textAlign: "center",
    color: theme.dark,
    maxWidth: "65%",
    marginTop: 20
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    bottom: 15
  }
});
