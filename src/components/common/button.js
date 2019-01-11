import React from "react";
import theme from "./theme";
import { Text, TouchableOpacity, Dimensions } from "react-native";

let buttonHeight;
if (
  Dimensions.get("window").height > 700 &&
  Dimensions.get("window").height < 830
) {
  buttonHeight = 65;
} else if (Dimensions.get("window").height > 830) {
  buttonHeight = 70;
} else {
  buttonHeight = 60;
}
const Button = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.buttonStyle,
        {
          backgroundColor: props.bColor,
          borderColor: props.borderColor,
          height: buttonHeight
        }
      ]}
    >
      <Text style={styles.text}> {props.children} </Text>
    </TouchableOpacity>
  );
};

const styles = {
  buttonStyle: {
    width: "80%",
    backgroundColor: theme.dark,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.dark,
    borderRadius: 15
  },
  text: {
    fontFamily: theme.font,
    fontSize: 18,
    color: theme.white
  }
};

export default Button;
