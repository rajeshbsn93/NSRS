import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class AlertService {

  constructor() { }

  swalPopSuccess(textMsg:string){
    Swal.fire({
      position: 'center',
      icon: 'success',
      text: textMsg,
      showConfirmButton: true,
    });
  }

  swalPopError(textMsg:string){
    Swal.fire({
      position: 'center',
      icon: 'error',
      text: textMsg,
      showConfirmButton: true,
    });
  }

  swalPopSuccessTimer(textMsg:string){
    Swal.fire({
      position: 'center',
      icon: 'success',
      text: textMsg,
      timer:3000
    });
  }

  swalPopErrorTimer(textMsg:string){
    Swal.fire({
      position: 'center',
      icon: 'error',
      text: textMsg,
      timer:3000
    });
  }

  swalPopWarningTimer(textMsg:string){
    Swal.fire({
      position: 'center',
      icon: 'warning',
      text: textMsg,
      timer:2000
    });
  }

  swalPopWarning(textMsg:string){
    Swal.fire({
      position: 'center',
      icon: 'warning',
      text: textMsg,
      showConfirmButton:true
    });
  }

  showToast(typeIcon = SWAL_TYPE.SUCCESS, timerProgressBar: boolean = false, title: string, timer: number = 2000) {
    Swal.fire({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      icon: typeIcon,
      timerProgressBar,
      timer,
      title
    });
  }
}

export enum SWAL_TYPE {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  QUESTION = 'question'
}
