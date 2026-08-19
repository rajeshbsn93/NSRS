import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Enable_disableFormService {

constructor() { }

  DisableField(formName:any,formControlName:string,disableVal?:boolean){
    formName.controls[formControlName]?.disable({onlySelf:disableVal})
  }

  enableField(formName:any,formControlName:string,disableVal?:boolean){
    formName.controls[formControlName]?.enable({onlySelf:disableVal}) 
  }

  DisableFieldFormArray(formName:any,index:number,formControlName:string,disableVal?:boolean){
    formName.controls[index].get(formControlName)?.disable({onlySelf:disableVal})
  }

  EnableFieldFormArray(formName:any,index:number,formControlName:string,disableVal?:boolean){
    formName.controls[index].get(formControlName)?.disable({onlySelf:disableVal})
  }

}
