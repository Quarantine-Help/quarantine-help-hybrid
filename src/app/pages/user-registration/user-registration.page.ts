import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GeoLocationService } from 'src/app/services/geo-location/geo-location.service';
import { MiscService } from 'src/app/services/misc/misc.service';
import { GeolocationPosition, LatLng } from '../../models/geo';
import { HEREMapService } from 'src/app/services/HERE-map/here-map.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.page.html',
  styleUrls: ['./user-registration.page.scss'],
})
export class UserRegistrationPage implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  quarantineRegistration: FormGroup;
  showPasswordText: boolean; // To toggle password visibility
  passwordIcon: 'eye' | 'eye-off' = 'eye';
  pageClean: boolean; // Flag to check if no changes were made.
  pageCleanQuarantined: boolean;
  regSubs: Subscription;
  regQuarantineSubs: Subscription;
  showVolunteer: boolean; // Flag for hiding and showing 2 forms
  quarantinedOrVolunteer: string;
  setDefault: string;
  loadingAniGPSData: HTMLIonLoadingElement;
  currentLocation: LatLng = undefined;
  toastElement: Promise<void>;
  private HEREMapObj: any;
  address: string;
  city: string;
  country: string;

  constructor(
    private geoLocationService: GeoLocationService,
    private miscService: MiscService,
    private hereMapService: HEREMapService
  ) {
    this.pageClean = true;
    this.pageCleanQuarantined = true;
    this.showPasswordText = false;
    this.showVolunteer = true;
    this.setDefault = 'Volunteer';
    this.registrationForm = new FormGroup({
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
    this.quarantineRegistration = new FormGroup({
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
    this.regSubs = this.registrationForm.valueChanges.subscribe((change) => {
      this.pageClean = false;
    });
    this.regQuarantineSubs = this.quarantineRegistration.valueChanges.subscribe(
      (change) => {
        this.pageCleanQuarantined = false;
      }
    );
  }

  ngOnDestroy() {
    this.regSubs.unsubscribe();
    this.regQuarantineSubs.unsubscribe();
  }

  togglePasswordVisibility() {
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    if (this.passwordIcon === 'eye-off') {
      setTimeout(() => {
        this.passwordIcon = 'eye';
      }, 6000);
    }
  }

  registerUser() {
    console.log(this.registrationForm.value);
  }

  registerVolunteer() {
    console.log(this.quarantineRegistration.value);
  }

  segmentChanged(ev: any) {
    this.quarantinedOrVolunteer = ev.detail.value;
    if (this.quarantinedOrVolunteer === 'Quarantined') {
      this.showVolunteer = false;
      // Start the loading animation for getting GPS data
      this.miscService
        .presentLoadingWithOptions({
          duration: 0,
          message: `Getting current location.`,
        })
        .then((onLoadSuccess) => {
          this.loadingAniGPSData = onLoadSuccess;
          this.loadingAniGPSData.present();
          // Get the GPS data
          this.getGPSLocation();
        })
        .catch((error) => alert(error));
    } else if (this.quarantinedOrVolunteer === 'Volunteer') {
      this.showVolunteer = true;
    }
  }

  getGPSLocation() {
    this.geoLocationService
      .getCurrentPosition()
      .then((mapCenterlatLng) => {
        // Destroy loading controller on dismiss
        if (this.loadingAniGPSData !== undefined) {
          this.loadingAniGPSData.dismiss().then(() => {
            this.loadingAniGPSData = undefined;
          });
        }
        this.currentLocation = {
          lat: mapCenterlatLng.coords.latitude,
          lng: mapCenterlatLng.coords.longitude,
        };
        this.hereMapService
          .getUserLocation(this.currentLocation)
          .then((data: any) => {
            this.address =
              data.body.Response.View[0].Result[0].Location.Address.Label;
            this.city =
              data.body.Response.View[0].Result[0].Location.Address.City;
            this.country =
              data.body.Response.View[0].Result[0].Location.Address.Country;
          });
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
