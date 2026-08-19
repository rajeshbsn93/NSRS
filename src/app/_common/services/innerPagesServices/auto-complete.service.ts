import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AutoCompleteService {
  constructor() {}

  autoCompleteFilter(value: string, list: any, propertyName: string): string[] {
    const filterValue = value.toLowerCase();
    return list.filter((item: any) =>
      item[propertyName].toLowerCase().includes(filterValue)
    );
  }

  autoCompleteValidator(control: AbstractControl, list: any, propertyName: string, errorType: string): ValidatorFn {
    return (): ValidationErrors | null => (control.value &&
      !list.some((item: any) => item[propertyName] === control.value)
      ? { [errorType]: true }
      : null);
  }
}
