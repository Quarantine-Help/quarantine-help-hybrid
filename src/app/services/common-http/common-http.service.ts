import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HTTP_TIMEOUT } from 'src/app/constants/network';

@Injectable({
  providedIn: 'root',
})
export class CommonHTTPService {
  constructor(private http: HttpClient) {}
  /**
   * @description method which calls the HTTP GET request
   * @param url url of the http GET resource
   * @returns Promise which resolved on HTTP GET success
   */
  httpGet(url) {
    // console.log('Starting HTTP GET call to ', url);

    const options: { observe: 'response' } = {
      observe: 'response',
    };
    return new Promise((resolve, reject) => {
      this.http
        .get(encodeURI(url), options)
        .toPromise()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          console.error('httpGet Error:', JSON.stringify(err));
          reject(err);
        });
      setTimeout(() => {
        reject('Timeout Exceeded');
      }, HTTP_TIMEOUT);
    });
  }

  /**
   * @description method which calls the HTTP POST request
   * @param url url of the http POST resource
   * @param body body of the http POST request
   * @returns Promise which resolved on HTTP POST success
   */
  httpPost(url, body) {
    // console.log('Starting HTTP POST call to ', url, body);
    return new Promise((resolve, reject) => {
      const headerOptions = new HttpHeaders();
      headerOptions.append('Content-Type', 'application/json');
      const options: { headers: HttpHeaders; observe: 'response' } = {
        headers: headerOptions,
        observe: 'response',
      };
      this.http
        .post(encodeURI(url), body, options)
        .toPromise()
        .then((resp) => {
          resolve(resp);
        })
        .catch((err) => {
          console.error('http POST Error:', JSON.stringify(err));
          reject(err);
        });
      setTimeout(() => {
        reject('Timeout Exceeded');
      }, HTTP_TIMEOUT);
    });
  }

  /**
   * @description method which calls the HTTP PATCH request
   * @param url url of the http PATCH resource
   * @param body body of the http PATCH request
   * @returns Promise which resolved on HTTP PATCH success
   */
  httpPatch(url, body) {
    // console.log('Starting HTTP PATCH call to ', url, body);
    return new Promise((resolve, reject) => {
      const headerOptions = new HttpHeaders();
      headerOptions.append('Content-Type', 'application/json');
      const options: { headers: HttpHeaders; observe: 'response' } = {
        headers: headerOptions,
        observe: 'response',
      };
      console.log(body);
      this.http
        .patch(encodeURI(url), body, options)
        .toPromise()
        .then((resp) => {
          resolve(resp);
        })
        .catch((err) => {
          console.error('http PATCH Error:', JSON.stringify(err));
          reject(err);
        });
      setTimeout(() => {
        reject('Timeout Exceeded');
      }, HTTP_TIMEOUT);
    });
  }
}
