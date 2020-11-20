import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { Router } from '@angular/router';

import { StorageKeys } from './constants/core-api';
import { StorageService } from './services/storage/storage.service';
import { UserType } from './models/core-api';
const { StatusBar, SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  hasUserOnboarded: boolean;
  userType: UserType;
  constructor(
    private platform: Platform,
    private storageService: StorageService,
    private router: Router
  ) {
    SplashScreen.show({
      autoHide: true,
    });
    this.initializeApp();
  }

  initializeApp() {
    this.hasUserOnboarded = false;
    this.userType = undefined;
    this.platform.ready().then(() => {
      this.storageService
        .getObject(StorageKeys.hasUserOnboarded)
        .then(({ hasUserOnboarded }) => {
          if (hasUserOnboarded) {
            this.hasUserOnboarded = hasUserOnboarded;
          }
          this.storageService
            .getObject(StorageKeys.authInfo)
            .then(({ type }) => {
              this.userType = type;
              this.resumeNavigation();
            });
        })
        .catch((error) => {
          console.log('Unable to get data from Storage', error);
          this.storageService
            .getObject(StorageKeys.authInfo)
            .then(({ type }) => {
              if (type) {
                this.userType = type;
              }
              this.resumeNavigation();
            })
            .catch((err) => {
              console.log('Unable to get data from Storage', err);
            });
        });
      if (this.platform.is('hybrid')) {
        StatusBar.setBackgroundColor({ color: 'white' });
        StatusBar.setStyle({ style: StatusBarStyle.Light });
        SplashScreen.hide();
      }
    });
  }

  resumeNavigation() {
    if (this.hasUserOnboarded === true && this.userType !== undefined) {
      if (this.userType === 'HL') {
        console.log('Onboarded HL to map');
        this.router.navigateByUrl('/map');
      } else if (this.userType === 'AF') {
        console.log('Onboarded AF to my-requests');
        this.router.navigateByUrl('/my-requests');
      }
    } else if (this.hasUserOnboarded === true && this.userType === undefined) {
      console.log('New onboarded user to register');
      this.router.navigateByUrl('/instructions');
    } else if (this.hasUserOnboarded === false) {
      console.log('Any new non-onboarded user goes to onboard');
      this.router.navigateByUrl('/onboarding');
    }
  }
}
