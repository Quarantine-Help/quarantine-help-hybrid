import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectUserTypePage } from './select-user-type.page';

const routes: Routes = [
  {
    path: '',
    component: SelectUserTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectUserTypePageRoutingModule {}
