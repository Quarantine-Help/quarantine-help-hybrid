import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../environments/environment';

declare var H: any;

interface LatLng {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-quarantine-map',
  templateUrl: 'quarantine-map.html',
  styleUrls: ['quarantine-map.scss']
})
export class QuarantineMapPage implements AfterViewInit {
  private HEREMapsPlatform: any;
  private HEREMapObj: any;
  private HEREMapUI: any;
  private HEREmapEvents: any;
  private mapEventsBehavior: any;
  private defaultLayers: any;

  @ViewChild('mapContainer', { static: true }) mapElement: ElementRef;

  ngAfterViewInit() {
    const mapCenterlatLng: LatLng = { lat: 10.525037, lng: 76.214553 };
    this.initHEREMap(mapCenterlatLng);
    this.dropMarker(mapCenterlatLng, {
      title: 'John Doe',
      desc: 'Require non-emergency medical supplies.'
    });
  }

  initHEREMap(mapCenter) {
    // Initialize the platform object:
    this.HEREMapsPlatform = new H.service.Platform({
      apikey: environment.JS_KEY
    });

    // Obtain the default map types from the platform object
    this.defaultLayers = this.HEREMapsPlatform.createDefaultLayers();
    // Instantiate (and display) a map object:
    this.HEREMapObj = new H.Map(
      this.mapElement.nativeElement,
      this.defaultLayers.vector.normal.map,
      { zoom: 14, center: mapCenter }
    );

    // Refer : https://developer.here.com/documentation/maps/3.1.14.0/api_reference/H.map.Style.html
    const provider = this.HEREMapObj.getBaseLayer().getProvider();
    const style = new H.map.Style(
      `assets/normal.day.yaml`,
      `https://js.api.here.com/v3/3.1/styles/omv/`
    );
    provider.setStyle(style);

    // Create the default UI:
    this.HEREMapUI = H.ui.UI.createDefault(this.HEREMapObj, this.defaultLayers);
    // Enable the event system on the map instance:
    this.HEREmapEvents = new H.mapevents.MapEvents(this.HEREMapObj);
    // Instantiate the default behavior on the map events
    this.mapEventsBehavior = new H.mapevents.Behavior(this.HEREmapEvents);
  }

  dropMarker(coordinates: LatLng, info: { title: string; desc: string }) {
    const marker = new H.map.Marker(coordinates);
    marker.setData(`<b>${info.title}</b><br>${info.desc}`);
    marker.addEventListener(
      'tap',
      event => {
        const bubble = new H.ui.InfoBubble(this.getLatLngFromScreen(event), {
          content: event.target.data
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
    return {
      lat: Math.abs(coordinates.lat.toFixed(4)),
      lng: Math.abs(coordinates.lng.toFixed(4))
    };
  }
}
