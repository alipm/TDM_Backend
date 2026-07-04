import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../service/api.service';
import { DataService } from '../../service/sharedata.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SpinneroverlayComponent } from '../../common/spinneroverlay/spinneroverlay.component';
import { Router } from '@angular/router';

interface IResponse {
  data: {
    email: '';
    id: '';
    username:'';
    role: '';
    token: '';
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatCardModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    SpinneroverlayComponent,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLoading = false;
  responseObj: IResponse | undefined;
  private apiUrl = environment.apiUrl;
  constructor(
    private apiService: ApiService,
    private service: DataService,
    private route: Router
  ) {}

  myFormGroup = new FormGroup({
    user: new FormControl('', [
      Validators.required,
      // Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    ]),
    password: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.myFormGroup.valid) {
      const formData = this.myFormGroup.value;
      this.isLoading = true;

      this.apiService
        .post<IResponse>(`${this.apiUrl}/auth/login`, formData)
        .subscribe(
          (response) => {
            this.responseObj = response;
            this.service.showSuccessMsg(
              'Login successful! Redirecting to Dashboard.'
            );
            localStorage.setItem('role', this.responseObj.data.role);
            localStorage.setItem('userId', this.responseObj.data.id);
            localStorage.setItem('username', this.responseObj.data.username);
            localStorage.setItem('token', this.responseObj.data.token);
            localStorage.setItem(
              'tokenTimestamp',
              new Date().getTime().toString()
            );
            setTimeout(() => {
              this.route.navigate(['dashboard']);
            }, 1000);
            this.isLoading = false;
          },
          (error) => {
            console.error('Login API Error:', error);
          }
        )
        .add(() => {
          this.isLoading = false;
        });
    } else {
      this.myFormGroup.markAllAsTouched();
    }
  }
}
