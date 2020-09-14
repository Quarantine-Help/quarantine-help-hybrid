import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CallNumberService } from 'src/app/services/call-number/call-number.service';
import { MiscService } from 'src/app/services/misc/misc.service';
import { CoreAPIService } from 'src/app/services/core-api/core-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserType } from 'src/app/models/core-api';
import { defaultUserType } from 'src/app/constants/core-api';

@Component({
  selector: 'app-viewrequest',
  templateUrl: './view-request.page.html',
  styleUrls: ['./view-request.page.scss'],
})
export class ViewRequestPage implements OnInit, OnDestroy {
  loadingData: HTMLIonLoadingElement;
  requestData: any;
  requestId: number;
  userType: UserType;
  authSubs: Subscription;
  constructor(
    private router: Router,
    private callNumberService: CallNumberService,
    private miscService: MiscService,
    private coreAPIService: CoreAPIService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.requestData = navigation.extras.state;
    this.requestId = navigation.extras.state.id;

    this.authSubs = this.authService.user.subscribe((user) => {
      if (user && user.email !== undefined && user.token !== undefined) {
        this.userType = user.type;
      } else {
        this.userType = defaultUserType;
      }
    });
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }

  callAssignee(phoneNo) {
    this.callNumberService
      .callNumber(phoneNo)
      .then((res) => console.log('Launched dialer!', res))
      .catch((err) => console.log('Error launching dialer', err));
  }

  resolveRequest() {
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
                    if (this.loadingData !== undefined) {
                      this.loadingData.dismiss().then(() => {
                        this.loadingData = undefined;
                      });
                    }
                    this.miscService.presentAlert({
                      header: 'Success!!!',
                      subHeader: 'Request Resolved.',
                      buttons: [
                        {
                          text: 'Ok',
                          cssClass: 'secondary',
                          handler: () => {
                            this.router.navigate(['/my-requests'], { replaceUrl: true });
                          },
                        },
                      ],
                      message: `Request Resolved successfully. Click Ok to continue`,
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
                            this.router.navigate(['/my-requests'], { replaceUrl: true });
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
