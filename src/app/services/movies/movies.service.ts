import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  exhaustMap,
  from,
  map,
  tap,
} from 'rxjs';
import { ToastService } from '../toast';
import { StorageKeys, StorageService } from '../storage';
import { environment } from '../../../environments/environment';
import { Movie } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private readonly apiUrl = `${environment.apiUrl}/movies`;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private movies = new BehaviorSubject<Movie[]>([]);

  private selectedMovie = new BehaviorSubject<Movie | undefined>(undefined);

  movies$ = this.movies.asObservable();

  selectedMovie$ = this.selectedMovie.asObservable();

  constructor(
    private http: HttpClient,
    private readonly storageService: StorageService,
    private readonly toastService: ToastService
  ) {
    this.retrieveMoviesFromStorage();
  }

  getMovies(): Observable<Movie[]> {
    const url = this.apiUrl;
    let page = 1;

    return from(this.storageService.get<number>(StorageKeys.MoviesPage)).pipe(
      exhaustMap((storedPage) => {
        page = storedPage ?? page;
        return this.http.get<Movie[]>(url, {
          params: { page },
          ...this.httpOptions,
        });
      }),
      exhaustMap((movies) => {
        const savedMovies = [...movies, ...this.movies.value];
        return this.storageService.set(StorageKeys.Movies, savedMovies);
      }),
      exhaustMap(async (movies) => {
        await this.storageService.set(StorageKeys.MoviesPage, ++page);
        return movies;
      }),
      tap((movies) => this.movies.next(movies)),
      catchError((error) => {
        this.toastService.showDanger({ message: error.message });
        return EMPTY;
      })
    );
  }

  getMovie(id: number): Observable<Movie | undefined> {
    return from(this.storageService.get<Movie[]>(StorageKeys.Movies)).pipe(
      map((movies) => movies?.find((movie) => movie.id === id)),
      map((movie) => {
        if (!movie) {
          throw new Error('An error occurred while getting the movie details.');
        }

        return movie;
      }),
      tap((movie) => this.selectedMovie.next(movie)),
      catchError(() => EMPTY)
    );
  }

  async retrieveMoviesFromStorage() {
    try {
      const movies = await this.storageService.get<Movie[]>(StorageKeys.Movies);
      this.movies.next(movies ?? []);
    } catch (error) {
      this.movies.next([]);
      console.error(error);
    }
  }
}
