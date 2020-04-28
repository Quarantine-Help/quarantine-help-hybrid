import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewRequestsPageRoutingModule } from './view-requests-routing.module';

import { ViewRequestsPage } from './view-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewRequestsPageRoutingModule
  ],
  declarations: [ViewRequestsPage]
})
export class ViewRequestsPageModule {}
