import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

import { RequestInfoModalComponent } from 'src/app/components/request-info-modal/request-info-modal.component';
import { GeoLocationService } from 'src/app/services/geo-location/geo-location.service';
import { MiscService } from 'src/app/services/misc/misc.service';
import { CoreAPIService } from 'src/app/services/core-api/core-api.service';
import { environment } from '../../../environments/environment';

import { RequestView, UserThemeColorPrimary } from 'src/app/models/ui';
import { LatLng } from '../../models/geo';
import {
  NearbyParticipantsResponse,
  NearbyParticipant,
} from '../../models/core-api';
import {
  RequestTypes,
  SearchFilters,
  Categories,
} from 'src/app/models/here-map';

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
  private markers: any;
  private markerGroup: any;
  private groceryIcon: any;
  private medicalIcon: any;

  currentLocation: LatLng = undefined;
  @ViewChild('mapContainer', { static: true }) mapElement: ElementRef;
  loadingAniHEREMap: HTMLIonLoadingElement;
  loadingAniNearbyParticipants: HTMLIonLoadingElement;
  loadingAniGPSData: HTMLIonLoadingElement;
  toastElement: Promise<void>;
  showFiltering: boolean;
  filters: SearchFilters;
  allIcon: any;
  userThemeColorPrimary: UserThemeColorPrimary;

  constructor(
    private geoLocationService: GeoLocationService,
    private miscService: MiscService,
    private coreAPIService: CoreAPIService,
    private modalController: ModalController
  ) {
    this.filters = {
      distance: 5,
      category: 'all',
    };
    this.showFiltering = false;
    this.userThemeColorPrimary = 'primaryAF';
  }

  ngOnInit() {}

  ngAfterViewInit() {
    // Create a marker group for future use.
    this.markerGroup = new H.map.Group();
    this.markers = [];

    // initialize Icon files
    this.medicalIcon = new H.map.Icon('assets/common/medicalIcon.svg', {
      size: { w: 56, h: 56 },
    });
    this.groceryIcon = new H.map.Icon('assets/common/groceryIcon.svg', {
      size: { w: 56, h: 56 },
    });
    this.allIcon = new H.map.Icon('assets/common/allIcon.svg', {
      size: { w: 56, h: 56 },
    });

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
    if (this.showFiltering) {
      this.HEREMapObj.getViewPort().setPadding(50, 50, 120, 100);
    } else {
      this.HEREMapObj.getViewPort().setPadding(50, 50, 50, 100);
    }
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
    const MAX_ZOOM_LEVEL = 21;
    this.HEREMapObj = new H.Map(
      this.mapElement.nativeElement,
      this.defaultLayers.vector.normal.map,
      {
        zoom: MAX_ZOOM_LEVEL,
        padding: { top: 50, left: 50, bottom: 50, right: 100 },
      }
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
      this.HEREMapObj.getCenter(), // When using the search filters, use current map center to query.
      this.filters.category
    );
  }

  // TODO - refactor
  getNearbyParticipants(radius: number, latlng: LatLng, category: Categories) {
    // Removes all markers, marker group and event listeners.
    this.markers.forEach((marker) => {
      marker.dispose();
    });
    // this.markerGroup.removeObjects(this.markers);
    this.HEREMapObj.removeObjects(this.HEREMapObj.getObjects());

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
              this.dropMarkersAndReCenter(result.body.results);
            }
          });
      })
      .catch((error) => alert(error));
  }

  dropMarkersAndReCenter(participants) {
    participants.forEach((participant: NearbyParticipant) => {
      // Set the correct icon for the marker, based on the requests
      const isGroceryRequest = participant.requests.some(
        (request) => request.type === 'G'
      );
      const isMedicineRequest = participant.requests.some(
        (request) => request.type === 'M'
      );
      let markerIcon;
      if (isGroceryRequest && isMedicineRequest) {
        markerIcon = { icon: this.allIcon };
      } else if (isGroceryRequest) {
        markerIcon = { icon: this.groceryIcon };
      } else {
        markerIcon = { icon: this.medicalIcon };
      }

      const markerData: RequestView = {
        id: participant.id,
        crisisId: participant.crisis,
        user: participant.user,
        address: {
          firstLineOfAddress: participant.firstLineOfAddress,
          secondLineOfAddress: participant.secondLineOfAddress,
        },
        phone: participant.phone,
        isGroceryRequest,
        isMedicineRequest,
        requests: participant.requests,
      };

      // Create markers for the participants request
      this.createMarker(
        {
          lat: parseFloat(participant.position.latitude),
          lng: parseFloat(participant.position.longitude),
        },
        markerIcon,
        markerData
      );
    });
    this.markerGroup.addObjects(this.markers);
    this.HEREMapObj.addObject(this.markerGroup);

    // get geo bounding box for the group and set it to the map
    this.HEREMapObj.getViewModel().setLookAtData({
      bounds: this.markerGroup.getBoundingBox(),
    });
  }

  // Create markers for each participant request and attach handlers to show Request cards onClick
  createMarker(coordinates: LatLng, markerIcon, markerData: RequestView) {
    const marker = new H.map.Marker(coordinates, markerIcon);
    marker.addEventListener(
      'tap',
      (event) => {
        this.showRequestCard(
          event.currentPointer,
          this.getLatLngFromScreen(event.currentPointer),
          markerData
        );
      },
      false
    );
    this.markers.push(marker);
  }

  async showRequestCard(
    { viewportX, viewportY },
    coordinates: LatLng,
    markerData: RequestView
  ) {
    const modal = await this.modalController.create({
      component: RequestInfoModalComponent,
      componentProps: {
        viewportX,
        viewportY,
        coordinates,
        markerData,
      },
      cssClass: 'request-modal-wrapper',
    });
    return await modal.present();
  }

  /**
   * Gets a lat lng object from returned using the HERE map screenToGeo method
   * @param event The MapEvent object from the event handler
   * @returns An object containing numerical values 'lat' and 'lng'
   */
  getLatLngFromScreen({ viewportX, viewportY }): LatLng {
    const coordinates = this.HEREMapObj.screenToGeo(viewportX, viewportY);
    // TODO - check precision of coordinates with backend team
    return {
      lat: Math.abs(coordinates.lat.toFixed(4)),
      lng: Math.abs(coordinates.lng.toFixed(4)),
    };
  }
}
