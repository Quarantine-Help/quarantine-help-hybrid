import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestPageRoutingModule } from './view-request-routing.module';

import { ViewRequestPage } from './view-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestPageRoutingModule
  ],
  declarations: [ViewRequestPage]
})
export class RequestPageModule {}
