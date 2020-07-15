import { Component, OnInit, Input } from '@angular/core';
import { LatLng } from 'src/app/models/geo';
import { RequestView } from 'src/app/models/ui';

@Component({
  selector: 'app-request-info-modal',
  templateUrl: './request-info-modal.component.html',
  styleUrls: ['./request-info-modal.component.scss'],
})
export class RequestInfoModalComponent implements OnInit {
  request: {
    createdAt: string;
    deadline: string;
    description: string;
    id: number;
    status: string;
    type: string;
  };
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

    // TEMP !!
    this.request = {
      createdAt: '2020-04-18T14:17:28.187947Z',
      deadline: '2020-05-29T00:00:01Z',
      description: 'Want 2 Kg ApplesWant 2 Kg ApplesWant 2 Kg Apples',
      id: 5,
      status: 'T',
      type: 'M',
    };
  }
}
