import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
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
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { SpinneroverlayComponent } from '../../common/spinneroverlay/spinneroverlay.component';
import { ApiService } from '../../service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DataService } from '../../service/sharedata.service';

const moment = _rollupMoment || _moment;

// Custom date formats configuration
export const MY_FORMATS = {
  parse: {
    dateInput: 'dddd, LL', // 'LL' means 'December 9, 2024'
  },
  display: {
    dateInput: 'dddd, LL', // 'dddd' for day of the week + 'LL' for 'December 9, 2024'
    monthYearLabel: 'MMM YYYY', // 'Dec 2024'
    dateA11yLabel: 'LL', // 'December 9, 2024'
    monthYearA11yLabel: 'MMMM YYYY', // 'December 2024'
  },
};

@Component({
  selector: 'app-createticket',
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
    MatDatepickerModule,
    MatNativeDateModule,
    SpinneroverlayComponent,
  ],
  templateUrl: './createticket.component.html',
  providers: [
    // Provide the custom Moment.js date adapter globally for this component
    provideMomentDateAdapter(MY_FORMATS),
  ],
  styleUrl: './createticket.component.css',
})
export class CreateticketComponent {
  ticketForm: FormGroup;
  isLoading = false;
  accessToken: any;
  private apiUrl = environment.apiUrl;
  userId = '';
  initialValues = {
    Customer_ID: null,
    Environment: '',
    Sub_Category: '',
    Dispatch_Date: moment(),
    Transaction_ID:
      Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
      100000000000,
    Waste_Type: '',
    Category: '',
    Swappable_Flag: null,
  };
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private sharedService: DataService
  ) {
    this.ticketForm = this.fb.group({
      Customer_ID: [this.initialValues.Customer_ID, Validators.required],
      Environment: [this.initialValues.Environment, Validators.required],
      Sub_Category: [this.initialValues.Sub_Category, Validators.required],
      Dispatch_Date: [this.initialValues.Dispatch_Date, Validators.required],
      Transaction_ID: [
        this.initialValues.Transaction_ID,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      Waste_Type: [this.initialValues.Waste_Type, Validators.required],
      Category: [this.initialValues.Category, Validators.required],
      Swappable_Flag: [this.initialValues.Swappable_Flag, Validators.required],
    });
  }
  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('token') ?? '';
      this.userId = localStorage.getItem('userId') ?? '';
    }
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      this.isLoading = true;
      const dispatchDate = this.ticketForm.get('Dispatch_Date')!.value;
      let formattedDate = dispatchDate;
      if (
        typeof dispatchDate === 'string' &&
        !/^\d{2}\/\d{2}\/\d{4}$/.test(dispatchDate) &&
        !/^\d{4}-\d{2}-\d{2}$/.test(dispatchDate)
      ) {
        formattedDate = dispatchDate;
      } else {
        formattedDate = moment(dispatchDate).format('MM/DD/YYYY');
      }

      this.ticketForm.patchValue({
        Dispatch_Date: formattedDate,
      });
      /*this.ticketForm.value.Customer_ID = Number(
        this.ticketForm.value.Customer_ID
      );*/
      this.ticketForm.value.createdby = this.userId;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.accessToken}`,
      });
      this.apiService
        .post<any>(
          `${this.apiUrl}/ticket/ticket-create`,
          this.ticketForm.value,
          headers,
          ''
        )
        .subscribe(
          (response) => {
            this.isLoading = false;
            if (response.message.includes('successfully')) {
              this.sharedService.showSuccessMsg(response.message);
              this.ticketForm.reset(this.initialValues);
              this.ticketForm.patchValue({
                Transaction_ID:
                  Math.floor(
                    Math.random() * (999999999999 - 100000000000 + 1)
                  ) + 100000000000,
              });
            }
          },
          (error) => {
            console.error('create API Error:', error);
            this.isLoading = false;
            const dateToPatch = moment(formattedDate, 'MM/DD/YYYY').toDate();

            this.ticketForm.patchValue({
              Dispatch_Date: dateToPatch,
            });
          }
        );
    }
  }

  onCancel(): void {
    this.ticketForm.reset(this.initialValues);
    this.isLoading = false;
  }
}
