import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../service/api.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { SpinneroverlayComponent } from '../../common/spinneroverlay/spinneroverlay.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { dayFormatValidator } from '../../utility/utility';
import { DataService } from '../../service/sharedata.service';

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
  selector: 'app-createcustomer',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SpinneroverlayComponent,
  ],
  templateUrl: './createcustomer.component.html',
  styleUrl: './createcustomer.component.css',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class CreatecustomerComponent implements OnInit {
  isLoading = false;
  expandedPanel1 = true;
  expandedPanel2 = false;
  expandedPanel3 = false;
  expandedPanel4 = false;
  private apiUrl = environment.apiUrl;
  userId = '';
  accessToken: any;
  form: FormGroup;
  transID: string = ''; 
  excludedFields = ['countryCode', 'municipalCode'];
  initialFormValues = {
    customerConfig:{
      customerType: 'R',
      environment: 'WMCDCQA',
      MASlibrary: '',
      companyCode: '',
    },
    customerBio:{
      name: 'KCWMToolCustomer',
      contact: 'KC Customer',
      address: '415 DAY HILL RD',
      city: 'WINDSOR',
      state: 'CT',
      zipcode: '06095-1712',
      email: 'mymail@gmail.com',
      phone: '9878977843'
    },
    serviceAddress:{
      name: 'KCWMToolCustomer',
      contact: 'KC Customer',
      address:'415 DAY HILL RD',
      city: 'WINDSOR',
      state: 'CT',
      zipcode: '06095-1712',
      email: 'mymail@gmail.com',
      phone: '9878977843'
    },
    billingInfo: {
      billingCycle: 'RMA',
      startDate: moment(),
      contractType: 'OPEN MARKET',
      contractDate: moment(),
      countryCode: '',
    },
    serviceLines: {
      svc: '200',
      wasteType: 'MSW Commercial',
      serviceCycle: 'MTR',
      tax: false,
      tp: true,
      municipalCode: '',
      monday: '$1AT',
      tuesday: '$2AT',
      wednesday: '$3AT',
      thursday: '$4AT',
      friday: '$5AT',
      saturday: '$6AT',
      sunday: '$7AT',
    },
  };

  routes: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private sharedService: DataService
  ) {


    this.sharedService.data$.subscribe(val => {
      this.transID = val;
    });
    if(this.transID != null){
      //call fetch details and set the service values
      this.initialFormValues = {
        customerConfig:{
          customerType: 'R',
          environment: 'WMCDCQA',
          MASlibrary: '',
          companyCode: '',
        },
        customerBio:{
          name: 'KCWMToolCustomer',
          contact: 'KC Customer',
          address: '415 DAY HILL RD',
          city: 'WINDSOR',
          state: 'CT',
          zipcode: '06095-1712',
          email: 'mymail@gmail.com',
          phone: '9878977843'
        },
        serviceAddress:{
          name: 'KCWMToolCustomer',
          contact: 'KC Customer',
          address:'415 DAY HILL RD',
          city: 'WINDSOR',
          state: 'CT',
          zipcode: '06095-1712',
          email: 'mymail@gmail.com',
          phone: '9878977843'
        },
        billingInfo: {
          billingCycle: 'RMA',
          startDate: moment(),
          contractType: 'OPEN MARKET',
          contractDate: moment(),
          countryCode: '',
        },
        serviceLines: {
          svc: '200',
          wasteType: 'MSW Commercial',
          serviceCycle: 'MTR',
          tax: false,
          tp: true,
          municipalCode: '',
          monday: '$1AT',
          tuesday: '$2AT',
          wednesday: '$3AT',
          thursday: '$4AT',
          friday: '$5AT',
          saturday: '$6AT',
          sunday: '$7AT',
        },
      };
    }

    this.form = this.fb.group({
      customerConfig: this.fb.group({
        customerType: [this.initialFormValues.customerConfig.customerType, Validators.required],
        environment: [this.initialFormValues.customerConfig.environment, Validators.required],
        MASlibrary: [this.initialFormValues.customerConfig.MASlibrary, [Validators.required,Validators.pattern(/^[a-zA-Z0-9]+$/)]],
        companyCode: [this.initialFormValues.customerConfig.companyCode, [Validators.required]],
      }),
      customerBio: this.fb.group({
        name: [this.initialFormValues.customerBio.name, Validators.required],
        contact: [this.initialFormValues.customerBio.contact, Validators.required],
        address: [this.initialFormValues.customerBio.address, Validators.required],
        city: [this.initialFormValues.customerBio.city, Validators.required],
        state: [this.initialFormValues.customerBio.state, Validators.required],
        zipcode: [this.initialFormValues.customerBio.zipcode, Validators.required],
        email: [this.initialFormValues.customerBio.email,[Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
        phone: [this.initialFormValues.customerBio.phone, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      }),
      serviceAddress: this.fb.group({
        name: [this.initialFormValues.serviceAddress.name, Validators.required],
        contact: [this.initialFormValues.serviceAddress.contact, Validators.required],
        address: [this.initialFormValues.serviceAddress.address, Validators.required],
        city: [this.initialFormValues.serviceAddress.city, Validators.required],
        state: [this.initialFormValues.serviceAddress.state, Validators.required],
        zipcode: [this.initialFormValues.serviceAddress.zipcode, Validators.required],
        email: [this.initialFormValues.serviceAddress.email, [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
        phone: [this.initialFormValues.serviceAddress.phone, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      }),
      billingInfo: this.fb.group({
        billingCycle: [this.initialFormValues.billingInfo.billingCycle, Validators.required],
        startDate: [this.initialFormValues.billingInfo.startDate, Validators.required],
        contractType: [this.initialFormValues.billingInfo.contractType, Validators.required],
        contractDate: [this.initialFormValues.billingInfo.contractDate, Validators.required],
        countryCode: [this.initialFormValues.billingInfo.countryCode],
      }),
      serviceLines: this.fb.group({
        svc: [this.initialFormValues.serviceLines.svc, Validators.required],
        wasteType: [
          this.initialFormValues.serviceLines.wasteType,
          Validators.required,
        ],
        serviceCycle: [
          this.initialFormValues.serviceLines.serviceCycle,
          Validators.required,
        ],
        tax: [this.initialFormValues.serviceLines.tax, Validators.required],
        tp: [this.initialFormValues.serviceLines.tp, Validators.required],
        municipalCode: [
          this.initialFormValues.serviceLines.municipalCode
        ],
        monday: [
          this.initialFormValues.serviceLines.monday
        ],
        tuesday: [
          this.initialFormValues.serviceLines.tuesday
        ],
        wednesday: [
          this.initialFormValues.serviceLines.wednesday
        ],
        thursday: [
          this.initialFormValues.serviceLines.thursday
        ],
        friday: [
          this.initialFormValues.serviceLines.friday
        ],
        saturday: [
          this.initialFormValues.serviceLines.saturday
        ],
        sunday: [
          this.initialFormValues.serviceLines.sunday
        ],
      }),
    });
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('token') ?? '';
      this.userId= localStorage.getItem('userId') ?? '';
    }
    this.form.get('serviceLines.serviceCycle')?.disable();
    this.form.get('serviceLines.tp')?.disable();

  }

  enableFields(){
    if(this.form.get('customerConfig.customerType')?.value == 'O'){
      this.form.get('serviceLines.serviceCycle')?.enable();
      this.form.get('serviceLines.tp')?.enable();
    }else{
      this.form.get('serviceLines.serviceCycle')?.disable();
      this.form.get('serviceLines.tp')?.disable();
    }
  }
  
  goToNext(panel: number): void {
    if (panel === 2) {
      this.expandedPanel1 = false;
      this.expandedPanel2 = true;
    } else if (panel === 3) {
      this.expandedPanel2 = false;
      this.expandedPanel3 = true;
    } else if (panel === 4) {
      this.expandedPanel3 = false;
      this.expandedPanel4 = true;
    }
  }

  isFormValidExcludingFields(form: FormGroup, excludeFields: string[]): boolean {
    let isValid = true;  
    Object.keys(form.controls).forEach(groupKey => {
      const group = form.controls[groupKey] as FormGroup;      
      Object.keys(group.controls).forEach(fieldKey => {
        const control = group.controls[fieldKey];       
        if (!excludeFields.includes(fieldKey) && !control.disabled) {
          if (!control.valid) {
            isValid = false;
          }
        }
      });
    });  
    return isValid;
  }

  onSubmit() {
    const contractDate = this.form.get('billingInfo.contractDate')!.value;
    const formattedContractDate = contractDate.format('YYYY-MM-DD');

    const startDate = this.form.get('billingInfo.startDate')!.value;
    const formattedStartDate = startDate.format('YYYY-MM-DD');

    if (this.isFormValidExcludingFields(this.form, this.excludedFields)) {
      this.isLoading = true;
      this.routes = [
        {
          dayOfWeek: 'Monday',
          routeCode: this.form.value.serviceLines.monday || '',
        },
        {
          dayOfWeek: 'Tuesday',
          routeCode: this.form.value.serviceLines.tuesday || '',
        },
        {
          dayOfWeek: 'Wednesday',
          routeCode: this.form.value.serviceLines.wednesday || '',
        },
        {
          dayOfWeek: 'Thursday',
          routeCode: this.form.value.serviceLines.thursday || '',
        },
        {
          dayOfWeek: 'Friday',
          routeCode: this.form.value.serviceLines.friday || '',
        },
        {
          dayOfWeek: 'Saturday',
          routeCode: this.form.value.serviceLines.saturday || '',
        },
        {
          dayOfWeek: 'Sunday',
          routeCode: this.form.value.serviceLines.sunday || '',
        },
      ];
      this.form.value.routes = this.routes;
      this.form.value.billingInfo.contractDate = formattedContractDate;
      this.form.value.billingInfo.startDate = formattedStartDate;
      if(this.form.get('customerConfig.customerType')?.value != 'O'){
        this.form.value.serviceLines.tp = false;
      }
      this.form.value.createdby=this.userId;

      const formData = { ...this.form.value };

      delete formData.serviceLines.monday;
      delete formData.serviceLines.tuesday;
      delete formData.serviceLines.wednesday;
      delete formData.serviceLines.thursday;
      delete formData.serviceLines.friday;
      delete formData.serviceLines.saturday;
      delete formData.serviceLines.sunday;

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.accessToken}`,
      });
      this.apiService
        .post<any>(
          `${this.apiUrl}/customer/customer-create`,
          this.form.value,
          headers,
          ''
        )
        .subscribe(
          (response) => {
            this.isLoading = false;
            if (response.message.includes('successfully')) {
              this.sharedService.showSuccessMsg(
                response.message
              );
              //this.form.reset(this.initialFormValues);
            }
          },
          (error) => {
            console.error('create API Error:', error);
            this.isLoading = false;
            /*this.sharedService.showErrorMsg(
              'An error occurred. Please try again later.'
            );*/
          }
        )
        .add(() => {
          this.isLoading = false;
        });
    }
  }

  onCancel() {
    this.form.reset(this.initialFormValues);
  }
}
