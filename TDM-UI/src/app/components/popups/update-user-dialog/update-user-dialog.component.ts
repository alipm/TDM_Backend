import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
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
  selector: 'app-update-user-dialog',
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
  templateUrl: './update-user-dialog.component.html',
  styleUrl: './update-user-dialog.component.css',
})
export class UpdateUserDialogComponent {
  userForm: FormGroup;
  localUserID='';


  constructor(
    public dialogRef: MatDialogRef<UpdateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      username: [this.data.username, Validators.required],
      user_id: [{value:this.data.user_id,disabled: true}, Validators.required],
      email: [this.data.email, [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      status: [this.data.status, Validators.required],
      role: [{ value: this.data.role, disabled: true }, Validators.required],  // 'role' is disabled
      last_modified_by:[this.data.last_modified_by]
    });
    this.localUserID=this.data.user_id;
    this.userForm.get('role')?.disable();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.userForm.get('user_id')?.enable();
      this.userForm.get('user_id')?.setValue(this.localUserID);
      this.dialogRef.close(this.userForm.value);
    }
  }
}
