import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '@env/environment';

/**
 * Prefixes all requests with `environment.serverUrl`.
 * Add Authorize Header
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private oauthService: OAuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.startsWith(environment.issuer)) return next.handle(request);

    const token = this.oauthService.getAccessToken();
    if (token) {
      request = request.clone({
        url: request.url,
        headers: request.headers.set('Authorization', 'bearer ' + token)
      });
    } else {
      return throwError('Invalid token or authorization has been denied for this request');
    }

    return next.handle(request);
  }
}
