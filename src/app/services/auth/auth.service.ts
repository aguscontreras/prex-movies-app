import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  EMPTY,
  Observable,
  catchError,
  concatMap,
  exhaustMap,
  from,
  tap,
} from 'rxjs';
import { UserService } from '../user';
import { ToastService } from '../toast';
import { AuthTokens, SignUpReq, User } from '../../models';
import { StorageKeys, StorageService } from '../storage';

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
    private readonly toastService: ToastService,
    private readonly storageService: StorageService
  ) {
    this.retrieveTokensFromStorage();
  }

  get isUserLoggedIn() {
    return !!this.tokens;
  }

  signIn(email: string, password: string): Observable<User> {
    const url = `${this.apiUrl}/login`;
    const body = { email, password };

    return this.http.post<AuthTokens>(url, body, this.httpOptions).pipe(
      concatMap((tokens) =>
        from(this.storageService.set(StorageKeys.Tokens, tokens))
      ),
      tap((tokens) => (this.tokens = tokens)),
      concatMap(() => this.userService.fetchUser(email)),
      catchError((error) => {
        this.toastService.showDanger({ message: error.message });
        return EMPTY;
      })
    );
  }

  signUp(body: SignUpReq): Observable<User> {
    const url = `${this.apiUrl}/register`;

    return this.http.post<User>(url, body, this.httpOptions).pipe(
      catchError((error) => {
        this.toastService.showDanger({ message: error.message });
        return EMPTY;
      })
    );
  }

  async signOut() {
    await this.storageService.clear();
    this.tokens = undefined;
    this.router.navigate(['/pre-home']);
  }

  getTokens(): AuthTokens | undefined {
    return this.tokens;
  }

  refreshToken(): Observable<AuthTokens> {
    const url = `${this.apiUrl}/refresh`;

    return this.userService.currentUser$.pipe(
      exhaustMap((user) => {
        const body = {
          email: user?.email,
          userId: user?.id,
        };

        return this.http.post<AuthTokens>(url, body, this.httpOptions).pipe(
          exhaustMap((tokens) =>
            from(this.storageService.set(StorageKeys.Tokens, tokens))
          ),
          tap((tokens) => (this.tokens = tokens)),
          catchError((error) => {
            this.toastService.showDanger({ message: error.message });
            return EMPTY;
          })
        );
      })
    );
  }

  async retrieveTokensFromStorage() {
    try {
      this.tokens = await this.storageService.get<AuthTokens>(
        StorageKeys.Tokens
      );
      return this.tokens;
    } catch (error) {
      this.signOut();
      return undefined;
    }
  }
}
