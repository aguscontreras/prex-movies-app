import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  exhaustMap,
  from,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageKeys, StorageService } from '../storage';
import { ToastService } from '../toast/toast.service';
import { User } from '../../models';
import { Router } from '@angular/router';

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

  constructor(
    private http: HttpClient,
    private readonly storageService: StorageService,
    private readonly toastService: ToastService,
    private router: Router
  ) {
    this.retrieveUserFromStorage();
  }

  fetchUser(email: string): Observable<User> {
    const url = `${this.apiUrl}/${email}`;

    return this.http.get<User>(url, this.httpOptions).pipe(
      exhaustMap((user) =>
        from(this.storageService.set(StorageKeys.User, user))
      ),
      tap((user) => this.currentUser.next(user)),
      catchError((error) => {
        this.toastService.showDanger({ message: error.message });
        return EMPTY;
      })
    );
  }

  async removeUser() {
    this.currentUser.next(undefined);
    await this.storageService.remove(StorageKeys.User);
  }

  async retrieveUserFromStorage() {
    try {
      const user = await this.storageService.get<User>(StorageKeys.User);

      if (!!user) {
        this.currentUser.next(user);
        this.router.navigate(['/home']);
      }
    } catch (error) {
      this.currentUser.next(undefined);
    }
  }
}
