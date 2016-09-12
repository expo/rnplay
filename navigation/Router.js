/**
 * @providesModule Router
 * @flow
 */

import {
  createRouter,
} from '@exponent/ex-navigation';

import ExploreScreen from 'ExploreScreen';
import FakeExploreScreen from 'FakeExploreScreen';
import MyAppsScreen from 'MyAppsScreen';
import HistoryScreen from 'HistoryScreen';
import AboutScreen from 'AboutScreen';
import DrawerNavigationLayout from 'DrawerNavigationLayout';
import TabNavigationLayout from 'TabNavigationLayout';
import AuthenticationScreen from 'AuthenticationScreen';

export default createRouter(() => ({
  explore: () => ExploreScreen,
  fakeExplore: () => FakeExploreScreen,
  myApps: () => MyAppsScreen,
  history: () => HistoryScreen,
  about: () => AboutScreen,
  drawerNavigationLayout: () => DrawerNavigationLayout,
  tabNavigationLayout: () => TabNavigationLayout,
  authentication: () => AuthenticationScreen,
}));
