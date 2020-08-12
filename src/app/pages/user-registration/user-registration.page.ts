import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserType } from 'src/app/models/core-api';
import { GeoLocationService } from 'src/app/services/geo-location/geo-location.service';
import { MiscService } from 'src/app/services/misc/misc.service';
import { HEREMapService } from 'src/app/services/HERE-map/here-map.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LatLng } from '../../models/geo';
import { ReverseGeoResult } from 'src/app/models/here-map';
import { UserRegData, UserRegResponse } from 'src/app/models/auth';
import { Crisis } from 'src/app/constants/core-api';

interface UserAddress {
  address: string;
  city: string;
  country: string;
  countryCode: string;
  postCode: string;
  placeId: string;
}
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.page.html',
  styleUrls: ['./user-registration.page.scss'],
})
export class UserRegistrationPage implements OnInit, OnDestroy {
  userType: UserType;
  regForm: FormGroup;
  regFormSubs: Subscription;
  regFormClean: boolean; // Flag to check if no changes were made.
  showPasswordText: boolean; // To toggle password visibility
  passwordIcon: 'eye' | 'eye-off' = 'eye';
  currentLocation: LatLng = undefined;
  userAddress: UserAddress;
  toastElement: Promise<void>;
  loadingAniGPSData: HTMLIonLoadingElement;
  loadingAniGetAddr: HTMLIonLoadingElement;
  userRegAni: HTMLIonLoadingElement;

  constructor(
    private geoLocationService: GeoLocationService,
    private miscService: MiscService,
    private hereMapService: HEREMapService,
    private router: Router,
    private authService: AuthService
  ) {
    this.regForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      address1: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      address2: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      city: new FormControl('', [Validators.required, Validators.minLength(2)]),
      postCode: new FormControl('', [Validators.required]),
      country: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.email,
      ]),
      phoneNumber: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.required,
      ]),
    });
  }

  ngOnInit() {
    this.showPasswordText = false;
    // TODO: get user type
    this.userType = 'HL';
    this.userAddress = undefined;
    this.regFormSubs = this.regForm.valueChanges.subscribe((change) => {
      this.regFormClean = false;
    });

    // Provide user with instructions on filling the form.
    this.miscService.presentAlert({
      header: 'Info',
      subHeader: 'Registration Options',
      buttons: ['Ok'],
      message: `Please select <strong>I'm Quarantined</strong> if you are in quarantine and require assistance from volunteers.
      <br><br>You may continue in the <strong>I Volunteer</strong> tab otherwise.`,
    });

    // Start the loading animation for getting GPS data
    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Getting current location.`,
      })
      .then((onLoadSuccess) => {
        this.loadingAniGPSData = onLoadSuccess;
        // Get the GPS data
        this.getGPSLocation();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  ngOnDestroy() {
    this.regFormSubs.unsubscribe();
  }

  togglePasswordVisibility() {
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    if (this.passwordIcon === 'eye-off') {
      setTimeout(() => {
        this.passwordIcon = 'eye';
      }, 10000);
    }
  }

  getGPSLocation() {
    // If GPS data already exists, use it.
    if (this.currentLocation) {
      this.getUserAddress();
    } else {
      this.loadingAniGPSData.present();
      this.geoLocationService
        .getCurrentPosition()
        .then((location) => {
          // Destroy loading controller on dismiss
          if (this.loadingAniGPSData !== undefined) {
            this.loadingAniGPSData.dismiss().then(() => {
              this.loadingAniGPSData = undefined;
            });
          }
          this.currentLocation = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          };
          this.getUserAddress();
        })
        .catch((error) => {
          console.error(`ERROR - Unable to getting location`, error);
          // Destroy loading controller on dismiss and ask for a retry
          if (this.loadingAniGPSData) {
            this.loadingAniGPSData.dismiss().then(() => {
              this.loadingAniGPSData = undefined;
            });
          }
          // Show error message and retry option on GPS fail
          this.miscService
            .presentToastWithOptions({
              message: error.message,
              color: 'secondary',
            })
            .then((toast) => {
              this.toastElement = toast.present();
              toast.onWillDismiss().then((OverlayEventDetail) => {
                if (OverlayEventDetail.role === 'cancel') {
                  // this.exitApp();
                } else {
                  this.getGPSLocation();
                }
              });
            });
        });
    }
  }

  getUserAddress() {
    // call reverse-geo code iff the user address does not exist
    if (this.userAddress) {
      this.regForm.get('address1').setValue(this.userAddress.address);
      this.regForm.get('city').setValue(this.userAddress.city);
      this.regForm.get('country').setValue(this.userAddress.country);
    } else {
      this.miscService
        .presentLoadingWithOptions({
          duration: 0,
          message: `Getting user address`,
        })
        .then((onLoadSuccess) => {
          this.loadingAniGetAddr = onLoadSuccess;
          this.loadingAniGetAddr.present();
          // Get the user address
          this.hereMapService
            .getUserAddress(this.currentLocation)
            .then((data: ReverseGeoResult) => {
              // Destroy loading controller on dismiss
              if (this.loadingAniGetAddr !== undefined) {
                this.loadingAniGetAddr.dismiss().then(() => {
                  this.loadingAniGetAddr = undefined;
                });
              }
              const geoDataObj = data.body.Response.View[0].Result[0].Location;
              this.userAddress = {
                address: geoDataObj.Address.Label,
                city: geoDataObj.Address.City,
                countryCode: geoDataObj.Address.AdditionalData[0].value,
                country: geoDataObj.Address.AdditionalData[1].value,
                postCode: geoDataObj.Address.PostalCode,
                placeId: geoDataObj.LocationId,
              };
              // set the values to the form
              this.regForm.get('address1').setValue(this.userAddress.address);
              this.regForm.get('city').setValue(this.userAddress.city);
              this.regForm.get('country').setValue(this.userAddress.country);
              this.regForm.get('postCode').setValue(this.userAddress.postCode);
            });
        })
        .catch((error) => {
          console.error('Error getting address', error);
          // Destroy loading controller on dismiss.
          if (this.loadingAniGetAddr) {
            this.loadingAniGetAddr.dismiss().then(() => {
              this.loadingAniGetAddr = undefined;
            });
          }
        });
    }
  }

  registerUser() {
    const userData: UserRegData = {
      user: undefined,
      type: undefined,
      phone: undefined,
      placeId: undefined,
      postCode: undefined,
      city: undefined,
      country: undefined,
      position: undefined,
      firstLineOfAddress: undefined,
      secondLineOfAddress: '',
      crisis: Crisis.COVID19,
    };

    userData.user = {
      firstName: this.regForm.get('firstName').value,
      lastName: this.regForm.get('lastName').value,
      email: this.regForm.get('email').value,
      password: this.regForm.get('password').value,
    };
    userData.city = this.regForm.get('city').value;
    userData.postCode = this.regForm.get('postCode').value;
    userData.firstLineOfAddress = this.regForm.get('address1').value;
    userData.secondLineOfAddress = this.regForm.get('address2').value;
    userData.phone = this.regForm.get('phoneNumber').value;
    userData.position = {
      latitude: this.currentLocation.lat as any,
      longitude: this.currentLocation.lng as any,
    };
    userData.type = this.userType;
    userData.placeId = this.userAddress.placeId;
    userData.country = this.userAddress.countryCode;

    // start the loading animation
    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Registering user`,
      })
      .then((onLoadSuccess) => {
        this.userRegAni = onLoadSuccess;
        this.userRegAni.present();

        // call the register API
        this.authService
          .registerUser(userData)
          .then((response: UserRegResponse) => {
            this.userRegAni.dismiss();
            this.router.navigate(['/login']);
          })
          .catch((errorObj) => {
            this.userRegAni.dismiss();
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
      .catch((error) => console.error(error));
  }

  handleLoginErrors(errorMessages: string[], statusCode) {
    console.log(...errorMessages, statusCode);
    this.miscService.presentAlert({ message: errorMessages.join('. ') });
  }
}
