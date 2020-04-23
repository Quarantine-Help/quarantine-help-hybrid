import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  quaRegForm: FormGroup;
  volRegForm: FormGroup;
  isVolunteer: boolean; // flag for showing different forms
  isEditable: boolean;
  userDetails: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    emailid: string;
    phoneNumber: string;
  };

  constructor() {
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
    this.isVolunteer = false;
    this.isEditable = false;
    this.userDetails = {
      firstName: 'johny',
      lastName: 'depp',
      address: 'apartment no, xyz street',
      city: 'stockholm',
      country: 'Sweden',
      emailid: 'example@gmail.com',
      phoneNumber: '9846512234',
    };
    this.quaRegForm.get('firstName').setValue(this.userDetails.firstName);
    this.quaRegForm.get('lastName').setValue(this.userDetails.lastName);
    this.quaRegForm.get('address').setValue(this.userDetails.address);
    this.quaRegForm.get('city').setValue(this.userDetails.city);
    this.quaRegForm.get('country').setValue(this.userDetails.country);
    this.quaRegForm.get('email').setValue(this.userDetails.emailid);
    this.quaRegForm.get('phoneNumber').setValue(this.userDetails.phoneNumber);
    this.volRegForm.get('firstName').setValue(this.userDetails.firstName);
    this.volRegForm.get('lastName').setValue(this.userDetails.lastName);
    this.volRegForm.get('email').setValue(this.userDetails.emailid);
    this.volRegForm.get('phoneNumber').setValue(this.userDetails.phoneNumber);
  }

  onEdit() {
    this.isEditable = true;
  }

  onCancel() {
    this.isEditable = false;
  }

  saveUser() {
    this.isEditable = false;
    console.log(this.quaRegForm.value);
  }

  saveVolUser() {
    this.isEditable = false;
    console.log(this.volRegForm.value);
  }
}
