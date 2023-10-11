import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { AlertButton, IonicModule, ModalController } from '@ionic/angular';
import { switchMap, take, combineLatest, NEVER } from 'rxjs';
import { MoviesService, ToastService } from '../../services';
import { EditMovieComponent } from '../../shared';
import { Movie } from '../../models';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class DetailsPage {
  private readonly destroyRef = inject(DestroyRef);

  readonly starsCount = Array(5);

  movie$ = this.moviesService.selectedMovie$;

  public alertButtons: AlertButton[] = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Yes, delete',
      role: 'confirm',
      handler: () => this.deleteMovie(),
    },
  ];

  constructor(
    private readonly moviesService: MoviesService,
    private readonly toastService: ToastService,
    private modalController: ModalController,
    private router: Router
  ) {}

  deleteMovie() {
    this.movie$
      .pipe(
        switchMap((movie) => {
          if (movie) {
            return this.moviesService.deleteMovie(movie.id);
          } else {
            throw new Error('Movie not found');
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: async () => {
          const toast = await this.toastService.showSuccess({
            message: 'Movie deleted successfully',
          });
          await toast.onDidDismiss();
          this.router.navigate(['/home']);
        },
      });
  }

  onEdit() {
    combineLatest({
      movie: this.movie$,
      genres: this.moviesService.genres$,
    })
      .pipe(
        take(1),
        switchMap(({ movie, genres }) => {
          if (movie) {
            return this.openEditModal(movie, genres);
          } else {
            throw new Error('Movie not found');
          }
        }),
        switchMap((result) => {
          if (result.role === 'submit') {
            const movieData: Movie = result.data.movie;
            return this.moviesService.updateMovie(movieData);
          }

          return NEVER;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: async () => {
          await this.toastService.showSuccess({
            message: 'Movie updated successfully',
          });
        },
      });
  }

  async openEditModal(movie: Movie, genres: string[]) {
    const modal = await this.modalController.create({
      component: EditMovieComponent,
      componentProps: { movie, genres },
    });

    modal.present();

    return modal.onDidDismiss();
  }

  getRating(index: number, rating: number) {
    return index + 1 <= rating ? 'star' : 'star-outline';
  }
}
