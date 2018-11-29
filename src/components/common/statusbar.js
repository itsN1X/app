import React from 'react';
import { StyleSheet, Dimensions, Text, View, Image, Platform, TouchableOpacity } from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import theme from './theme';

let searchBarHeight;
if(Dimensions.get('window').height > 700 && Dimensions.get('window').height < 830) {
	statusBarHeight = 24;
}
else if(Dimensions.get('window').height > 830 ){
	statusBarHeight = 30;
}
else {
	statusBarHeight = 16;
}
export default class StatusBar extends React.Component {
	render() {
		return(
			<ElevatedView style={[styles.statusBar, {backgroundColor: this.props.bColor}]}>
			</ElevatedView>
		);
	}
}
const styles = StyleSheet.create({
	statusBar: {
		zIndex: 99,
		backgroundColor: theme.white,
		height: Platform.OS === 'ios' ? statusBarHeight : 0,
		width: '100%',
	},
});
