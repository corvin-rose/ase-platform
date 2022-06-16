import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Shader } from '../../../rest/model/shader';
import { ErrorService } from '../../../rest/service/error.service';
import { ShaderService } from '../../../rest/service/shader.service';

@Component({
  selector: 'app-shader-settings-dialog',
  templateUrl: './shader-settings-dialog.component.html',
  styleUrls: ['./shader-settings-dialog.component.css']
})
export class ShaderSettingsDialogComponent implements OnInit {

  title: string = 'Title';

  constructor(public dialogRef: MatDialogRef<ShaderSettingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private shaderService: ShaderService,
              private errorService: ErrorService) { }

  ngOnInit(): void {
    this.shaderService.getShaderById(this.data).subscribe({
      next: (response: Shader) => {
        this.title = response.title;
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error(error.message);
      }
    })
  }

  onSaveClick(): void {
    this.shaderService.getShaderById(this.data).subscribe({
      next: (response: Shader) => {
        if (response.title === this.title) {
          this.dialogRef.close();
          return;
        }

        response.title = this.title;
        this.shaderService.updateShader(response).subscribe({
          next: () => {
            this.dialogRef.close();
          },
          error: (error: HttpErrorResponse) => {
            this.errorService.showError(error);
            console.error(error.message);
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error(error.message);
      }
    })
  }
}
