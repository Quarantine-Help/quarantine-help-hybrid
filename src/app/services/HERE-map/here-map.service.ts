import { Injectable } from '@angular/core';
import { CommonHTTPService } from '../common-http/common-http.service';

@Injectable({
  providedIn: 'root',
})
export class HEREMapService {
  apiKey: string;
  autoSuggestBaseUrl: string;
  urlSuffix: string;

  constructor(private commonHTTP: CommonHTTPService) {
    this.autoSuggestBaseUrl =
      'https://autosuggest.search.hereapi.com/v1/autosuggest?';
    this.apiKey = 'INxGhspY9TqShx3heSZSBmobOsutPeE9eJaTxfHiiQQ';
    this.urlSuffix = `&apiKey=${this.apiKey}&resultTypes=houseNumber,street`;
  }

  getUserAddressOnSearch(location, searchWord) {
    const addressUrl = `${this.autoSuggestBaseUrl}at=${location.lat},${location.lng}&limit=10&q=${searchWord}${this.urlSuffix}`;
    return this.commonHTTP.httpGet(encodeURI(addressUrl));
  }
}
