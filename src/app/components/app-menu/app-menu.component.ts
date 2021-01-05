import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterEvent, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserType } from 'src/app/models/core-api';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserThemeColorPrimary } from 'src/app/models/ui';
import {
  defaultUserType,
  defaultPrimaryColor,
} from 'src/app/constants/core-api';

type Language = 'en' | 'de';
@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
})
export class AppMenuComponent implements OnInit, OnDestroy {
  pages: {
    name: string;
    icon: string;
    path: string;
    expectedRoles?: UserType[];
  }[];
  permittedPages: {
    name: string;
    icon: string;
    path: string;
    expectedRoles?: UserType[];
  }[];
  activePath: string;
  language: Language;
  languages: { name: string; value: Language }[];
  isLoggedIn: boolean;
  authSubs: Subscription;
  userType: UserType | '';
  userThemeColorPrimary: UserThemeColorPrimary;
  constructor(private router: Router, private authService: AuthService) {
    this.languages = [
      { name: 'English', value: 'en' },
      { name: 'Deutsch', value: 'de' },
    ];
    this.language = 'en';
    this.pages = [
      {
        name: 'Home',
        icon: 'home',
        path: '/map',
      },
      {
        name: 'Search',
        icon: 'search',
        path: '/map/:search',
      },
      {
        name: 'My Requests',
        icon: 'help-buoy-outline',
        path: '/my-requests',
        expectedRoles: ['HL', 'AF', 'AU', 'TP'], // must correspond to the routes in routing module
      },
      {
        name: 'Create Request',
        icon: 'add-circle-outline',
        path: '/create-request',
        expectedRoles: ['AF'], // must correspond to the routes in routing module
      },
      {
        name: 'My Profile',
        icon: 'person',
        path: '/profile',
        expectedRoles: ['HL', 'AF', 'AU', 'TP'], // must correspond to the routes in routing module
      },
    ];
    this.userThemeColorPrimary = defaultPrimaryColor;
  }

  ngOnInit() {
    this.isLoggedIn = false;

    this.permittedPages = [...this.pages];
    this.authSubs = this.authService.user.subscribe((user) => {
      if (user && user.email !== undefined && user.token !== undefined) {
        this.userType = user.type;
        this.isLoggedIn = true;
        this.permittedPages = this.pages.filter((page) => {
          if (page.expectedRoles && page.expectedRoles.length > 0) {
            return page.expectedRoles.includes(this.userType as any);
          } else {
            return true;
          }
        });
      } else {
        this.isLoggedIn = false;
        this.userType = defaultUserType;
      }
    });

    this.router.events.subscribe((event: RouterEvent) => {
      if (event.url) {
        this.activePath = event.url;
      }
    });
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }

  isPermitted({ expectedRoles = '' }) {
    if (expectedRoles === '' || this.userType === '') {
      return true;
    } else if (this.userType !== undefined) {
      return expectedRoles.includes(this.userType);
    }
  }

  authAction() {
    console.log('Log out clicked');
    if (this.isLoggedIn) {
      this.authService.logOutUser().then(() => {
        this.router.navigateByUrl('/login');
      });
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
