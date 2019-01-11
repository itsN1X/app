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
  TouchableWithoutFeedback
} from "react-native";
import Toast from "react-native-simple-toast";
import theme from "../../common/theme";

export default class WalletCoinItem extends React.Component {
  onWalletPress(
    walleticon,
    walletname,
    walletsymbol,
    walletvalue,
    walletamount
  ) {
    if (walletsymbol === "BTC") {
      this.props.onWalletOpen(
        walleticon,
        walletname,
        walletsymbol,
        walletvalue,
        walletamount
      );
    } else {
      Toast.showWithGravity("Coming Soon!", Toast.LONG, Toast.CENTER);
    }
  }

  render() {
    return (
      <View style={styles.walletItemContainer}>
        <TouchableOpacity
          onPress={() =>
            this.onWalletPress(
              this.props.lighticon,
              this.props.name,
              this.props.symbol,
              this.props.value,
              this.props.amount
            )
          }
          style={styles.walletItem}
        >
          <View style={styles.contentContainer}>
            <View style={styles.upperContentFlex}>
              <View style={styles.coinImageContainer}>
                <Image
                  style={styles.coinImage}
                  source={{ uri: this.props.icon }}
                />
                <Text style={styles.coinNameText}>{this.props.name}</Text>
              </View>
              <View style={styles.coinAmountContainer}>
                <Text style={styles.coinAmountText}>
                  {this.props.symbol == "BTC"
                    ? this.props.amount
                    : "Coming Soon"}
                </Text>
                <Text style={styles.coinValueText}>
                  ${(
                    (this.props.value * (this.props.amount * 100000000)) /
                    100000000
                  ).toFixed(3)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  walletItemContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center"
  },
  walletNonItem: {
    height: 80,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.white,
    borderRadius: 10,
    borderBottomColor: theme.darkgrey,
    marginVertical: 5
  },
  walletItem: {
    height: 80,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.lightgrey,
    borderRadius: 10,
    borderBottomColor: theme.darkgrey,
    marginVertical: 5
  },
  contentContainer: {
    width: "90%"
  },
  upperContentFlex: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  coinImageContainer: {
    flex: 0.6,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  coinImage: {
    width: 40,
    height: 40,
    marginRight: 10
  },
  coinNameText: {
    fontFamily: theme.font,
    fontSize: 20,
    color: theme.dark
  },
  coinAmountContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  coinAmountText: {
    fontFamily: theme.Lato,
    fontWeight: "300",
    fontSize: 18,
    color: theme.dark
  },
  coinValueContainer: {
    flex: 0.2,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  coinValueText: {
    fontFamily: theme.Lato,
    marginTop: 5,
    fontWeight: "300",
    fontSize: 12,
    color: theme.dark,
    opacity: 0.5
  },
  INRContainer: {
    justifyContent: "center",
    alignItems: "flex-end"
  },
  INRText: {
    fontFamily: theme.Lato,
    fontWeight: "300",
    fontSize: 16,
    color: theme.dark
  }
});
