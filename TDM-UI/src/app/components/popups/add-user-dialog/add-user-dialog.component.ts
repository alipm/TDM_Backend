import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface User {
  username: string;
  user_id: string;
  email: string;
  status: string;
  role: string;
  password_hash?: string; 
  last_modified_by:string;
}
@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.css',
})
export class AddUserDialogComponent {
  userForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserDialogComponent>
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)],
      ],
      password: ['', Validators.required],
      status: ['Active', Validators.required], // Default status
      role: ['User', Validators.required], // Default role
    });
    this.userForm.get('role')?.disable();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}
