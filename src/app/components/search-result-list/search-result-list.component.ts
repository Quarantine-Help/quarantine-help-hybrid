import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LatLng } from 'src/app/models/geo';

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss'],
})
export class SearchResultListComponent {
  @Input() show: boolean;
  @Input() searchResults: any;
  @Output() selectAddress: EventEmitter<LatLng> = new EventEmitter<LatLng>();
  constructor() {}

  handleAddressSelect(address) {
    console.log('address', address);
    console.log('show', this.show);
    this.show = false;
  }
}
