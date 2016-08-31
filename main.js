/**
 * @providesModule main
 * @flow
 */

import React from 'react';
import {
  AppRegistry,
  ActivityIndicator,
  DeviceEventEmitter,
  Linking,
  NativeModules,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {
  withNavigation,
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import Exponent, {
  Components,
} from 'exponent';
import {
  MaterialIcons,
  Ionicons,
} from '@exponent/vector-icons';
import {
  connect,
  Provider as ReduxProvider,
} from 'react-redux';
import PlaygroundStore from 'PlaygroundStore';

import Actions from 'Actions';
import Colors from 'Colors';
import Layout from 'Layout';
import LocalStorage from 'LocalStorage';
import Router from 'Router';
import {
  cacheFonts,
  cacheImages,
} from './utilities/cacheHelpers';

class AppContainer extends React.Component {
  render() {
    return (
      <ReduxProvider store={PlaygroundStore}>
        <NavigationProvider router={Router}>
          <App {...this.props} />
        </NavigationProvider>
      </ReduxProvider>
    );
  }
}

@withNavigation
@connect(data => App.getDataProps)
class App extends React.Component {
  static getDataProps(data) {
    return {
      currentUser: data.currentUser,
      isGlobalLoadingVisible: data.apiState.isLoading,
    };
  };

  state = {
    bootstrapIsComplete: false,
  };

  componentWillMount() {
    this._bootstrap();
  }

  componentDidUpdate(prevProps) {
    if (!this.state.bootstrapIsComplete) {
      return;
    }

    const rootNavigator = this.props.navigation.getNavigator('root');

    if (!isLoggedIn(prevProps.currentUser) && isLoggedIn(this.props.currentUser)) {
      rootNavigator.replace(Router.getRoute(Layout.navigationLayoutRoute));
    } else if (isLoggedIn(prevProps.currentUser) && !isLoggedIn(this.props.currentUser)) {
      rootNavigator.replace(Router.getRoute('authentication'));
    }
  }

  componentDidMount() {
    let { exp } = this.props;

    // Was the app opened from a rnplay:// link?
    if (exp.initialUri) {
      this._handleOpenUrl(exp.initialUri);
    }

    // Was a rnplay:// link pressed while the app was backgrounded?
    Linking.addEventListener('url', (event) => {
      let { url } = event;
      this._handleOpenUrl(url);
    });

    // Was the app opened from a push notification?
    if (exp.notification) {
      this._handleNotification({data: exp.notification});
    }

    // Watch for push notifications while open
    DeviceEventEmitter.addListener('Exponent.notification', this._handleNotification);
  }

  _handleNotification = ({data}) => {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    if (data && data.url_token) {
      this.props.dispatch(Actions.openApp(`rnplay://rnplay.org/apps/${data.url_token}`));
    }
  }

  _handleOpenUrl = (url) => {
    if (!url || url.indexOf('rnplay://') === -1) {
      return;
    }

    this.props.dispatch(Actions.openApp(url));
  }

  render() {
    if (!this.state.bootstrapIsComplete) {
      return <Components.AppLoading />;
    }

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}

        <StackNavigation
          id="root"
          initialRoute={getInitialRoute(this.props.currentUser)}
        />

        {this.props.isGlobalLoadingVisible && this._renderGlobalLoadingOverlay()}
      </View>
    );
  }

  _renderGlobalLoadingOverlay = () => {
    return (
      <View style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
        <ActivityIndicator color={Colors.midGrey} />
      </View>
    );
  }

  async _bootstrap() {
    try {
      let fetchUser = LocalStorage.getUserAsync();
      let fetchHistory = LocalStorage.getHistoryAsync();

      let fontAssets = cacheFonts([
        Platform.OS === 'ios' ? Ionicons.font : MaterialIcons.font,
        {'open-sans-light': require('./assets/fonts/opensans-light.ttf')},
        {'open-sans': require('./assets/fonts/opensans-regular.ttf')},
        {'open-sans-bold': require('./assets/fonts/opensans-bold.ttf')},
      ]);

      let imageAssets = cacheImages([
        require('./assets/images/logo-white.png'),
        require('./assets/images/logo-with-sand.png'),
        require('./assets/images/network-error.png'),
        require('./assets/images/exponent-wordmark.png'),
        require('./assets/images/exponent-icon.png'),
      ]);

      let [ user, history, ...rest ] = await Promise.all([
        fetchUser,
        fetchHistory,
        ...fontAssets,
        ...imageAssets
      ]);

      user && this.props.dispatch(Actions.setCurrentUser(user));
      history && this.props.dispatch(Actions.setHistory(history));
      this.setState({bootstrapIsComplete: true});
    } catch (e) {
      Alert.alert('Error on bootstrap!', e.message);
    }
  }
}

function isLoggedIn(userState) {
  return !!userState.authToken || userState.isGuest;
}

function getInitialRoute(currentUser) {
  if (isLoggedIn(currentUser)) {
    return Router.getRoute(Layout.navigationLayoutRoute);
  } else {
    return Router.getRoute('authentication');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarUnderlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingOverlay: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Exponent.registerRootComponent(AppContainer);
