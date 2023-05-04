import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-shader-create-dialog',
  templateUrl: './shader-create-dialog.component.html',
  styleUrls: ['./shader-create-dialog.component.css'],
})
export class ShaderCreateDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ShaderCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onInputChange(event: Event, inputSize: number): void {
    if (event instanceof KeyboardEvent && event.keyCode == 13 && inputSize >= 3) {
      this.dialogRef.close(this.data);
    }
  }
}
