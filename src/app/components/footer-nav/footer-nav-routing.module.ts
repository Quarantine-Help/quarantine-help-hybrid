import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FooterNavPage } from './footer-nav.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: FooterNavPage,
    children: [
      {
        path: 'my-requests',
        redirectTo: '/my-requests',
        pathMatch: 'full',
      },
      {
        path: 'settings',
        redirectTo: '/settings',
        pathMatch: 'full',
      },
      {
        path: 'login',
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FooterNavPageRoutingModule {}
