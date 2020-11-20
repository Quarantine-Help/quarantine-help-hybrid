import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserThemeColorPrimary } from 'src/app/models/ui';
import { UserType } from 'src/app/models/core-api';
import { AuthService } from 'src/app/services/auth/auth.service';
import { defaultUserType } from 'src/app/constants/core-api';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.page.html',
  styleUrls: ['./app-settings.page.scss'],
})
export class AppSettingsPage implements OnInit {
  userType: UserType;
  authSubs: Subscription;
  userThemeColorPrimary: UserThemeColorPrimary;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userThemeColorPrimary = 'primaryAF';
    this.userType = 'AF';

    this.authSubs = this.authService.user.subscribe((user) => {
      if (user && user.email !== undefined && user.token !== undefined) {
        this.userType = user.type;
        this.userThemeColorPrimary =
          this.userType === 'AF' ? 'primaryAF' : 'primaryHL';
      } else {
        this.userType = defaultUserType;
      }
    });
  }
}
