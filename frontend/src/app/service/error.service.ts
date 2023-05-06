import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const DEFAULT_ERROR: string = 'A technical error has been occurred';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private snackBar: MatSnackBar) {}

  showError(httpError: HttpErrorResponse): void {
    let message = '';
    if (httpError.error != undefined && httpError.error.error != undefined) {
      message = httpError.error.error + ': ' + httpError.error.message;
    } else {
      message = DEFAULT_ERROR;
    }
    this.showCustomError(message);
  }

  showCustomError(error: string): void {
    this.snackBar.open(error, 'Close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['snackbar'],
    });
  }
}
