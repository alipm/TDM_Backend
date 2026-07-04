import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrl: './delete-confirm-dialog.component.css',
})
export class DeleteConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true); 
  }

  onCancel(): void {
    this.dialogRef.close(false); 
  }
}
