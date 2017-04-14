/**
 * @providesModule AuthenticationApi
 * @flow
 */

import PlaygroundRestApi from 'PlaygroundRestApi';

export default class AuthenticationApi {
  static async signIn(email: string, password: string) {
    const params = {
      user: {
        email,
        password,
        remember_me: true,
      },
    };

    return PlaygroundRestApi.post('/users/sign_in', params);
  }

  static async signUp(email: string, password: string) {
    const params = {
      user: {
        email,
        password,
      },
    };

    return PlaygroundRestApi.post('/users', params);
  }

  static async isEmailTaken(email: string) {
    let response = await PlaygroundRestApi.get(`/validations/email/${email}`);
    return !response.available;
  }

  static async signOut() {
    return PlaygroundRestApi.delete('/users/sign_out');
  }
}
