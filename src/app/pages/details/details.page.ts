import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { AlertButton, IonicModule, ModalController } from '@ionic/angular';
import { switchMap, take, combineLatest, NEVER, tap } from 'rxjs';
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

  alertButtons: AlertButton[] = [
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

  imgFallback = '/assets/img/img-fallback.png';

  constructor(
    private readonly moviesService: MoviesService,
    private readonly toastService: ToastService,
    private modalController: ModalController,
    private router: Router
  ) {}

  deleteMovie() {
    this.movie$
      .pipe(
        take(1),
        switchMap((movie) =>
          movie ? this.moviesService.deleteMovie(movie.id) : NEVER
        ),
        tap(() =>
          this.toastService.showSuccess({
            message: 'Movie deleted successfully',
          })
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.router.navigate(['/home']));
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
            return NEVER;
          }
        }),
        switchMap(({ data: movie }) =>
          movie ? this.moviesService.updateMovie(movie) : NEVER
        ),
        tap(() =>
          this.toastService.showSuccess({
            message: 'Movie updated successfully',
          })
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  async openEditModal(movie: Movie, genres: string[]) {
    const modal = await this.modalController.create({
      component: EditMovieComponent,
      componentProps: { movie, genres },
    });

    await modal.present();

    return modal.onDidDismiss<Movie>();
  }

  getRating(index: number, rating: number) {
    return index + 1 <= rating ? 'star' : 'star-outline';
  }

  onImgError(movie: Movie) {
    movie.coverBase64 = this.imgFallback;
  }
}
