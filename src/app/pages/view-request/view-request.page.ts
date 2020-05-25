import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewrequest',
  templateUrl: './view-request.page.html',
  styleUrls: ['./view-request.page.scss'],
})
export class ViewRequestPage implements OnInit {
  isGrocery: boolean;
  constructor() {}

  ngOnInit() {
    this.isGrocery = true;
  }
}
