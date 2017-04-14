/**
 * @providesModule PlaygroundStore
 * @flow
 */

import { applyMiddleware, combineReducers, createStore } from 'redux';
import { effectsMiddleware } from 'redux-effex';
import {
  NavigationReducer,
  createNavigationEnabledStore,
} from '@exponent/ex-navigation';

import ApiStateReducer from 'ApiStateReducer';
import CurrentUserReducer from 'CurrentUserReducer';
import HistoryReducer from 'HistoryReducer';
import Effects from 'Effects';

export default createStore(
  combineReducers({
    currentUser: CurrentUserReducer,
    history: HistoryReducer,
    apiState: ApiStateReducer,
  }),
  applyMiddleware(effectsMiddleware(Effects))
);
