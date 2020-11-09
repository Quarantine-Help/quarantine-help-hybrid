import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { Router } from '@angular/router';

import { StorageService } from './services/storage/storage.service';
const { StatusBar, SplashScreen } = Plugins;
const HAS_ONBOARDED_STORAGE_KEY = 'hasOnboarded';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  hasUserOnboarded: boolean;
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
    this.platform.ready().then(() => {
      this.storageService
        .getObject(HAS_ONBOARDED_STORAGE_KEY)
        .then(({ hasOnboarded }) => {
          this.hasUserOnboarded = hasOnboarded;
          this.resumeNavigation();
        });
      if (this.platform.is('hybrid')) {
        StatusBar.setBackgroundColor({ color: 'white' });
        StatusBar.setStyle({ style: StatusBarStyle.Light });
        SplashScreen.hide();
      }
    });
  }

  resumeNavigation() {
    // if (this.hasUserOnboarded) {
    //   console.log('to map');
    //   this.router.navigateByUrl('/map');
    // } else {
    //   console.log('to onboard');
    //   this.router.navigateByUrl('/onboarding');
    // }
  }
}
