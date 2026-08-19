import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function noJavaScriptValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null; // Skip validation if empty
      
      const forbiddenPattern = /<script[\s\S]*?>[\s\S]*?<\/script>|javascript:|on\w+="[\s\S]*?"|<\/|\/>/gi;
      const hasJavaScript = forbiddenPattern.test(control.value);
      return hasJavaScript ? { 'noJavaScript': true } : null;
    };
  }