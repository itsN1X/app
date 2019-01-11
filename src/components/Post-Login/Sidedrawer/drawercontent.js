import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground
} from "react-native";
import { Actions } from "react-native-router-flux";
import MenuItem from "./menuitem";
import theme from "../../common/theme";
import Logout from "../../../../images/logout.png";
import Button from "../../common/button";

var Background =
  "https://s3.ap-south-1.amazonaws.com/maxwallet-images/menubg.png";
var Logo = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/menulogo.png";
var Profile =
  "https://s3.ap-south-1.amazonaws.com/maxwallet-images/profile.png";
var Exchange =
  "https://s3.ap-south-1.amazonaws.com/maxwallet-images/sendrecieve.png";
var Settings =
  "https://s3.ap-south-1.amazonaws.com/maxwallet-images/settings.png";
var BackupPhrase =
  "https://s3.ap-south-1.amazonaws.com/maxwallet-images/padlock.png";
var Shield = "https://s3.ap-south-1.amazonaws.com/maxwallet-images/shield.png";

export default class DrawerContent extends Component {
  constructor(props) {
    super(props);
    this.onProfilePress = this.onProfilePress.bind(this);
    this.onExchangePress = this.onExchangePress.bind(this);
    this.onWalletsPress = this.onWalletsPress.bind(this);
    this.onSettingsPress = this.onSettingsPress.bind(this);
    this.onKeyRecoveryPress = this.onKeyRecoveryPress.bind(this);
    this.onBackupPhrasePress = this.onBackupPhrasePress.bind(this);
  }
  onProfilePress() {
    this.props.closeDrawer();
    Actions.profile();
  }
  onExchangePress() {
    this.props.closeDrawer();
    Actions.exchange();
  }
  onBackupPhrasePress() {
    this.props.closeDrawer();
    Actions.backupphrase();
  }
  onWalletsPress() {
    this.props.closeDrawer();
    Actions.pop();
    requestAnimationFrame(() => {
      Actions.refresh();
    }, 0);
  }
  onSettingsPress() {
    this.props.closeDrawer();
    Actions.settings();
  }
  onKeyRecoveryPress() {
    this.props.closeDrawer();
    var type = "register";
    Actions.enteremail({ mode: type });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.profileFlex}>
          <ImageBackground style={styles.bgImage} source={{ uri: Background }}>
            <Image style={styles.logo} source={{ uri: Logo }} />
          </ImageBackground>
        </View>
        <View style={styles.menuItemsFlex}>
          <View style={{ marginTop: 20 }} />
          <MenuItem
            iconImage={Profile}
            itemName="Profile"
            itemFunction={this.onProfilePress}
          />
          <MenuItem
            iconImage={Shield}
            itemName="Setup Recovery"
            itemFunction={this.onKeyRecoveryPress}
          />
          <MenuItem
            iconImage={Exchange}
            itemName="Exchange"
            itemFunction={this.onExchangePress}
          />
          <MenuItem
            iconImage={BackupPhrase}
            itemName="Backup Phrase"
            itemFunction={this.onBackupPhrasePress}
          />
          {/*this.props.mainDrawer ? <MenuItem iconImage={Wallet} itemName="Wallets" itemFunction={this.onWalletsPress} /> : null*/}
          <MenuItem
            iconImage={Settings}
            itemName="Settings"
            itemFunction={this.onSettingsPress}
          />
        </View>
        <View style={styles.versionFlex}>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>v 1.0.0</Text>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.white
  },
  profileFlex: {
    flex: 0.28,
    width: "100%",
    backgroundColor: theme.dark,
    marginBottom: 20,
    flexDirection: "row"
  },
  bgImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: 120,
    height: 120
  },
  profileImageContainer: {
    flex: 0.35,
    alignItems: "center",
    justifyContent: "center"
  },
  profileImage: {
    height: 70,
    width: 70,
    borderRadius: 35
  },
  personDetailsContainer: {
    flex: 0.65,
    justifyContent: "center",
    paddingLeft: 5
  },
  personName: {
    fontFamily: theme.font,
    fontSize: 18,
    color: theme.white
  },
  personRating: {
    fontFamily: theme.Lato,
    fontSize: 15,
    opacity: 0.9,
    color: theme.white
  },
  starImage: {
    width: 12,
    height: 12,
    opacity: 0.9
  },
  menuItemsFlex: {
    flex: 0.64,
    width: "90%"
  },
  versionFlex: {
    flex: 0.08,
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  versionContainer: {
    padding: 10
  },
  versionText: {
    fontFamily: theme.font,
    fontWeight: "300",
    fontSize: 14,
    color: theme.dark,
    opacity: 0.8
  }
});
