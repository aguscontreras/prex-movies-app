import { Pipe, PipeTransform } from '@angular/core';
import { Movie } from '../../models';

@Pipe({
  name: 'filterMovie',
  standalone: true,
})
export class FilterMoviePipe implements PipeTransform {
  transform(movies: Movie[] | null, searchQuery: string): Movie[] {
    if (movies?.length) {
      return movies?.filter(({ title }) =>
        title.toUpperCase().includes(searchQuery.toUpperCase())
      );
    }

    return [];
  }
}
