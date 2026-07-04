import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { environment } from '../../../environments/environment';
import { SpinneroverlayComponent } from '../../common/spinneroverlay/spinneroverlay.component';
import { ApiService } from '../../service/api.service';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';
import { ElementSchemaRegistry } from '@angular/compiler';
import { DataService } from '../../service/sharedata.service';
import { MatTooltipModule } from '@angular/material/tooltip';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD', // 'LL' means 'December 9, 2024'
  },
  display: {
    dateInput: 'YYYY-MM-DD', // 'dddd' for day of the week + 'LL' for 'December 9, 2024'
    monthYearLabel: 'MMM YYYY', // 'Dec 2024'
    dateA11yLabel: 'LL', // 'December 9, 2024'
    monthYearA11yLabel: 'MMMM YYYY', // 'December 2024'
  },
};
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    SpinneroverlayComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class DashboardComponent {
  custCount: number = 0;
  ticketCount: number = 0;
  displayedColumns: string[] = [];
  columnHeaders: string[] = [];

  tableData = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoading = false;
  accessToken: any;
  private apiUrl = environment.apiUrl;
  startDate: any;
  endDate: any;
  type: any;
  isSearchDisabled: boolean = true;
  errorMessage: string = '';
  role = '';
  userId = '';
  constructor(
    private apiService: ApiService,
    private sharedService: DataService
  ) {}

  ngAfterViewInit() {
    this.tableData.paginator = this.paginator;
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('token') ?? '';
      this.role = localStorage.getItem('role') ?? '';
      this.userId = localStorage.getItem('userId') ?? '';
    }
    this.getAllCounts();
  }

  getAllCounts() {
    this.getCount('Ticket').subscribe(
      (response) => {
        this.isLoading = false;
        if (response.message.includes('successfully')) {
          this.sharedService.showSuccessMsg(response.message);
          this.ticketCount = response.data.response.length;
        }
      },
      (error) => {
        console.error('get API Error:', error);
        this.isLoading = false;
      }
    );
    this.getCount('Customer').subscribe(
      (response) => {
        this.isLoading = false;
        if (response.message.includes('successfully')) {
          this.sharedService.showSuccessMsg(response.message);
          this.custCount = response.data.response.length;
        }
      },
      (error) => {
        console.error('get API Error:', error);
        this.isLoading = false;
      }
    );
  }
  getCount(type: string) {
    let payload = {
      Type: type,
      StartDate: '2020-01-01',
      EndDate: moment().format('YYYY-MM-DD'),
      UserId: this.userId,
      Role: this.role,
    };

    this.isLoading = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: `Bearer ${this.accessToken}`,
    });
    return this.apiService.post<any>(
      `${this.apiUrl}/data/getCustomerTicketData`,
      payload,
      headers,
      ''
    );
  }

  allFields() {
    if (this.type && this.startDate && this.endDate) {
      return false;
    }
    return true;
  }

  validateDateRange(): void {
    if (
      this.endDate &&
      this.startDate &&
      moment(this.endDate).isBefore(moment(this.startDate))
    ) {
      this.errorMessage = 'End date cannot be before start date.';
      this.isSearchDisabled = true;
    } else {
      this.errorMessage = '';
      this.isSearchDisabled = this.allFields();
    }
  }

  onDateChange(): void {
    this.validateDateRange();
  }

  //to change the column names from table to ui
  capitalizeFirstLetter(str: string): string {
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  onSubmit() {
    let payload = {
      Type: this.type,
      StartDate: this.startDate.format('YYYY-MM-DD'),
      EndDate: this.endDate.format('YYYY-MM-DD'),
      UserId: this.userId,
      Role: this.role,
    };

    this.isLoading = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: `Bearer ${this.accessToken}`,
    });
    this.apiService
      .post<any>(
        `${this.apiUrl}/data/getCustomerTicketData`,
        payload,
        headers,
        ''
      )
      .subscribe(
        (response) => {
          this.isLoading = false;

          if (response.message.includes('successfully')) {
            this.sharedService.showSuccessMsg(response.message);
            this.tableData.data = response.data.response;
            this.displayedColumns = Object.keys(this.tableData.data[0]);
            this.columnHeaders = this.displayedColumns.map((column) =>
              this.capitalizeFirstLetter(column)
            );
            this.processDateColumns();
          }
        },
        (error) => {
          console.error('create API Error:', error);
          this.isLoading = false;
        }
      );
  }

  processDateColumns() {
    this.tableData.data.forEach((row) => {
      this.displayedColumns.forEach((column) => {
        if (
          ['dispatch_date', 'created_at', 'updated_at'].includes(column) &&
          this.isValidDate(row[column])
        ) {
          row[column] = moment(row[column]).format('YYYY-MM-DD HH:mm:ss');
        }
      });
    });
  }

  isValidDate(value: any): boolean {
    return moment(value, moment.ISO_8601, true).isValid();
  }

  isUrlColumn(column: string): boolean {
    return column === 'transaction_id';
  }

  setTransactionID(element: any) {
    this.sharedService.setTransID(element.transaction_id);
  }
}
