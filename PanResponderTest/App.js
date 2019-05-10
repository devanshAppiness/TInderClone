/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const Users = [
  { id: "1", uri: require('./assets/image1.jpeg') },
  { id: "2", uri: require('./assets/image2.jpeg') },
  { id: "3", uri: require('./assets/image3.jpeg') },
  { id: "4", uri: require('./assets/image4.jpeg') },
]
type Props = {};
export default class App extends Component<Props> {
  constructor() {
    super()
    this.position = new Animated.ValueXY;
    this.state = {
      currentState: 0
    }
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })
    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }
    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    this.disLikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1,0,0],
      extrapolate: 'clamp'
    })
    this.nextCardOpacity= this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1,0,1],
      extrapolate: 'clamp'
    })
    this.nextCardScale= this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1,0.8,1],
      extrapolate: 'clamp'
    })
  }
  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {        
          if (gestureState.dx > 200) {
        Animated.spring(this.position, {
          toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
        }).start(() => {
          this.setState({ currentState: this.state.currentState + 1 }, () => {
            this.position.setValue({ x: 0, y: 0 })
          })
        })
      }
      else if (gestureState.dx < -200) {
        Animated.spring(this.position, {
          toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
        }).start(() => {
          this.setState({ currentState: this.state.currentState + 1 }, () => {
            this.position.setValue({ x: 0, y: 0 })
          })
        })
      }
      else {
        Animated.spring(this.position, {
          toValue: { x: 0, y: 0 },
          friction: 4
        }).start()
      }
    }
    })
  }
  renderUsers() {

    return Users.map((item, i) => {
      if (i < this.state.currentState) {
        return null
      }
      else if (i == this.state.currentState) {
        return (
          <Animated.View {...this.PanResponder.panHandlers} key={item.id}
            style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
            <Animated.View
              style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], top: 50, left: 40, position: 'absolute', zIndex: 1000 }}>
              <Text
                style={{ borderWidth: 1, color: 'green', borderColor: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
            </Animated.View>
            <Animated.View
              style={{ opacity: this.disLikeOpacity, transform: [{ rotate: '30deg' }], top: 50, right: 40, position: 'absolute', zIndex: 1000 }}>
              <Text
                style={{ borderWidth: 1, color: 'red', borderColor: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
            </Animated.View>
            <Image style={{ flex: 1, height: null, width: null, borderRadius: 20 }} source={item.uri} />

          </Animated.View>
        )
      }
      else {
        return (
          <Animated.View key={item.id}
            style={{opacity:this.nextCardOpacity, transform:[{scale:this.nextCardScale}], height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }}>

            <Image style={{ flex: 1, height: null, width: null, borderRadius: 20 }} source={item.uri} />

          </Animated.View>
        )
      }
    }
    ).reverse()
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 60 }}>
        <Text style={{fontSize:30, alignSelf:'center'}}>Local Tinder</Text>
        </View>
        <View style={{ flex: 1 }}>
          {this.renderUsers()}
        </View>
        <View style={{ height: 60 }}>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
