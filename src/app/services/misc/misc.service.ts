import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

import { AlertOptions, LoadingOptions } from '../../models/ionic';

@Injectable({
  providedIn: 'root',
})
export class MiscService {
  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  presentLoadingWithOptions(
    options?: LoadingOptions
  ): Promise<HTMLIonLoadingElement> {
    // Spinner types include : "bubbles" | "circles" | "circular" | "crescent" | "dots" | "lines" | "lines-small"
    // Refer https://ionicframework.com/docs/api/loading to find out the default values and only add the diff. Also the see ...(rest
    // operator) is used here and will replace the existing value.
    return this.loadingController.create({
      spinner: 'bubbles',
      duration: 5000,
      message: 'Loader will dismiss in 5 seconds...',
      translucent: true,
      cssClass: 'alert-backdrop',
      ...options,
    });
  }

  async presentAlert(options: AlertOptions) {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Login failed !',
      message: 'Unknown error !',
      cssClass: 'alert-backdrop',
      buttons: ['Try again'],
      ...options,
    });
    await alert.present();
  }

  presentToastWithOptions(options?) {
    return this.toastController.create({
      message: 'Click to Close',
      position: 'bottom',
      cssClass: 'toast-service-class',
      buttons: [
        {
          side: 'end',
          icon: 'refresh-outline',
          text: 'Retry',
          cssClass: 'toast-retry-class',
          handler: () => {
            console.log('Retry clicked');
          },
        },
        {
          side: 'start',
          cssClass: 'toast-cancel-class',
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
      ...options,
    });
  }
}
