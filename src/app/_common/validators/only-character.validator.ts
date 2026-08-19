import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function OnlyCharactervalidator(...formControlName: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let name = control.get(formControlName)?.value;
    let regExp = /^[a-zA-Z ]+$/;
    if (name != null) {
      if (!regExp.test(name)) {
        return null;
      } else {
        return { inValidName: true };
      }
    } else {
      return null;
    }
  };
}

export function NewOnlyCharactervalidator(control: AbstractControl): ValidationErrors | null {
  let name = control.value
  let regExp = /^[a-zA-Z ]+$/;
  if (name != null) {
    if (!regExp.test(name)) {
        return { inValidName: true };
    } else {
        return null;
    }
  } else {
    return null;
  }
}

export function OnlyNumbervalidator(control: AbstractControl): ValidationErrors | null {
    let val = control.value
    let regExp = /^[0-9]*$/;
    if (val != null) {
      if (!regExp.test(val)) {
          return { inValidNumber: true };
      } else {
          return null;
      }
    } else {
      return null;
    }
  }


