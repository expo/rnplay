/**
 * @providesModule DrawerNavigationLayout
 * @flow
 */

import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import {
  StackNavigation,
  DrawerNavigation,
  DrawerNavigationItem,
} from '@exponent/ex-navigation';
import {
  MaterialIcons,
} from '@exponent/vector-icons';

import { connect } from 'react-redux';

import Actions from 'Actions';
import Colors from 'Colors';
import Router from 'Router';
import { Font } from 'exponent';
import { RegularText } from 'StyledText';

const defaultRouteConfig = {
  navigationBar: {
    tintColor: Colors.navigationBarTintColor,
    backgroundColor: Colors.navigationBarBackgroundColor,
    titleStyle: Font.style('open-sans'),
  },
};

@connect()
export default class DrawerNavigationLayout extends React.Component {
  render() {
    return (
      <DrawerNavigation
        renderHeader={this._renderHeader}
        drawerWidth={300}
        initialItem="about">

        <DrawerNavigationItem
          id="fakeExplore"
          selectedStyle={styles.selectedItemStyle}
          renderTitle={isSelected => this._renderTitle('Explore', isSelected)}
          renderIcon={isSelected => this._renderIcon('explore', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('explore')}
          />
        </DrawerNavigationItem>

        <DrawerNavigationItem
          id="myApps"
          selectedStyle={styles.selectedItemStyle}
          renderTitle={isSelected => this._renderTitle('My Apps', isSelected)}
          renderIcon={isSelected => this._renderIcon('account-box', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('myApps')}
          />
        </DrawerNavigationItem>

        <DrawerNavigationItem
          id="history"
          selectedStyle={styles.selectedItemStyle}
          renderTitle={isSelected => this._renderTitle('History', isSelected)}
          renderIcon={isSelected => this._renderIcon('history', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('history')}
          />
        </DrawerNavigationItem>

        <DrawerNavigationItem
          id="about"
          selectedStyle={styles.selectedItemStyle}
          renderTitle={isSelected => this._renderTitle('About', isSelected)}
          renderIcon={isSelected => this._renderIcon('info', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('about')}
          />
        </DrawerNavigationItem>

        <DrawerNavigationItem
          id="sign-out"
          selectedStyle={styles.selectedItemStyle}
          onPress={() => this.props.dispatch(Actions.signOut())}
          renderTitle={isSelected => this._renderTitle('Sign out', isSelected)}
          renderIcon={isSelected => this._renderIcon('exit-to-app', isSelected)}>
          <View />
        </DrawerNavigationItem>
      </DrawerNavigation>
    );
  }

  _renderHeader = () => {
    return (
      <View style={{height: 125, paddingBottom: 12, paddingLeft: 12, backgroundColor: Colors.tintColor, justifyContent: 'flex-end'}}>
        <RegularText style={{fontSize: 18, color: '#fff'}}>
          React Native Playground
        </RegularText>
      </View>
    );
  };

  _renderTitle(text: string, isSelected: bool) {
    return (
      <Text style={[styles.buttonTitleText, isSelected ? styles.buttonTitleTextSelected : {}]}>
        {text}
      </Text>
    );
  }

  _renderIcon(name: string, isSelected: bool) {
    return (
      <View style={{width: 28}}>
        <MaterialIcons
          name={name}
          size={28}
          color={isSelected ? Colors.drawerIconSelected : Colors.drawerIconDefault}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonTitleText: {
    color: Colors.drawerTextDefault,
    fontWeight: 'bold',
    marginLeft: 18,
  },
  buttonTitleTextSelected: {
    color: Colors.tintColor,
  },
  selectedItemStyle: {
    backgroundColor: "#EBEBEB",
  },
});
