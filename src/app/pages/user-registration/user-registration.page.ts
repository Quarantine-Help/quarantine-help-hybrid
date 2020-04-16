import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

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

  segmentChanged(ev: any) {
    this.quarantinedOrVolunteer = ev.detail.value;
    if (this.quarantinedOrVolunteer === 'Quarantined') {
      this.showVolunteer = false;
    } else if (this.quarantinedOrVolunteer === 'Volunteer') {
      this.showVolunteer = true;
    }
  }

  constructor() {
    this.pageClean = true;
    this.pageCleanQuarantined = true;
    this.showPasswordText = false;
    this.showVolunteer = true;
    this.setDefault = 'Volunteer';
    this.registrationForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required
      ]),
      lastName: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.email,
      ]),
      phoneNumber: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.required
      ]),
    });
    this.quarantineRegistration = new FormGroup({
      firstName: new FormControl('', [
        Validators.required
      ]),
      lastName: new FormControl('', [
        Validators.required
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      city: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      country: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.email,
      ]),
      phoneNumber: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.required
      ]),
    });
  }

  ngOnInit() {
    this.regSubs = this.registrationForm.valueChanges.subscribe((change) => {
      this.pageClean = false;
    });
    this.regQuarantineSubs = this.quarantineRegistration.valueChanges.subscribe((change) => {
      this.pageCleanQuarantined = false;
    });
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
}
