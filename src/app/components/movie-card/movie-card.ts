import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../../services/fetch-api-data.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { Movie } from '../../Interfaces/movie';
import { Genre } from '../../Interfaces/genre';

import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';

import { GenreInformationDialog } from '../../dialogs/genre-information.dialog';

/**
 * Displays all movies in card format, handles filtering by search term,
 * favorite management, and genre-related actions.
 */
@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatDialogModule
  ],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.scss']
})
export class MovieCardComponent implements OnInit {

  /**
   * The user's authentication token.
   */
  token: string | null = null;

  /**
   * The current search term entered by the user.
   */
  searchTerm = '';

  /**
   * Full list of all movies retrieved from the API.
   */
  allMovies: Movie[] = [];

  /**
   * List of movies filtered by search input.
   */
  filteredMovies: Movie[] = [];

  /**
   * List of genres retrieved from the API.
   */
  genres: Genre[] = [];

  /**
   * Indicates whether the movie data is currently loading.
   */
  loading: Boolean = true;

  /**
   * Subscription to search term changes.
   */
  private searchSub!: Subscription;

  /**
   * The current username retrieved from local storage.
   */
  user: string = localStorage.getItem('user') || 'null';

  /**
   * List of favorite movie IDs for the current user.
   */
  favoriteMovies: string[] = [];

  /**
   * Initializes the MovieCardComponent with required services.
   * @param fetchApiData - Service to access the MyFlix API.
   * @param authService - Service to manage authentication state.
   * @param searchService - Service for global search functionality.
   * @param dialog - Angular Material dialog service.
   * @param router - Angular Router for navigation.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    private authService: AuthService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  /**
   * Angular lifecycle hook that runs after component initialization.
   * Subscribes to token and search term, and fetches genres, movies, and user info.
   */
  ngOnInit(): void {
    this.authService.token$.subscribe(token => {
      this.token = token;
    });

    this.getGenres();
    this.getMovies();
    this.getUserInfo();

    this.searchSub = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.filterMovies(term);
    });
  }

  /**
   * Unsubscribes from search term observable to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  /**
   * Fetches the list of genres from the API.
   */
  getGenres(): void {
    this.fetchApiData.getGenres().subscribe({
      next: (genres: Genre[]) => {
        this.genres = genres;
      },
      error: (err) => {
        console.log('Error fetching Genres:', err);
      }
    });
  }

  /**
   * Fetches all movies from the API and initializes the filtered list.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (movies: Movie[]) => {
        this.allMovies = movies;
        this.filteredMovies = movies;
        this.loading = false;
      },
      error: (err) => {
        console.log('Error fetching Movies:', err);
      }
    });
  }

  /**
   * Retrieves the genre name given a genre ID.
   * @param genreId - The ID of the genre.
   * @returns The genre name or 'Unknown Genre' if not found.
   */
  getGenreInfo(genreId: string): string {
    const genre = this.genres.find(genre => genre._id === genreId);
    return genre ? genre.name : 'Unknown Genre';
  }

  /**
   * Filters the list of movies based on a search term.
   * @param term - The search term used to filter movies by name.
   */
  filterMovies(term: string): void {
    if (!term) {
      this.filteredMovies = this.allMovies;
      return;
    }

    this.filteredMovies = this.allMovies.filter(movie =>
      movie.name.toLowerCase().includes(term)
    );
  }

  /**
   * Called when the search term is changed.
   * @param term - The new search term.
   */
  onSearchChanged(term: string): void {
    this.searchTerm = term;
    this.filteredMovies = this.allMovies.filter(movie =>
      movie.name.toLowerCase().includes(term)
    );
  }

  /**
   * Toggles a movie in the user's list of favorites.
   * Adds or removes it based on whether it is already a favorite.
   * @param movieId - ID of the movie to toggle.
   * @param movieName - Name of the movie to toggle.
   */
  toggleFavorite(movieId: string, movieName: string): void {
    if (this.isFavorite(movieId)) {
      this.fetchApiData.deleteMovieByName(this.user, movieName).subscribe({
        next: () => {
          this.favoriteMovies = this.favoriteMovies.filter(id => id !== movieId);
          console.log("FavoriteMovies", this.favoriteMovies);
        },
        error: (error) => console.error('Error removing favorite:', error)
      });
    } else {
      this.fetchApiData.addMoviebyName(this.user, movieName).subscribe({
        next: () => {
          this.favoriteMovies.push(movieId);
          console.log("FavoriteMovies", this.favoriteMovies);
        },
        error: (error) => console.error('Error adding favorite:', error)
      });
    }
  }

  /**
   * Retrieves user data and initializes the list of favorite movies.
   */
  getUserInfo(): void {
    this.fetchApiData.getUserByName(this.user).subscribe({
      next: (result) => {
        this.favoriteMovies = result?.FavoriteMovies || [];
      },
      error: (error) => {
        console.log('Error fetching user info:', error);
      }
    });
  }

  /**
   * Checks whether a movie is in the user's list of favorites.
   * @param movieId - ID of the movie.
   * @returns True if the movie is a favorite, false otherwise.
   */
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  /**
   * Removes a movie from the user's favorites and refreshes user data.
   * @param userName - Username of the user.
   * @param movieName - Name of the movie to remove.
   */
  removeFromFavorites(userName: string, movieName: string): void {
    this.fetchApiData.deleteMovieByName(userName, movieName).subscribe({
      next: () => {
        this.getUserInfo();
      },
      error: (err) => console.error('Error removing favorite:', err)
    });
  }

  /**
   * Opens a dialog to show more information about a selected genre.
   * @param genreId - The ID of the genre to display.
   */
  genreInfo(genreId: string): void {
    const genre = this.genres.find(g => g._id === genreId);

    if (!genre) {
      console.warn('Genre not found for ID:', genreId);
      return;
    }

    this.dialog.open(GenreInformationDialog, {
      data: {
        name: genre.name,
        description: genre.description
      },
      width: '300px'
    });
  }

}
