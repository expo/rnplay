/**
 * @providesModule AppListView
 * @flow
 */

import React from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  AppState,
  Image,
  Linking,
  ListView,
  NativeModules,
  PixelRatio,
  RefreshControl,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
const { ExponentUtil } = NativeModules;

import { connect } from 'react-redux';
import { withNavigation } from '@exponent/ex-navigation';

import Actions from 'Actions';
import AppDataApi from 'AppDataApi';
import Alerts from 'Alerts';
import Colors from 'Colors';
import Layout from 'Layout';
import { RegularText } from 'StyledText';
import type { AppData } from 'SharedTypes';

type Props = {
  apps: Array<AppData>,
  isRefreshing: boolean,
  onRefresh: () => void,
  onEndReached: () => void,
};

type State = {
  isLoadingApp: boolean,
  dataSource: ListView.DataSource,
};

@connect()
@withNavigation
export default class AppListView extends React.Component {
  state: State;

  constructor(props: Props, context: any) {
    super(props, context);

    let dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    if (props.apps) {
      dataSource = dataSource.cloneWithRows(props.apps);
    }

    this.state = {
      isLoadingApp: false,
      dataSource,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.apps !== this.props.apps) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.apps),
      });
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  render() {
    if (this.state.dataSource.getRowCount() > 0) {
      return this._renderAppList();
    } else {
      return this._renderNoResults();
    }
  }

  _renderAppList() {
    return (
      <View style={{ flex: 1 }}>
        <ListView
          style={{ flex: 1 }}
          contentContainerStyle={{ backgroundColor: '#fff' }}
          dataSource={this.state.dataSource}
          renderRow={this._renderApp}
          initialPageSize={10}
          pageSize={5}
          refreshControl={
            this.props.onRefresh &&
              <RefreshControl
                refreshing={this.props.isRefreshing}
                onRefresh={this.props.onRefresh}
              />
          }
          onEndReachedThreshold={1200}
          onEndReached={this.props.onEndReached}
        />
        {this.state.isLoadingApp && this._renderLoading()}
      </View>
    );
  }

  _shareApp(app: AppData) {
    const url = 'https://rnplay.org/apps/' + app.url_token;
    const message = `${app.name || app.module_name} on rnplay.org`;

    if (ExponentUtil && ExponentUtil.shareAsync) {
      ExponentUtil.shareAsync('Share this experience', message, url);
    } else {
      ActionSheetIOS.showShareActionSheetWithOptions(
        { url, message },
        error => console.log(error),
        success => console.log(success)
      );
    }
  }

  _renderApp = (app: AppData) => {
    return (
      <TouchableHighlight
        underlayColor={Colors.veryLightGrey}
        onLongPress={() => this._shareApp(app)}
        onPress={() => this._selectApp(app)}>
        <View style={styles.appContainer}>
          <View style={styles.appTextDescription}>
            <RegularText style={styles.appTitle} numberOfLines={1}>
              {app.name || app.module_name}
            </RegularText>

            <View style={styles.targetBuild}>
              <RegularText style={styles.targetBuildText}>
                Targets <RegularText>{app.build_name}</RegularText>
              </RegularText>
            </View>

            <View style={styles.viewCount}>
              <RegularText style={styles.viewCountText}>
                {app.view_count} <RegularText>views</RegularText>
              </RegularText>
            </View>
          </View>

          {this._renderCreator(app)}
        </View>
      </TouchableHighlight>
    );
  };

  _renderCreator(app: AppData) {
    if (!app.creator || this.props.hideCreator) {
      return;
    }

    const avatarUrl = 'https://rnplay.org/' + app.creator.avatar_url + '?v=1';

    return (
      <View style={styles.creator}>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} source={{ uri: avatarUrl }} />
        </View>

        <RegularText style={styles.username} numberOfLines={1}>
          {app.creator.username || 'guest'}
        </RegularText>
      </View>
    );
  }

  _selectApp(app: AppData) {
    if (this.state.isLoadingApp) {
      return;
    }

    this.setState({ isLoadingApp: true });
    AppState.addEventListener('change', this._handleAppStateChange);
    this.props.dispatch(Actions.openApp(app));
  }

  _handleAppStateChange = (appState: string) => {
    if (this.state.isLoadingApp && appState === 'active') {
      this.setState({ isLoadingApp: false });
      AppState.removeEventListener('change', this._handleAppStateChange);
    }
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
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
  appContainer: {
    overflow: 'hidden',
    flexDirection: 'row',
    flex: 1,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 3 / PixelRatio.get(),
    borderBottomColor: '#eee',
  },
  appTextDescription: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  targetBuild: {
    opacity: 0.4,
    paddingBottom: 2,
  },
  viewCount: {
    opacity: 0.4,
  },
  targetBuildText: {
    fontSize: 12,
  },
  viewCountText: {
    fontSize: 12,
  },
  creator: {
    position: 'absolute',
    right: 0,
    width: 70,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 11,
    opacity: 0.4,
    width: 50,
    textAlign: 'center',
  },
  avatarContainer: {
    width: 30,
    height: 30,
    marginBottom: 5,
    borderRadius: 15,
    backgroundColor: '#eee',
  },
  avatar: {
    width: 30,
    height: 30,
    marginBottom: 5,
    borderRadius: 15,
  },
  cancelButton: {
    color: 'white',
    flex: 1,
    fontSize: 25,
    marginLeft: 20,
  },
  appTitle: {
    fontSize: 16,
    color: Colors.tintColor,
    width: Layout.window.width - 70,
    flex: 1,
  },
});
