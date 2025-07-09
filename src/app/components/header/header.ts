import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationDialog } from '../../dialogs/logout-confirmation.dialog';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    MatDialogModule,
    RouterModule,
    MatButtonModule,

  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  menuOpen = false;

  token: string | null = null;

  constructor(private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog

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
}
