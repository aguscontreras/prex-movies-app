import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { FiltersService, MoviesService } from '../../services';
import { MoviesListComponent } from '../../shared';
import { Movie } from '../../models';
import { FilterMoviePipe } from '../../pipes';
import { AdvancedFiltersComponent } from '../../shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MoviesListComponent,
    FilterMoviePipe,
  ],
})
export class HomePage {
  movies$ = this.moviesService.movies$;

  advancedFilters$ = this.filtersService.filters$;

  title = '';

  constructor(
    private readonly moviesService: MoviesService,
    private readonly filtersService: FiltersService,
    private router: Router,
    private modalController: ModalController
  ) {}

  getMovies(event?: any) {
    this.movies$ = this.moviesService.getMovies().pipe(
      finalize(() => {
        event?.target?.complete();
      })
    );
  }

  editMovie(movie: Movie) {
    this.router.navigate([`/details/${movie.id}`]);
  }

  async showAdvancedFilters() {
    const modal = await this.modalController.create({
      component: AdvancedFiltersComponent,
      cssClass: 'floating',
    });

    await modal.present();
  }
}
