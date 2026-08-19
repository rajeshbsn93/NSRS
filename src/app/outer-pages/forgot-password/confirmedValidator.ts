import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
    
export function ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors['ConfirmedValidator']) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

export function ConfirmedValidatorNew(newPassword:string, confirmPassword: string):ValidatorFn{

    return (control:AbstractControl):ValidationErrors | null => {
        const newPass = control.get(newPassword)?.value
        const confirmPass = control.get(confirmPassword)?.value
        
        if(newPass != confirmPass && confirmPass != newPass){
            return { "notMatched" : true}
        }
        return null
    }

}
export function MatchedValidatorMobile(newPassword:string, confirmPassword: string):ValidatorFn{

    return (control:AbstractControl):ValidationErrors | null => {
        const newPass = control.get(newPassword)?.value
        const confirmPass = control.get(confirmPassword)?.value
        
        if(newPass == confirmPass && confirmPass == newPass){
            return { "matchedMobile" : true}
        }
        return null
    }

}
export function MatchedValidatorEmail(email:string, alternate_email_id: string):ValidatorFn{

    return (control:AbstractControl):ValidationErrors | null => {
        const newPass = control.get(email)?.value
        const confirmPass = control.get(alternate_email_id)?.value
        
        if(newPass == confirmPass && confirmPass == newPass){
            return { "matchedEmail" : true}
        }
        return null
    }

}