import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectUserTypePageRoutingModule } from './select-user-type-routing.module';

import { SelectUserTypePage } from './select-user-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectUserTypePageRoutingModule
  ],
  declarations: [SelectUserTypePage]
})
export class SelectUserTypePageModule {}
