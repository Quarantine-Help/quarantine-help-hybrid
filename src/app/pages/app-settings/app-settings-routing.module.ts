import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppSettingsPage } from './app-settings.page';

const routes: Routes = [
  {
    path: '',
    component: AppSettingsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppSettingsPageRoutingModule {}
