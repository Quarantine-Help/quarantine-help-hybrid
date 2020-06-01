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

  ngOnInit() {
    console.log(this.requestData);
  }

  viewRequest(requestId) {
    console.log('navigate to request view page', requestId);
    this.requestOpened.emit({
      id: requestId,
    });
  }
}
