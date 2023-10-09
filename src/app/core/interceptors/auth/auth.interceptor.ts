import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { EMPTY, Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../../services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isRefreshing = false;

  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
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
          catchError((err) => this.handleAuthError(err, requestClone, next))
        );
    }

    return next
      .handle(request)
      .pipe(catchError((err) => this.handleAuthError(err, request, next)));
  }

  private handleAuthError(
    err: any,
    request: HttpRequest<unknown>,
    next: HttpHandler
  ) {
    if (err.statusCode === 401 || err.statusCode === 403) {
      if (this.isRefreshing) {
        this.authService.signOut();
        return EMPTY;
      }

      this.isRefreshing = true;

      return this.authService.refreshToken().pipe(
        switchMap(({ access_token, refresh_token }) => {
          this.isRefreshing = false;

          const requestClone = request.clone({
            headers: request.headers
              .set('Authorization', `Bearer ${access_token}`)
              .set('x-refresh-token', refresh_token),
          });

          return next.handle(requestClone);
        })
      );
    }

    return throwError(() => err);
  }
}
