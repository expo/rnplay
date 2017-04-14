/**
 * @providesModule setCurrentUserAsync
 * @flow
 */

import type { EffectParams } from 'redux-effex';
import { Notifications, Permissions } from 'exponent';

import Actions from 'Actions';
import PlaygroundRestApi from 'PlaygroundRestApi';

export default async function setCurrentUserAsync({
  action,
  getState,
}: EffectParams) {
  if (!action.user || action.user.isGuest) {
    return;
  }

  let { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    return;
  }

  let { currentUser } = getState();
  let token = await Notifications.getExponentPushTokenAsync();
  try {
    let response = await PlaygroundRestApi.post(
      `/push_tokens?push_token[value]=${token}`,
      '',
      currentUser.email,
      currentUser.authToken
    );

    if (response.success) {
      console.log('Push token created on server');
    } else if (response.error) {
      console.log(response.error);
      console.log('Error response from server when posting token');
    }
  } catch (e) {
    console.log(e);
    console.log('Posting push token to server threw an exception');
  }
}
