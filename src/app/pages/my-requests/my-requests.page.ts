import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';

import { MiscService } from 'src/app/services/misc/misc.service';
import { CoreAPIService } from 'src/app/services/core-api/core-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserType } from 'src/app/models/core-api';
import { defaultUserType } from 'src/app/constants/core-api';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.page.html',
  styleUrls: ['./my-requests.page.scss'],
})
export class MyRequestsPage implements OnInit, OnDestroy {
  loadingData: HTMLIonLoadingElement;
  isOpenRequests: boolean;
  allRequests: any;
  userType: UserType;
  authSubs: Subscription;
  constructor(
    private router: Router,
    private miscService: MiscService,
    private coreAPIService: CoreAPIService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isOpenRequests = true;
    this.getRequests();

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

  createNewReq() {
    this.router.navigateByUrl('/create-request');
  }

  onRequestOpened(requestData) {
    const afRequestData: NavigationExtras = {
      state: requestData,
    };
    this.router.navigate(['view-request'], afRequestData);
  }

  segmentChanged(e) {
    if (e.detail.value === 'Open Requests') {
      this.isOpenRequests = true;
    } else if (e.detail.value === 'Closed Requests') {
      this.isOpenRequests = false;
    }
  }

  getAfOrHlRequest() {
    if (this.userType === 'AF') {
      return this.coreAPIService.getAFUserRequests();
    } else if (this.userType === 'HL') {
      return this.coreAPIService.getHLAssignedRequests();
    }
  }

  getRequests() {
    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Fetching requests`,
      })
      .then((onLoadSuccess) => {
        this.loadingData = onLoadSuccess;
        this.loadingData.present();
        this.getAfOrHlRequest()
          .then((result: any) => {
            // Dismiss & destroy loading controller on
            if (this.loadingData !== undefined) {
              this.loadingData.dismiss().then(() => {
                this.loadingData = undefined;
              });
            }
            this.allRequests = result.body.results;
          })
          .catch((errorObj) => {
            this.loadingData.dismiss();
            this.handleErrors(errorObj);
          })
          .catch((error) => alert(error));
      });
  }

  handleErrors(errorObj) {
    const { error, status: statusCode } = errorObj;
    const errorMessages: string[] = [];
    for (const key in error) {
      if (error.hasOwnProperty(key) && typeof key !== 'function') {
        console.error(error[key]);
        errorMessages.push(error[key]);
      }
    }
    console.log(...errorMessages, statusCode);
    this.miscService.presentAlert({
      message: errorMessages.join('. '),
      subHeader: null,
      buttons: ['Ok'],
    });
  }
}
