import React from 'react';
import { Platform } from 'react-native';
export default {
  netflixred: '#EA001F',
  netflixdark: '#141414',
  netflixdarkgrey: "#240B0E",
  white: '#FFFFFF',
  dark: '#071741',
  lightblue: '#0C1F50',
  buttonblue: '#48558D',
  black: '#000000',
  grey: '#EBEBEB',
  darkgrey: '#BABABA',
  offWhite: '#f8f8f8',
  font: Platform.OS === 'ios' ? 'Montserrat' : 'Montserrat-Regular',
  font300: Platform.OS === 'ios' ? 'Montserrat' : 'Montserrat-Light',
  font500: Platform.OS === 'ios' ? 'Montserrat' : 'Montserrat-Medium',
  Lato: Platform.OS === 'ios' ? 'Lato' : 'Lato-Regular',
  Lato300: Platform.OS === 'ios' ? 'Lato' : 'Lato-Light',
  Lato100: Platform.OS === 'ios' ? 'Lato' : 'Lato-Hairline',
  borderRadius: 5,
};
