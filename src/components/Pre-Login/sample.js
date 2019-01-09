import React , { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions, BackHandler, ImageBackground, AsyncStorage, Animated, Easing } from 'react-native';
import Carousel from 'react-native-snap-carousel';


export class Sample extends Component {

    _renderItem ({item, index}) {
        return (
        );
    }

    render () {
        return (
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.state.entries}
              renderItem={this._renderItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
            />
        );
    }
}
