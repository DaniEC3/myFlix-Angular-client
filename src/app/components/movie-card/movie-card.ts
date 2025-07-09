import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../../services/fetch-api-data.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { Movie } from '../../Interfaces/movie';
import { Genre } from '../../Interfaces/genre';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.scss']
})
export class MovieCardComponent implements OnInit {

  constructor(
    public fetchApiData: FetchApiDataService,
  ) { }

  ngOnInit(): void {

    this.getGenres();
    this.getMovies();
  }

  movies: Movie[] = [];
  genres: Genre[] = [];

  getGenres(): void {
    this.fetchApiData.getGenres() //	Returns an Observable that will emit the list of movies when the API responds
      .subscribe({  //	This block runs when the data is successfully received
        next: (genres: Genre[]) => { // 	This block runs when the data is successfully received
          this.genres = genres;
          console.log(genres);
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
          this.movies = movies;
          console.log(movies);
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
}
