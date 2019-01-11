import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  ImageBackground,
  Modal
} from "react-native";
import theme from "./theme";

export default class SharmirPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      coins: [
        {
          id: 0,
          devices: "2/3"
        },
        {
          id: 1,
          devices: "3/5"
        }
      ]
    };
    this.onCoinSelect = this.onCoinSelect.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  componentWillMount() {
    this.setState({ modalVisible: this.props.status });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ modalVisible: nextProps.status });
  }
  onCoinSelect(value) {
    this.props.changeCoin(value);
  }
  closeModal() {
    this.setState({ modalVisible: false });
  }
  render() {
    return (
      <View
        style={{
          zIndex: 1000,
          backgroundColor: theme.white,
          alignItems: "center"
        }}
      >
        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            this.closeModal();
          }}
          visible={this.state.modalVisible}
        >
          <View
            style={{ height: 30, width: "100%", backgroundColor: theme.white }}
          />
          <ScrollView style={{ backgroundColor: theme.white }}>
            <View style={styles.container}>
              {this.state.coins.map((value, i) => {
                return (
                  <TouchableOpacity
                    key={value.id}
                    style={styles.pickerItemContainer}
                    onPress={() => this.onCoinSelect(value.devices)}
                  >
                    <View style={styles.pickerNameContainer}>
                      <Text style={styles.pickerNameText}>{value.devices}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={this.closeModal}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.white,
    height: "100%",
    width: "100%",
    alignItems: "center"
  },
  pickerItemContainer: {
    width: "80%",
    height: 70,
    alignItems: "center",
    flexDirection: "row"
  },
  pickerNameContainer: {
    flex: 0.3,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  pickerNameText: {
    fontFamily: theme.Lato,
    fontWeight: "300",
    fontSize: 18,
    color: theme.black
  },
  pickerValueContainer: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  pickerValueText: {
    fontFamily: theme.Lato,
    fontWeight: "300",
    fontSize: 18,
    color: theme.black
  },
  cancelButton: {
    position: "absolute",
    bottom: 30,
    right: 27,
    padding: 10
  },
  cancelText: {
    fontFamily: theme.Lato,
    fontWeight: "300",
    fontSize: 18,
    color: "red"
  }
});
