import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
 <mat-dialog-content style="padding: 12px;">
      <h2>{{ data?.name }}</h2>
      <p>{{ data?.description }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Close</button>
    </mat-dialog-actions>
`
})
export class GenreInformationDialog {
  constructor(
    private dialogRef: MatDialogRef<GenreInformationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string; description: string }
  ) { }

  close() {
    this.dialogRef.close();
  }


}
