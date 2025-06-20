import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Movie } from '../Interfaces/movie';
import { Director } from '../Interfaces/director';
import { Genre } from '../Interfaces/genre';
import { User } from '../Interfaces/user';
import { LoginCredentials } from '../Interfaces/login';

// ✅ Replace with your actual hosted API URL
const apiUrl = 'https://movies-my-flix-app-60bc918eee2b.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor(private http: HttpClient) { }

  // ✅ Registers a new user

  userRegistration(userDetails: Partial<User>): Observable<User> {
    console.log('Registering user:', userDetails);
    return this.http.post<User>(apiUrl + 'users/create', userDetails
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ User Login

  userLogin(credentails: LoginCredentials): Observable<any> {
    return this.http.post<LoginCredentials>(apiUrl + 'login', credentails)
      .pipe(
        catchError(this.handleError)
      )
  }

  // ✅ Get all movies

  getAllMovies(): Observable<Movie[]> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<Movie[]>(apiUrl + 'movies', { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Get directors

  getDirectors(): Observable<Director[]> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<Director[]>(apiUrl + 'directors', { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Get director by name

  getDirectorByName(name: string): Observable<Director> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<Director>(`${apiUrl}directors/${name}`, { headers }).pipe(
      catchError(this.handleError)
    )
  }

  // ✅ Get genres

  getGenres(): Observable<Genre[]> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<Genre[]>(apiUrl + 'genres', { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Get genre by name

  getGenreByName(name: string): Observable<Genre> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<Genre>(`${apiUrl}genres/${name}`, { headers }).pipe(
      catchError(this.handleError)
    )
  }

  // ✅ Get users

  getUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<User[]>(apiUrl + `users`, { headers }).pipe(
      catchError(this.handleError)
    )
  }

  // ✅ Get user by name

  getUserByName(name: string): Observable<User> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<User>(`${apiUrl}users/${name}`, { headers }).pipe(
      catchError(this.handleError)
    )
  }

  // ✅ Add a movie to favourite Movies

  addMoviebyName(username: string, moviename: string): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.post(`${apiUrl}users/${username}/movies/${moviename}`, null, { headers }).pipe(
      catchError(this.handleError)
    )
  }

  // ✅ Edit user

  editUser(username: string, updatedUser: Partial<User>): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.put(`${apiUrl}users/update/${username}`, updatedUser, { headers }).pipe(
      catchError(this.handleError)
    )
  }

  // ✅ Delete user

  deleteUser(userid: string): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.delete(`${apiUrl}users/${userid}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Delete a movie from the favorite movies

  deleteMovieByName(username: string, moviename: string): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.delete(`${apiUrl}users/${username}/movies/${moviename}`, { headers }).pipe(
      catchError(this.handleError)
    )
  }

  // ✅ Headers

  private getAuthHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('token');
    return token
      ? new HttpHeaders({ Authorization: 'Bearer ' + token })
      : null;
  }

  // ✅ Generic error handler

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Server error ${error.status}:`, error.error);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}

