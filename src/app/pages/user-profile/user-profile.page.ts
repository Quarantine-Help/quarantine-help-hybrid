import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { MiscService } from 'src/app/services/misc/misc.service';
import { CoreAPIService } from 'src/app/services/core-api/core-api.service';
import {
  UserProfileData,
  UserProfileResponseBody,
} from 'src/app/models/core-api';

interface UserProfile {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  emailid: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  quaRegForm: FormGroup;
  volRegForm: FormGroup;
  isVolunteer: boolean; // flag for current user type
  isEditable: boolean;
  loadingProfileData: HTMLIonLoadingElement;
  userProfileDetails: UserProfile;

  constructor(
    private miscService: MiscService,
    private coreAPIService: CoreAPIService
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
    });
  }

  ngOnInit() {
    // TODO: get the user type from backend
    this.isVolunteer = false;
    this.isEditable = false;
    this.getProfileData();
  }

  onEdit() {
    this.isEditable = true;
  }

  getProfileData() {
    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Fetching user data`,
      })
      .then((onLoadSuccess) => {
        this.loadingProfileData = onLoadSuccess;
        this.loadingProfileData.present();
        this.coreAPIService
          .getUserProfileData()
          .then((result: UserProfileResponseBody) => {
            // Dismiss & destroy loading controller on
            if (this.loadingProfileData !== undefined) {
              this.loadingProfileData.dismiss().then(() => {
                this.loadingProfileData = undefined;
              });
            }
            this.syncDownProfileData(result.body);
          })
          .catch((errorObj) => {
            this.loadingProfileData.dismiss();
            const { error, status: statusCode } = errorObj;
            const errorMessages: string[] = [];
            for (const key in error) {
              if (error.hasOwnProperty(key) && typeof key !== 'function') {
                console.error(error[key][0]);
                errorMessages.push(error[key][0]);
              }
            }
            // show the errors as alert
            this.handleErrors(errorMessages, statusCode);
          })
          .catch((error) => alert(error));
      });
  }

  syncDownProfileData(apiResult?: UserProfileData) {
    // use data fetched from API if available
    if (apiResult) {
      this.userProfileDetails = {
        firstName: apiResult.user.firstName,
        lastName: apiResult.user.lastName,
        address: `${apiResult.firstLineOfAddress}, ${apiResult.secondLineOfAddress}`,
        city: apiResult.city,
        country: apiResult.country,
        emailid: apiResult.user.email,
        phoneNumber: apiResult.phone,
      };
    }

    // Restore previously fetched data if discarding changes
    if (this.isVolunteer) {
      this.volRegForm
        .get('firstName')
        .setValue(this.userProfileDetails.firstName);
      this.volRegForm
        .get('lastName')
        .setValue(this.userProfileDetails.lastName);
      this.volRegForm.get('email').setValue(this.userProfileDetails.emailid);
      this.volRegForm
        .get('phoneNumber')
        .setValue(this.userProfileDetails.phoneNumber);
    } else {
      this.quaRegForm
        .get('firstName')
        .setValue(this.userProfileDetails.firstName);
      this.quaRegForm
        .get('lastName')
        .setValue(this.userProfileDetails.lastName);
      this.quaRegForm.get('address').setValue(this.userProfileDetails.address);
      this.quaRegForm.get('email').setValue(this.userProfileDetails.emailid);
      this.quaRegForm
        .get('phoneNumber')
        .setValue(this.userProfileDetails.phoneNumber);
      this.quaRegForm.get('city').setValue(this.userProfileDetails.city);
      this.quaRegForm.get('country').setValue(this.userProfileDetails.country);
    }
  }

  onCancel() {
    this.isEditable = false;
    if (this.quaRegForm.dirty || this.volRegForm.dirty) {
      this.miscService.presentAlert({
        header: 'Warning',
        subHeader: 'Are you sure? ',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              this.isEditable = true;
            },
          },
          {
            text: 'Yes',
            handler: () => {
              this.isEditable = false;
              this.syncDownProfileData();
              this.volRegForm.markAsPristine();
              this.quaRegForm.markAsPristine();
            },
          },
        ],
        message: `Your changes are not saved. Are you sure you want to discard the changes? `,
      });
    }
  }

  saveQuaUser() {
    this.isEditable = false;
    this.quaRegForm.markAsPristine(); // for checking status of form in further edit and cancel
    this.removeCleanFields();
  }

  saveVolUser() {
    this.isEditable = false;
    this.volRegForm.markAsPristine(); // for checking status of form in further edit and cancel
    this.removeCleanFields();
  }

  // TODO: Refactor to use Form dirty
  removeCleanFields() {
    if (this.isVolunteer) {
      const volUserDetails = {
        user: {
          firstName:
            this.volRegForm.get('firstName').value !==
            this.userProfileDetails.firstName
              ? this.volRegForm.get('firstName').value
              : null,
          lastName:
            this.volRegForm.get('lastName').value !==
            this.userProfileDetails.lastName
              ? this.volRegForm.get('lastName').value
              : null,
          email:
            this.volRegForm.get('email').value !==
            this.userProfileDetails.emailid
              ? this.volRegForm.get('email').value
              : null,
        },
        phone:
          this.volRegForm.get('phoneNumber').value !==
          this.userProfileDetails.phoneNumber
            ? this.volRegForm.get('phoneNumber').value
            : null,
      };
      this.syncUpProfileData(volUserDetails);
    } else {
      const quaUserDetails = {
        user: {
          firstName:
            this.quaRegForm.get('firstName').value !==
            this.userProfileDetails.firstName
              ? this.quaRegForm.get('firstName').value
              : null,
          lastName:
            this.quaRegForm.get('lastName').value !==
            this.userProfileDetails.lastName
              ? this.quaRegForm.get('lastName').value
              : null,
          email:
            this.quaRegForm.get('email').value !==
            this.userProfileDetails.emailid
              ? this.quaRegForm.get('email').value
              : null,
        },
        phone:
          this.quaRegForm.get('phoneNumber').value !==
          this.userProfileDetails.phoneNumber
            ? this.quaRegForm.get('phoneNumber').value
            : null,
        firstLineOfAddress:
          this.quaRegForm.get('address').value !==
          this.userProfileDetails.address
            ? this.quaRegForm.get('address').value
            : null,
        city:
          this.quaRegForm.get('city').value !== this.userProfileDetails.city
            ? this.quaRegForm.get('city').value
            : null,
        country:
          this.quaRegForm.get('country').value !==
          this.userProfileDetails.country
            ? this.quaRegForm.get('country').value
            : null,
      };
      this.syncUpProfileData(quaUserDetails);
    }
  }

  syncUpProfileData(profileDataDiff) {
    // SO answer to remove null keys from an object
    const deleteNullProperties = (object) => {
      for (const key in object) {
        if (object[key] === null) {
          delete object[key];
        } else if (typeof object[key] === 'object') {
          deleteNullProperties(object[key]);
        }
      }
    };
    deleteNullProperties(profileDataDiff);
    this.callPatchUserProfile(profileDataDiff);
  }

  callPatchUserProfile(profilePatchData) {
    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Updating profile details`,
      })
      .then((onLoadSuccess) => {
        this.loadingProfileData = onLoadSuccess;
        this.loadingProfileData.present();
        this.coreAPIService
          .saveUserProfileData(profilePatchData)
          .then((result: UserProfileResponseBody) => {
            // Dismiss & destroy loading controller on
            if (this.loadingProfileData !== undefined) {
              this.loadingProfileData.dismiss().then(() => {
                this.loadingProfileData = undefined;
              });
            }
            console.log('PatchUserProfile Success', result);
            this.miscService.presentAlert({
              header: 'Success 😊',
              message: 'The Profile details have been updated successfully.',
              subHeader: null,
              buttons: ['Ok'],
            });
            this.syncDownProfileData(result.body);
          })
          .catch((errorObj) => {
            this.loadingProfileData.dismiss();
            console.log(errorObj);
            const { error, status: statusCode } = errorObj;
            const errorMessages: string[] = [];
            for (const key in error) {
              if (error.hasOwnProperty(key) && typeof key !== 'function') {
                Object.values(error[key]).forEach((value) => {
                  errorMessages.push(value as string);
                });
              }
            }
            // show the errors as alert
            this.handleErrors(errorMessages, statusCode);
          });
      })
      .catch((error) => alert(error));
  }

  handleErrors(errorMessages: string[], statusCode) {
    console.log(...errorMessages, statusCode);
    this.miscService.presentAlert({ message: errorMessages.join('. ') });
  }
}
