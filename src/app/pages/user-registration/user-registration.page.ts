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
import { Crisis, defaultUserType } from 'src/app/constants/core-api';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { isoCountry3To2Mapping } from 'src/app/constants/countries';

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
  authSubs: Subscription;
  searchResult: {};
  displayAddressSearch: boolean;
  addressList: [];
  hasSelectedAddress: boolean;
  addressDetails: any;
  loadingAddressData: HTMLIonLoadingElement;
  loadingData: HTMLIonLoadingElement;

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
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
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
    this.authSubs = this.authService.user.subscribe((user) => {
      if (user && user.email !== undefined && user.token !== undefined) {
        this.userType = user.type;
      } else {
        this.userType = defaultUserType;
      }
    });

    this.hasSelectedAddress = false;
    this.regForm
      .get('address')
      .valueChanges.pipe(
        filter(
          (searchInput) => searchInput.length > 2 && !this.hasSelectedAddress
        ),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        console.log(value);
        this.findAddress(value);
      });
    this.addressList = [];
    this.showPasswordText = false;
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
    this.authSubs.unsubscribe();
  }

  togglePasswordVisibility() {
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    if (this.passwordIcon === 'eye-off') {
      setTimeout(() => {
        this.passwordIcon = 'eye';
      }, 10000);
    }
  }

  findAddress(searchWord) {
    this.displayAddressSearch = true;
    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Fetching Address`,
      })
      .then((onLoadSuccess) => {
        this.loadingAddressData = onLoadSuccess;
        this.loadingAddressData.present();
        this.hereMapService
          .getUserAddressOnSearch(this.currentLocation, searchWord)
          .then((data: any) => {
            // Dismiss & destroy loading controller on
            if (this.loadingAddressData !== undefined) {
              this.loadingAddressData.dismiss().then(() => {
                this.loadingAddressData = undefined;
              });
            }
            this.addressList = data.body.items;
          });
      });
  }

  setSelectedAddress(item) {
    this.hasSelectedAddress = true;
    this.regForm.patchValue({
      address: item.address.label,
    });
    this.displayAddressSearch = false;
    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Loading`,
      })
      .then((onLoadSuccess) => {
        this.loadingData = onLoadSuccess;
        this.loadingData.present();
        this.hereMapService.getAddressDetails(item.id).then((data: any) => {
          // Dismiss & destroy loading controller on
          if (this.loadingData !== undefined) {
            this.loadingData.dismiss().then(() => {
              this.loadingData = undefined;
            });
          }
          this.addressDetails = data.body.address;
          this.userAddress = {
            address: data.body.address.label,
            city: data.body.address.city,
            countryCode: data.body.address.countryCode,
            country: data.body.address.countryName,
            postCode: data.body.address.postalCode,
            placeId: data.body.id,
          };

          // set the values to the form
          this.regForm.get('city').setValue(this.userAddress.city);
          this.regForm.get('country').setValue(this.userAddress.country);
          this.regForm.get('postCode').setValue(this.userAddress.postCode);
        });
      });
  }

  getGPSLocation() {
    // If GPS data already exists, use it.
    if (this.currentLocation) {
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
      secondLineOfAddress: undefined,
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
    userData.firstLineOfAddress = this.regForm.get('address').value;
    userData.phone = this.regForm.get('phoneNumber').value;
    userData.position = {
      latitude: this.currentLocation.lat as any,
      longitude: this.currentLocation.lng as any,
    };
    userData.type = this.userType;
    userData.placeId = this.userAddress.placeId;
    userData.country = this.getISO2CountryCode(this.addressDetails.countryCode);

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

  getISO2CountryCode(iso3CountryCode) {
    return isoCountry3To2Mapping[iso3CountryCode];
  }

  handleLoginErrors(errorMessages: string[], statusCode) {
    console.log(...errorMessages, statusCode);
    this.miscService.presentAlert({ message: errorMessages.join('. ') });
  }
}
