import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DataService } from '../service/sharedata.service';

export const loginguardGuard: CanActivateFn = (route, state) => {
  const authService = inject(DataService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
