import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonHTTPService } from '../common-http/common-http.service';

import { LatLng } from 'src/app/models/geo';
import { RequestTypes } from 'src/app/models/here-map';

@Injectable({
  providedIn: 'root',
})
export class CoreAPIService {
  private baseURL: string;
  private affectedParticipantsURL: string;
  constructor(private commonHTTP: CommonHTTPService) {
    const crisisId = 1;
    const suffix = `crises/${crisisId}`;
    this.baseURL = `${environment.DJANGO_API_ENDPOINT}/v${environment.DJANGO_API_VERSION}/${suffix}`;
    this.affectedParticipantsURL = `${this.baseURL}/affected-participants`; // Trailing slash issue.
  }

  getNearbyParticipants(radius: number, latLng: LatLng, requestType?: RequestTypes) {
    let apiParams = '';
    if (requestType) {
      apiParams = `?radius=${radius}&latitude=${latLng.lat}&longitude=${latLng.lng}&requestType=${requestType}`;
    } else {
      apiParams = `?radius=${radius}&latitude=${latLng.lat}&longitude=${latLng.lng}`;
    }
    const afMapAPIURL = `${this.affectedParticipantsURL}/${apiParams}`;
    return this.commonHTTP.httpGet(afMapAPIURL);
  }
}
