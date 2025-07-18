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

  constructor(
    public fetchApiData: FetchApiDataService,
    private authService: AuthService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private router: Router,

  ) { }

  token: string | null = null;

  searchTerm = '';
  allMovies: Movie[] = [];
  filteredMovies: Movie[] = [];
  genres: Genre[] = [];
  loading: Boolean = true;
  private searchSub!: Subscription;

  ngOnInit(): void {

    this.authService.token$.subscribe(token => {
      this.token = token;
    })

    this.getGenres();
    this.getMovies();
    this.getUserInfo();

    this.searchSub = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.filterMovies(term);
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe(); // clean up
  }

  user: string = localStorage.getItem('user') || 'null';
  favoriteMovies: string[] = []

  getGenres(): void {
    this.fetchApiData.getGenres() //	Returns an Observable that will emit the list of movies when the API responds
      .subscribe({  //	This block runs when the data is successfully received
        next: (genres: Genre[]) => { // 	This block runs when the data is successfully received
          this.genres = genres;
        },
        error: (err) => {
          console.log('Error fetching Genres:', err);
        }
      });
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies() //	Returns an Observable that will emit the list of movies when the API responds
      .subscribe({  //	This block runs when the data is successfully received
        next: (movies: Movie[]) => { // 	This block runs when the data is successfully received
          this.allMovies = movies;
          this.filteredMovies = movies;
          this.loading = false;
        },
        error: (err) => {
          console.log('Error fetching Movies:', err);
        }
      });
  }

  getGenreInfo(genreId: string): string {
    const genre = this.genres.find(genre => genre._id === genreId);
    return genre ? genre.name : 'Unknown Genre';
  }

  filterMovies(term: string): void {
    if (!term) {
      this.filteredMovies = this.allMovies;
      return;
    }

    this.filteredMovies = this.allMovies.filter(movie =>
      movie.name.toLowerCase().includes(term)
    );
  }


  onSearchChanged(term: string) {
    this.searchTerm = term;
    this.filteredMovies = this.allMovies.filter(movie =>
      movie.name.toLowerCase().includes(term)
    );
  }

  toggleFavorite(movieId: string, movieName: string): void {
    if (this.isFavorite(movieId)) {
      this.fetchApiData.deleteMovieByName(this.user, movieName).subscribe({
        next: () => {
          this.favoriteMovies = this.favoriteMovies.filter(id => id !== movieId);
          console.log("FavoriteMovies", this.favoriteMovies)

        },
        error: (error) => console.error('Error removing favorite:', error)
      });
    } else {
      this.fetchApiData.addMoviebyName(this.user, movieName).subscribe({
        next: () => {
          this.favoriteMovies.push(movieId);
          console.log("FavoriteMovies", this.favoriteMovies)
        },
        error: (error) => console.error('Error adding favorite:', error)
      });
    }
  }


  getUserInfo(): void {
    this.fetchApiData.getUserByName(this.user).subscribe({
      next: (result) => {
        this.favoriteMovies = result?.FavoriteMovies || [];
      },
      error: (error) => {
        console.log('Error fetching user info:', error)
      }
    })
  }
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  removeFromFavorites(userName: string, movieName: string): void {
    this.fetchApiData.deleteMovieByName(userName, movieName).subscribe({
      next: () => {
        this.getUserInfo();
      },
      error: (err) => console.error('Error removing favorite:', err)
    });
  }

  genreInfo(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.dialog.open(GenreInformationDialog, {
      position: {
        top: `${rect.top + window.scrollY}px`,
        left: `${rect.right + 8}px` // appears slightly to the right of the button
      },
      panelClass: 'custom-dialog-panel'
    });
  }

}
