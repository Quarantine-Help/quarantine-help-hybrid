import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-requests',
  templateUrl: './view-requests.page.html',
  styleUrls: ['./view-requests.page.scss'],
})
export class ViewRequestsPage implements OnInit {
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
      description: 'Want 1 Kg grapes',
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
      createdAt: '2020-03-31T16:54:16.421078Z',
    },
    {
      id: 18,
      type: 'G',
      deadline: '2020-05-28T22:01:01Z',
      description: 'Want 1 Kg apple',
      assignee: null,
      status: 'P',
      assignmentHistory: [],
      createdAt: '2020-03-31T16:54:16.421078Z',
    },
    {
      id: 18,
      type: 'M',
      deadline: '2020-05-28T22:01:01Z',
      description: 'Medicine',
      assignee: null,
      status: 'C',
      assignmentHistory: [],
      createdAt: '2020-03-31T16:54:16.421078Z',
    },
  ];
  isOpenRequests: boolean;
  constructor(private router: Router) {}

  ngOnInit() {
    this.isOpenRequests = true;
  }

  createNewReq() {
    console.log('%cnavigate to create request page', 'color: green');
    // uncomment this on merging
    // this.router.navigate(['/create-request']);
  }

  segmentChanged(e) {
    // console.log(e.detail.value);
    if (e.detail.value === 'Open Requests') {
      this.isOpenRequests = true;
    } else if (e.detail.value === 'Closed Requests') {
      this.isOpenRequests = false;
    }
  }
}
