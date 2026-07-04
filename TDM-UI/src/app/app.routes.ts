import { Routes } from '@angular/router';
import { BulkuploadComponent } from './components/bulkupload/bulkupload.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CreatecustomerComponent } from './components/createcustomer/createcustomer.component';
import { CreateticketComponent } from './components/createticket/createticket.component';
import { authGuard } from './guard/auth-guard.guard';
import { loginguardGuard } from './guard/loginguard.guard';
import { AdminComponent } from './components/admin/admin.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginguardGuard],
  },
  {
    path: 'forgot',
    component: ForgotComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'customer',
    component: CreatecustomerComponent,
    canActivate: [authGuard],
  },
  {
    path: 'ticket',
    component: CreateticketComponent,
    canActivate: [authGuard],
  },
  {
    path: 'bulkupload',
    component: BulkuploadComponent,
    canActivate: [authGuard],
  },
  {
    path: 'users',
    component: AdminComponent,
    canActivate: [authGuard],
  },
  { path: '**', component: NotfoundComponent },
];
