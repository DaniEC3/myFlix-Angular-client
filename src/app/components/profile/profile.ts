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

/**
 * The ProfileComponent allows a user to view and update their personal profile information.
 * Users can also delete their account and remove movies from their list of favorites.
 */
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

  /**
   * Stores the current username, retrieved from local storage.
   */
  user: string = localStorage.getItem('user') || 'null';

  /**
   * Stores the user's full profile details.
   */
  userDetails: Partial<User> = {
    userName: '',
    password: '',
    email: '',
    birthDay: '',
    first_Name: '',
    last_Name: '',
    FavoriteMovies: [''],
  };

  /**
   * List of the user's favorite movie IDs.
   */
  favoriteMovies: string[] = [];

  /**
   * Initializes the component and retrieves user information.
   */
  ngOnInit(): void {
    this.user = localStorage.getItem('user') || '';
    this.getUserInfo();    
  }

  /**
   * Constructs the ProfileComponent with injected services.
   * @param fetchApiData - Service to handle API requests.
   * @param authService - Service for managing authentication tokens.
   * @param router - Angular router for navigation.
   * @param snackBar - Snackbar for user notifications.
   * @param dialog - Dialog service for confirmation modals.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  /**
   * Retrieves user details and updates local state.
   */
  getUserInfo(): void {
    this.fetchApiData.getUserByName(this.user).subscribe({
      next: (result) => {
        this.userDetails = result;
        this.favoriteMovies = result.FavoriteMovies ?? [];
      },
      error: (error) => {
        console.log('Error fetching user info:', error);
      }
    });
  }

  /**
   * Opens a confirmation dialog before proceeding with user deletion.
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog);

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteUser();
      }
    });
  }

  /**
   * Deletes the user profile after confirmation.
   * Clears local storage and navigates back to login.
   */
  deleteUser(): void {
    if (!this.user) {
      console.error('No user defined to delete.');
      return;
    }

    this.fetchApiData.deleteUser(this.user).subscribe({
      next: () => {
        this.authService.setToken(null);
        localStorage.removeItem('user');
        this.snackBar.open('User Removal Successfully!', 'OK', {
          duration: 2000
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log('Error deleting user:', error);
        this.snackBar.open('Failed to delete user. Try again later.', 'OK', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Updates the user's profile information via the API.
   */
  updateUser(): void {
    if (!this.user) {
      console.error('No user defined to update.');
      return;
    }

    this.fetchApiData.editUser(this.user, this.userDetails).subscribe({
      next: () => {
        localStorage.setItem('user', this.userDetails.userName || 'null');
        this.snackBar.open('User profile updated successfully!', 'OK', {
          duration: 3000
        });
        this.user = localStorage.getItem('user') || 'null';
      },
      error: (error) => {
        console.log('Error updating user:', error);
      }
    });
  }

  /**
   * Removes a movie from the user's list of favorites.
   * @param userName - The username of the user.
   * @param movieName - The name of the movie to remove.
   */
  removeFromFavorites(userName: string, movieName: string): void {
    this.fetchApiData.deleteMovieByName(userName, movieName).subscribe({
      next: () => {
        this.getUserInfo();
      },
      error: (err) => console.error('Error removing favorite:', err)
    });
  }
}
