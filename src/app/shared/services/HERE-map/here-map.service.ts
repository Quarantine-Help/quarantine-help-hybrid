import { Injectable } from '@angular/core';
import { CommonHTTPService } from '../common-http/common-http.service';
import { environment } from '../../../../environments/environment';
import { LatLng } from 'src/app/models/geo';

@Injectable({
  providedIn: 'root',
})
export class HEREMapService {
  private autoSuggestBaseUrl: string;
  private autoSuggestUrlSuffix: string;
  private lookUpURL: string;

  constructor(private commonHTTP: CommonHTTPService) {
    this.autoSuggestBaseUrl =
      'https://autosuggest.search.hereapi.com/v1/autosuggest?';
    this.autoSuggestUrlSuffix = `&apiKey=${environment.HERE_MAPS_REST_KEY}&resultTypes=houseNumber,street&lang=en-US`;
    this.lookUpURL = 'https://lookup.search.hereapi.com/v1/';
  }

  getUserAddressOnSearch(location: LatLng, searchWord) {
    const addressAPIUrl =
      `${this.autoSuggestBaseUrl}in=circle:${location.lat},${location.lng};r=100000` +
      `&limit=10&q=${searchWord}${this.autoSuggestUrlSuffix}`;
    return this.commonHTTP.httpGet(encodeURI(addressAPIUrl));
  }

  getPlaceIdDetails(id) {
    const idLookUpApiUrl =
      `${this.lookUpURL}lookup?id=${id}` +
      `&apiKey=${environment.HERE_MAPS_REST_KEY}&lang=en-US`;
    return this.commonHTTP.httpGet(encodeURI(idLookUpApiUrl));
  }
}
