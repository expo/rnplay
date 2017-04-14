/**
 * @providesModule RemoteAppListView
 * @flow
 */

import React from 'react';
import {
  ActivityIndicator,
  Image,
  NativeModules,
  PixelRatio,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
const { ExponentUtil } = NativeModules;

import { connect } from 'react-redux';
import { withNavigation } from '@exponent/ex-navigation';

import AppDataApi from 'AppDataApi';
import AppListView from 'AppListView';
import Alerts from 'Alerts';
import Colors from 'Colors';
import Layout from 'Layout';
import { RegularText } from 'StyledText';
import type { AppData } from 'SharedTypes';

type Props = {
  url: string,
};

type State = {
  data: Array<AppData>,
  hasError: boolean,
  isInitialLoadComplete: boolean,
  isLoadingApp: boolean,
  isRefreshing: boolean,
  isRequestInFlight: boolean,
  page: number,
};

@connect(data => RemoteAppListView.getDataProps(data))
@withNavigation
export default class RemoteAppListView extends React.Component {
  static getDataProps(data) {
    return {
      currentUser: data.currentUser,
    };
  }

  state: State = {
    data: [],
    hasError: false,
    isInitialLoadComplete: false,
    isLoadingApp: false,
    isRefreshing: false,
    isRequestInFlight: false,
    page: 1,
  };

  componentDidMount() {
    this._fetchApps();
  }

  render() {
    if (!this.state.isInitialLoadComplete && !this.state.hasError) {
      return this._renderLoading();
    } else if (this.state.hasError && !this.state.data.length) {
      return this._renderRetry();
    } else {
      if (this.state.data.length > 0) {
        return (
          <AppListView
            apps={this.state.data}
            isRefreshing={this.state.isRefreshing}
            onRefresh={this._handleRefreshAsync}
            onEndReached={this._handleEndReached}
          />
        );
      } else {
        return this._renderNoResults();
      }
    }
  }

  _handleRefreshAsync = async () => {
    try {
      this.setState({ isRefreshing: true });
      await this._fetchApps(1, true);
    } catch (e) {
      // TODO: Should look for first parent stack!
      // this.props.navigator.showLocalAlert('Failed to refresh, try again!', Alerts.error);
    } finally {
      this.setState({ isRefreshing: false });
    }
  };

  _fetchApps: (page: ?number, isRefreshing?: boolean) => Promise<void> = async (
    page = 1,
    isRefreshing = false
  ) => {
    if (this.state.isRequestInFlight) {
      return;
    }

    this.setState({ isRequestInFlight: true });

    const { currentUser, url } = this.props;
    const { email, authToken } = currentUser;

    try {
      let data = await AppDataApi.fetchListAsync(
        url,
        page || 1,
        email,
        authToken
      );

      if (data.error) {
        this.props.navigator.showLocalAlert(
          'It would seem that you are unauthorized to access this. Weird.',
          Alerts.error
        );
        return;
      }

      let newData;
      if (isRefreshing) {
        newData = data;
      } else {
        newData = [...this.state.data, ...data];
      }

      this.setState({
        data: newData,
        isRequestInFlight: false,
        isInitialLoadComplete: true,
        hasError: false,
      });
    } catch (e) {
      this.props.navigator.showLocalAlert(
        'Uh oh something went wrong...',
        Alerts.error
      );

      this.setState({
        hasError: true,
        isInitialLoadComplete: false,
        isRequestInFlight: false,
      });
    }
  };

  _handleEndReached = () => {
    const nextPage = this.state.page + 1;
    this.setState({ page: nextPage });
    this._fetchApps(nextPage);
  };

  _renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.midGrey} />
      </View>
    );
  }

  _renderNoResults() {
    return <View />;
  }

  _renderRetry() {
    return (
      <View style={styles.retryButtonWrapper}>
        <Image
          source={require('../assets/images/network-error.png')}
          style={styles.networkErrorImage}
        />

        <TouchableOpacity
          style={styles.retryButtonHighlight}
          onPress={this._fetchApps}>
          <View style={styles.retryButtonView}>
            <RegularText style={styles.retryButtonText}>
              Connection failed. Retry?
            </RegularText>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  retryButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  retryButtonHighlight: {
    overflow: 'hidden',
  },
  retryButtonView: {
    borderRadius: 7,
    height: 40,
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
  },
  retryButtonText: {
    paddingLeft: 20,
    paddingRight: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingBottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkErrorImage: {
    width: 300,
    height: 267,
    opacity: 0.9,
    marginBottom: 30,
  },
});
