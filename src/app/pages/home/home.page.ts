import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { MoviesService } from '../../services';
import { MoviesListComponent } from '../../shared';
import { Movie } from '../../models';
import { FilterMoviePipe } from '../../pipes';

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

  filter = '';

  constructor(
    private readonly moviesService: MoviesService,
    private router: Router
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
}
