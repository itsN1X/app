import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Clipboard
} from "react-native";
import theme from "../common/theme";

export default class SeedItem extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.seedItem}>
        <View style={styles.indexContainer}>
          <Text style={styles.indexText}>#{this.props.index}</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{this.props.item}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  seedItem: {
    height: 25,
    backgroundColor: theme.dark,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    marginRight: 10,
    marginBottom: 10
  },
  indexContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  itemContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  indexText: {
    fontFamily: theme.Lato,
    fontWeight: "300",
    color: "#989898",
    fontSize: 12,
    paddingLeft: 5
  },
  itemText: {
    fontFamily: theme.Lato,
    fontSize: 16,
    color: theme.white,
    paddingRight: 8,
    paddingVertical: 2,
    paddingLeft: 5
  }
});
