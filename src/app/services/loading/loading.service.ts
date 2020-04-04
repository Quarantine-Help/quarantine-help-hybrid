import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(public loadingController: LoadingController) {}

  async presentLoadingWithOptions(options?) {
    // Spinner types include : "bubbles" | "circles" | "circular" | "crescent" | "dots" | "lines" | "lines-small"
    // Refer https://ionicframework.com/docs/api/loading to find out
    // the default values and only add the diff. Also the see ...(rest
    // operator) is used here and will replace the existing value.
    let loadingElement: HTMLIonLoadingElement;
    try {
      loadingElement = await this.loadingController.create({
        spinner: 'bubbles',
        duration: 5000,
        message: 'Loader will dismiss in 5 seconds...',
        translucent: true,
        cssClass: 'custom-loading',
        ...options,
      });
      await loadingElement.present();
    } catch (error) {
      console.error('Error loading loader :D', error);
      loadingElement = undefined;
    }
    return loadingElement;
  }
}
