import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  NavigationStart,
  Event as NavigationEvent,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { UserType } from 'src/app/models/core-api';
import { AuthService } from 'src/app/services/auth/auth.service';
import { defaultUserType } from 'src/app/constants/core-api';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.page.html',
  styleUrls: ['./footer-nav.page.scss'],
})
export class FooterNavPage implements OnInit, OnDestroy {
  userType: UserType;
  currentTab: string;
  showTabs: boolean;
  isLoggedIn: boolean;
  authSubs: Subscription;
  constructor(private router: Router, private authService: AuthService) {
    this.showTabs = false;
    this.isLoggedIn = false;
  }

  ngOnInit() {
    this.userType = defaultUserType;
    this.currentTab = '';

    this.authSubs = this.authService.user.subscribe((user) => {
      if (user && user.email !== undefined && user.token !== undefined) {
        this.userType = user.type;
        this.isLoggedIn = true;
      } else {
        this.userType = defaultUserType;
        this.isLoggedIn = false;
      }
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: any) => {
        const { url } = event;
        this.currentTab = url;
        console.log(url);
        this.handlePageChange(url);
      });
  }

  handlePageChange(url) {
    switch (url) {
      case '/my-requests': {
        this.showTabs = true;
        break;
      }
      case '/settings': {
        this.showTabs = true;
        break;
      }
      case '/map': {
        this.showTabs = true;
        break;
      }
      default:
        this.showTabs = false;
    }
  }

  ngOnDestroy() {
    if (this.authSubs) {
      this.authSubs.unsubscribe();
    }
  }
}
