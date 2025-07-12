import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchApiDataService } from '../../services/fetch-api-data.service';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

import { Genre } from '../../Interfaces/genre';
import { Movie } from '../../Interfaces/movie';



@Component({
  selector: 'app-movie-info',
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './movie-info.html',
  styleUrls: ['./movie-info.scss']
})
export class MovieInfoComponent implements OnInit {
  movieName: string = '';
  movie: Movie | null = null;
  loading: Boolean = true;
  genres: Genre[] = [];

  constructor(
    private route: ActivatedRoute,
    private fetchApiData: FetchApiDataService
  ) { }

  ngOnInit(): void {
    this.movieName = this.route.snapshot.paramMap.get('name')!;
    this.fetchApiData.getMovieByName(this.movieName).subscribe({
      next: (data: Movie) => {
        this.movie = data
        this.loading = false;
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
