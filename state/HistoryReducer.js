/**
 * @providesModule HistoryReducer
 */

import ActionTypes from 'ActionTypes';

class HistoryReducer {
  static reduce(state = [], action) {
    if (HistoryReducer[action.type]) {
      return HistoryReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SET_HISTORY](state, action) {
    return action.history;
  }

  static [ActionTypes.ADD_APP_TO_HISTORY](state, action) {
    return [...state, action.app];
  }

  static [ActionTypes.RESET](state, action) {
    return [];
  }
}

export default HistoryReducer.reduce;
