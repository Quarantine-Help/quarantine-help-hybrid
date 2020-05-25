import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewRequestPage } from './view-request.page';

const routes: Routes = [
  {
    path: '',
    component: ViewRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestPageRoutingModule {}
