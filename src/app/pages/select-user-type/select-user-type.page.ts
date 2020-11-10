import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserThemeColorPrimary } from 'src/app/models/ui';

@Component({
  selector: 'app-select-user-type',
  templateUrl: './select-user-type.page.html',
  styleUrls: ['./select-user-type.page.scss'],
})
export class SelectUserTypePage implements OnInit {
  userThemeColorPrimary: UserThemeColorPrimary;
  userThemeColorHL: UserThemeColorPrimary;

  constructor(private router: Router) {}

  ngOnInit() {
    this.userThemeColorPrimary = 'primaryAF';
    this.userThemeColorHL = 'primaryHL';
  }

  goToAboutUs() {
    console.log('navigate to about us page');
    // this.router.navigateByUrl('/');
  }

  goToQuarantinedReg() {
    this.router.navigateByUrl('/user-reg');
  }

  goToVolunteerReg() {
    this.router.navigateByUrl('/user-reg');
  }
}
