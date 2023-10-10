import { ResolveFn } from '@angular/router';
import { Movie } from '../../models';
import { inject } from '@angular/core';
import { MoviesService } from '../../services';

export const moviesResolver: ResolveFn<Movie[]> = () => {
  return inject(MoviesService).getMovies();
};
