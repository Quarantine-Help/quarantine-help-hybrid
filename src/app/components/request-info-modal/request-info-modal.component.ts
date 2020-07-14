import { Component, OnInit, Input } from '@angular/core';
import { LatLng } from 'src/app/models/geo';
import { RequestView } from 'src/app/models/ui';

@Component({
  selector: 'app-request-info-modal',
  templateUrl: './request-info-modal.component.html',
  styleUrls: ['./request-info-modal.component.scss'],
})
export class RequestInfoModalComponent implements OnInit {
  constructor() {}
  // Data passed in by componentProps
  @Input() viewportX: string;
  @Input() viewportY: string;
  @Input() coordinates: LatLng; // ??????? Remove these. not yused
  @Input() markerData: RequestView;
  ngOnInit() {
    console.log('RequestInfoModalComponent');
    console.log(this.viewportX, this.viewportY);
    console.log('coordinates', this.coordinates);
    console.log('markerData', this.markerData);
  }
}
