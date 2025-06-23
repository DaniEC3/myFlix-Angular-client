import { Component, OnInit, Optional, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';



// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../../services/fetch-api-data.service';

import { LoginCredentials } from '../../Interfaces/login';

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

@Input() credentials: LoginCredentials = {
    userName: '',
    password: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  userPassword: string = '';
  showpassword = false;

  togglePasswordVisibility(){
    this.showpassword = !this.showpassword;
  }

  loginUser(): void {
    this.fetchApiData.userLogin(this.credentials).subscribe({
      next: (result) => {
        localStorage.setItem('token',result.token);
        localStorage.setItem('user',result.user.userName)

        this.snackBar.open(`Welcome back, ${result.user.userName}!`, 'OK', {
          duration: 2000
        });

        this.router.navigate(['/home']); // ✅ redirect to home
      },
      error: (error) => {
        this.snackBar.open('Login failed. Please check your credentials', 'OK', {
          duration: 2000
        });
      }
    });
  }

}
