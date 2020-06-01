import { NgModule } from '@angular/core';
import {
  PreloadAllModules,
  RouterModule,
  Routes,
  Route,
} from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { UserType } from './models/core-api';

interface CustomRouteData {
  expectedRoles: UserType[];
}
interface CustomRoute extends Route {
  data?: CustomRouteData;
  children?: CustomRoute[];
}

const routes: CustomRoute[] = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'user-reg',
    loadChildren: () =>
      import('./pages/user-registration/user-registration.module').then(
        (m) => m.UserRegistrationPageModule
      ),
  },
  {
    path: 'map',
    loadChildren: () =>
      import('./pages/quarantine-map/quarantine-map.module').then(
        (m) => m.QuarantineMapPageModule
      ),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    data: {
      expectedRoles: ['HL', 'AF', 'AU', 'TP'],
    },
    loadChildren: () =>
      import('./pages/user-profile/user-profile.module').then(
        (m) => m.UserProfilePageModule
      ),
  },
  {
    path: 'create-request',
    canActivate: [AuthGuard],
    data: {
      expectedRoles: ['AF'],
    },
    loadChildren: () =>
      import('./pages/create-request/create-request.module').then(
        (m) => m.CreateRequestPageModule
      ),
  },
  {
    path: 'view-request/:id',
    canActivate: [AuthGuard],
    data: {
      expectedRoles: ['HL', 'AF', 'AU', 'TP'],
    },
    loadChildren: () =>
      import('./pages/view-request/view-request.module').then(
        (m) => m.ViewRequestPageModule
      ),
  },
  {
    path: 'my-requests',
    canActivate: [AuthGuard],
    data: {
      expectedRoles: ['HL', 'AF', 'AU', 'TP'],
    },
    loadChildren: () =>
      import('./pages/my-requests/my-requests.module').then(
        (m) => m.MyRequestsPageModule
      ),
  },
  { path: '**', redirectTo: 'map' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
