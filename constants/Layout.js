/**
 * @providesModule Layout
 * @flow
 */

import { Dimensions, Platform, NativeModules } from 'react-native';

const { ExponentConstants } = NativeModules;

const useDrawerNavigation = Platform.OS === 'android';
// const useDrawerNavigation = false;

export default {
  navigationLayoutRoute: useDrawerNavigation
    ? 'drawerNavigationLayout'
    : 'tabNavigationLayout',
  statusBarHeight: ExponentConstants.statusBarHeight,
  window: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
};
