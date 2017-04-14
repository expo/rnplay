/**
 * @providesModule AppDataApi
 * @flow
 */

import PlaygroundRestApi from 'PlaygroundRestApi';

export default class AppDataApi {
  static fetchListAsync(
    resourceUri: string,
    page: number,
    email: string,
    authToken: string
  ) {
    const separator = resourceUri.indexOf('?') !== -1 ? '&' : '?';
    const uriWithQueryParams = `${resourceUri}${separator}page=${page}`;

    return PlaygroundRestApi.get(uriWithQueryParams);
  }

  static async fetchAppDataAsync(uri: string) {
    let response = await fetch(uri, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    let data = await response.json();
    if (!data.id && data.status && data.status !== '200') {
      throw new Error(`Error loading app ${data.status}`);
    }

    return data;
  }

  static incrementViewCountAsync(urlToken: string) {
    return PlaygroundRestApi.post(`/apps/${urlToken}/view.json`);
  }
}
