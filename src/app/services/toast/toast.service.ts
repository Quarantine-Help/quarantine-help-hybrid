import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}
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
