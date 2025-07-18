import { Component, OnInit, Optional, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { FetchApiDataService } from '../../services/fetch-api-data.service';
import { LoginCredentials } from '../../Interfaces/login';
import { AuthService } from '../../services/auth.service';

/**
 * Component responsible for handling user login.
 * Provides input fields for username and password,
 * and authenticates the user with the backend API.
 */
@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './user-login.html',
  styleUrls: ['./user-login.scss']
})
export class UserLoginComponent implements OnInit {

  /**
   * User login credentials (username and password).
   * Passed in optionally via parent component binding.
   */
  @Input() credentials: LoginCredentials = {
    userName: '',
    password: '',
  };

  /**
   * User password value used for two-way binding or display logic.
   */
  userPassword: string = '';

  /**
   * Flag for toggling password visibility.
   */
  showpassword = false;

  /**
   * Creates an instance of UserLoginComponent with injected services.
   * @param fetchApiData - API service for login.
   * @param snackBar - Snackbar for showing login feedback.
   * @param router - Angular router for navigation.
   * @param authService - Authentication state management service.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Angular lifecycle method that runs on component initialization.
   */
  ngOnInit(): void {}

  /**
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility(): void {
    this.showpassword = !this.showpassword;
  }

  /**
   * Sends the login request to the API.
   * On success, stores the token and user in localStorage,
   * sets the token in the AuthService, shows a success message,
   * and navigates to the home page.
   * On error, displays a snackbar with an error message.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.credentials).subscribe({
      next: (result) => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', result.user.userName);

        this.authService.setToken(result.token);

        this.snackBar.open(`Welcome back, ${result.user.userName}!`, 'OK', {
          duration: 2000
        });

        this.router.navigate(['/home']);
      },
      error: () => {
        this.snackBar.open('Login failed. Please check your credentials', 'OK', {
          duration: 2000
        });
      }
    });
  }

}
