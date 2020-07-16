import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MiscService } from 'src/app/services/misc/misc.service';
import { CoreAPIService } from 'src/app/services/core-api/core-api.service';
import { CallNumberService } from 'src/app/services/call-number/call-number.service';
@Component({
  selector: 'app-viewrequest',
  templateUrl: './view-request.page.html',
  styleUrls: ['./view-request.page.scss'],
})
export class ViewRequestPage implements OnInit {
  loadingData: HTMLIonLoadingElement;
  isVolunteer: boolean; // flag for checking if the user is volunteer or quarantined
  requestedData: any;
  assigneeDetails: any;
  requestId: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private callNumberService: CallNumberService,
    private miscService: MiscService,
    private coreAPIService: CoreAPIService
  ) {}

  ngOnInit() {
    this.requestId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getRequest();
    this.isVolunteer = true;
    this.requestedData = {
      id: 1,
      type: 'G',
      deadline: '2020-05-29T00:01:01Z',
      description: '',
      assignee: {
        id: 4,
        user: {
          firstName: '',
          lastName: '',
          email: '',
        },
        position: {
          longitude: '',
          latitude: '',
        },
        type: '',
        firstLineOfAddress: '',
        secondLineOfAddress: '',
        country: '',
        placeId: '',
        postCode: '',
        city: '',
        phone: '',
        crisis: 1,
      },
      status: '',
      assignmentHistory: [
        {
          status: '',
          id: 7,
          createdAt: '2000-01-01T11:17:37.784674Z',
          didComplete: false,
          assigneeId: 4,
        },
      ],
      createdAt: '2000-01-01T10:43:18.521097Z',
    };
    this.assigneeDetails = this.requestedData.assignee;
  }

  callAssignee(phoneNo) {
    this.callNumberService
      .callNumber(phoneNo)
      .then((res) => console.log('Launched dialer!', res))
      .catch((err) => console.log('Error launching dialer', err));
  }

  resolveRequest() {
    console.log('resolve request');
  }

  cancelRequest() {
    console.log('cancel request');
  }

  getRequest() {
    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Fetching request`,
      })
      .then((onLoadSuccess) => {
        this.loadingData = onLoadSuccess;
        this.loadingData.present();
        this.coreAPIService
          .getEachHLAssignedRequest(this.requestId)
          .then((result: any) => {
            console.log(result.body);
            // Dismiss & destroy loading controller on
            if (this.loadingData !== undefined) {
              this.loadingData.dismiss().then(() => {
                this.loadingData = undefined;
              });
            }
            this.requestedData = result.body;
            this.assigneeDetails = this.requestedData.assignee;
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
