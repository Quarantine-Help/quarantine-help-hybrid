import { Injectable, OnInit } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  authSubs: Subscription;
  authToken: string;
  constructor(private authService: AuthService) {
    this.authSubs = this.authService.user.subscribe((user) => {
      if (user && user.email !== undefined && user.token !== undefined) {
        this.authToken = user.token;
      } else {
        this.authToken = '';
      }
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = this.addAuthenticationToken(req);
    return next.handle(req);
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    if (this.authToken === '') {
      return request;
    }

    // Avoid Auth token for external API's
    if (request.url.indexOf(environment.DJANGO_API_ENDPOINT) === -1) {
      return request;
    }

    // Avoid Auth token for the auth APIs.
    const isNonAuthAPIs =
      request.url.indexOf(`/${this.authService.authAPISuffix}/`) === -1;
    if (!isNonAuthAPIs) {
      return request;
    }

    return request.clone({
      headers: request.headers.set(`Authorization`, `Token ${this.authToken}`),
    });
  }
}
