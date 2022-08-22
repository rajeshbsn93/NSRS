import {
    AbstractControl,
    ValidatorFn,
    FormControl,
    UntypedFormGroup,
  } from '@angular/forms';
  
  export function ConfirmValidator(controlName:string, matchingControlName:string){
    return (formGroup:UntypedFormGroup) =>{
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if(matchingControl.errors && !matchingControl.errors['confirmValidator']){
        return 
      }
      if(control.value !== matchingControl.value){
        matchingControl.setErrors({confirmValidator: true})
      } else{
        matchingControl.setErrors(null)
      }
    }
  }
  