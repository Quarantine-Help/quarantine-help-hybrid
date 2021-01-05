import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { SearchFilters, Category } from 'src/app/models/here-map';
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
  categories: Category[];
  userThemeColorPrimary: UserThemeColorPrimary;
  constructor() {
    this.defaultDistance = 5;
    this.distance = this.defaultDistance; // default search radius in kilometers.
    this.showOptions = true;
    this.showClearFilter = false;
    this.categories = ['all'];
    this.userThemeColorPrimary = 'primaryAF';
  }

  ngOnInit() {}

  // Show/hide filter options.
  toggleOptions() {
    if (
      this.distance === this.defaultDistance &&
      this.categories.includes('all')
    ) {
      setTimeout(() => {
        this.showClearFilter = false;
      }, 200);
    }
    this.showOptions = !this.showOptions;
  }

  // Clears the category and distance filters to default value
  clearFilters() {
    this.categories = ['all'];
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
  selectCategory(category: Category) {
    const hasOther = this.categories.includes('other');
    const hasMedicine = this.categories.includes('medicine');
    const hasGrocery = this.categories.includes('grocery');

    switch (category) {
      case 'all': {
        this.categories = ['all'];
        break;
      }
      case 'grocery': {
        // Toggle all, if medicine and other was already selected
        if (hasMedicine && hasOther) {
          this.categories = ['all'];
        } else {
          if (this.categories.includes('all')) {
            this.categories.splice(this.categories.indexOf('all'), 1);
          }
          this.categories.push('grocery');
        }
        break;
      }
      case 'medicine': {
        // Toggle all, if grocery and other was already selected
        if (hasGrocery && hasOther) {
          this.categories = ['all'];
        } else {
          if (this.categories.includes('all')) {
            this.categories.splice(this.categories.indexOf('all'), 1);
          }
          this.categories.push('medicine');
        }
        break;
      }
      case 'other': {
        // Toggle all, if medicine & grocery was already selected
        if (hasGrocery && hasMedicine) {
          this.categories = ['all'];
        } else {
          if (this.categories.includes('all')) {
            this.categories.splice(this.categories.indexOf('all'), 1);
          }
          this.categories.push('other');
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
      categories: this.categories,
    });
  }
}
