import { Component, OnInit } from '@angular/core';
import { UserThemeColorPrimary } from 'src/app/models/ui';


@Component({
  selector: 'app-select-user-type',
  templateUrl: './select-user-type.page.html',
  styleUrls: ['./select-user-type.page.scss'],
})
export class SelectUserTypePage implements OnInit {
  userThemeColorPrimary: UserThemeColorPrimary;
  userThemeColorHL: UserThemeColorPrimary;

  constructor() { }

  ngOnInit() {
    this.userThemeColorPrimary = 'primaryAF';
    this.userThemeColorHL = 'primaryHL';
  }

}
