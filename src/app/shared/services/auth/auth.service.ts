import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  LoginUserCred,
  LoginResponse,
  UserRegData,
  UserDataObservableType,
} from '../../../models/auth';
import { UserType } from '../../../models/core-api';
import { CommonHTTPService } from '../common-http/common-http.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { StorageKeys } from 'src/app/constants/core-api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authAPISuffix: string;
  private baseURL: string;
  private loginURL: string;
  private registerURL: string;
  user: Observable<UserDataObservableType>;
  private authState = new BehaviorSubject(null);
  constructor(
    private storageService: StorageService,
    private commonHTTP: CommonHTTPService
  ) {
    this.authAPISuffix = `auth`;
    this.baseURL = `${environment.DJANGO_API_ENDPOINT}/v${environment.DJANGO_API_VERSION}/${this.authAPISuffix}`;
    this.loginURL = `${this.baseURL}/login/`;
    this.registerURL = `${this.baseURL}/register/`;

    this.loadAuthData();
    this.user = this.authState.asObservable();
  }

  loadAuthData() {
    this.storageService
      .getObject(StorageKeys.authInfo)
      .then((userData: UserDataObservableType | null | undefined) => {
        if (
          userData &&
          userData.email !== undefined &&
          userData.token !== undefined
        ) {
          this.authState.next(userData);
        }
      });
  }

  loginUser(userCred: LoginUserCred) {
    return this.commonHTTP
      .httpPost(this.loginURL, userCred)
      .then((data: LoginResponse) => {
        const userData: {
          email: string;
          token: string;
          type: UserType;
        } = {
          email: data.body.email,
          token: data.body.token,
          type: data.body.participantType,
        };
        this.authState.next(userData);
        this.storageService.setObject(
          StorageKeys.authInfo,
          JSON.stringify(userData)
        );
        return Promise.resolve(userData);
      });
  }

  registerUser(userData: UserRegData) {
    return this.commonHTTP.httpPost(this.registerURL, userData);
  }

  logOutUser() {
    this.authState.next(null);
    return this.storageService.setObject(
      StorageKeys.authInfo,
      JSON.stringify({})
    );
  }
}
