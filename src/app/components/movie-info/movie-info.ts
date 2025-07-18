import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchApiDataService } from '../../services/fetch-api-data.service';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Genre } from '../../Interfaces/genre';
import { Movie } from '../../Interfaces/movie';
import { Director } from '../../Interfaces/director';

/**
 * Displays detailed information about a specific movie,
 * including its genre and director.
 */
@Component({
  selector: 'app-movie-info',
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    RouterModule,
    DatePipe
  ],
  templateUrl: './movie-info.html',
  styleUrls: ['./movie-info.scss']
})
export class MovieInfoComponent implements OnInit {

  /**
   * The name of the movie from the route parameter.
   */
  movieName: string = '';

  /**
   * The movie data retrieved from the API.
   */
  movie: Movie | null = null;

  /**
   * Indicates whether data is still loading.
   */
  loading: Boolean = true;

  /**
   * All genres retrieved from the API.
   */
  genres: Genre[] = [];

  /**
   * The director of the current movie.
   */
  director: Director | null = null;

  /**
   * Creates the MovieInfoComponent instance.
   * @param route - ActivatedRoute to access route parameters.
   * @param fetchApiData - Service to fetch data from the API.
   */
  constructor(
    private route: ActivatedRoute,
    private fetchApiData: FetchApiDataService
  ) { }

  /**
   * Angular lifecycle method triggered on component initialization.
   * Fetches genre list, movie details, and the movie's director.
   */
  ngOnInit(): void {
    this.getGenres();
    this.movieName = this.route.snapshot.paramMap.get('name')!;
    this.fetchApiData.getMovieByName(this.movieName).subscribe({
      next: (data: Movie) => {
        this.movie = data;
        this.loading = false;

        // After loading movie, fetch director
        this.fetchApiData.getDirectors().subscribe({
          next: (directors: Director[]) => {
            const match = directors.find(d => d._id === this.movie?.director);
            if (match) {
              this.director = match;
            }
          },
          error: (err) => console.error('Error fetching directors:', err)
        });
      },
      error: (err) => {
        console.error('Failed to fetch movie:', err);
      }
    });
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
   * Gets the name of a genre given its ID.
   * @param genreId - The ID of the genre.
   * @returns The name of the genre or 'Unknown Genre' if not found.
   */
  getGenreInfo(genreId: string): string {
    const genre = this.genres.find(genre => genre._id === genreId);
    return genre ? genre.name : 'Unknown Genre';
  }

  /**
   * Fetches movie data based on the current movieName.
   * This method may be used for manual refresh or testing.
   */
  getMovieData(): void {
    this.fetchApiData.getMovieByName(this.movieName).subscribe({
      next: (movie: Movie) => {
        this.movie = movie;
        console.log(this.movie);
      },
      error: (err) => {
        console.log('Error fetching movie data:', err);
      }
    });
  }
}
