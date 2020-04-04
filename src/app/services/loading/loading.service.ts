import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(private loadingController: LoadingController) {}

  presentLoadingWithOptions(options?): Promise<HTMLIonLoadingElement> {
    // Spinner types include : "bubbles" | "circles" | "circular" | "crescent" | "dots" | "lines" | "lines-small"
    // Refer https://ionicframework.com/docs/api/loading to find out the default values and only add the diff. Also the see ...(rest
    // operator) is used here and will replace the existing value.
    return this.loadingController.create({
      spinner: 'bubbles',
      duration: 5000,
      message: 'Loader will dismiss in 5 seconds...',
      translucent: true,
      cssClass: 'custom-loading',
      ...options,
    });
  }
}
