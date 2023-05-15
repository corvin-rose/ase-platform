import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-shader-buffer-delete-dialog',
  templateUrl: './shader-buffer-delete-dialog.component.html',
  styleUrls: ['./shader-buffer-delete-dialog.component.css'],
})
export class ShaderBufferDeleteDialogComponent implements OnInit {
  bufferKeys: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<ShaderBufferDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bufferIndex: number; buffers: Map<number, string> }
  ) {}

  ngOnInit(): void {
    this.bufferKeys = [...this.data.buffers.keys()].sort();
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
