import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  
} from '@angular/material/dialog'
import { YoungProfessionalService } from 'src/app/_common/services/young-professional/young-professional.service';
@Component({
  selector: 'app-yp-common-popup',
  templateUrl: './yp-common-popup.component.html',
  styleUrls: ['./yp-common-popup.component.css']
})
export class YpCommonPopupComponent implements OnInit {
  dialogRef = inject(MatDialogRef<YpCommonPopupComponent>);
  isLoading:Boolean=false

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private youngProfessionalService:YoungProfessionalService,) { }

  ngOnInit(): void {
  }

  reject(isRejected:boolean){
    this.dialogRef.close({isRejected:isRejected});
   }

   close(status:string){
    this.dialogRef.close({navigateTo:status});
   }
}
