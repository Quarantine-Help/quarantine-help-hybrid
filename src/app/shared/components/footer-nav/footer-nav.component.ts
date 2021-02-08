import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserType } from 'src/app/models/core-api';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { defaultUserType } from 'src/app/constants/core-api';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss'],
})
export class FooterNavComponent implements OnInit, OnDestroy {
  @Input() currentTab: string;
  userType: UserType;
  component;
  isLoggedIn: boolean;
  authSubs: Subscription;
  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = false;
  }

  ngOnInit() {
    this.userType = defaultUserType;
    this.authSubs = this.authService.user.subscribe((user) => {
      if (user && user.email !== undefined && user.token !== undefined) {
        this.userType = user.type;
        this.isLoggedIn = true;
      } else {
        this.userType = defaultUserType;
        this.isLoggedIn = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubs) {
      this.authSubs.unsubscribe();
    }
  }

  onTabSelect(url) {
    this.router.navigateByUrl(url);
  }
}
