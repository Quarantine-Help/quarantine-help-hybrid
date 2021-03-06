import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';

import { MiscService } from 'src/app/shared/services/misc/misc.service';
import { CoreAPIService } from 'src/app/shared/services/core-api/core-api.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import {
  HelpRequest,
  HelpRequestResponse,
  UserType,
} from 'src/app/models/core-api';
import {
  defaultUserType,
  defaultPrimaryColor,
} from 'src/app/constants/core-api';
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
  hasOpenRequests: boolean;
  allRequests: HelpRequest[];
  userType: UserType;
  authSubs: Subscription;
  userThemeColorPrimary: UserThemeColorPrimary;
  userThemeColorSecondary: UserThemeColorSecondary;
  isLoggedIn: boolean;
  constructor(
    private router: Router,
    private miscService: MiscService,
    private coreAPIService: CoreAPIService,
    private authService: AuthService
  ) {
    this.isLoggedIn = false;
    this.userType = defaultUserType;
    this.userThemeColorPrimary = defaultPrimaryColor;
  }

  ngOnInit() {
    this.authSubs = this.authService.user.subscribe((user) => {
      if (user && user.email !== undefined && user.token !== undefined) {
        this.userType = user.type;
        this.isLoggedIn = true;
        this.userThemeColorPrimary =
          this.userType === 'AF' ? 'primaryAF' : 'primaryHL';
        this.userThemeColorSecondary =
          this.userType === 'AF' ? 'secondaryAF' : 'secondaryHL';
      } else {
        this.isLoggedIn = false;
        this.userType = defaultUserType;
        this.userThemeColorPrimary = defaultPrimaryColor;
      }
    });

    this.hasOpenRequests = true;
    this.getRequests();
  }

  ngOnDestroy() {
    if (this.authSubs) {
      this.authSubs.unsubscribe();
    }
  }

  createNewReq() {
    this.router.navigate(['/create-request'], { replaceUrl: true });
  }

  onRequestOpened(requestData: HelpRequest) {
    const afNavExtras: NavigationExtras = {
      state: requestData,
      replaceUrl: true,
    };
    this.router.navigate(['view-request'], afNavExtras);
  }

  segmentChanged(e) {
    if (e.detail.value === 'Open Requests') {
      this.hasOpenRequests = true;
    } else if (e.detail.value === 'Closed Requests') {
      this.hasOpenRequests = false;
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
          .then((result: HelpRequestResponse) => {
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
  sortRequests(requests: HelpRequest[]) {
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
    console.log(errorMessages, statusCode);
    this.miscService.presentAlert({
      message: errorMessages.join('. '),
      subHeader: null,
      buttons: ['Ok'],
    });
  }
}
