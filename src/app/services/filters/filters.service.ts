import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface AdvancedFilter {
  rating?: number;
  genres?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private filters = new BehaviorSubject<AdvancedFilter | undefined>(undefined);

  filters$ = this.filters.asObservable();

  filterActive$ = this.filters$.pipe(
    map((filters) => {
      return filters?.rating || filters?.genres?.length;
    })
  );

  setFilters(filters: AdvancedFilter) {
    this.filters.next(filters);
  }

  clearFilters() {
    this.filters.next(undefined);
  }
}
