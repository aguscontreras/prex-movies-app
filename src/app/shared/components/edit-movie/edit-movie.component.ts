import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services';
import { Movie } from '../../../models';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class EditMovieComponent implements OnInit {
  movie!: Movie;

  genres: string[] = [];

  form = this.initForm();

  readonly starsCount = Array(5);

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.patchForm(this.movie);
  }

  initForm() {
    return this.formBuilder.nonNullable.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      genres: [[''], [Validators.required]],
      releaseDate: [new Date(), [Validators.required]],
      coverUrl: ['', [Validators.required]],
      rating: [0, [Validators.required]],
    });
  }

  get rating() {
    return this.form.controls.rating;
  }

  get releaseDate() {
    return this.form.controls.releaseDate;
  }

  patchForm(movie: Movie) {
    this.form.patchValue({
      title: movie.title,
      description: movie.description,
      genres: movie.genres,
      releaseDate: movie.releaseDate,
      coverUrl: movie.coverUrl,
      rating: movie.rating,
    });
  }

  getRating(index: number, rating: number) {
    return index + 1 <= rating ? 'star' : 'star-outline';
  }

  onDismiss() {
    return this.modalController.dismiss(null, 'dismiss');
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.toastService.showDanger({
        message: 'Please review the entered data',
      });

      throw new Error('[Edit movie] Invalid form.');
    }

    const movie: Movie = { ...this.movie, ...this.form.value };

    await this.modalController.dismiss({ movie }, 'submit');
  }

  onDateChange(event: any) {
    this.releaseDate.setValue(event?.target.value);
  }
}
