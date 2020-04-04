import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { from } from 'rxjs';

const { Geolocation } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class GeoLocationService {
  constructor() {}

  /**
   * Calls the Geo location API and returns a promise with the GPS coordinated
   * @returns An observable containing GeolocationPosition object, which contains coords.
   */
  getCurrentPosition(options?) {
    return from(
      Geolocation.getCurrentPosition({ enableHighAccuracy: true, ...options })
    );
  }
}
