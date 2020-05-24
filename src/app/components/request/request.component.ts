import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  @Input() requestData: any;
  constructor() {}

  ngOnInit() {
    console.log(this.requestData);
  }

  viewRequest() {
    console.log('navigate to request view page');
  }
}
