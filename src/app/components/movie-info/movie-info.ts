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
  movieName: string = '';
  movie: Movie | null = null;
  loading: Boolean = true;
  genres: Genre[] = [];
  director: Director | null = null;

  constructor(
    private route: ActivatedRoute,
    private fetchApiData: FetchApiDataService
  ) { }

  ngOnInit(): void {
    this.getGenres()
    this.movieName = this.route.snapshot.paramMap.get('name')!;
    this.fetchApiData.getMovieByName(this.movieName).subscribe({
      next: (data: Movie) => {
        this.movie = data
        this.loading = false;
        // Get director after movie is loaded
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
        console.error('Failed to fetch movie:', err)
      }
    });
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

  getGenreInfo(genreId: string): string {
    const genre = this.genres.find(genre => genre._id === genreId);
    return genre ? genre.name : 'Unknown Genre';
  }

  getMovieData(): void {
    this.fetchApiData.getMovieByName(this.movieName)
      .subscribe({
        next: (movie: Movie) => {
          this.movie = movie;
          console.log(this.movie)
        },
        error: (err) => {
          console.log('Error fetching movie data:', err);
        }
      });
  }
}
