import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service responsible for handling authentication tokens.
 * Stores and retrieves the token from localStorage and
 * exposes a reactive token stream using BehaviorSubject.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Internal BehaviorSubject to track the current token.
   * Initialized from localStorage if available.
   */
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  /**
   * Observable stream of the current authentication token.
   */
  token$ = this.tokenSubject.asObservable();

  /**
   * Sets or clears the authentication token.
   * If a token is provided, it's saved to localStorage.
   * If null, the token is removed from localStorage.
   * Also updates the internal BehaviorSubject.
   *
   * @param token - The authentication token to store or null to clear it.
   */
  setToken(token: string | null) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    this.tokenSubject.next(token);
  }

  /**
   * Retrieves the current token value from the BehaviorSubject.
   *
   * @returns The current authentication token or null.
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }
}
