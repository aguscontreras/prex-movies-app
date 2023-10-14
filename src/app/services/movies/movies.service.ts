import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  concatMap,
  exhaustMap,
  from,
  map,
  mergeMap,
  of,
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

  private genres = new BehaviorSubject<string[]>([]);

  movies$ = this.movies.asObservable();

  selectedMovie$ = this.selectedMovie.asObservable();

  genres$ = this.genres.asObservable();

  constructor(
    private http: HttpClient,
    private readonly storageService: StorageService,
    private readonly toastService: ToastService
  ) {
    this.retrieveMoviesFromStorage();
    this.retrieveGenresFromStorage();
    this.initStorageSubscription();
  }

  private initStorageSubscription() {
    this.storageService.onClear$.subscribe((clean) => {
      if (clean) {
        this.movies.next([]);
        this.selectedMovie.next(undefined);
      }
    });
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
        if (movies.length > 0) ++page;
        await this.storageService.set(StorageKeys.MoviesPage, ++page);
        return movies;
      }),
      tap((movies) => this.movies.next(movies)),
      catchError(() => from(this.retrieveMoviesFromStorage())),
      catchError((error) => {
        this.toastService.showDanger({ message: error.message });
        return EMPTY;
      })
    );
  }

  getMovie(id: number): Observable<Movie | {}> {
    return from(this.storageService.get<Movie[]>(StorageKeys.Movies)).pipe(
      map((movies) => movies?.find((movie) => movie.id === id)),
      map((movie) => {
        if (!movie) {
          throw new Error('An error occurred while getting the movie details.');
        }

        return movie;
      }),
      tap((movie) => this.selectedMovie.next(movie)),
      catchError((error) => {
        this.toastService.showDanger({ message: error.message });
        return of({});
      })
    );
  }

  async retrieveMoviesFromStorage() {
    try {
      const movies = await this.storageService.get<Movie[]>(StorageKeys.Movies);
      this.movies.next(movies ?? []);
      return movies ?? [];
    } catch (error) {
      this.movies.next([]);
      return [];
    }
  }

  deleteMovie(id: number): Observable<Movie[]> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete<boolean>(url, this.httpOptions).pipe(
      mergeMap(() => this.deleteMovieLocal(id)),
      tap((movies) => this.movies.next(movies)),
      catchError((error) => {
        this.toastService.showDanger({ message: error.message });
        return EMPTY;
      })
    );
  }

  private async deleteMovieLocal(id: number): Promise<Movie[]> {
    const allMovies = await this.storageService.get<Movie[]>(
      StorageKeys.Movies
    );

    const newMovies = allMovies?.filter((movie) => movie.id !== id);

    await this.storageService.set(StorageKeys.Movies, newMovies);

    return newMovies ?? [];
  }

  updateMovie(updatedMovie: Movie): Observable<Movie> {
    const url = `${this.apiUrl}/${updatedMovie.id}`;
    const { coverBase64, ...movie } = updatedMovie;

    return this.http.put<Movie>(url, movie, this.httpOptions).pipe(
      concatMap((movie) => this.updateMovieLocal(movie)),
      tap(({ movie }) => this.selectedMovie.next(movie)),
      tap(({ movies }) => this.movies.next(movies)),
      map(({ movie }) => movie),
      catchError((error) => {
        this.toastService.showDanger({ message: error.message });
        return EMPTY;
      })
    );
  }

  private async updateMovieLocal(updatedMovie: Movie): Promise<{
    movie: Movie;
    movies: Movie[];
  }> {
    const allMovies = await this.storageService.get<Movie[]>(
      StorageKeys.Movies
    );

    if (!allMovies) {
      throw new Error('Movies not found in local storage');
    }

    const movieIndex = await allMovies?.findIndex(
      (m) => m.id === updatedMovie.id
    );

    if (movieIndex === -1) {
      throw new Error('Movie not found in local storage');
    }

    allMovies[movieIndex] = {
      ...allMovies[movieIndex],
      ...updatedMovie,
    };

    await this.storageService.set<Movie[]>(StorageKeys.Movies, allMovies);

    return { movie: updatedMovie, movies: allMovies };
  }

  getGenres(): Observable<string[]> {
    const url = `${this.apiUrl}/genres`;

    return from(this.retrieveGenresFromStorage()).pipe(
      exhaustMap((genres) =>
        genres ? of(genres) : this.http.get<string[]>(url, this.httpOptions)
      ),
      tap((genres) =>
        this.storageService.set<string[]>(StorageKeys.Genres, genres)
      ),
      tap((genres) => this.genres.next(genres)),
      catchError((error) => {
        this.toastService.showDanger({ message: error.message });
        return EMPTY;
      })
    );
  }

  async retrieveGenresFromStorage() {
    try {
      const genres = await this.storageService.get<string[]>(
        StorageKeys.Genres
      );

      this.genres.next(genres ?? []);
      return genres;
    } catch (error) {
      this.movies.next([]);
      return undefined;
    }
  }
}
