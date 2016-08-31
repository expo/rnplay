/**
 * @providesModule CurrentUserReducer
 */

import ActionTypes from 'ActionTypes';
import { User } from 'Records';

class CurrentUserReducer {
  static reduce(state = new User(), action) {
    if (CurrentUserReducer[action.type]) {
      return CurrentUserReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SET_CURRENT_USER](state, action) {
    let { user } = action;

    if (!user) {
      return new User();
    }

    return new User({
      id: user.id,
      authToken: user.authentication_token,
      email: user.email,
      username: user.username,
      isGuest: !!user.isGuest,
    });
  }

  static [ActionTypes.RESET](state, action) {
    return new User();
  }
}

export default CurrentUserReducer.reduce;
