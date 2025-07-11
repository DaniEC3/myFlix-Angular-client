import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf, NgSwitch, NgSwitchCase, } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationDialog } from '../../dialogs/logout-confirmation.dialog';
import { SearchService } from '../../services/search.service';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    MatDialogModule,
    RouterModule,
    MatButtonModule,

  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  menuOpen = false;

  @Input() token: string | null = null;
  @Output() searchChanged = new EventEmitter<string>();

  constructor(private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private searchService: SearchService

  ) { }

  ngOnInit() {
    this.authService.token$.subscribe(token => {
      this.token = token;
    })
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    const dialogRef = this.dialog.open(LogoutConfirmationDialog);

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.authService.setToken(null);
        this.router.navigate(['/login']);
        this.snackBar.open(`Log Out Succesfully!`, 'OK', {
          duration: 2000
        });
      }
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchService.setSearchTerm(input.value.toLowerCase());
  }
}
