import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  requestDetails: any;
  constructor(
    private router: Router,
    private callNumberService: CallNumberService
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.requestDetails = navigation.extras.state;
    this.isVolunteer = true;
    this.requestedData = this.requestDetails;
    this.assigneeDetails = this.requestDetails.assignee;
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
}
