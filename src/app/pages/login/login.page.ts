import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginUserCred } from '../../models/auth';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginAni: HTMLIonLoadingElement;
  constructor(
    private authService: AuthService,
    public alertController: AlertController,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {}

  loginUser() {
    this.loadingService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Checking credentials`,
      })
      .then((onLoadSuccess) => {
        this.loginAni = onLoadSuccess;
        this.loginAni.present();

        // call the login API
        const userCred: LoginUserCred = {
          email: 'jg@patientcom',
          password: 'jgg',
        };
        this.authService
          .loginUser(userCred)
          .then((data) => {
            console.log(JSON.stringify(data));
          })
          .catch((errorObj) => {
            this.loginAni.dismiss();
            const { error, status: statusCode } = errorObj;
            const errorMessages: string[] = [];
            for (const key in error) {
              if (error.hasOwnProperty(key) && typeof key !== 'function') {
                console.error(error[key][0]);
                errorMessages.push(error[key][0]);
              }
            }
            this.handleLoginErrors(errorMessages, statusCode);
          });
      })
      .catch((error) => alert(error));
  }

  handleLoginErrors(errorMessages: string[], statusCode) {
    console.log(...errorMessages, statusCode);
    this.presentAlert(...errorMessages);
  }

  registerUser() {
    console.log('register');
  }

  async presentAlert(messages = 'Unknown error !') {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Unable to login',
      // message: `The following error occurred: ${messages} Please try again`,
      message: messages,
      buttons: ['Try again'],
    });

    await alert.present();
  }
}
