import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateRequestPage } from './create-request.page';

const routes: Routes = [
  {
    path: '',
    component: CreateRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateRequestPageRoutingModule {}
