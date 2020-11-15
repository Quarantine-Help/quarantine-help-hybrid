import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

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
  constructor() {}

  ngOnInit() {}

  viewRequest(requestId) {
    this.requestOpened.emit({
      id: requestId,
    });
  }
}
