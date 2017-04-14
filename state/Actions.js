/**
 * @providesModule Actions
 * @flow
 */

import ActionTypes from 'ActionTypes';

type RawUserData =
  | {
      id: number,
      authToken: string,
      email: string,
      username: string,
    }
  | {
      isGuest: true,
    }
  | null;

export default class Actions {
  static setCurrentUser(user: RawUserData) {
    return {
      type: ActionTypes.SET_CURRENT_USER,
      user,
    };
  }

  static becomeGuest() {
    return {
      type: ActionTypes.BECOME_GUEST,
    };
  }

  static signIn(user: RawUserData) {
    return {
      type: ActionTypes.SIGN_IN,
      user,
    };
  }

  static signOut() {
    return {
      type: ActionTypes.SIGN_OUT,
    };
  }

  static openApp(app) {
    return {
      type: ActionTypes.OPEN_APP,
      app,
    };
  }

  static addAppToHistory(app) {
    return {
      type: ActionTypes.ADD_APP_TO_HISTORY,
      app,
    };
  }

  static setHistory(history) {
    return {
      type: ActionTypes.SET_HISTORY,
      history,
    };
  }

  static showGlobalLoading() {
    return {
      type: ActionTypes.SHOW_GLOBAL_LOADING,
    };
  }

  static hideGlobalLoading() {
    return {
      type: ActionTypes.HIDE_GLOBAL_LOADING,
    };
  }
}
