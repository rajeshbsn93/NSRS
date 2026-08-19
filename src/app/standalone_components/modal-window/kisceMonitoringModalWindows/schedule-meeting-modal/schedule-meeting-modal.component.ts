import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-schedule-meeting-modal',
  templateUrl: './schedule-meeting-modal.component.html',
  styleUrls: ['./schedule-meeting-modal.component.css'],
    providers: [
      { provide: DateAdapter, useClass: MomentDateAdapter},
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS} 
    ],
    standalone:true,
    imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent]
})
export class ScheduleMeetingModalComponent implements OnInit {

 userDetails!: IUserDetails;
  multiScheduleMeetingDetailsForm!:FormGroup; 
  loader:boolean=false
  fileUploadRes:any
  fileUrl:any
  fileBaseUrl = environment.fileUrl;
  unsubscribe: Subject<any> = new Subject();
  remarks:boolean=false;
  scheduleMeetingModalData:any;
  constructor(
    public activeModal:NgbActiveModal,
    private fb:FormBuilder,
    private _alertService:AlertService,
    private _sharableService:SharableService,
    private storageService:StorageService,
    private _scheduleMeetingService:EquipmentProcurementService,
    private _datePipe: DatePipe,
    ) { }

  ngOnInit() {
    this.userDetails=this.storageService.getUserDetails()
    this.multiScheduleMeetingDetailsForm = this.fb.group({ 
      addMultiTagArray:this.fb.array([])
    });
    this.addMultiTagArray.push(this.AddMultiTagArray(this.scheduleMeetingModalData));
  }


  get addMultiTagArray(): FormArray{
    return this.multiScheduleMeetingDetailsForm.get('addMultiTagArray') as FormArray
  }
  
  AddMultiTagArray(modal:any):FormGroup{
    return this.fb.group({
      id:[modal.action == 'edit' ? modal.data.id : 0,Validators.required],
      meeting_date:[modal.action == 'edit' ? modal.data.meeting_date : '',Validators.required],
      meeting_time:[modal.action == 'edit' ? modal.data.meeting_time.substring(0,5) :'',Validators.required],
      
      link:[modal.action == 'edit' ? modal.data.link : '',[Validators.required,Validators.maxLength(200)]],
      attended_by:[modal.action == 'edit' ? modal.data.attended_by :'',[Validators.required,Validators.maxLength(200)]],
      minutes:[modal.action == 'edit' ? modal.data.minutes : ''],
      remarks:[modal.action == 'edit' ? modal.data.remarks :'',[Validators.maxLength(200)]],
      user_id:[this.userDetails.user_id],
      role_id:[this.userDetails.role_id],
      scheme_Roll_id:[80]
    })
  }

  newAddMultiTagArray(){
    this.addMultiTagArray.push(this.AddMultiTagArray(this.scheduleMeetingModalData))
  }

  removeAddMultiTagArray(index:any){
    this.addMultiTagArray.removeAt(index)
  }


  submitMultiTagged(){
    
    
    if(this.multiScheduleMeetingDetailsForm.valid){
      this.loader=true
      this._scheduleMeetingService.saveScheduleMeetingForm(this.multiScheduleMeetingDetailsForm.getRawValue().addMultiTagArray).pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (response: any) => {
          this.loader=false
          if(response.status){
            this._alertService.swalPopSuccess(`${response.message}`)
            this.activeModal.close({
              saved:1,
            })
          }else{
            this._alertService.swalPopError(`${response.message}`)
          }
        },
        error: (error:any) => {
          this.loader=false
          if(error?.error?.code==200){
            if(error?.error?.message){
              this._alertService.swalPopError(`${error.error.message}`)
            }
          }
        }
      });
   }else{
    this.multiScheduleMeetingDetailsForm.markAllAsTouched();
   }   
   
    
  }


  verifyFileSize(files:any){
    var fileSize = files[0].size
    return fileSize
  }

  verifyDocumentFileExtension(files:any){
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile 
  }

  public uploadDocuments=(files:any,index:any)=>{
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
        var fileSize=this.verifyFileSize(files)
        if(fileSize<=5242880){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("path",'data/Tempimage')
            formData.append("uploadType",'3')
          }
          //serivce calling
          this.loader = true
          this._sharableService.uploadFile(formData).subscribe({
            next: (res) => {
              this.loader = false
              this.fileUploadRes=res;
              if(this.fileUploadRes.isUploaded==true) {
                this._alertService.swalPopSuccess('File Uploaded')
                this.addMultiTagArray.controls[index].get('minutes')?.setValue(this.fileUploadRes.filedataList[0].filePath);
              } else {
                this._alertService.swalPopError(this.fileUploadRes.errorMsg || 'Upload Failed! Please Try Again.');
              }
            },
            error: () => {
              // this.addMultiTagArray.controls[index].get('document_upload_path')?.setValue('');
              // this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(null);
              this.loader=false;
            }
          })
        }else{
          this._alertService.swalPopError('File size must not be more than 5mb')
        }
      }
      else {
        this._alertService.swalPopWarning('Only jpg, jpeg, png, pdf file is allowed!')
      }
    }
  }

}
