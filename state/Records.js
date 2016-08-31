/**
 * @providesModule Records
 * @flow
 */

import { Record } from 'immutable';

export const User = Record({
  id: null,
  authToken: '',
  avatarUrl: '',
  email: '',
  username: '',
  isGuest: false,
});

export const ApiState = Record({
  isLoading: false,
});
