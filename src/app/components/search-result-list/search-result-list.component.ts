import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AutoSuggestResultItem } from 'src/app/models/here-map-autosuggest';
@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss'],
})
export class SearchResultListComponent {
  @Input() show: boolean;
  @Input() searchResults: any;
  @Output() selectAddress: EventEmitter<
    AutoSuggestResultItem
  > = new EventEmitter<AutoSuggestResultItem>();
  constructor() {}

  handleAddressSelect(address) {
    console.log('handleAddressSelect : search-result-list-component', address);
    this.show = false;
    this.selectAddress.emit(address);
  }
}
