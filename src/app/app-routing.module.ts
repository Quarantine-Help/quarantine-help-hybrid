import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Route } from '@angular/router';

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
  { path: '', redirectTo: 'onboarding', pathMatch: 'full' },
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
    path: 'view-request',
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
  {
    path: 'select-user-type',
    loadChildren: () =>
      import('./pages/select-user-type/select-user-type.module').then(
        (m) => m.SelectUserTypePageModule
      ),
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('./pages/onboarding/onboarding.module').then(
        (m) => m.OnboardingPageModule
      ),
  },
  {
    path: 'about-us',
    loadChildren: () =>
      import('./pages/about-us/about-us.module').then(
        (m) => m.AboutUsPageModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/app-settings/app-settings.module').then(
        (m) => m.AppSettingsPageModule
      ),
  },
  {
    path: 'instructions',
    loadChildren: () =>
      import('./pages/safety-instructions/safety-instructions.module').then(
        (m) => m.SafetyInstructionsPageModule
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
