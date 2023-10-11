import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Movie } from '../../models';
import { inject } from '@angular/core';
import { MoviesService } from '../../services';

export const selectedMovieResolver: ResolveFn<Movie | {}> = (
  route: ActivatedRouteSnapshot
) => {
  const id = Number(route.paramMap.get('id'));
  return inject(MoviesService).getMovie(id);
};
