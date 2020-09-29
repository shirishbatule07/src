import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '../helpers/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { LogoutService } from '@app/shared/services/logout.service';

const log = new Logger('ErrorHandlerInterceptor');

/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private notification: NotificationService, private logoutService: LogoutService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(err: any): Observable<any> {
    if (err instanceof HttpErrorResponse) {
      if (!environment.production) {
        // Do something with the error
        log.error('Request error', err);
      }
      if (err.status === 401) {
        this.notification.error('Error', 'Your session has expired. Please relogin.');
        this.logoutService.logout();
      } else if (err.status === 400) {
        this.notification.error('Error', err.error.errorMessage);
      } else if (err.status === 0 || err.status === 500) {
        this.notification.error('Error', 'Something went Wrong, Please contact administrator.');
      }
    }
    return throwError(err);
  }
}
