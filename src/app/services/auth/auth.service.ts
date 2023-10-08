import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthTokens, SignUpReq, User } from '../../models';
import { Observable, exhaustMap } from 'rxjs';
import { UserService } from '../user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService,
  ) {}

  signIn(email: string, password: string): Observable<User> {
    const url = `${this.apiUrl}/login`;
    const body = { email, password };

    return this.http
      .post<AuthTokens>(url, body, this.httpOptions)
      .pipe(exhaustMap(() => this.userService.fetchUser(email)));
  }

  signUp(body: SignUpReq): Observable<User> {
    const url = `${this.apiUrl}/register`;

    return this.http.post<User>(url, body, this.httpOptions);
  }
}
