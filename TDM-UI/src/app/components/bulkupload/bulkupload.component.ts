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
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { environment } from '../../../environments/environment';
import { SpinneroverlayComponent } from '../../common/spinneroverlay/spinneroverlay.component';
import { ApiService } from '../../service/api.service';
import { DataService } from '../../service/sharedata.service';
import { DeleteConfirmDialogComponent } from '../popups/delete-confirm-dialog/delete-confirm-dialog.component';

interface ErrorItem {
  record: any;
  error: string;
}
@Component({
  selector: 'app-bulkupload',
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
  ],
  templateUrl: './bulkupload.component.html',
  styleUrl: './bulkupload.component.css',
})
export class BulkuploadComponent {
  displayedColumns: string[] = [];
  tableData = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoading = false;
  bulkType: string = '';
  records: string = '';
  custType: string = '';
  environment: string = '';
  masLib: string = '';
  companyCode: string = '';
  accessToken: any;
  private apiUrl = environment.apiUrl;
  isEditMode = true;
  userId = '';
  constructor(
    private apiService: ApiService,
    private service: DataService,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.tableData.paginator = this.paginator;
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('token') ?? '';
      this.userId = localStorage.getItem('userId') ?? '';
    }
  }

  onSubmit(): void {
    let missingDataFound = false;
    let missingColumns: string[] = [];
    this.tableData.data.forEach((rowData, rowIndex) => {
      this.displayedColumns.forEach((column) => {
        if (column === 'Actions') return;

        const value = rowData[column];

        if (value === null || value === undefined || value === '') {
          missingColumns.push(column);
        }
      });

      if (missingColumns.length > 0) {
        missingDataFound = true;
        this.service.showErrorMsg(
          `Missing data in columns: ${missingColumns.join(', ')}`
        );
      }
    });

    if (!missingDataFound) {
      let finalJSON;
      this.tableData.data.forEach((item) => {
        delete item.isEditing;
      });
      if (this.bulkType == 'ticket') {
        finalJSON = {
          type: this.bulkType,
          tableData: this.tableData.data,
          createdby: this.userId,
        };
        this.isLoading = true;

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.accessToken}`,
        });
        this.apiService
          .post<any>(
            `${this.apiUrl}/ticket/ticket-bulk-create`,
            finalJSON,
            headers,
            ''
          )
          .subscribe(
            (response) => {
              this.isLoading = false;

              if (response.message.includes('successfully')) {
                this.service.showSuccessMsg(response.message);
              }

              if (response.errors.length == 0) {
                this.tableData.data = [];
              } else {
                this.service.showErrorMsg(
                  'Could not process shown records in the table! Please correct and submit again.'
                );

                let extractedRecords = response.errors.map(
                  (error: ErrorItem) => error.record
                );
                this.tableData.data = extractedRecords;
              }
            },
            (error) => {
              console.error('create API Error:', error);
              this.isLoading = false;
            }
          );
      } else {
        finalJSON = {
          environment: this.environment,
          customerType: this.custType,
          masLibrary: this.masLib,
          companyCode: this.companyCode,
          type: this.bulkType,
          tableData: this.tableData.data,
        };
      }

      //console.log('Submitted:' + JSON.stringify(finalJSON));
    }
  }

  onCancel(): void {
    this.resetFields();
  }

  resetFields(): void {
    this.bulkType = '';
    this.records = '';
    this.custType = '';
    this.environment = '';
    this.masLib = '';
    this.companyCode = '';
    this.tableData.data = [];
    this.displayedColumns = [];
  }
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    this.tableData.data = [];
    this.displayedColumns = [];
    if (file) {
      event.target.value = '';
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });

        if (jsonData.length > 0) {
          this.displayedColumns = jsonData[0] as string[];
          this.displayedColumns.push('Actions');

          //console.log(this.displayedColumns);
          let expectedColumns = [];
          let isValid = true;
          if (this.bulkType == 'ticket') {
            expectedColumns = [
              'Customer_ID',
              'Environment',
              'Category',
              'Sub_Category',
              'Waste_Type',
              'Swappable_Flag',
              'Dispatch_Date',
              'Actions',
            ];
            isValid = this.validateColumns(
              this.displayedColumns,
              expectedColumns
            );
          }

          if (!isValid) {
            this.service.showErrorMsg('Please upload correct excel!');

            return;
          }

          this.tableData.data = jsonData
            .slice(1) // Skip first row
            .filter((row: any[]) =>
              row.some(
                (cell) => cell !== null && cell !== undefined && cell !== ''
              )
            )
            .map((row: any[]) => {
              const rowData: any = {};

              row.forEach((value, index) => {
                const column = this.displayedColumns[index];

                /* if (this.shouldConvertToDate(column)) {
                  rowData[column] = this.convertToDate(value); //dispatch date
                } else {*/
                rowData[column] = value;
                //}
              });
              return rowData;
            });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  validateColumns(fileColumns: string[], expectedColumns: string[]): boolean {
    if (fileColumns.length !== expectedColumns.length) {
      return false;
    }

    return fileColumns.every(
      (column, index) => column.trim() === expectedColumns[index]
    );
  }

  enableFields() {
    this.tableData.data = [];
  }

  checkFields(): boolean {
    if (this.bulkType == 'customer') {
      if (
        this.companyCode != '' &&
        this.masLib != '' &&
        this.environment != '' &&
        this.custType != ''
      ) {
        return false;
      }
    } else if (this.bulkType == 'ticket') {
      return false;
    }
    return true;
  }

  shouldConvertToDate(column: string): boolean {
    const dateColumns = ['Dispatch_Date'];
    return dateColumns.includes(column);
  }

  convertToDate(value: any): any {
    if (typeof value === 'number' && value > 1) {
      const excelEpoch = 25569;
      const date = new Date((value - excelEpoch) * 86400 * 1000);
      return date.toLocaleDateString();
    }
    return value;
  }

  toggleEditMode(element: any): void {
    element.isEditing = !element.isEditing;
    this.isEditMode = !element.isEditing; //to enable/diable button
  }

  deleteRow(row: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.tableData.data.indexOf(row);
        if (index > -1) {
          this.tableData.data.splice(index, 1);
          this.tableData = new MatTableDataSource<any>(this.tableData.data);
          this.tableData.paginator = this.paginator;
        }
      }
    });
  }
}
