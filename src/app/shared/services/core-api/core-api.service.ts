import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonHTTPService } from '../common-http/common-http.service';

import { LatLng } from 'src/app/models/geo';
import { RequestTypes } from 'src/app/models/here-map-core';
import { Crisis } from 'src/app/constants/core-api';

@Injectable({
  providedIn: 'root',
})
export class CoreAPIService {
  private commonBaseURL: string;
  private crisisBaseURL: string;
  private affectedParticipantsURL: string;
  private userProfileMgtURL: string;
  private afRequestsMgtURL: string;
  private hlAssignedRequestsMgtURL: string;
  private hlExploreAssignRequestsURL: string;
  constructor(private commonHTTP: CommonHTTPService) {
    const crisisSuffix = `crises/${Crisis.COVID19}`;
    this.commonBaseURL = `${environment.DJANGO_API_ENDPOINT}/v${environment.DJANGO_API_VERSION}`;
    this.crisisBaseURL = `${this.commonBaseURL}/${crisisSuffix}`;

    this.affectedParticipantsURL = `${this.crisisBaseURL}/affected-participants`; // Trailing slash issue.
    this.hlExploreAssignRequestsURL = `${this.crisisBaseURL}/affected-participants`;
    this.userProfileMgtURL = `${this.commonBaseURL}/me/`; // Trailing slash issue.
    this.afRequestsMgtURL = `${this.commonBaseURL}/me/requests/`;
    this.hlAssignedRequestsMgtURL = `${this.commonBaseURL}/me/assigned-requests/`;
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
    return this.commonHTTP.httpGet(this.userProfileMgtURL);
  }

  updateUserProfileData(profileData) {
    return this.commonHTTP.httpPatch(this.userProfileMgtURL, profileData);
  }

  createAFRequest(requestData) {
    return this.commonHTTP.httpPost(this.afRequestsMgtURL, requestData);
  }

  getAFUserRequests() {
    return this.commonHTTP.httpGet(this.afRequestsMgtURL);
  }

  getHLAssignedRequests() {
    return this.commonHTTP.httpGet(this.hlAssignedRequestsMgtURL);
  }

  assignAFRequestsAsHL(participantId: number, requestId: number) {
    console.log(
      `${this.hlExploreAssignRequestsURL}/${participantId}/requests/${requestId}/assign/`
    );
    return this.commonHTTP.httpPost(
      `${this.hlExploreAssignRequestsURL}/${participantId}/requests/${requestId}/assign/`
    );
  }

  unassignRequest(requestId) {
    return this.commonHTTP.httpDelete(
      `${this.hlAssignedRequestsMgtURL}${requestId}`
    );
  }

  resolveARequest(requestId, status) {
    return this.commonHTTP.httpPatch(
      `${this.hlAssignedRequestsMgtURL}${requestId}/`,
      status
    );
  }
}
