import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewRequestPageRoutingModule } from './view-request-routing.module';

import { ViewRequestPage } from './view-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewRequestPageRoutingModule
  ],
  declarations: [ViewRequestPage]
})
export class ViewRequestPageModule {}
