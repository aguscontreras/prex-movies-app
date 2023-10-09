import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../../../models';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MoviesListComponent {
  @Input() movies: Movie[] | null = [];

  @Output() select = new EventEmitter<Movie>();

  @Output() edit = new EventEmitter<Movie>();

  readonly starsCount = Array(5);

  getRating(index: number, rating: number) {
    ++index;
    return index <= rating ? 'star' : 'star-outline';
  }

  onSelectMovie(movie: Movie) {
    this.select.emit(movie);
  }

  onEditMovie(movie: Movie) {
    this.edit.emit(movie);
  }

  getMovieId(index: number, item: { id: number }) {
    return item.id;
  }
}
