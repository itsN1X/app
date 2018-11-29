/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import Router from './src/router';
import NotificationUtils from './src/components/common/notificationutils';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

global.NotificationUtils=new NotificationUtils(null, MessageBarManager);

export default class App extends Component {
	componentDidMount() {
	  // Register the alert located on this master page
	  // This MessageBar will be accessible from the current (same) component, and from its child component
	  // The MessageBar is then declared only once, in your main component.
	  MessageBarManager.registerMessageBar(this.refs.alert);
	}
	 
	componentWillUnmount() {
	  // Remove the alert located on this master page from the manager
	  MessageBarManager.unregisterMessageBar();
	}
  render() {
    return (
    	<View style={{flex: 1}}>
	      <Router />
	      <MessageBarAlert ref="alert" />
	    </View>
    );
  }
}
