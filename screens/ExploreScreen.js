/**
 * @providesModule ExploreScreen
 * @flow
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import RemoteAppListView from 'RemoteAppListView';
import Colors from 'Colors';
import Layout from 'Layout';
import { RegularText } from 'StyledText';
import { SlidingTabNavigation, SlidingTabNavigationItem } from '@exponent/ex-navigation';

export default class ExploreScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Explore',
      ...SlidingTabNavigation.navigationBarStyles,
    },
  };

  render() {
    return (
      <SlidingTabNavigation
        initialTab="popular"
        barBackgroundColor={Colors.tintColor}
        position="top"
        pressColor="rgba(0,0,0,0.2)">

        <SlidingTabNavigationItem
          id="popular"
          renderLabel={() => this._renderLabel('Popular', 'popularIconName')}>
          {this._renderPopular()}
        </SlidingTabNavigationItem>

        <SlidingTabNavigationItem
          id="picks"
          renderLabel={() => this._renderLabel('Picks', 'picksIconName')}>
          {this._renderPicks()}
        </SlidingTabNavigationItem>

      </SlidingTabNavigation>
    );
  }

  _renderLabel(title: string, iconName: string) {
    return (
      <RegularText style={{color: Colors.navigationBarTintColor}}>
        {title}
      </RegularText>
    );
  }

  _renderPopular() {
    return (
      <RemoteAppListView url="/apps/popular.json" />
    );
  }

  _renderPicks() {
    return (
      <RemoteAppListView url="/apps/picks.json"  />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#ccc',
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 5,
  },
});
