import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserThemeColorPrimary } from 'src/app/models/ui';
import { UserType } from 'src/app/models/core-api';
import { AuthService } from 'src/app/services/auth/auth.service';
import { defaultUserType, defaultPrimaryColor } from 'src/app/constants/core-api';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.page.html',
  styleUrls: ['./app-settings.page.scss'],
})
export class AppSettingsPage implements OnInit {
  userType: UserType;
  authSubs: Subscription;
  userThemeColorPrimary: UserThemeColorPrimary;
  isLoggedIn: boolean;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.userThemeColorPrimary = defaultPrimaryColor;
    this.userType = defaultUserType;
    this.isLoggedIn = false;

    this.authSubs = this.authService.user.subscribe((user) => {
      if (user && user.email !== undefined && user.token !== undefined) {
        this.userType = user.type;
        this.isLoggedIn = true;
        this.userThemeColorPrimary =
          this.userType === 'AF' ? 'primaryAF' : 'primaryHL';
      } else {
        this.isLoggedIn = false;
        this.userType = defaultUserType;
        this.userThemeColorPrimary = defaultPrimaryColor;
      }
    });
  }

  authAction() {
    if (this.isLoggedIn) {
      this.authService.logOutUser().then(() => {
        this.router.navigateByUrl('/login');
      });
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
