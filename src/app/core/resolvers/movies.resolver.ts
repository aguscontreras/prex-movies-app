import { ResolveFn } from '@angular/router';
import { Movie } from '../../models';
import { inject } from '@angular/core';
import { MoviesService } from '../../services';
import { forkJoin } from 'rxjs';

export const moviesResolver: ResolveFn<{
  movies: Movie[];
  genres: string[];
}> = () => {
  const moviesService = inject(MoviesService);
  return forkJoin({
    movies: moviesService.getMovies(),
    genres: moviesService.getGenres(),
  });
};
