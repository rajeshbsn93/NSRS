import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMobileNumber]',
  standalone:true,
})
export class MobileNumberDirective {
  // Allow decimal numbers and negative values
 regxVal = /^[6-9]+([0-9]*)$/;
 private regex: RegExp = new RegExp(this.regxVal);
 // private regex: RegExp = new RegExp("^[6-9][0-9]{9}$");
 // Allow key codes for special events. Reflect :
 // Backspace, tab, end, home
 private specialKeys: Array<string> = [
   'Backspace',
   'Tab',
   'End',
   'Home',
   'ArrowLeft',
   'ArrowRight',
   'Delete',
   'Enter',
 ];

 constructor(private el: ElementRef) {}
 @HostListener('keydown', ['$event'])
 onKeyDown(event: KeyboardEvent) {
   // Allow Backspace, tab, end, and home keys
   if (this.specialKeys.indexOf(event.key) !== -1) {
     return;
   }

   let current: string = this.el.nativeElement.value;
   let next: string = current.concat(event.key);

   if (next && !String(next).match(this.regex)) {
     event.preventDefault();
   }
 }

//  validate(control: AbstractControl): ValidationErrors | null {
//    const isValid = this.regxVal.test(control.value);
//    return !isValid ? { invalidInput: true } : null;
//  }

}
