/**
 * @providesModule HistoryScreen
 * @flow
 */

import React from 'react';
import { ListView, ScrollView, Text, View } from 'react-native';

import { connect } from 'react-redux';

import AppListView from 'AppListView';

@connect(data => HistoryScreen.getDataProps)
export default class HistoryScreen extends React.Component {
  static getDataProps(data) {
    return {
      history: data.history,
    };
  }

  static route = {
    navigationBar: {
      title: 'History',
    },
  };

  render() {
    return <AppListView apps={this.props.history} />;
  }
}
