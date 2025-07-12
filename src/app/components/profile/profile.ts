import { Component, OnInit, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { FetchApiDataService } from '../../services/fetch-api-data.service';

import { AuthService } from '../../services/auth.service';

import { User } from '../../Interfaces/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {

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
    private authService: AuthService
  ) { }

  ngOnInit(): void { 
    this.getUserInfo();
  };
  
  user: string = localStorage.getItem('user') || 'null';


  getUserInfo() {
    this.fetchApiData.getUserByName(this.user).subscribe({
      next: (result) => {
        this.userDetails = result;
      }, 
      error: (error) => {
        console.log('Error fetching user info:', error)
      }
    })
  }

}

