import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CallNumberService } from 'src/app/services/call-number/call-number.service';
import { MiscService } from 'src/app/services/misc/misc.service';

@Component({
  selector: 'app-viewrequest',
  templateUrl: './view-request.page.html',
  styleUrls: ['./view-request.page.scss'],
})
export class ViewRequestPage implements OnInit {
  loadingData: HTMLIonLoadingElement;
  isVolunteer: boolean; // flag for checking if the user is volunteer or quarantined
  requestData: any;
  constructor(
    private router: Router,
    private callNumberService: CallNumberService,
    private miscService: MiscService
  ) {}

  ngOnInit() {
    this.isVolunteer = true;
    const navigation = this.router.getCurrentNavigation();
    this.requestData = navigation.extras.state;
  }

  callAssignee(phoneNo) {
    this.callNumberService
      .callNumber(phoneNo)
      .then((res) => console.log('Launched dialer!', res))
      .catch((err) => console.log('Error launching dialer', err));
  }

  resolveRequest() {
    console.log('resolve request');
    this.miscService.presentAlert({
      header: 'Warning',
      subHeader: 'Are you sure? ',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('cancel');
          },
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('yes');
          },
        },
      ],
      message: `Are you sure you want to Resolve the Request? `,
    });
  }

  removeRequest() {
    console.log('remove request');
    this.miscService.presentAlert({
      header: 'Warning',
      subHeader: 'Are you sure? ',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('cancel');
          },
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('yes');
          },
        },
      ],
      message: `Are you sure you want to Remove the Request? `,
    });
  }
}
