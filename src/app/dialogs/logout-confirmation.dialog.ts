import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog'; // ✅ Required for dialog structure tags

@Component({
  standalone: true,
  selector: 'app-logout-confirmation',
  imports: [
    MatButtonModule,
    MatDialogModule // ✅ Required for <mat-dialog-title>, <mat-dialog-content>, etc.
  ],
  template: `
    <h2 mat-dialog-title>Confirm Logout</h2>
    <mat-dialog-content>
      Are you sure you want to log out?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">Cancel</button>
      <button mat-button color="warn" (click)="close(true)">Logout</button>
    </mat-dialog-actions>
  `
})
export class LogoutConfirmationDialog {
  constructor(private dialogRef: MatDialogRef<LogoutConfirmationDialog>) {}

  close(confirmed: boolean) {
    this.dialogRef.close(confirmed);
  }
}
