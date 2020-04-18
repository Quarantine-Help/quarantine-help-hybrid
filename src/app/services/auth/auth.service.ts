import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonHTTPService } from '../common-http/common-http.service';

import { LoginUserCred } from '../../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL: string;
  private loginURL: string;
  private registerURL: string;
  constructor(private commonHTTP: CommonHTTPService) {
    const suffix = `auth`;
    this.baseURL = `${environment.DJANGO_API_ENDPOINT}/v${environment.DJANGO_API_VERSION}/${suffix}`;
    this.loginURL = `${this.baseURL}/login/`;
    this.registerURL = `${this.baseURL}/register/`;
  }

  loginUser(userCred: LoginUserCred) {
    return this.commonHTTP.httpPost(this.loginURL, userCred);
  }
}
