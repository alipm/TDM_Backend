import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dayFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validFormat = /^\$(\d{1,2})AT$/; 

    if (control.value && !validFormat.test(control.value)) {
      return { invalidFormat: true };  
    }
    return null;  
  };
}
