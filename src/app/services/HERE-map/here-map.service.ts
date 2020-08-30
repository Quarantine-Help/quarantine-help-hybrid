import { Injectable } from '@angular/core';
import { CommonHTTPService } from '../common-http/common-http.service';

@Injectable({
  providedIn: 'root',
})
export class HEREMapService {
  apiKey: string;
  autoSuggestBaseUrl: string;
  urlSuffix: string;
  lookUpURL: string;

  constructor(private commonHTTP: CommonHTTPService) {
    this.autoSuggestBaseUrl =
      'https://autosuggest.search.hereapi.com/v1/autosuggest?';
    this.apiKey = 'INxGhspY9TqShx3heSZSBmobOsutPeE9eJaTxfHiiQQ';
    this.urlSuffix = `&apiKey=${this.apiKey}&resultTypes=houseNumber,street&lang=en-US`;
    this.lookUpURL = 'https://lookup.search.hereapi.com/v1/';
  }

  getUserAddressOnSearch(location, searchWord) {
    const addressUrl = `${this.autoSuggestBaseUrl}at=${location.lat},${location.lng}&limit=10&q=${searchWord}${this.urlSuffix}`;
    return this.commonHTTP.httpGet(encodeURI(addressUrl));
  }

  getAddressDetails(id) {
    const url = `${this.lookUpURL}lookup?id=${id}&apiKey=${this.apiKey}&lang=en-US`;
    return this.commonHTTP.httpGet(encodeURI(url));
  }
}
