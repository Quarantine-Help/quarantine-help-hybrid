export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    altitude?: any;
    accuracy: number;
    altitudeAccuracy?: any;
  };
  timestamp: number;
}
