import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddUserDialogComponent } from '../popups/add-user-dialog/add-user-dialog.component';
import { UpdateUserDialogComponent } from '../popups/update-user-dialog/update-user-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DeleteConfirmDialogComponent } from '../popups/delete-confirm-dialog/delete-confirm-dialog.component';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinneroverlayComponent } from '../../common/spinneroverlay/spinneroverlay.component';
import { DataService } from '../../service/sharedata.service';

interface User {
  username: string;
  user_id: string;
  email: string;
  status: string;
  role: string;
  password_hash?: string;
  last_modified_by: string;
}
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    SpinneroverlayComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = [
    'user_id',
    'username',
    'email',
    'status',
    'role',
    'last_modified_by',
    'actions',
  ];
  users = new MatTableDataSource<any>();
  isLoading = false;
  accessToken: any;
  userId: any;
  private apiUrl = environment.apiUrl;
  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private service: DataService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('token') ?? '';
      this.userId = localStorage.getItem('userId') ?? '';
    }
    this.isLoading = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: `Bearer ${this.accessToken}`,
    });
    this.apiService
      .get<any>(`${this.apiUrl}/auth/fetchUser`, headers, '')
      .subscribe(
        (response) => {
          this.isLoading = false;
          if (response.message.includes('successfully')) {
            this.service.showSuccessMsg(response.message);
          }
          this.users.data = response.data.response;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  updateUser(user: User): void {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      width: '800px',
      data: { ...user }, // Pass the selected user data to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.users.data.findIndex(
          (u) => u.user_id == result.user_id
        );
        if (index >= 0) {
          // call service reload
          this.updateUserService(index, result);
        }
      }
    });
  }

  updateUserService(index: any, element: any) {
    element.last_modified_by = this.userId;
    this.isLoading = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: `Bearer ${this.accessToken}`,
    });
    this.apiService
      .post<any>(`${this.apiUrl}/auth/updateUser`, element, headers, '')
      .subscribe(
        (response) => {
          this.isLoading = false;
          if (response.message.includes('successfully')) {
            this.service.showSuccessMsg(response.message);
          }
          element.role = 'User';
          this.users.data[index] = element;
          this.users = new MatTableDataSource<any>(this.users.data);
          this.users._updateChangeSubscription();
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //console.log(user);
        const index = this.users.data.indexOf(user);
        if (index > -1) {
          // call service realod
          this.deleteUserService(index, user);
        }
      }
    });
  }

  deleteUserService(index: any, element: any) {
    this.isLoading = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: `Bearer ${this.accessToken}`,
    });

    let payload = {
      user_id: element.user_id,
    };
    this.apiService
      .post<any>(`${this.apiUrl}/auth/deleteUser`, payload, headers, '')
      .subscribe(
        (response) => {
          this.isLoading = false;
          if (response.message.includes('successfully')) {
            this.service.showSuccessMsg(response.message);
          }
          this.users.data.splice(index, 1);
          this.users = new MatTableDataSource<any>(this.users.data);
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  addUser(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addUserService(result);
      }
    });
  }

  addUserService(element: any) {
    this.isLoading = true;
    element.last_modified_by = this.userId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: `Bearer ${this.accessToken}`,
    });
    this.apiService
      .post<any>(`${this.apiUrl}/auth/createUser`, element, headers, '')
      .subscribe(
        (response) => {
          this.isLoading = false;
          if (response.message.includes('successfully')) {
            this.service.showSuccessMsg(response.message);
          }
          element.role = 'User';
          element.user_id = response.data.userID;
          this.users.data.push(element);
          this.users = new MatTableDataSource<any>(this.users.data);
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }
}
