import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ScrollDetail } from '@ionic/angular';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { FiltersService, MoviesService, ToastService } from '../../services';
import { FilterMoviePipe, MoviesListComponent } from '../../shared';
import { Movie } from '../../models';
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

  filterActive$ = this.filtersService.filterActive$;

  title = '';

  showFab = false;

  constructor(
    private readonly moviesService: MoviesService,
    private readonly filtersService: FiltersService,
    private router: Router,
    private modalController: ModalController,
    private toastService: ToastService
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

  ionViewDidEnter() {
    this.toastService.show({
      message: 'Slide down to get new movies',
      icon: 'arrow-down-circle-outline',
    });
  }

  async showAdvancedFilters() {
    const modal = await this.modalController.create({
      component: AdvancedFiltersComponent,
      cssClass: 'floating',
    });

    await modal.present();
  }

  handleScroll(ev: CustomEvent<ScrollDetail>) {
    this.showFab = ev.detail.scrollTop > 115;
  }
}
