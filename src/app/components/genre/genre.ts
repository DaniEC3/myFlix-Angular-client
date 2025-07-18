import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../../services/fetch-api-data.service';
import { NgFor, NgStyle, NgIf } from '@angular/common';

import { Genre } from '../../Interfaces/genre';
import { Movie } from '../../Interfaces/movie';

import { GenreDetailComponent } from '../genre-detail/genre-detail';

/**
 * Displays all available genres and a visual preview of their related movies.
 * Allows users to view detailed genre information in a modal dialog.
 */
@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [MatCardModule, NgFor, NgStyle, NgIf],
  templateUrl: './genre.html',
  styleUrls: ['./genre.scss']
})
export class GenreComponent {

  /**
   * All genres fetched from the API.
   */
  allGenres: Genre[] = [];

  /**
   * All movies fetched from the API.
   */
  allMovies: Movie[] = [];

  /**
   * Stores a list of movies used for displaying images.
   */
  imagePath: Movie[] = [];

  /**
   * Stores the currently selected genre name (if any).
   */
  randomGenre = "";

  /**
   * Movies filtered by a selected genre.
   */
  filteredMovies: Movie[] = [];

  /**
   * A map associating each genre ID with a preview image path.
   */
  genreImageMap: { [genreId: string]: string } = {};

  /**
   * Boolean to indicate loading state while data is being fetched.
   */
  loading: Boolean = true;

  /**
   * Creates an instance of GenreComponent.
   * @param fetchApiData - Service for making API calls.
   * @param dialog - Angular Material dialog service.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    private dialog: MatDialog
  ) { }

  /**
   * Angular lifecycle method triggered on component initialization.
   * Fetches all genres and movies from the API.
   */
  ngOnInit(): void {
    this.getMovies();
    this.getGenres();
  }

  /**
   * Fetches all available genres from the backend API.
   */
  getGenres(): void {
    this.fetchApiData.getGenres().subscribe({
      next: (genres: Genre[]) => {
        this.allGenres = genres;
        this.loading = false;
      },
      error: (err) => {
        console.log('Error fetching genres:', err);
        this.loading = false;
      }
    });
  }

  /**
   * Fetches all movies from the backend API.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies()
      .subscribe({
        next: (movies: Movie[]) => {
          this.allMovies = movies;
        },
        error: (err) => {
          console.log('Error fetching movies:', err);
        }
      });
  }

  /**
   * Returns the image path of the first movie matching a given genre.
   * Used to display a preview image for each genre card.
   *
   * @param genreId - The genre name to find a movie for.
   * @returns The image path or a default image if no match is found.
   */
  getGenreImage(genreId: string): string {
    const matchingMovie = this.allMovies.find(movie => movie.genre === genreId);
    return matchingMovie?.imagePath || 'assets/images/default.jpg';
  }

  /**
   * Opens a modal dialog displaying details about the selected genre,
   * including a list of related movies.
   *
   * @param genre - The genre to display in the modal.
   */
  openGenreModal(genre: Genre): void {
    this.dialog.open(GenreDetailComponent, {
      data: {
        genre,
        movies: this.allMovies,
      },
      panelClass: 'custom-modal',
      width: '60vw',
      maxWidth: '600px'
    });
  }
}
