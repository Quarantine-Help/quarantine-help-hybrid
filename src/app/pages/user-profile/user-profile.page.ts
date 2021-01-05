import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { MiscService } from 'src/app/shared/services/misc/misc.service';
import { CoreAPIService } from 'src/app/shared/services/core-api/core-api.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import {
  UserProfileData,
  UserProfileResponseBody,
  UserType,
} from 'src/app/models/core-api';
import { countryList } from 'src/app/constants/countries';
import { UserThemeColorPrimary } from 'src/app/models/ui';
import { defaultPrimaryColor, defaultUserType } from 'src/app/constants/core-api';
import { Subscription } from 'rxjs';

interface UserProfile {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  postCode: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  profileForm: FormGroup;
  isEditable: boolean;
  loadingProfileData: HTMLIonLoadingElement;
  userProfileDetails: UserProfile;
  searchResult: { name: string; isoAlphaTwoCode: string }[];
  displayCountrySearch: boolean;
  isoAlphaTwoCode: string;
  filterCountryName: { name: string; isoAlphaTwoCode: string }[];
  userThemeColorPrimary: UserThemeColorPrimary;
  isLoggedIn: boolean;
  userType: UserType;
  authSubs: Subscription;
  constructor(
    private miscService: MiscService,
    private coreAPIService: CoreAPIService,
    private authService: AuthService
  ) {
    this.profileForm = new FormGroup({
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
      postCode: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.required,
      ]),
    });
  }

  ngOnInit() {
    this.isEditable = false;
    this.searchResult = [];
    this.getProfileData();

    this.isLoggedIn = false;
    this.userType = defaultUserType;
    this.userThemeColorPrimary = defaultPrimaryColor;

    this.authSubs = this.authService.user.subscribe((user) => {
      if (user && user.email !== undefined && user.token !== undefined) {
        this.userType = user.type;
        this.isLoggedIn = true;
        this.userThemeColorPrimary =
          this.userType === 'AF' ? 'primaryAF' : 'primaryHL';
      } else {
        this.isLoggedIn = false;
        this.userType = defaultUserType;
        this.userThemeColorPrimary = defaultPrimaryColor;
      }
    });

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
      // find country name with the country code
      this.filterCountryName = countryList.filter((country) =>
        country.isoAlphaTwoCode
          .toLowerCase()
          .includes(apiResult.country.toLowerCase())
      );
      this.userProfileDetails = {
        firstName: apiResult.user.firstName,
        lastName: apiResult.user.lastName,
        address: apiResult.firstLineOfAddress,
        city: apiResult.city,
        country: this.filterCountryName[0].name,
        postCode: apiResult.postCode,
        phoneNumber: apiResult.phone,
      };
    }

    // Restore previously fetched data if discarding changes
    this.profileForm
      .get('firstName')
      .setValue(this.userProfileDetails.firstName);
    this.profileForm.get('lastName').setValue(this.userProfileDetails.lastName);
    this.profileForm.get('address').setValue(this.userProfileDetails.address);
    this.profileForm.get('postCode').setValue(this.userProfileDetails.postCode);
    this.profileForm
      .get('phoneNumber')
      .setValue(this.userProfileDetails.phoneNumber);
    this.profileForm.get('city').setValue(this.userProfileDetails.city);
    this.profileForm.get('country').setValue(this.userProfileDetails.country);
  }

  onCancel() {
    this.isEditable = false;
    if (this.profileForm.dirty) {
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
              this.profileForm.markAsPristine();
            },
          },
        ],
        message: `Your changes are not saved. Are you sure you want to discard the changes? `,
      });
    }
    this.searchResult.splice(0);
  }

  saveUser() {
    this.isEditable = false;
    this.profileForm.markAsPristine(); // for checking status of form in further edit and cancel
    this.removeCleanFields();
  }

  filterCountries(e) {
    const valueSearchbox = e.detail.value;
    this.searchResult = countryList.filter((country) =>
      country.name.toLowerCase().includes(valueSearchbox.toLowerCase())
    );
  }

  setSelectedCountry(item) {
    this.profileForm.markAsDirty();
    this.isoAlphaTwoCode = item.isoAlphaTwoCode;
    this.profileForm.patchValue({
      country: item.name,
    });
    this.searchResult.splice(0);
    this.displayCountrySearch = false;
  }

  showCountrySearch() {
    if (this.displayCountrySearch) {
      this.searchResult.splice(0);
    }
    this.displayCountrySearch = !this.displayCountrySearch;
  }

  // TODO: Refactor to use Form dirty
  removeCleanFields() {
    const quaUserDetails = {
      user: {
        firstName:
          this.profileForm.get('firstName').value !==
          this.userProfileDetails.firstName
            ? this.profileForm.get('firstName').value
            : null,
        lastName:
          this.profileForm.get('lastName').value !==
          this.userProfileDetails.lastName
            ? this.profileForm.get('lastName').value
            : null,
      },
      postCode:
        this.profileForm.get('postCode').value !==
        this.userProfileDetails.postCode
          ? this.profileForm.get('postCode').value
          : null,
      phone:
        this.profileForm.get('phoneNumber').value !==
        this.userProfileDetails.phoneNumber
          ? this.profileForm.get('phoneNumber').value
          : null,
      firstLineOfAddress:
        this.profileForm.get('address').value !==
        this.userProfileDetails.address
          ? this.profileForm.get('address').value
          : null,
      city:
        this.profileForm.get('city').value !== this.userProfileDetails.city
          ? this.profileForm.get('city').value
          : null,
      country: this.isoAlphaTwoCode,
    };
    this.syncUpProfileData(quaUserDetails);
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
          .updateUserProfileData(profilePatchData)
          .then((result: UserProfileResponseBody) => {
            // Dismiss & destroy loading controller on
            if (this.loadingProfileData !== undefined) {
              this.loadingProfileData.dismiss().then(() => {
                this.loadingProfileData = undefined;
              });
            }
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
