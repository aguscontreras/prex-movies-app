import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthTokens, SignUpReq, User } from '../../models';
import { Observable, exhaustMap, tap } from 'rxjs';
import { UserService } from '../user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private tokens?: AuthTokens;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService,
    private readonly router: Router,
  ) {}

  signIn(email: string, password: string): Observable<User> {
    const url = `${this.apiUrl}/login`;
    const body = { email, password };

    return this.http.post<AuthTokens>(url, body, this.httpOptions).pipe(
      tap((tokens) => (this.tokens = tokens)),
      exhaustMap(() => this.userService.fetchUser(email)),
    );
  }

  signUp(body: SignUpReq): Observable<User> {
    const url = `${this.apiUrl}/register`;

    return this.http.post<User>(url, body, this.httpOptions);
  }

  signOut() {
    this.tokens = undefined;
    this.userService.removeUser();
    this.router.navigate(['/login']);
  }

  getTokens(): AuthTokens | undefined {
    return this.tokens;
  }

  refreshToken(): Observable<AuthTokens> {
    const url = `${this.apiUrl}/refresh`;
    return this.http
      .get<AuthTokens>(url, this.httpOptions)
      .pipe(tap((tokens) => (this.tokens = tokens)));
  }
}
