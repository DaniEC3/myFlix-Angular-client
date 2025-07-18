// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../../services/fetch-api-data.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../Interfaces/user';
import { Router } from '@angular/router';

/**
 * Component responsible for registering new users.
 * Accepts user details, sends them to the backend API,
 * and displays a success or error message accordingly.
 */
@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './user-registration.html',
  styleUrls: ['./user-registration.scss']
})
export class UserRegistrationComponent implements OnInit {

  /**
   * Object containing user input fields for registration.
   */
  @Input() userDetails: Partial<User> = {
    userName: '',
    password: '',
    email: '',
    birthDay: '',
    first_Name: '',
    last_Name: ''
  };

  /**
   * Creates the UserRegistrationComponent instance.
   * @param fetchApiData - Service used to send API requests.
   * @param dialogRef - Optional dialog reference, used to close modal if needed.
   * @param snackBar - Service for displaying snack bar messages.
   * @param router - Angular router used for navigation after registration.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    @Optional() public dialogRef: MatDialogRef<UserRegistrationComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  /**
   * Angular lifecycle method called when the component is initialized.
   */
  ngOnInit(): void {}

  /**
   * Submits the user's registration data to the backend API.
   * If successful, shows a success message and redirects to the login page.
   * If the dialog is open, it is closed after registration.
   * On error, displays a failure message.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userDetails).subscribe({
      next: (result) => {
        if (this.dialogRef) {
          this.dialogRef.close();
        }

        this.snackBar.open(`Welcome, ${result.userName}!`, 'OK', {
          duration: 2000
        });

        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.snackBar.open('Registration failed:', 'OK', {
          duration: 2000
        });
      }
    });
  }
}
