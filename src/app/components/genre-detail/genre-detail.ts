import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'; // ✅ correct import
import { Genre } from '../../Interfaces/genre';
import { Movie } from '../../Interfaces/movie';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-genre-detail',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    NgFor
  ],
  templateUrl: './genre-detail.html',
  styleUrls: ['./genre-detail.scss']
})
export class GenreDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public  data: {genre: Genre, movies: Movie[]}) {
    this.filteredMovies = data.movies.filter(
    movie => movie.genre === data.genre._id
    );
  }

  
filteredMovies: Movie[] = [];

  filteredMovie(): void {
    
    this.data.movies
  }
}
