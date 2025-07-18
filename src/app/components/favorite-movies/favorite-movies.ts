import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { FetchApiDataService } from '../../services/fetch-api-data.service';
import { Movie } from '../../Interfaces/movie';

/**
 * Displays a user's list of favorite movies.
 * Fetches user info and movie data, filters favorites,
 * and allows users to remove movies from their favorites.
 */
@Component({
  selector: 'app-favorite-movies',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './favorite-movies.html',
  styleUrls: ['./favorite-movies.scss']
})
export class FavoriteMoviesComponent implements OnInit {

  /**
   * Stores the list of favorite movie IDs retrieved from the user data.
   */
  favoriteMoviesIds: string[] = [];

  /**
   * Stores the filtered list of favorite movie objects.
   */
  filteredMovies: Movie[] = [];

  /**
   * Stores all available movies from the database.
   */
  allMovies: Movie[] = [];

  /**
   * The current username, retrieved from local storage.
   */
  user: string = localStorage.getItem('user') || 'null';

  /**
   * Initializes the component by fetching user data.
   */
  ngOnInit(): void {
    this.getUserInfo();
  }

  /**
   * Injects the API data service.
   * @param fetchApiData - The service used to communicate with the backend API.
   */
  constructor(
    private fetchApiData: FetchApiDataService
  ) { }

  /**
   * Retrieves user data, including the list of favorite movie IDs.
   * On success, it triggers the movie filtering process.
   */
  getUserInfo(): void {
    this.fetchApiData.getUserByName(this.user).subscribe({
      next: (result) => {
        this.favoriteMoviesIds = result.FavoriteMovies || [];
        this.getMovieData();
      },
      error: (error) => {
        console.log('Error fetching user info:', error);
      }
    });
  }

  /**
   * Fetches all movies and filters them by favorite IDs.
   * The filtered movies are displayed in the UI.
   */
  getMovieData(): void {
    this.fetchApiData.getAllMovies()
      .subscribe({
        next: (result: Movie[]) => {
          this.allMovies = result;
          this.filteredMovies = this.allMovies.filter(movie =>
            this.favoriteMoviesIds.includes(movie._id)
          );
        },
        error: (err) => {
          console.log('Error fetching movie data:', err);
        }
      });
  }

  /**
   * Removes a movie from the user's list of favorites.
   * Also updates the displayed movie list after deletion.
   *
   * @param movieName - The name of the movie to be removed.
   */
  deleteFavorite(movieName: string): void {
    this.fetchApiData.deleteMovieByName(this.user, movieName).subscribe({
      next: () => {
        this.filteredMovies = this.filteredMovies.filter(movie =>
          movie.name !== movieName
        );
        console.log("filteredMovies", this.filteredMovies);
      },
      error: (error) => console.error('Error removing favorite:', error)
    });
  }

}
