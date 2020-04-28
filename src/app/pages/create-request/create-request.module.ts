import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateRequestPageRoutingModule } from './create-request-routing.module';

import { CreateRequestPage } from './create-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateRequestPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateRequestPage]
})
export class CreateRequestPageModule {}
