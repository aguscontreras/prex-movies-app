import { Pipe, PipeTransform } from '@angular/core';
import { Movie } from '../../models';
import { AdvancedFilter } from '../../services';

@Pipe({
  name: 'filterMovie',
  standalone: true,
})
export class FilterMoviePipe implements PipeTransform {
  transform(
    movies: Movie[] | null,
    movieTitle: string,
    advancedFilters?: AdvancedFilter | null
  ): Movie[] {
    if (!movies) return [];

    if (advancedFilters) {
      const { rating, genres } = advancedFilters;

      if (rating) {
        movies = movies.filter((m) => m.rating <= rating);
      }

      if (genres && genres.length) {
        movies = movies.filter((m) => m.genres.some((e) => genres.includes(e)));
      }
    }

    return movies.filter(({ title }) =>
      title.toUpperCase().includes(movieTitle.toUpperCase())
    );
  }
}
