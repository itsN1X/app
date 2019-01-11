import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BarIndicator, DotIndicator } from "react-native-indicators";
import theme from "./theme";

export default class Loader extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mainIndicator}>
          <View>
            <BarIndicator color={theme.dark} size={50} count={5} />
          </View>
        </View>
        <View style={styles.activityContainer}>
          <View style={styles.activityIndicator}>
            <Text style={styles.activityText}> {this.props.activity} </Text>
            <View style={{ height: 10 }}>
              <DotIndicator color={theme.dark} count={3} size={3} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white
  },
  mainIndicator: {
    flex: 0.5,
    width: "100%",
    justifyContent: "flex-end"
  },
  activityContainer: {
    flex: 0.49,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  activityIndicator: {
    flexDirection: "row",
    height: 50,
    alignItems: "flex-end"
  },
  activityText: {
    fontFamily: theme.font,
    fontSize: 16,
    color: theme.dark
  }
});
