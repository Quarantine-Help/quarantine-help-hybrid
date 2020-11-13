import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';

import { MiscService } from 'src/app/services/misc/misc.service';
import { CoreAPIService } from 'src/app/services/core-api/core-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserType } from 'src/app/models/core-api';
import { defaultUserType } from 'src/app/constants/core-api';
import {
  UserThemeColorPrimary,
  UserThemeColorSecondary,
} from 'src/app/models/ui';

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
  userThemeColorPrimary: UserThemeColorPrimary;
  userThemeColorSecondary: UserThemeColorSecondary;
  constructor(
    private router: Router,
    private miscService: MiscService,
    private coreAPIService: CoreAPIService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userThemeColorPrimary =
      this.userType === 'AF' ? 'primaryAF' : 'primaryHL';
    this.userThemeColorSecondary =
      this.userType === 'AF' ? 'secondaryAF' : 'secondaryHL';
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
    this.router.navigate(['/create-request'], { replaceUrl: true });
  }

  onRequestOpened(requestData) {
    const afNavExtras: NavigationExtras = {
      state: requestData,
      replaceUrl: true,
    };
    this.router.navigate(['view-request'], afNavExtras);
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
            const allRequestRaw = result.body.results;
            this.allRequests = this.sortRequests(allRequestRaw);
          })
          .catch((errorObj) => {
            this.loadingData.dismiss();
            this.handleErrors(errorObj);
          });
      })
      .catch((error) => console.error(error));
  }

  // sort data from api in descending order by created date
  sortRequests(requests) {
    return requests.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
      return 0;
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
