import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationDialog } from '../../dialogs/logout-confirmation.dialog';
import { SearchService } from '../../services/search.service';

/**
 * Header component responsible for navigation, logout, and search.
 * Dynamically displays menu options based on authentication state.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    MatDialogModule,
    RouterModule,
    MatButtonModule
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  /**
   * Indicates whether the menu is currently open.
   */
  menuOpen = false;

  /**
   * The current authentication token passed from the parent component.
   */
  @Input() token: string | null = null;

  /**
   * Emits search input changes to the parent component.
   */
  @Output() searchChanged = new EventEmitter<string>();

  /**
   * Initializes the HeaderComponent with necessary services.
   * @param router - Angular router for navigation.
   * @param authService - Service that manages authentication state.
   * @param snackBar - Service to show snackbar notifications.
   * @param dialog - Service to open confirmation dialogs.
   * @param searchService - Service that handles the global search term.
   */
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private searchService: SearchService
  ) { }

  /**
   * Subscribes to the authentication token when the component initializes.
   */
  ngOnInit(): void {
    this.authService.token$.subscribe(token => {
      this.token = token;
    });
  }

  /**
   * Toggles the visibility of the mobile navigation menu.
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Logs the user out after confirming via a dialog.
   * Clears the token, navigates to the login page, and shows a snackbar.
   */
  logout(): void {
    const dialogRef = this.dialog.open(LogoutConfirmationDialog);

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.authService.setToken(null);
        this.router.navigate(['/login']);
        this.snackBar.open('Log Out Succesfully!', 'OK', {
          duration: 2000
        });
      }
    });
  }

  /**
   * Handles the search input field change event.
   * Passes the lowercase search term to the SearchService.
   * 
   * @param event - Input event from the search field.
   */
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchService.setSearchTerm(input.value.toLowerCase());
  }
}
