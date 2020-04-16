import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { QuarantineMapPage } from './quarantine-map';
import { MapFilterComponent } from '../../components/map-filter/map-filter.component';

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
  ],
  declarations: [QuarantineMapPage, MapFilterComponent],
  exports: [MapFilterComponent],
})
export class QuarantineMapPageModule {}
