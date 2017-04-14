/**
 * @providesModule Effects
 * @flow
 */

import ActionTypes from 'ActionTypes';
import type { EffectErrorHandlerParams } from 'redux-effex';

import openAppAsync from 'openAppAsync';
import signInAsync from 'signInAsync';
import signOutAsync from 'signOutAsync';
import setCurrentUserAsync from 'setCurrentUserAsync';

function genericErrorHandler({ action, error }: EffectErrorHandlerParams) {
  console.log({ error, action });
}

export default [
  {
    action: ActionTypes.OPEN_APP,
    effect: openAppAsync,
    error: genericErrorHandler,
  },
  {
    action: ActionTypes.SIGN_OUT,
    effect: signOutAsync,
    error: genericErrorHandler,
  },
  {
    action: ActionTypes.SIGN_IN,
    effect: signInAsync,
    error: genericErrorHandler,
  },
  {
    action: ActionTypes.SET_CURRENT_USER,
    effect: setCurrentUserAsync,
    error: genericErrorHandler,
  },
];
