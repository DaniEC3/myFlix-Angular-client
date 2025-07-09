import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MovieCardComponent } from '../movie-card/movie-card';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MovieCardComponent,
    RouterModule,
  ],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss']
})
export class HomePageComponent {

  constructor(private router: Router) { }

  goToMovie(movieId: string) {
    this.router.navigate(['/movies', movieId]);
  }
}
