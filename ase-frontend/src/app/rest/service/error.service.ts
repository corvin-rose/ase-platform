import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private snackBar: MatSnackBar) { }

  showError(httpError: HttpErrorResponse): void {
    let message = '';
    if (httpError.error != null) {
      message = httpError.error.error + ': ' + httpError.error.message;
    } else {
      message = httpError.message;
    }

    this.snackBar.open(message, 'Close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['snackbar']
    });
  }
}
