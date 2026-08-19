import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/_common/material.module';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-verify-achievement-popup',
  templateUrl: './verify-achievement-popup.component.html',
  styleUrls: ['./verify-achievement-popup.component.css'],
  standalone:true,
  imports:[CommonModule,MaterialModule, LoaderComponent]
})
export class VerifyAchievementPopupComponent implements OnInit {
  message: string = ""
  confirmButtonText = ""
  cancelButtonText = ""
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<VerifyAchievementPopupComponent>) {
      if(data){
    this.message = data.message || this.message;
    if (data.buttonText) {
      this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
      this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
    }
      }
  }
  ngOnInit(): void {
    
  }

  onConfirmClick(status:number): void {
    this.dialogRef.close({
      status:status,
      isVerify:true
    });
  }

  close() {
    this.dialogRef.close({
      isVerify:false
    });
  }
}
