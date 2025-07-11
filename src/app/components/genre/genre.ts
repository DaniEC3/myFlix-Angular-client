import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../../services/fetch-api-data.service';
import { NgFor, NgStyle, NgIf } from '@angular/common';

import { Genre } from '../../Interfaces/genre';
import { Movie } from '../../Interfaces/movie';

import { GenreDetailComponent } from '../genre-detail/genre-detail';

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [MatCardModule, NgFor, NgStyle, NgIf],
  templateUrl: './genre.html',
  styleUrls: ['./genre.scss']
})
export class GenreComponent {
  constructor(
    public fetchApiData: FetchApiDataService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getMovies()
    this.getGenres()
  }
  allGenres: Genre[] = [];
  allMovies: Movie[] = [];
  imagePath: Movie[] = [];
  randomGenre = "";
  filteredMovies: Movie[] = [];
  genreImageMap: { [genreId: string]: string } = {};
  loading: Boolean = true;


  getGenres(): void {
    this.fetchApiData.getGenres().subscribe({
      next: (genres: Genre[]) => {
        this.allGenres = genres;
        this.loading = false;
      },
      error: (err) => {
        console.log('Error fetching genres:', err);
        this.loading = false;
      }
    })
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies()
      .subscribe({
        next: (movies: Movie[]) => {
          this.allMovies = movies;

        },
        error: (err) => {
          console.log('Error fetching movies:', err);
        }
      })
  }

  getGenreImage(genreId: string): string {
    const matchingMovie = this.allMovies.find(movie => movie.genre === genreId);
    return matchingMovie?.imagePath || 'assets/images/default.jpg';
  }

  openGenreModal(genre: Genre): void {
    this.dialog.open(GenreDetailComponent, {
      data: {
        genre,
        movies: this.allMovies,
      },
       panelClass: 'custom-modal',
      width: '60vw',
      maxWidth: '600px'
    });
  }

}
