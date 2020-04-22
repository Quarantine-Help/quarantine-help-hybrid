import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  isVolunteer: boolean;
  constructor() { }

  ngOnInit() {
    this.isVolunteer = false;
  }

}
