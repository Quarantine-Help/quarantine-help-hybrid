import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { AuthService } from '../services/auth/auth.service';
import { MiscService } from '../services/misc/misc.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private authService: AuthService,
    private miscService: MiscService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const expectedRoles: string[] = next.data.expectedRoles;
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        if (user && user.email !== undefined && user.token !== undefined) {
          if (expectedRoles.includes(user.type)) {
            return true;
          } else {
            this.miscService.presentAlert({
              header: 'Sorry, page disabled',
              subHeader: null,
              message:
                'You need to be registered as a different type of user in order to access the page.',
              buttons: ['Ok'],
            });
            return false;
          }
        } else {
          this.miscService.presentAlert({
            header: 'Authentication Required',
            subHeader: 'Please Login',
            message:
              'You need to be logged in to be able to use this feature.',
            buttons: ['Ok'],
          });
          return this.router.parseUrl('/login');
        }
      })
    );
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
}
