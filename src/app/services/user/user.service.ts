import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private currentUser = new BehaviorSubject<User | undefined>(undefined);

  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {}

  fetchUser(email: string): Observable<User> {
    const url = `${this.apiUrl}/${email}`;

    return this.http
      .get<User>(url, this.httpOptions)
      .pipe(tap((user) => this.currentUser.next(user)));
  }

  removeUser() {
    this.currentUser.next(undefined);
  }
}
