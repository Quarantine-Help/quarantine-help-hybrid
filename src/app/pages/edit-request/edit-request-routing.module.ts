import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditRequestPage } from './edit-request.page';

const routes: Routes = [
  {
    path: '',
    component: EditRequestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRequestPageRoutingModule {}
