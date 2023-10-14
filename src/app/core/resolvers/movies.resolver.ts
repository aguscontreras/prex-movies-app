import { ResolveFn, Router } from '@angular/router';
import { Movie } from '../../models';
import { inject } from '@angular/core';
import { MoviesService } from '../../services';
import { combineLatest, first } from 'rxjs';

export const moviesResolver: ResolveFn<{
  movies: Movie[];
  genres: string[];
}> = () => {
  const router = inject(Router);

  const [, lastRoute] = router.routerState.snapshot.url.split('/');

  const moviesService = inject(MoviesService);

  return combineLatest({
    movies:
      lastRoute === 'details'
        ? moviesService.movies$
        : moviesService.getMovies(),
    genres: moviesService.getGenres(),
  }).pipe(first());
};
