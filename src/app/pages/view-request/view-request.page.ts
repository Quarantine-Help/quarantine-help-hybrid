import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewrequest',
  templateUrl: './view-request.page.html',
  styleUrls: ['./view-request.page.scss'],
})
export class ViewRequestPage implements OnInit {
  isVolunteer: boolean; // flag for checking if the user is volunteer or quarantined
  requestedData: any;
  assigneeDetails: any;
  constructor() {}

  ngOnInit() {
    this.isVolunteer = false;
    this.requestedData = {
      id: 16,
      type: 'G',
      deadline: '2020-05-29T00:01:01Z',
      description:
        'Description text want 3 kg of banana Lorem Ipsum has been the industrys standard Lorem Ipsum has been the industrys standard',
      assignee: {
        id: 4,
        user: {
          firstName: 'Johnny',
          lastName: 'Depp',
          email: 'johnny@test.com',
        },
        position: {
          longitude: '16.466003417968743',
          latitude: '63.78531111116974',
        },
        type: 'HL',
        firstLineOfAddress: 'apartment no',
        secondLineOfAddress: 'xyz street',
        country: 'DE',
        placeId: 'asdfa',
        postCode: '12345',
        city: 'Berlin',
        phone: '+46761189399',
        crisis: 1,
      },
      status: 'T',
      assignmentHistory: [
        {
          status: 'A',
          id: 7,
          createdAt: '2020-04-04T11:17:37.784674Z',
          didComplete: false,
          assigneeId: 4,
        },
      ],
      createdAt: '2020-04-04T10:43:18.521097Z',
    };
    this.assigneeDetails = this.requestedData.assignee;
  }

  resolveRequest() {
    console.log('resolve request');
  }

  cancelRequest() {
    console.log('cancel request');
  }
}
