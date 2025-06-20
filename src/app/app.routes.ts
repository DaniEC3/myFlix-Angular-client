import { Routes } from '@angular/router';
import { UserLoginComponent } from './components/user-login/user-login';
import { HomePageComponent } from './components/home-page/home-page';
import { UserRegistrationComponent } from './components/user-registration/user-registration';

export const routes: Routes = [
  {path: 'login',component: UserLoginComponent},
  {path: 'home',component: HomePageComponent},
  {path: 'registration',component: UserRegistrationComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
