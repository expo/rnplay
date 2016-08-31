/**
 * @providesModule ApiStateReducer
 */

import ActionTypes from 'ActionTypes';
import { ApiState } from 'Records';

class ApiStateReducer {
  static reduce(state = new ApiState(), action) {
    if (ApiStateReducer[action.type]) {
      return ApiStateReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SHOW_GLOBAL_LOADING](state, action) {
    return state.set('isLoading', true);
  }

  static [ActionTypes.HIDE_GLOBAL_LOADING](state, action) {
    return state.set('isLoading', false);
  }

  static [ActionTypes.RESET](state, action) {
    return new ApiState();
  }
}

export default ApiStateReducer.reduce;
