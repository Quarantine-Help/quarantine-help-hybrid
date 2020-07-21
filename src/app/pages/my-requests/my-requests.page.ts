import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { MiscService } from 'src/app/services/misc/misc.service';
import { CoreAPIService } from 'src/app/services/core-api/core-api.service';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.page.html',
  styleUrls: ['./my-requests.page.scss'],
})
export class MyRequestsPage implements OnInit {
  loadingData: HTMLIonLoadingElement;
  isOpenRequests: boolean;
  allRequests: any;
  userType: string; // AF/HL
  constructor(
    private router: Router,
    private miscService: MiscService,
    private coreAPIService: CoreAPIService
  ) {}

  ngOnInit() {
    this.isOpenRequests = true;
    this.getRequests();
    // TODO: Get the userType from user observable.
    this.userType = 'AF';
  }

  createNewReq() {
    this.router.navigateByUrl('/create-request');
  }

  onRequestOpened(requestData) {
    // this.router.navigateByUrl(`/view-request/${requestData.id}`);
    const afRequestData: NavigationExtras = {
      state: { someKeyName: requestData },
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

  handleErrors(errorMessages: string[], statusCode) {
    console.log(...errorMessages, statusCode);
    this.miscService.presentAlert({ message: errorMessages.join('. ') });
  }
}
