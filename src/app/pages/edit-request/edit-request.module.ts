import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditRequestPageRoutingModule } from './edit-request-routing.module';

import { EditRequestPage } from './edit-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditRequestPageRoutingModule,
  ],
  declarations: [EditRequestPage],
})
export class EditRequestPageModule {}
