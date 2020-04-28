import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-requests',
  templateUrl: './view-requests.page.html',
  styleUrls: ['./view-requests.page.scss'],
})
export class ViewRequestsPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  createNewReq() {
    console.log('%cnavigate to create request page', 'color: green');
    // uncomment this on merging
    // this.router.navigate(['/create-request']);
  }
}
