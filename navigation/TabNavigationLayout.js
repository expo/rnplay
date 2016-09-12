/**
 * @providesModule TabNavigationLayout
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  StackNavigation,
  TabNavigation,
  TabNavigationItem,
} from '@exponent/ex-navigation';
import { Ionicons } from '@exponent/vector-icons';
import { Font } from 'exponent';

import Colors from 'Colors';
import Router from 'Router';

const defaultRouteConfig = {
  navigationBar: {
    tintColor: Colors.navigationBarTintColor,
    backgroundColor: Colors.navigationBarBackgroundColor,
    titleStyle: Font.style('open-sans'),
  },
};

type TabRenderFunction = (isSelected: bool) => ReactElement<any>;

export default class TabNavigationLayout extends React.Component {

  render() {
    return (
      <TabNavigation
        tabBarColor={Colors.tabBar}
        tabBarHeight={56}
        initialTab="about">

        <TabNavigationItem
          id="explore"
          renderIcon={isSelected => this._renderIcon('Explore', 'ios-compass-outline', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('fakeExplore')}
          />
        </TabNavigationItem>

        <TabNavigationItem
          id="myApps"
          renderIcon={isSelected => this._renderIcon('My Apps', 'ios-person-outline', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('myApps')}
          />
        </TabNavigationItem>

        <TabNavigationItem
          id="history"
          renderIcon={isSelected => this._renderIcon('History', 'ios-clock-outline', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('history')}
          />
        </TabNavigationItem>

        <TabNavigationItem
          id="about"
          renderIcon={isSelected => this._renderIcon('About', 'ios-help-circle-outline', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('about')}
          />
        </TabNavigationItem>
      </TabNavigation>
    );
  }

  _renderIcon(title: string, iconName: string, isSelected: bool): ReactElement<any> {
    let color = isSelected ? Colors.tabIconSelected : Colors.tabIconDefault;

    return (
      <View style={styles.tabItemContainer}>
        <Ionicons name={iconName} size={32} color={color} />

        <Text style={[styles.tabTitleText, {color}]} numberOfLines={1}>
          {title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitleText: {
    fontSize: 11,
  },
});
