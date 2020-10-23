import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { SearchFilters, Categories } from 'src/app/models/here-map';
import { UserThemeColorPrimary } from 'src/app/models/ui';

@Component({
  selector: 'map-filter',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss'],
})
export class MapFilterComponent implements OnInit {
  @Input() showFiltering: boolean;
  @Output() filtersApplied: EventEmitter<SearchFilters> = new EventEmitter<
    SearchFilters
  >();
  distance: number;
  defaultDistance: number;
  showOptions: boolean;
  showClearFilter: boolean;
  category: Categories;
  userThemeColorPrimary: UserThemeColorPrimary;
  constructor() {
    this.defaultDistance = 5;
    this.distance = this.defaultDistance; // default search radius in kilometers.
    this.showOptions = true;
    this.showClearFilter = false;
    this.category = 'all';
    this.userThemeColorPrimary = 'primaryAF';
  }

  ngOnInit() {}

  // Show/hide filter options.
  toggleOptions() {
    if (this.distance === this.defaultDistance && this.category === 'all') {
      setTimeout(() => {
        this.showClearFilter = false;
      }, 200);
    }
    this.showOptions = !this.showOptions;
  }

  // Clears the category and distance filters to default value
  clearFilters() {
    this.category = 'all';
    // If the distance slider was used, we need to reset it, taking into consideration the additional change event.
    if (this.distance !== this.defaultDistance) {
      this.distance = 5;
      setTimeout(() => {
        this.showClearFilter = false;
      }, 500);
    } else {
      this.showClearFilter = false;
    }
  }

  // Shows the clear filters button if distance is changed.
  onDistanceChange(event) {
    this.showClearFilter = true;
  }

  // Select the category and show the clear filters button.
  selectCategory(category: Categories) {
    switch (category) {
      case 'all': {
        this.category = 'all';
        break;
      }
      case 'grocery': {
        // Toggle all, if medicine was already selected
        if (this.category === 'medicine') {
          this.category = 'all';
        } else {
          this.category = 'grocery';
        }
        break;
      }
      case 'medicine': {
        // Toggle all, if medicine was already selected
        if (this.category === 'grocery') {
          this.category = 'all';
        } else {
          this.category = 'medicine';
        }
        break;
      }
    }
  }

  // Applies the filters and collapses the filter options.
  applyFilters() {
    this.showOptions = false;
    this.filtersApplied.emit({
      distance: this.distance,
      category: this.category,
    });
  }
}
