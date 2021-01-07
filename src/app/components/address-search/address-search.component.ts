import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { HEREMapService } from 'src/app/shared/services/HERE-map/here-map.service';
import { MiscService } from 'src/app/shared/services/misc/misc.service';

@Component({
  selector: 'app-address-search',
  templateUrl: './address-search.component.html',
  styleUrls: ['./address-search.component.scss'],
})
export class AddressSearchComponent implements OnInit {
  @Input() lat: number;
  @Input() lng: number;
  @Output() filter = new EventEmitter();
  searchQuery: string;
  isFilterEnabled: boolean;
  constructor(
    private hereMapService: HEREMapService,
    private miscService: MiscService
  ) {}

  ngOnInit() {
    this.isFilterEnabled = false;
    const location = { lat: this.lat, lng: this.lng };
  }

  toggleFiltering() {
    this.filter.emit();
    this.isFilterEnabled = !this.isFilterEnabled;
  }

  handleOnBlur() {
    this.searchQuery = '';
  }

  handleAddressSearch({ detail }) {
    if (detail.value.length >= 3) {
      this.getAddressAutoComplete(detail.value);
    } else {
      this.miscService.clearAddressSearchResult();
    }
  }

  getAddressAutoComplete(searchQuery) {
    const location = { lat: this.lat, lng: this.lng };
    this.hereMapService
      .getUserAddressOnSearch(location, searchQuery)
      .then(({ body }) => {
        this.miscService.addressResult.next(body.items);
      });
  }
}
