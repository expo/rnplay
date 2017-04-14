/**
 * @providesModule signInAsync
 * @flow
 */

import type { EffectParams } from 'redux-effex';

import Actions from 'Actions';
import LocalStorage from 'LocalStorage';

export default async function signInAsync({ action, dispatch }: EffectParams) {
  let { user } = action;

  await LocalStorage.saveUserAsync(user);
  dispatch(Actions.setCurrentUser(user));
}
