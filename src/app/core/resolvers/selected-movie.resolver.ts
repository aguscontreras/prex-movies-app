import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Movie } from '../../models';
import { inject } from '@angular/core';
import { MoviesService } from '../../services';
import { of } from 'rxjs';

export const selectedMovieResolver: ResolveFn<Movie | undefined> = (
  route: ActivatedRouteSnapshot
) => {
  const id = Number(route.paramMap.get('id'));

  console.log(id);

  if (!isNaN(id)) {
    return inject(MoviesService).getMovie(id);
  }

  return of(undefined);
};
