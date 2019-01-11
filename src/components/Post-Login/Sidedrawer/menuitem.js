import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import theme from "../../common/theme";

export default class DrawerContent extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={this.props.itemFunction}
      >
        <View style={styles.itemIconContainer}>
          <Image
            style={styles.itemIcon}
            source={{ uri: this.props.iconImage }}
          />
        </View>
        <View style={styles.itemNameContainer}>
          <Text style={styles.itemName}>{this.props.itemName}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  menuItem: {
    marginLeft: 20,
    flexDirection: "row",
    height: 70,
    alignItems: "center"
  },
  iconContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue"
  },
  itemIcon: {
    width: 22,
    height: 22
  },
  itemNameContainer: {
    flex: 0.8,
    paddingLeft: 10,
    justifyContent: "center"
  },
  itemName: {
    fontFamily: theme.font,
    color: theme.black,
    fontSize: 18
  }
});
