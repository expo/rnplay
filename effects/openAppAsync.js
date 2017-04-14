/**
 * @providesModule openAppAsync
 * @flow
 */

import { Alert, Linking } from 'react-native';
import type { EffectParams } from 'redux-effex';

import AppDataApi from 'AppDataApi';
import Actions from 'Actions';
import LocalStorage from 'LocalStorage';

export default async function openAppAsync({
  action,
  dispatch,
  getState,
}: EffectParams) {
  let { app } = action;

  if (typeof app === 'string') {
    app = await fetchAppDataAsync(app, dispatch);
  }

  dispatch(Actions.addAppToHistory(app));
  const { history } = getState();
  LocalStorage.saveHistoryAsync(history);

  AppDataApi.incrementViewCountAsync(app.url_token);
  Linking.openURL(`exp://rnplay.org/apps/${app.url_token}`);
}

async function fetchAppDataAsync(url, dispatch) {
  let app;

  try {
    dispatch(Actions.showGlobalLoading());
    let httpUrl = url.indexOf('rnplay:') === 0
      ? url.replace('rnplay:', 'http:')
      : url;
    app = await AppDataApi.fetchAppDataAsync(httpUrl);
  } catch (e) {
    Alert.alert('Error', `There was a problem loading ${url}.`, [
      { text: 'Try again', onPress: () => dispatch(Actions.openApp(url)) },
      { text: 'Cancel', style: 'cancel' },
    ]);
    throw e;
  } finally {
    dispatch(Actions.hideGlobalLoading());
  }

  return app;
}
