import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { FetchApiDataService } from '../../services/fetch-api-data.service';

import { Movie } from '../../Interfaces/movie';

@Component({
  selector: 'app-favorite-movies',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule],

  templateUrl: './favorite-movies.html',
  styleUrls: ['./favorite-movies.scss']
})
export class FavoriteMoviesComponent implements OnInit {

  ngOnInit(): void {

    this.getMovieData();

  };


  constructor(
    private fetchApiData: FetchApiDataService
  ) {

  }

  favoriteMovies: Movie[] = [];

  getMovieData(): void {
    this.fetchApiData.getAllMovies()
      .subscribe({
        next: (result: Movie[]) => {
          this.favoriteMovies = result.filter(movie =>
              
            )
          
        },
        error: (err) => {
          console.log('Error fetching movie data:', err);
        }
      });
  }



}
