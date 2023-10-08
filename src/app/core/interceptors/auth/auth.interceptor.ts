import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, retry, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../../services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isRefreshing = false;

  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const tokens = this.authService.getTokens();

    if (tokens) {
      const { access_token, refresh_token } = tokens;

      const requestClone = request.clone({
        headers: request.headers
          .set('Authorization', `Bearer ${access_token}`)
          .set('x-refresh-token', refresh_token),
      });

      return next
        .handle(requestClone)
        .pipe(
          catchError((err) => this.handleAuthError(err, requestClone, next)),
        );
    }

    return next
      .handle(request)
      .pipe(catchError((err) => this.handleAuthError(err, request, next)));
  }

  private handleAuthError(
    err: HttpErrorResponse,
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ) {
    if (err.status === 401 || err.status === 403) {
      return this.authService.refreshToken().pipe(
        retry(3),
        switchMap(({ access_token, refresh_token }) => {
          this.isRefreshing = false;

          const requestClone = request.clone({
            headers: request.headers
              .set('Authorization', `Bearer ${access_token}`)
              .set('x-refresh-token', refresh_token),
          });

          return next.handle(requestClone);
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.signOut();
          return throwError(() => err);
        }),
      );
    }

    return throwError(() => err);
  }
}
