import { Injectable } from '@angular/core';
import { CommonHTTPService } from '../common-http/common-http.service';

@Injectable({
  providedIn: 'root'
})
export class HEREMapService {
  reverseCodeBaseURL: string;
  urlSuffix: string;
  apiKey: string;

  constructor(private commonHTTP: CommonHTTPService) {
    this.reverseCodeBaseURL = 'https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?';
    this.apiKey = 'INxGhspY9TqShx3heSZSBmobOsutPeE9eJaTxfHiiQQ';
    this.urlSuffix = `&mode=retrieveAddresses&maxresults=1&gen=9&apiKey=${this.apiKey}`;
  }

  getUserAddress(currentLocation) {
    const requestURL = `${this.reverseCodeBaseURL}prox=${currentLocation.lat},${currentLocation.lng}${this.urlSuffix}`;
    return this.commonHTTP.httpGet(encodeURI(requestURL));
  }
}
