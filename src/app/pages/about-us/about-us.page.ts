import { Component, OnInit } from '@angular/core';

import { UserThemeColorPrimary } from 'src/app/models/ui';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
  userThemeColorPrimary: UserThemeColorPrimary;
  constructor() {}

  ngOnInit() {
    this.userThemeColorPrimary = 'primaryAF';
  }
}
