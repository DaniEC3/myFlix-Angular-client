import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog'; // ✅ Required for dialog structure tags

@Component({
  standalone: true,
  selector: 'genre-information',
  imports: [
    MatButtonModule,
    MatDialogModule // ✅ Required for <mat-dialog-title>, <mat-dialog-content>, etc.
  ],
  template: `
  <mat-dialog-content>
    <p>This is genre information!</p>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-button (click)="close(false)">Close</button>
  </mat-dialog-actions>
`
})
export class GenreInformationDialog {
  constructor(private dialogRef: MatDialogRef<GenreInformationDialog>) { }

  close(confirmed: boolean) {
    this.dialogRef.close(confirmed);
  }
}
