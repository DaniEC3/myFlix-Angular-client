import { Component, OnInit, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { FetchApiDataService } from '../../services/fetch-api-data.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../services/auth.service';

import { User } from '../../Interfaces/user';

import { FavoriteMoviesComponent } from '../favorite-movies/favorite-movies';

import { DeleteConfirmationDialog } from '../../dialogs/delete-confirmation.dialog';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    FavoriteMoviesComponent
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {

  ngOnInit(): void {
    this.user = localStorage.getItem('user') || '';
    this.getUserInfo();    

  };
  constructor(
    public fetchApiData: FetchApiDataService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  userDetails: Partial<User> = {
    userName: '',
    password: '',
    email: '',
    birthDay: '',
    first_Name: '',
    last_Name: '',
    FavoriteMovies: [''],
  };

  user: string = localStorage.getItem('user') || 'null';
  favoriteMovies: string[] = []


  getUserInfo() {
    this.fetchApiData.getUserByName(this.user).subscribe({
      next: (result) => {
        this.userDetails = result;
        this.favoriteMovies = result.FavoriteMovies ?? [];
      },
      error: (error) => {
        console.log('Error fetching user info:', error)
      }
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog);

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteUser()
      }
    });
  }

  deleteUser(): void {
    if (!this.user) {
      console.error('No user defined to delete.');
      return;
    }

    this.fetchApiData.deleteUser(this.user).subscribe({
      next: (result) => {
        this.authService.setToken(null);
        localStorage.removeItem('user');


        this.snackBar.open(`User Removal Succesfully!`, 'OK', {
          duration: 2000
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log("Error deleting user:", error);
        this.snackBar.open('Failed to delete user. Try again later.', 'OK', {
          duration: 3000,
        });
      }
    })
  }

  updateUser(): void {
    if (!this.user) {
      console.error('No user defined to update.');
      return;
    }
    this.fetchApiData.editUser(this.user, this.userDetails).subscribe({
      next: () => {
        localStorage.setItem('user', (this.userDetails.userName) || 'null')
        this.snackBar.open('User profile updated successfully!', 'OK', {
          duration: 3000
        });
        this.user = localStorage.getItem('user') || 'null';
      },
      error: (error) => {
        console.log("Error updating user:", error)
      }
    })
  }
  
  removeFromFavorites(userName: string, movieName: string): void {
    this.fetchApiData.deleteMovieByName(userName, movieName).subscribe({
      next: () => {
        this.getUserInfo();
      },
      error: (err) => console.error('Error removing favorite:', err)
    });
  }
}

