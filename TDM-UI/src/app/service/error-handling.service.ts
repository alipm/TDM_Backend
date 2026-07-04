import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: HttpErrorResponse, customMessage?: string): void {
    let errorMessage = customMessage || 'An unknown error occurred!';

    if (
      typeof ErrorEvent !== 'undefined' &&
      error.error instanceof ErrorEvent
    ) {
      // Client-side error
      errorMessage = customMessage || `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error.message) {
        if (error.error.message.indexOf('Additional details:') > -1) {
          const startIdx = error.error.message.indexOf('Additional details:');

          if (startIdx !== -1) {
            let afterDetails = error.error.message
              .substring(startIdx + 'Additional details:'.length)
              .trim();
            const hyphenIdx = afterDetails.indexOf('_');
            if (hyphenIdx !== -1) {
              afterDetails = afterDetails.substring(hyphenIdx + 1).trim();
            }
            const splitParts = afterDetails.split(',');
            let correctedMessage = splitParts[0].trim();
            errorMessage = correctedMessage.replace(/["|:]/g, '');
          }
        } else {
          errorMessage = `${error.error.message}`;
        }
      } else {
        errorMessage = `${customMessage}`;
      }
    }
    this.snackBar.open(errorMessage, '', {
      duration: 7000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['error-snackbar'],
    });
  }
}
