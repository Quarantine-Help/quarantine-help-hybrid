import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'quarantine-map', pathMatch: 'full' },
  {
    path: 'quarantine-map',
    loadChildren: () =>
      import('./pages/quarantine-map/quarantine-map.module').then(
        m => m.QuarantineMapPageModule
      )
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
