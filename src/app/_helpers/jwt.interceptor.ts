import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';
import { KeycloakService } from '@app/_services/keycloak/keycloak.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: KeycloakService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //const user = this.authenticationService.userValue;
    const isLoggedIn = this.authenticationService.keycloak.token;//user?.token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    const isApiUrlAcc = request.url.startsWith(environment.apiUrlAcc);
    if (isLoggedIn && (isApiUrl || isApiUrlAcc)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${/*user.token*/isLoggedIn}`,
        },
      });
    }

    return next.handle(request);
  }
}
