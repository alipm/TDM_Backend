import { ErrorHandlingService } from './error-handling.service';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  get<T>(
    url: string,
    headers?: HttpHeaders,
    errorMessage?: string
  ): Observable<T> {
    return this.http.get<T>(url, { headers }).pipe(
      catchError((error) => {
        this.errorHandlingService.handleError(
          error,
          errorMessage || 'An error occurred while fetching data.'
        );
        return throwError(error);
      })
    );
  }

  post<T>(
    url: string,
    body: any,
    headers?: HttpHeaders,
    errorMessage?: string
  ): Observable<T> {
    return this.http.post<T>(url, body, { headers }).pipe(
      catchError((error) => {
        this.errorHandlingService.handleError(
          error,
          errorMessage || 'An error occurred while processing the request.'
        );
        return throwError(error);
      })
    );
  }
}
