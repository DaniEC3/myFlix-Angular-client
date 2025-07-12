import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog'; // ✅ Required for dialog structure tags

@Component({
  standalone: true,
  selector: 'app-delete-confirmation',
  imports: [
    MatButtonModule,
    MatDialogModule // ✅ Required for <mat-dialog-title>, <mat-dialog-content>, etc.
  ],
  template: `
    <h2 mat-dialog-title>Confirm user removal</h2>
    <mat-dialog-content>
      Are you sure you want to delete your user?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">Cancel</button>
      <button mat-button color="warn" (click)="close(true)">Delete</button>
    </mat-dialog-actions>
  `
})
export class DeleteConfirmationDialog {
  constructor(private dialogRef: MatDialogRef<DeleteConfirmationDialog>) {}

  close(confirmed: boolean) {
    this.dialogRef.close(confirmed);
  }
}
