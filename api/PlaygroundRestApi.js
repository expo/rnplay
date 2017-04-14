/**
 * @providesModule PlaygroundRestApi
 * @flow
 */

import { Constants } from 'exponent';

type RequestBody = ?(string | Object);

const baseUrl = 'https://rnplay.org';

export default class RestApi {
  static async get(
    url: string,
    authEmail: ?string = '',
    authToken: ?string = ''
  ) {
    let platformParam = `?platform=${global.PLATFORM}`;

    if (url.indexOf('?') !== -1) {
      platformParam = platformParam.replace('?', '&');
    }

    let response = await fetch(baseUrl + url + platformParam, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-User-Email': authEmail,
        'X-User-Token': authToken,
        'Exponent-SDK-Version': Constants.exponentVersion,
      },
    });

    return response.json();
  }

  static async post(
    url: string,
    body: RequestBody = '',
    authEmail: ?string = '',
    authToken: ?string = ''
  ) {
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    // Optional -- we post to login and don't have email/token in that case of
    // course
    if (authEmail && authToken) {
      headers = {
        ...headers,
        'X-User-Email': authEmail,
        'X-User-Token': authToken,
      };
    }

    let response = await fetch(baseUrl + url, {
      method: 'post',
      headers,
      body: JSON.stringify(body),
    });

    // It's possible that the server sends us back something
    // that isn't json here, so just ignore it if we can't
    // parse it
    let result;
    try {
      result = await response.json();
    } catch (e) {
      result = { error: e };
    }

    return result;
  }

  static async put(url: string, body: RequestBody) {
    let response = await fetch(baseUrl + url, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response.json();
  }

  static async delete(url: string) {
    let response = await fetch(baseUrl + url, { method: 'delete' });
    let result = await response.json();

    return result;
  }
}
