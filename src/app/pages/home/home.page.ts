import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MoviesListComponent } from '../../shared';
import { MoviesService } from '../../services';
import { finalize, take } from 'rxjs';
import { Router } from '@angular/router';
import { Movie } from '../../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MoviesListComponent],
})
export class HomePage implements OnInit {
  movies$ = this.moviesService.movies$;

  constructor(
    private readonly moviesService: MoviesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getMovies();
  }

  getMovies(event?: any) {
    this.moviesService
      .getMovies()
      .pipe(
        take(1),
        finalize(() => {
          event?.target?.complete();
        })
      )
      .subscribe();
  }

  editMovie(movie: Movie) {
    this.router.navigate([`/movie/${movie.id}`]);
  }
}
