import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  defaultUserType,
  defaultPrimaryColor,
} from 'src/app/constants/core-api';
import { UserType } from 'src/app/models/core-api';
import { UserThemeColorPrimary } from 'src/app/models/ui';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-safety-instructions',
  templateUrl: './safety-instructions.page.html',
  styleUrls: ['./safety-instructions.page.scss'],
})
export class SafetyInstructionsPage implements OnInit {
  userType: UserType;
  authSubs: Subscription;
  userThemeColorPrimary: UserThemeColorPrimary;
  isLoggedIn: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = false;
    this.userType = defaultUserType;
    this.userThemeColorPrimary = defaultPrimaryColor;

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
}
