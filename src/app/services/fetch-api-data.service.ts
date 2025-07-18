import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Movie } from '../Interfaces/movie';
import { Director } from '../Interfaces/director';
import { Genre } from '../Interfaces/genre';
import { User } from '../Interfaces/user';
import { LoginCredentials } from '../Interfaces/login';

/**
 * API URL for the hosted backend server.
 */
const apiUrl = 'https://movies-my-flix-app-60bc918eee2b.herokuapp.com/';

/**
 * Service responsible for communicating with the MyFlix API.
 * Provides methods for user registration, login, and retrieving or modifying movie and user data.
 */
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor(private http: HttpClient) { }

  /**
   * Returns HTTP headers with Authorization token from localStorage.
   * @returns HttpHeaders or null if no token found.
   */
  private getAuthHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('token');
    return token
      ? new HttpHeaders({ Authorization: 'Bearer ' + token })
      : null;
  }

  /**
   * Registers a new user.
   * @param userDetails - Partial user data for registration.
   * @returns Observable containing the created user.
   */
  userRegistration(userDetails: Partial<User>): Observable<User> {
    console.log('Registering user:', userDetails);
    return this.http.post<User>(apiUrl + 'users/create', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs in a user using provided credentials.
   * @param credentials - Object containing username and password.
   * @returns Observable containing user data and auth token.
   */
  userLogin(credentials: LoginCredentials): Observable<any> {
    return this.http.post<LoginCredentials>(apiUrl + 'login', credentials).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a list of all movies.
   * @returns Observable containing an array of movies.
   */
  getAllMovies(): Observable<Movie[]> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));
    return this.http.get<Movie[]>(apiUrl + 'movies', { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all directors.
   * @returns Observable containing an array of directors.
   */
  getDirectors(): Observable<Director[]> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));
    return this.http.get<Director[]>(apiUrl + 'directors', { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a movie by its name.
   * @param name - Name of the movie.
   * @returns Observable containing movie data.
   */
  getMovieByName(name: string): Observable<Movie> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));
    return this.http.get<Movie>(`${apiUrl}movies/${encodeURIComponent(name)}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a director by name.
   * @param name - Name of the director.
   * @returns Observable containing director data.
   */
  getDirectorByName(name: string): Observable<Director> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));
    return this.http.get<Director>(`${apiUrl}directors/${name}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all available genres.
   * @returns Observable containing an array of genres.
   */
  getGenres(): Observable<Genre[]> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));
    return this.http.get<Genre[]>(apiUrl + 'genres', { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a genre by its name.
   * @param name - Name of the genre.
   * @returns Observable containing genre data.
   */
  getGenreByName(name: string): Observable<Genre> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));
    return this.http.get<Genre>(`${apiUrl}genres/${name}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all registered users.
   * @returns Observable containing an array of users.
   */
  getUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));
    return this.http.get<User[]>(apiUrl + 'users', { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a user by their username.
   * @param name - Username.
   * @returns Observable containing user data.
   */
  getUserByName(name: string): Observable<User> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));
    return this.http.get<User>(`${apiUrl}users/${name}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Adds a movie to a user's list of favorite movies.
   * @param username - Username of the user.
   * @param moviename - Title of the movie to add.
   * @returns Observable with server response.
   */
  addMoviebyName(username: string, moviename: string): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));
    return this.http.post(`${apiUrl}users/${username}/movies/${moviename}`, null, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates user information.
   * @param username - Username of the user.
   * @param updatedUser - Updated user details.
   * @returns Observable with server response.
   */
  editUser(username: string, updatedUser: Partial<User>): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));
    return this.http.put(`${apiUrl}users/update/${username}`, updatedUser, {
      headers,
      responseType: 'text' as 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a user account.
   * @param userid - ID or username of the user.
   * @returns Observable with server response.
   */
  deleteUser(userid: string): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));
    return this.http.delete(`${apiUrl}users/${userid}`, {
      headers,
      responseType: 'text' as 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Removes a movie from a user's list of favorite movies.
   * @param username - Username of the user.
   * @param moviename - Title of the movie to remove.
   * @returns Observable with server response.
   */
  deleteMovieByName(username: string, moviename: string): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return throwError(() => new Error('User is not authenticated'));
    return this.http.delete(`${apiUrl}users/${username}/movies/${moviename}`, {
      headers,
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Generic error handler for HTTP requests.
   * Logs the error and returns a user-friendly error observable.
   * @param error - The HTTP error response.
   * @returns Observable that throws a generic error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Server error ${error.status}:`, error.error);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
