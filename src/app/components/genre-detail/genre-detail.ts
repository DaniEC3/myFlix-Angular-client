import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Genre } from '../../Interfaces/genre';
import { Movie } from '../../Interfaces/movie';
import { NgForm } from '@angular/forms';

/**
 * Modal component that displays detailed information about a specific genre
 * along with a list of movies that belong to that genre.
 */
@Component({
  selector: 'app-genre-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    NgFor,
    NgIf
  ],
  templateUrl: './genre-detail.html',
  styleUrls: ['./genre-detail.scss']
})
export class GenreDetailComponent {

  /**
   * A filtered list of movies that belong to the selected genre.
   */
  filteredMovies: Movie[] = [];

  /**
   * Creates the GenreDetailComponent instance.
   * Filters the movie list to include only those in the selected genre.
   *
   * @param data - The injected data containing the genre and all movies.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { genre: Genre, movies: Movie[] }
  ) {
    this.filteredMovies = data.movies.filter(
      movie => movie.genre === data.genre._id
    );
  }

  /**
   * Unused placeholder function for filtering movies.
   * May be removed or implemented if needed.
   */
  filteredMovie(): void {
    this.data.movies;
  }
}
