import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MiscService } from 'src/app/services/misc/misc.service';
import { LoginUserCred, LoginResponse } from '../../models/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  loginAni: HTMLIonLoadingElement;
  userData: LoginUserCred;
  loginForm: FormGroup;
  showPasswordText: boolean; // To toggle password visibility
  passwordIcon: 'eye' | 'eye-off' = 'eye';
  pageClean: boolean; // Flag to check if no changes were made.
  loginSubs: Subscription;
  loginResponse: LoginResponse;
  constructor(
    private authService: AuthService,
    public alertController: AlertController,
    private miscService: MiscService,
    private router: Router,
    private storageService: StorageService
  ) {
    this.pageClean = true;
    this.showPasswordText = false;
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.required,
      ]),
    });
  }

  ngOnInit() {
    this.loginSubs = this.loginForm.valueChanges.subscribe((change) => {
      this.pageClean = false;
    });
  }

  ngOnDestroy() {
    this.loginSubs.unsubscribe();
  }

  loginUser() {
    // start the loading animation
    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Checking credentials`,
      })
      .then((onLoadSuccess) => {
        this.loginAni = onLoadSuccess;
        this.loginAni.present();
        // call the login API
        const userCred: LoginUserCred = this.loginForm.value;
        this.authService
          .loginUser(userCred)
          .then((data: LoginResponse) => {
            this.storageService.setObject(
              'authToken',
              JSON.stringify(data.body.token)
            );
            this.loginAni.dismiss();
            this.router.navigate(['/quarantine-map']);
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
            // show the errors as alert
            this.handleLoginErrors(errorMessages, statusCode);
          });
      })
      .catch((error) => alert(error));
  }

  togglePasswordVisibility() {
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    if (this.passwordIcon === 'eye-off') {
      setTimeout(() => {
        this.passwordIcon = 'eye';
      }, 6000);
    }
  }

  handleLoginErrors(errorMessages: string[], statusCode) {
    console.log(...errorMessages, statusCode);
    this.miscService.presentAlert({ message: errorMessages.join('. ') });
  }

  registerUser() {
    console.log('go to register page');
  }
}
