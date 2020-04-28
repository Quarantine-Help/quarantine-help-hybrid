import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewRequestsPage } from './view-requests.page';

const routes: Routes = [
  {
    path: '',
    component: ViewRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewRequestsPageRoutingModule {}
