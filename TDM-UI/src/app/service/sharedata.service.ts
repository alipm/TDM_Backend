import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private snackBar: MatSnackBar) {}

  ifLoggedIn: any;
  private transactionID = new BehaviorSubject<any>(null);
  data$ = this.transactionID.asObservable();
  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const timestamp = localStorage.getItem('tokenTimestamp');
      if (!token || !timestamp) {
        return false;
      }
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - parseInt(timestamp);
      const twoHours = 2 * 60 * 60 * 1000;

      //console.log(timeElapsed+"..."+twoHours);

      // If the token is expired (older than 24 hours)
      if (timeElapsed > twoHours) {
        sessionStorage.clear();
        localStorage.clear();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return false;
      }
      return true;
    }
    return false;
  }

  showSuccessMsg(message: any) {
    this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['success-snackbar'],
    });
  }
  showErrorMsg(errorMessage: any) {
    this.snackBar.open(errorMessage, '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['error-snackbar'],
    });
  }

  setTransID(val: any) {
    this.transactionID.next(val);
  }
}
