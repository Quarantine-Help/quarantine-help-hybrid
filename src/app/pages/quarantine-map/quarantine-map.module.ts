import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { QuarantineMapPage } from './quarantine-map';
import { MapFilterComponent } from '../../components/map-filter/map-filter.component';
import { RequestInfoModalComponent } from '../../components/request-info-modal/request-info-modal.component';
import { AddressSearchComponent } from 'src/app/components/address-search/address-search.component';
import { SearchResultListComponent } from 'src/app/components/search-result-list/search-result-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: QuarantineMapPage,
      },
    ]),
    SharedModule,
  ],
  declarations: [
    QuarantineMapPage,
    MapFilterComponent,
    RequestInfoModalComponent,
    AddressSearchComponent,
    SearchResultListComponent,
  ],
  entryComponents: [],
})
export class QuarantineMapPageModule {}
