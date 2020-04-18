import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { GeoLocationService } from 'src/app/services/geo-location/geo-location.service';
import { MiscService } from 'src/app/services/misc/misc.service';
import { CoreAPIService } from 'src/app/services/core-api/core-api.service';

import { GeolocationPosition, LatLng } from '../../models/geo';
import {
  NearbyParticipantsResponse,
  NearbyParticipant,
} from '../../models/core-api';
import { RequestTypes, SearchFilters, Categories } from 'src/app/models/maps';

declare var H: any;

@Component({
  selector: 'app-quarantine-map',
  templateUrl: 'quarantine-map.html',
  styleUrls: ['quarantine-map.scss'],
})
export class QuarantineMapPage implements OnInit, AfterViewInit {
  private HEREMapsPlatform: any;
  private HEREMapObj: any;
  private HEREMapUI: any;
  private HEREmapEvents: any;
  private mapEventsBehavior: any;
  private defaultLayers: any;

  currentLocation: LatLng = undefined;
  @ViewChild('mapContainer', { static: true }) mapElement: ElementRef;
  loadingAniHEREMap: HTMLIonLoadingElement;
  loadingAniNearbyParticipants: HTMLIonLoadingElement;
  loadingAniGPSData: HTMLIonLoadingElement;
  toastElement: Promise<void>;
  showFiltering: boolean;
  filters: SearchFilters;

  constructor(
    private geoLocationService: GeoLocationService,
    private miscService: MiscService,
    private coreAPIService: CoreAPIService
  ) {
    this.filters = {
      distance: 5,
      category: 'all',
    };
  }

  ngOnInit() {
    this.showFiltering = false;
  }

  ngAfterViewInit() {
    // Start the loading animation for getting GPS data
    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Getting current location.`,
      })
      .then((onLoadSuccess) => {
        this.loadingAniGPSData = onLoadSuccess;
        this.loadingAniGPSData.present();
        // Get the GPS data
        this.getGPSLocation();
        // Start the map loading process in parallel
        this.initHEREMap();
      })
      .catch((error) => alert(error));
  }

  // Show/hide the map-filter component.
  toggleFiltering() {
    this.showFiltering = !this.showFiltering;
  }

  // TODO
  exitApp() {
    console.error('exitApp not implemented.');
  }

  onFabClick() {
    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Getting current location.`,
      })
      .then((onLoadSuccess) => {
        this.loadingAniGPSData = onLoadSuccess;
        this.loadingAniGPSData.present();
        // Get the GPS data
        this.getGPSLocation();
      })
      .catch((error) => alert(error));
  }

  // TODO - refactor ?
  /**
   * Get the GPS latLng and save it. If map is already loaded, then set center
   */
  getGPSLocation() {
    this.geoLocationService
      .getCurrentPosition()
      .then((mapCenterlatLng) => {
        // Destroy loading controller on dismiss
        if (this.loadingAniGPSData !== undefined) {
          this.loadingAniGPSData.dismiss().then(() => {
            this.loadingAniGPSData = undefined;
          });
        }
        this.currentLocation = {
          lat: mapCenterlatLng.coords.latitude,
          lng: mapCenterlatLng.coords.longitude,
        };

        // Checks to see if we are re-trying to get GPS or the first time
        if (this.HEREMapObj === undefined) {
          this.initHEREMap();
        } else {
          this.HEREMapObj.setCenter(this.currentLocation, true);
          this.HEREMapObj.setZoom(4, true);
        }

        this.getNearbyParticipants(
          this.filters.distance,
          this.currentLocation,
          this.filters.category
        );

        this.HEREMapObj.setCenter(this.currentLocation, true);
      })
      .catch((error) => {
        console.error(`ERROR - Unable to getting location`, error);
        // Destroy loading controller on dismiss and ask for a retry
        if (this.loadingAniGPSData) {
          this.loadingAniGPSData.dismiss().then(() => {
            this.loadingAniGPSData = undefined;
          });
        }
        // Show error message and retry option on GPS fail
        this.miscService
          .presentToastWithOptions({
            message: error.message,
            color: 'secondary',
          })
          .then((toast) => {
            this.toastElement = toast.present();
            toast.onWillDismiss().then((OverlayEventDetail) => {
              if (OverlayEventDetail.role === 'cancel') {
                this.exitApp();
              } else {
                this.getGPSLocation();
              }
            });
          });
      });
  }

  // TODO - refactor ?
  initHEREMap() {
    // TODO - Use a map load completion event instead of fixed 3000ms to dismiss loading animation
    // Start a map loading animation and dismiss after 5 sec.
    this.miscService
      .presentLoadingWithOptions({
        duration: 3000,
        message: `Loading the map.`,
      })
      .then((onLoadSuccess) => {
        this.loadingAniHEREMap = onLoadSuccess;
        this.loadingAniHEREMap.present();
      })
      .catch((error) => alert(error));

    // Initialize the platform object:
    this.HEREMapsPlatform = new H.service.Platform({
      apikey: environment.HERE_MAPS_JS_KEY,
    });

    // Obtain the default map types from the platform object
    this.defaultLayers = this.HEREMapsPlatform.createDefaultLayers();
    // Instantiate (and display) a map object:
    this.HEREMapObj = new H.Map(
      this.mapElement.nativeElement,
      this.defaultLayers.vector.normal.map,
      { zoom: 14 }
    );

    // Edge case : if map loads later than the GPS, we could use the location already fetched
    if (this.currentLocation !== undefined) {
      this.HEREMapObj.setCenter(this.currentLocation, true);
    }

    // Refer : https://developer.here.com/documentation/maps/3.1.14.0/api_reference/H.map.Style.html
    const provider = this.HEREMapObj.getBaseLayer().getProvider();
    const style = new H.map.Style(
      `assets/normal.day.yaml`,
      `https://js.api.here.com/v3/3.1/styles/omv/`
    );
    provider.setStyle(style);

    // Create the default UI:
    this.HEREMapUI = H.ui.UI.createDefault(this.HEREMapObj, this.defaultLayers);
    this.HEREMapUI.getControl('zoom').setAlignment('right-middle');
    this.HEREMapUI.getControl('mapsettings').setAlignment('right-middle');
    this.HEREMapUI.getControl('scalebar').setAlignment('left-bottom');
    // Enable the event system on the map instance:
    this.HEREmapEvents = new H.mapevents.MapEvents(this.HEREMapObj);
    // Instantiate the default behavior on the map events
    this.mapEventsBehavior = new H.mapevents.Behavior(this.HEREmapEvents);
  }

  // Apply the filters from the filter component and call the API..
  onFiltersApplied(filters: SearchFilters) {
    this.filters = filters;
    this.getNearbyParticipants(
      this.filters.distance,
      this.HEREMapObj.getCenter(),
      this.filters.category
    );
  }

  // TODO - refactor
  getNearbyParticipants(radius: number, latlng: LatLng, category: Categories) {
    // create a RequestTypes string value for query param, as per API requirements.
    let requestType: RequestTypes;
    if (category === 'grocery') {
      requestType = 'G';
    } else if (category === 'medicine') {
      requestType = 'M';
    }

    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Looking for nearby requests`,
      })
      .then((onLoadSuccess) => {
        this.loadingAniNearbyParticipants = onLoadSuccess;
        this.loadingAniNearbyParticipants.present();
        this.coreAPIService
          .getNearbyParticipants(radius, latlng, requestType)
          .then((result: NearbyParticipantsResponse) => {
            console.log(result);
            // Dismiss & destroy loading controller on
            if (this.loadingAniNearbyParticipants !== undefined) {
              this.loadingAniNearbyParticipants.dismiss().then(() => {
                this.loadingAniNearbyParticipants = undefined;
              });
            }
            // Inform user if there are no nearby requests
            if (result.body.count === 0) {
              this.miscService.presentAlert({
                header: 'Info',
                subHeader: 'No nearby requests.',
                message:
                  'We are unable to find any requests nearby. Please relax the search criteria.',
                buttons: ['Ok'],
              });
            } else {
              // Drop markers on participant location
              result.body.results.forEach((participant: NearbyParticipant) => {
                this.dropMarker(
                  {
                    lat: parseFloat(participant.position.latitude),
                    lng: parseFloat(participant.position.longitude),
                  },
                  {
                    title: 'Help',
                    desc: 'Just kidding',
                  }
                );
              });
            }
          });
      })
      .catch((error) => alert(error));
  }

  dropMarker(coordinates: LatLng, info: { title: string; desc: string }) {
    console.log('Dropping markers at', coordinates);
    const marker = new H.map.Marker(coordinates);
    marker.setData(`<b>${info.title}</b><br>${info.desc}`);
    marker.addEventListener(
      'tap',
      (event) => {
        const bubble = new H.ui.InfoBubble(this.getLatLngFromScreen(event), {
          content: event.target.data,
        });
        this.HEREMapUI.addBubble(bubble);
      },
      false
    );
    this.HEREMapObj.addObject(marker);
  }

  /**
   * Gets a lat lng object from returned using the HERE map screenToGeo method
   * @param event The MapEvent object from the event handler
   * @returns An object containing numerical values 'lat' and 'lng'
   */
  getLatLngFromScreen(event): LatLng {
    const coordinates = this.HEREMapObj.screenToGeo(
      event.currentPointer.viewportX,
      event.currentPointer.viewportY
    );
    // TODO - check precision of coordinates with backend team
    return {
      lat: Math.abs(coordinates.lat.toFixed(4)),
      lng: Math.abs(coordinates.lng.toFixed(4)),
    };
  }
}
