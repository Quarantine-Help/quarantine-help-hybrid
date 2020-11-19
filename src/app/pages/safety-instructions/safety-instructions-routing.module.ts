import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SafetyInstructionsPage } from './safety-instructions.page';

const routes: Routes = [
  {
    path: '',
    component: SafetyInstructionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SafetyInstructionsPageRoutingModule {}
