import React from "react";
import {
  StyleSheet,
  Text,
  BackHandler,
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
  AsyncStorage
} from "react-native";
import { Actions } from "react-native-router-flux";
import axios from "axios";
import Toast from "react-native-simple-toast";
import { BarIndicator } from "react-native-indicators";
import theme from "../../../common/theme";
import StatusBar from "../../../common/statusbar";
import AppStatusBar from "../../../common/appstatusbar";
import Button from "../../../common/button";
import TimerCountdown from "react-native-timer-countdown";

export default class Timer extends React.Component {}
