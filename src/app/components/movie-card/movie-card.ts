import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../../services/fetch-api-data.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { Movie } from '../../Interfaces/movie';
import { Genre } from '../../Interfaces/genre';

import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.scss']
})
export class MovieCardComponent implements OnInit {

  constructor(
    public fetchApiData: FetchApiDataService,
    private authService: AuthService,
    private searchService: SearchService
  ) { }

  token: string | null = null;

  searchTerm = '';
  allMovies: Movie[] = [];
  filteredMovies: Movie[] = [];
  genres: Genre[] = [];
  private searchSub!: Subscription;

  ngOnInit(): void {

    this.authService.token$.subscribe(token => {
      this.token = token;
    })

    this.getGenres();
    this.getMovies();

    this.searchSub = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.filterMovies(term);
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe(); // clean up
  }

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
}
