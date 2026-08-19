import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const FORMAT = {
  parse: {
      dateInput: 'YYYY',
  },
  display: {
      dateInput: 'YYYY',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY',
  },
};

@Directive({
  selector: '[appYearFormat]',
  standalone:true,
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: FORMAT },
],
})
export class YearFormatDirective {

  constructor() { }

}
