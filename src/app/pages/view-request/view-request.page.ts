import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CallNumberService } from 'src/app/services/call-number/call-number.service';
import { MiscService } from 'src/app/services/misc/misc.service';
import { CoreAPIService } from 'src/app/services/core-api/core-api.service';

@Component({
  selector: 'app-viewrequest',
  templateUrl: './view-request.page.html',
  styleUrls: ['./view-request.page.scss'],
})
export class ViewRequestPage implements OnInit {
  loadingData: HTMLIonLoadingElement;
  isVolunteer: boolean; // flag for checking if the user is volunteer or quarantined
  requestData: any;
  requestId: number;
  constructor(
    private router: Router,
    private callNumberService: CallNumberService,
    private miscService: MiscService,
    private coreAPIService: CoreAPIService
  ) {}

  ngOnInit() {
    this.isVolunteer = true;
    const navigation = this.router.getCurrentNavigation();
    this.requestData = navigation.extras.state;
    this.requestId = navigation.extras.state.id;
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
            this.miscService
              .presentLoadingWithOptions({
                duration: 0,
                message: `Resolving request`,
              })
              .then((onLoadSuccess) => {
                this.loadingData = onLoadSuccess;
                this.loadingData.present();
                const status = {
                  status: 'F',
                };
                this.coreAPIService
                  .resolveARequest(this.requestId, status)
                  .then((result: any) => {
                    console.log(result);
                    if (this.loadingData !== undefined) {
                      this.loadingData.dismiss().then(() => {
                        this.loadingData = undefined;
                      });
                    }
                  });
              });
          },
        },
      ],
      message: `Are you sure you want to Resolve the Request? `,
    });
  }

  removeRequest() {
    this.miscService.presentAlert({
      header: 'Warning',
      subHeader: 'Are you sure? ',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Yes',
          handler: () => {
            this.miscService
              .presentLoadingWithOptions({
                duration: 0,
                message: `Removing request`,
              })
              .then((onLoadSuccess) => {
                this.loadingData = onLoadSuccess;
                this.loadingData.present();
                this.coreAPIService
                  .unassignRequest(this.requestId)
                  .then((result: any) => {
                    if (this.loadingData !== undefined) {
                      this.loadingData.dismiss().then(() => {
                        this.loadingData = undefined;
                      });
                    }
                    this.miscService.presentAlert({
                      header: 'Success!!!',
                      subHeader: 'Request Removed.',
                      buttons: [
                        {
                          text: 'Ok',
                          cssClass: 'secondary',
                          handler: () => {
                            this.router.navigateByUrl('/my-requests');
                          },
                        },
                      ],
                      message: `Request removed successfully. Click Ok to continue`,
                    });
                  })
                  .catch((errorObj) => {
                    this.loadingData.dismiss();
                    const { error, status: statusCode } = errorObj;
                    const errorMessages: string[] = [];
                    for (const key in error) {
                      if (
                        error.hasOwnProperty(key) &&
                        typeof key !== 'function'
                      ) {
                        console.error(error[key][0]);
                        errorMessages.push(error[key][0]);
                      }
                    }
                    // show the errors as alert
                    this.handleErrors(errorMessages, statusCode);
                  });
              });
          },
        },
      ],
      message: `Are you sure you want to Remove the Request? `,
    });
  }

  handleErrors(errorMessages: string[], statusCode) {
    console.log(...errorMessages, statusCode);
    this.miscService.presentAlert({ message: errorMessages.join('. ') });
  }
}
