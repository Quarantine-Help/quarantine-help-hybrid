import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { HEREMapService } from 'src/app/shared/services/HERE-map/here-map.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
})
export class SearchFilterComponent implements OnInit {
  @Input() lat: number;
  @Input() lng: number;
  @Output() filter = new EventEmitter();
  @Output() searchResults = new EventEmitter();
  @Output() closeSearch = new EventEmitter();
  searchQuery: string;
  isFilterEnabled: boolean;
  constructor(private hereMapService: HEREMapService) {}

  ngOnInit() {
    this.isFilterEnabled = false;
    const location = { lat: this.lat, lng: this.lng };
  }

  toggleFiltering() {
    this.filter.emit();
    this.isFilterEnabled = !this.isFilterEnabled;
  }

  handleOnBlur() {
    // console.log('handleOnBlur() called');
    this.searchQuery = '';
    this.closeSearch.emit();
  }

  handleAddressSearch({ detail }) {
    if (detail.value.length >= 3) {
      this.getAddressAutoComplete(detail.value);
    } else {
      this.closeSearch.emit();
    }
  }

  getAddressAutoComplete(searchQuery) {
    const location = { lat: this.lat, lng: this.lng };
    this.hereMapService
      .getUserAddressOnSearch(location, searchQuery)
      .then(({ body }) => {
        this.searchResults.emit(body.items);
      });
  }
}
