import { Routes } from '@angular/router';
import { UserLoginComponent } from './components/user-login/user-login';
import { MovieCardComponent } from './components/movie-card/movie-card';
import { UserRegistrationComponent } from './components/user-registration/user-registration';
import { GenreComponent } from './components/genre/genre';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
  {path: 'login',component: UserLoginComponent},
  {path: 'home',component: MovieCardComponent},
  {path: 'registration',component: UserRegistrationComponent},
  {path: 'profile',component: ProfileComponent},
  {path: 'genre',component: GenreComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
