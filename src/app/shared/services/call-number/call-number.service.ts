import { Injectable } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Injectable({
  providedIn: 'root',
})
export class CallNumberService {
  constructor(private callNumberPlugin: CallNumber) {}

  callNumber(phoneNo) {
    return this.callNumberPlugin.callNumber(phoneNo, false);
  }
}
