import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppSettingsPageRoutingModule } from './app-settings-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppSettingsPage } from './app-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AppSettingsPageRoutingModule,
  ],
  declarations: [AppSettingsPage],
})
export class AppSettingsPageModule {}
