import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { RequestStatus } from 'src/app/constants/core-api';
import { HelpRequest } from 'src/app/models/core-api';
import {
  UserThemeColorPrimary,
  UserThemeColorSecondary,
} from 'src/app/models/ui';

interface RequestId {
  id: string;
}
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  @Input() requestData: HelpRequest;
  @Output() requestOpened: EventEmitter<RequestId> = new EventEmitter<
    RequestId
  >();
  requestStatusColor: UserThemeColorPrimary;
  requestStatusSecondaryColor: UserThemeColorSecondary;
  constructor() {}
  ngOnInit() {
    // TODO: Find out about the other statuses - C & F
    this.requestStatusColor = 'primaryAF';
    this.requestStatusSecondaryColor = 'secondaryAF';
    if (this.requestData.status === RequestStatus.transit) {
      this.requestStatusColor = 'primaryHL';
      this.requestStatusSecondaryColor = 'secondaryHL';
    }
  }

  viewRequest(requestId) {
    this.requestOpened.emit({
      id: requestId,
    });
  }
}
