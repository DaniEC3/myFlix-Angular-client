// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


// You'll use this import to close the dialog on success
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../../services/fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { User } from '../../Interfaces/user';

import { Router } from '@angular/router';

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

  @Input() userDetails: Partial<User> = {
    userName: '',
    password: '',
    email: '',
    birthDay: '',
    first_Name: '',
    last_Name: ''
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    @Optional() public dialogRef: MatDialogRef<UserRegistrationComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }
  ngOnInit(): void {
  }

  // This is the function responsible for sending the form inputs to the backend
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userDetails).subscribe({
      next: (result) => {
        if (this.dialogRef) {
          this.dialogRef.close(); // ✅ close modal if it exists
        }

        this.snackBar.open(`Welcome, ${result.userName}!`, 'OK', {
          duration: 2000
        });

        this.router.navigate(['/login']); // ✅ redirect to login page
      },
      error: (error) => {
        this.snackBar.open('Registration failed:', 'OK', {
          duration: 2000
        });
      }
    });
  }
}