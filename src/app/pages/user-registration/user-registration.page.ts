import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { GeoLocationService } from 'src/app/services/geo-location/geo-location.service';
import { MiscService } from 'src/app/services/misc/misc.service';
import { HEREMapService } from 'src/app/services/HERE-map/here-map.service';
import { LatLng } from '../../models/geo';
import { ReverseGeoResult } from 'src/app/models/here-map';
import { Router } from '@angular/router';

type userSegments = 'volunteer' | 'quarantined';
interface UserAddress {
  address: string;
  city: string;
  country: string;
}
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.page.html',
  styleUrls: ['./user-registration.page.scss'],
})
export class UserRegistrationPage implements OnInit, OnDestroy {
  userSegment: userSegments;
  volRegForm: FormGroup;
  quaRegForm: FormGroup;
  volRegFormSubs: Subscription;
  quaRegFormSubs: Subscription;
  volFormClean: boolean; // Flag to check if no changes were made.
  quaFormClean: boolean;
  showPasswordText: boolean; // To toggle password visibility
  passwordIcon: 'eye' | 'eye-off' = 'eye';
  toastElement: Promise<void>;
  loadingAniGPSData: HTMLIonLoadingElement;
  loadingAniGetAddr: HTMLIonLoadingElement;
  currentLocation: LatLng = undefined;
  userAddress: UserAddress;

  constructor(
    private geoLocationService: GeoLocationService,
    private miscService: MiscService,
    private hereMapService: HEREMapService,
    private router: Router
  ) {
    this.volRegForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
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
    this.quaRegForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      city: new FormControl('', [Validators.required, Validators.minLength(2)]),
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
    this.userSegment = 'volunteer';
    this.userAddress = undefined;
    this.volRegFormSubs = this.volRegForm.valueChanges.subscribe((change) => {
      this.volFormClean = false;
    });
    this.quaRegFormSubs = this.quaRegForm.valueChanges.subscribe((change) => {
      this.quaFormClean = false;
    });

    // Provide user with instructions on filling the form.
    this.miscService.presentAlert({
      header: 'Info',
      subHeader: 'Registration Options',
      buttons: ['Ok'],
      message: `Please select <strong>I'm Quarantined</strong> if you are in quarantine and require assistance from volunteers.
      <br><br>You may continue in the <strong>I Volunteer</strong> tab otherwise.`,
    });
  }

  ngOnDestroy() {
    this.volRegFormSubs.unsubscribe();
    this.quaRegFormSubs.unsubscribe();
  }

  togglePasswordVisibility() {
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    if (this.passwordIcon === 'eye-off') {
      setTimeout(() => {
        this.passwordIcon = 'eye';
      }, 10000);
    }
  }

  onSegmentChange() {
    if (this.userSegment === 'quarantined') {
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
        .catch((error) => alert(error));
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
      this.quaRegForm.get('address').setValue(this.userAddress.address);
      this.quaRegForm.get('city').setValue(this.userAddress.city);
      this.quaRegForm.get('country').setValue(this.userAddress.country);
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
              console.log(data);
              // Destroy loading controller on dismiss
              if (this.loadingAniGetAddr !== undefined) {
                this.loadingAniGetAddr.dismiss().then(() => {
                  this.loadingAniGetAddr = undefined;
                });
              }
              const geoDataObj =
                data.body.Response.View[0].Result[0].Location.Address;
              this.userAddress = {
                address: geoDataObj.Label,
                city: geoDataObj.City,
                country: geoDataObj.AdditionalData[0].value,
              };
              // set the values to the form
              this.quaRegForm.get('address').setValue(this.userAddress.address);
              this.quaRegForm.get('city').setValue(this.userAddress.city);
              this.quaRegForm.get('country').setValue(this.userAddress.country);
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
    console.log(this.volRegForm.value);
    this.router.navigate(['/login']);
  }

  registerVolunteer() {
    console.log(this.quaRegForm.value);
    this.router.navigate(['/login']);
  }
}
