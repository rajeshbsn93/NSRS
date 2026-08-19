import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
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
  selector: 'app-achievementModal',
  templateUrl: './achievementModal.component.html',
  styleUrls: ['./achievementModal.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS} 
  ],
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent]
})
export class AchievementModalComponent implements OnInit {

  userDetails!: IUserDetails;
  achievementForm!:FormGroup; 

  loader:boolean=false
  fileUploadRes:any
  fileUrl:any
  fileBaseUrl = environment.fileUrl;

  unsubscribe: Subject<any> = new Subject();
  remarks:boolean=false;

  achievementModalData:any;

  constructor(public activeModal:NgbActiveModal, private fb:FormBuilder, private _alertService:AlertService,
    private _sharableService:SharableService, private storageService:StorageService, private _scheduleMeetingService:EquipmentProcurementService,
    private _datePipe: DatePipe) { }

  ngOnInit() {
    this.userDetails=this.storageService.getUserDetails()

    this.achievementForm = this.fb.group({ 
      addMultiTagArray:this.fb.array([])
    });

    this.addMultiTagArray.push(this.AddMultiTagArray(this.achievementModalData));
  }


  get addMultiTagArray(): FormArray{
    return this.achievementForm.get('addMultiTagArray') as FormArray
  }
  
  AddMultiTagArray(modal:any):FormGroup{
    return this.fb.group({
      id:[modal.action == 'edit' ? modal.data.id : 0,Validators.required],
      athlete_kuid:[modal.action == 'edit' ? modal.data.ki_unique_id : '',Validators.required],
      name:[modal.action == 'edit' ? modal.data.name :'',Validators.required],
      
      discipline:[modal.action == 'edit' ? modal.data.sport_detail_id : '',[Validators.required,Validators.maxLength(200)]],
      tournament_name:[modal.action == 'edit' ? modal.data.tournament_name :'',[Validators.required,Validators.maxLength(200)]],
      date:[modal.action == 'edit' ? modal.data.date :''],
      level:[modal.action == 'edit' ? modal.data.level :'',[Validators.required,Validators.maxLength(200)]],
      position:[modal.action == 'edit' ? modal.data.position :'',[Validators.required,Validators.maxLength(200)]],
      user_id:[this.userDetails.user_id],
      role_id:[this.userDetails.role_id],
      
    })
  }

  newAddMultiTagArray(){
    this.addMultiTagArray.push(this.AddMultiTagArray(this.achievementModalData))
  }

  removeAddMultiTagArray(index:any){
    this.addMultiTagArray.removeAt(index)
  }


  submitMultiTagged(){
    if(this.achievementForm.valid){
      this.loader=true
      this._scheduleMeetingService.saveScheduleMeetingForm(this.achievementForm.getRawValue().addMultiTagArray).pipe(takeUntil(this.unsubscribe)).subscribe({
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
    this.achievementForm.markAllAsTouched();
   }   
   
    
  }


  verifyFileSize(files:any){
    var fileSize = files[0].size;
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
              console.error('error caught in file uploading');
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
