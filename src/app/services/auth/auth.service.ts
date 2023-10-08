import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SignUpReq, User } from '../../models';
import { Observable } from 'rxjs';

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

  constructor(private readonly http: HttpClient) {}

  signIn(email: string, password: string) {
    const url = `${this.apiUrl}/login`;
    const body = { email, password };

    return this.http.post(url, body, this.httpOptions);
  }

  signUp(body: SignUpReq): Observable<User> {
    const url = `${this.apiUrl}/register`;

    return this.http.post<User>(url, body, this.httpOptions);
  }
}
