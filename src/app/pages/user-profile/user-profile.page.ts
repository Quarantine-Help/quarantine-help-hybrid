import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { MiscService } from 'src/app/services/misc/misc.service';

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

  constructor(private miscService: MiscService) {
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
    this.syncProfileDetails();
  }

  onEdit() {
    this.isEditable = true;
  }

  syncProfileDetails() {
    // TODO: get profile details from API and cache it incase user discards changes
    const userDetails = {
      firstName: 'johny',
      lastName: 'depp',
      address: 'apartment no, xyz street',
      city: 'stockholm',
      country: 'Sweden',
      emailid: 'example@gmail.com',
      phoneNumber: '9846512234',
    };
    if (this.isVolunteer) {
      this.volRegForm.get('firstName').setValue(userDetails.firstName);
      this.volRegForm.get('lastName').setValue(userDetails.lastName);
      this.volRegForm.get('email').setValue(userDetails.emailid);
      this.volRegForm.get('phoneNumber').setValue(userDetails.phoneNumber);
    } else {
      this.quaRegForm.get('firstName').setValue(userDetails.firstName);
      this.quaRegForm.get('lastName').setValue(userDetails.lastName);
      this.quaRegForm.get('address').setValue(userDetails.address);
      this.quaRegForm.get('city').setValue(userDetails.city);
      this.quaRegForm.get('country').setValue(userDetails.country);
      this.quaRegForm.get('email').setValue(userDetails.emailid);
      this.quaRegForm.get('phoneNumber').setValue(userDetails.phoneNumber);
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
              this.syncProfileDetails();
              this.volRegForm.markAsPristine();
              this.quaRegForm.markAsPristine();
            },
          },
        ],
        message: `Your changes are not saved. Are you sure you want to discard the changes? `,
      });
    }
  }

  saveUser() {
    this.isEditable = false;
    console.log(this.quaRegForm.value);
    this.quaRegForm.markAsPristine(); // for checking status of form in further edit and cancel
  }

  saveVolUser() {
    this.isEditable = false;
    console.log(this.volRegForm.value);
    this.volRegForm.markAsPristine(); // for checking status of form in further edit and cancel
  }
}
