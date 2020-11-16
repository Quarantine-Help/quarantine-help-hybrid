import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { RequestStatus } from 'src/app/constants/core-api';

interface RequestId {
  id: string;
}
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  @Input() requestData: any;
  @Output() requestOpened: EventEmitter<RequestId> = new EventEmitter<
    RequestId
  >();
  requestStatusColor: UserThemeColorPrimary;
  constructor() {}


  ngOnInit() {
    console.log(this.requestData);

    // TODO: Find out about the other statuses - C & F
    this.requestStatusColor = 'primaryAF';
    if (this.requestData.status === RequestStatus.transit) {
      this.requestStatusColor = 'primaryHL';
    }
  }

  viewRequest(requestId) {
    this.requestOpened.emit({
      id: requestId,
    });
  }
}
