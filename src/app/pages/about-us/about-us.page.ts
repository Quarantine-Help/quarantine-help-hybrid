import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { defaultUserType } from 'src/app/constants/core-api';
import { UserType } from 'src/app/models/core-api';
import { UserThemeColorPrimary } from 'src/app/models/ui';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
  userType: UserType;
  authSubs: Subscription;
  userThemeColorPrimary: UserThemeColorPrimary;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubs = this.authService.user.subscribe((user) => {
      if (user && user.email !== undefined && user.token !== undefined) {
        this.userType = user.type;
      } else {
        this.userType = defaultUserType;
      }
    });

    this.userThemeColorPrimary =
      this.userType === 'AF' ? 'primaryAF' : 'primaryHL';
  }
}
