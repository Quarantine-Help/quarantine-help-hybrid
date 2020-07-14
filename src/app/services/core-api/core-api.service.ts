import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonHTTPService } from '../common-http/common-http.service';

import { LatLng } from 'src/app/models/geo';
import { RequestTypes } from 'src/app/models/here-map';
import { Crisis } from 'src/app/constants/core-api';

@Injectable({
  providedIn: 'root',
})
export class CoreAPIService {
  private commonBaseURL: string;
  private crisisBaseURL: string;
  private affectedParticipantsURL: string;
  private profileMgtURL: string;
  private afRequestsURL: string;
  private hlRequestURL: string;
  constructor(private commonHTTP: CommonHTTPService) {
    const crisisSuffix = `crises/${Crisis.COVID19}`;
    this.crisisBaseURL = `${environment.DJANGO_API_ENDPOINT}/v${environment.DJANGO_API_VERSION}/${crisisSuffix}`;
    this.affectedParticipantsURL = `${this.crisisBaseURL}/affected-participants`; // Trailing slash issue.

    this.commonBaseURL = `${environment.DJANGO_API_ENDPOINT}/v${environment.DJANGO_API_VERSION}`;
    this.profileMgtURL = `${this.commonBaseURL}/me/`; // Trailing slash issue.
    this.afRequestsURL = `${environment.DJANGO_API_ENDPOINT}/v1/me/requests`;
    this.hlRequestURL = `${environment.DJANGO_API_ENDPOINT}/v1/me/assigned-requests/`;
  }

  getNearbyParticipants(
    radius: number,
    latLng: LatLng,
    requestType?: RequestTypes
  ) {
    let apiParams = '';
    if (requestType) {
      apiParams = `?radius=${radius}&latitude=${latLng.lat}&longitude=${latLng.lng}&requestType=${requestType}`;
    } else {
      apiParams = `?radius=${radius}&latitude=${latLng.lat}&longitude=${latLng.lng}`;
    }
    const afMapAPIURL = `${this.affectedParticipantsURL}/${apiParams}`;
    return this.commonHTTP.httpGet(afMapAPIURL);
  }

  getUserProfileData() {
    return this.commonHTTP.httpGet(this.profileMgtURL);
  }

  saveUserProfileData(profileData) {
    return this.commonHTTP.httpPatch(this.profileMgtURL, profileData);
  }

  getRequestsAF() {
    return this.commonHTTP.httpGet(this.afRequestsURL);
  }

  getRequestsHL() {
    return this.commonHTTP.httpGet(this.hlRequestURL);
  }
}
