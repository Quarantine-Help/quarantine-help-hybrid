import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.page.html',
  styleUrls: ['./my-requests.page.scss'],
})
export class MyRequestsPage implements OnInit {
  allRequests = [
    {
      id: 14,
      type: 'G',
      deadline: '2020-05-28T22:01:01Z',
      description: 'Want 3 Kg banana',
      assignee: null,
      status: 'P',
      assignmentHistory: [],
      createdAt: '2020-03-31T16:54:16.421078Z',
    },
    {
      id: 15,
      type: 'G',
      deadline: '2020-05-28T22:01:01Z',
      description:
        ' Lorem Ipsum has been the industrys standard dummy text ever since the 1500s text. Lorem Ipsum has been the industrys',
      assignee: null,
      status: 'T',
      assignmentHistory: [],
      createdAt: '2020-03-31T16:54:16.421078Z',
    },
    {
      id: 16,
      type: 'G',
      deadline: '2020-05-28T22:01:01Z',
      description: 'Want 3 Kg orange',
      assignee: null,
      status: 'F',
      assignmentHistory: [],
      createdAt: '2020-03-31T16:54:16.421078Z',
    },
    {
      id: 17,
      type: 'G',
      deadline: '2020-05-28T22:01:01Z',
      description: 'Want 3 Kg mango',
      assignee: null,
      status: 'C',
      assignmentHistory: [],
      createdAt: '2020-04-31T16:54:16.421078Z',
    },
    {
      id: 18,
      type: 'G',
      deadline: '2020-05-28T22:01:01Z',
      description: 'Want 1 Kg apple',
      assignee: null,
      status: 'P',
      assignmentHistory: [],
      createdAt: '2020-05-31T16:54:16.421078Z',
    },
    {
      id: 18,
      type: 'M',
      deadline: '2020-05-28T22:01:01Z',
      description: 'Medicine',
      assignee: null,
      status: 'C',
      assignmentHistory: [],
      createdAt: '2021-03-01T16:54:16.421078Z',
    },
  ];
  isOpenRequests: boolean;
  constructor(private router: Router) {}

  ngOnInit() {
    this.isOpenRequests = true;
  }

  createNewReq() {
    this.router.navigateByUrl('/create-request');
  }

  onRequestOpened(requestData) {
    this.router.navigateByUrl(`/view-request/:${requestData.id}`);
  }

  segmentChanged(e) {
    if (e.detail.value === 'Open Requests') {
      this.isOpenRequests = true;
    } else if (e.detail.value === 'Closed Requests') {
      this.isOpenRequests = false;
    }
  }
}
