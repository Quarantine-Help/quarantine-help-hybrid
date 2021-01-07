import { Component, Output, EventEmitter } from '@angular/core';

import { AutoSuggestResultItem } from 'src/app/models/here-map-autosuggest';
import { MiscService } from 'src/app/shared/services/misc/misc.service';
@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss'],
})
export class SearchResultListComponent {
  show: boolean;
  searchResults: AutoSuggestResultItem[];
  @Output() selectAddress: EventEmitter<
    AutoSuggestResultItem
  > = new EventEmitter<AutoSuggestResultItem>();
  constructor(public miscService: MiscService) {
    this.show = false;
    this.miscService.addressResult.subscribe((addresses) => {
      this.searchResults = addresses;
      this.show = this.searchResults.length !== 0;
    });
  }

  handleAddressSelect(addresses) {
    this.selectAddress.emit(addresses);
    this.show = false;
    this.miscService.clearAddressSearchResult();
  }
}
