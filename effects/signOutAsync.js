/**
 * @providesModule signOutAsync
 * @flow
 */

import type { EffectParams } from 'redux-effex';

import Actions from 'Actions';
import AuthenticationApi from 'AuthenticationApi';
import LocalStorage from 'LocalStorage';

export default async function signOutAsync({ action, dispatch }: EffectParams) {
  await LocalStorage.clearAll();
  dispatch(Actions.setCurrentUser(null));
  await AuthenticationApi.signOut();
}
