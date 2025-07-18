import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { FetchApiDataService } from '../../services/fetch-api-data.service';

import { Movie } from '../../Interfaces/movie';

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

  ngOnInit(): void {

    this.getUserInfo();

  };


  constructor(
    private fetchApiData: FetchApiDataService
  ) {

  }

  favoriteMoviesIds: string[] = [];
  filteredMovies: Movie[] = [];
  allMovies: Movie[] = [];
  user: string = localStorage.getItem('user') || 'null';


  getUserInfo() {
    this.fetchApiData.getUserByName(this.user).subscribe({
      next: (result) => {
        this.favoriteMoviesIds = result.FavoriteMovies || [];
        this.getMovieData();
      },
      error: (error) => {
        console.log('Error fetching user info:', error)
      }
    })
  }

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

  deleteFavorite(movieName: string): void {
    this.fetchApiData.deleteMovieByName(this.user, movieName).subscribe({
      next: () => {
        this.filteredMovies = this.filteredMovies.filter(movie =>
          movie.name !== movieName
        );
        console.log("filteredMovies", this.filteredMovies)

      },
      error: (error) => console.error('Error removing favorite:', error)
    });

  }

}
