/**
 * @providesModule FakeExploreScreen
 * @flow
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Router from 'Router';
import RemoteAppListView from 'RemoteAppListView';
import Colors from 'Colors';
import Layout from 'Layout';
import { RegularText } from 'StyledText';

export default class FakeExploreScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Explore',
    },
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => { this.props.navigator.push(Router.getRoute('explore')) }}>
          <RegularText style={{color: '#fff'}}>Go to Explore</RegularText>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
