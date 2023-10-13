import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FiltersService, MoviesService } from '../../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, take } from 'rxjs';

@Component({
  selector: 'app-advanced-filters',
  templateUrl: './advanced-filters.component.html',
  styleUrls: ['./advanced-filters.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class AdvancedFiltersComponent implements OnInit, AfterViewInit {
  form = this.initForm();

  starsCount = Array(5);

  genres$ = this.moviesService.genres$;

  filters$ = this.filtersService.filters$;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly filtersService: FiltersService,
    private readonly moviesService: MoviesService,
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const filters = { ...this.form.getRawValue() };
        this.filtersService.setFilters(filters);
      });
  }

  ngAfterViewInit(): void {
    this.filters$.pipe(take(1), delay(100)).subscribe((filters) =>
      this.form.patchValue({
        rating: filters?.rating ?? 0,
        genres: filters?.genres ?? [],
      })
    );
  }

  initForm() {
    return this.formBuilder.nonNullable.group({
      rating: [0],
      genres: [['']],
    });
  }

  get rating() {
    return this.form.controls.rating;
  }

  get genres() {
    return this.form.controls.genres;
  }

  toggleGenre(genre: string) {
    if (this.genres.value.includes(genre)) {
      this.removeGenre(genre);
    } else {
      this.addGenre(genre);
    }
  }

  addGenre(genre: string) {
    const currentGenres = this.genres.value;

    if (currentGenres) {
      this.genres.setValue([...currentGenres, genre]);
    }
  }

  removeGenre(genre: string) {
    const currentGenres = this.genres.value?.filter((e) => e !== genre);
    this.genres.setValue(currentGenres ?? []);
  }

  onSubmit() {
    this.modalController.dismiss();
  }

  getRating(index: number, rating: number) {
    return index + 1 <= rating ? 'star' : 'star-outline';
  }

  clearFilters() {
    this.form.reset({
      rating: 0,
      genres: [],
    });
  }
}
