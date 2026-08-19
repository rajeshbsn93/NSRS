import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { environment } from 'src/environments/environment';
import {  Months, RoleCode} from 'src/app/_common/_enums/role-code';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { YearFormatDirective } from 'src/app/standalone_components/directives/year-format.directive';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';

@Component({
  selector: 'app-kisce-monitoring-training-details',
  templateUrl: './kisce-monitoring-training-details.component.html',
  styleUrls: ['./kisce-monitoring-training-details.component.css'],
  standalone:true,
  imports:[CommonModule, ReactiveFormsModule, MaterialModule, YearFormatDirective],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class KisceMonitoringTrainingDetailsComponent implements OnInit {

 
  multiTrainingDetailsForm!:FormGroup; 
  loader:boolean=false
  fileUploadRes:any
  fileUrl:any
  fileBaseUrl = environment.fileUrl;
  equipmentModalData:any;
  userDetails!:IUserDetails
  unsubscribe: Subject<any> = new Subject();
  remarks:boolean=false;
  monthsDetails:any=Months
  date = new FormControl(moment());
  min_date = new Date(2017,1,1)
  max_date = new Date()
  KicUsersRoleId:any=RoleCode
  constructor(
    public activeModal:NgbActiveModal,
    private fb:FormBuilder,
    private _alertService:AlertService,
    private _sharableService:SharableService,
    private storageService:StorageService,
    private _trainingDetailsService: EquipmentProcurementService,
    ) { }
  ngOnInit() {
    this.userDetails=this.storageService.getUserDetails()
    this.multiTrainingDetailsForm = this.fb.group({ 
      addMultiTagArray:this.fb.array([])
    });
 

    this.addMultiTagArray.push(this.AddMultiTagArray(this.equipmentModalData));
    
  }

  
  get addMultiTagArray(): FormArray{
    return this.multiTrainingDetailsForm.get('addMultiTagArray') as FormArray
  }
  
  AddMultiTagArray(modal:any):FormGroup{
    return this.fb.group({
      id:[modal.action == 'edit' ? modal.data.id : 0,Validators.required],
      academy_kuid:[modal.action == 'edit' ? (this.userDetails.role_id == this.KicUsersRoleId.kisceAdmin ? modal.data.academy_KUID : modal.data.kiC_KUID) : this.userDetails.nsrs_id,Validators.required],
      regular_training:[modal.action == 'edit' ? modal.data.is_trainging_provided :'',Validators.required],
      // reason:[{value:modal.action == 'edit' ? modal.data.reason :'', disabled: this.userDetails.role_id == 82 ? (this.remarks == false ? true : false) : true},[Validators.required,Validators.maxLength(200)]],
      reason:[{value:modal.action == 'edit' ? modal.data.reason :'',  disabled: modal?.data.is_trainging_provided ? true : false},[Validators.required,Validators.maxLength(200)]],
      training_Video_Link:[ {value:modal.action == 'edit' ? this.KicUsersRoleId.kisceAdmin == this.userDetails.role_id ?  modal.data.training_Video_Link : modal.data.upload_doc_path :'',disabled: modal.data.is_trainging_provided ? false : true},[Validators.required]],
      kiuid: [this.userDetails.role_id == this.KicUsersRoleId.kisceAdmin ? this.equipmentModalData.kiuid ? this.equipmentModalData.kiuid : '' : ''],
      user_id:[this.userDetails.user_id],
      role_id:[this.userDetails.role_id],
      month:[modal.action == 'edit' ? modal.data.month :'',Validators.required],
      year:[modal.action == 'edit' ? new Date((modal.data.year),1,1)  :'',Validators.required],
      
    })
  }

  newAddMultiTagArray(){
    this.addMultiTagArray.push(this.AddMultiTagArray(this.equipmentModalData))
  }

  removeAddMultiTagArray(index:any){
    this.addMultiTagArray.removeAt(index)
  }


  submitMultiTagged(){   

    if(this.multiTrainingDetailsForm.valid){
      this.loader=true
      let rawData = this.multiTrainingDetailsForm.getRawValue()

   rawData.addMultiTagArray[0].year =new Date (rawData.addMultiTagArray[0].year).getFullYear().toString();
      
      this._trainingDetailsService.saveTrainingDetailsForm(rawData.addMultiTagArray).pipe(takeUntil(this.unsubscribe)).subscribe({
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
    this.multiTrainingDetailsForm.markAllAsTouched();
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

  // public uploadDocuments=(files:any,index:any)=>{
  //   if (files.length === 0){
  //     return;
  //   }else{
  //     var extFile=this.verifyDocumentFileExtension(files)
  //     if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
  //       var fileSize=this.verifyFileSize(files)
  //       if(fileSize<=5242880){
  //         const formData = new FormData();
  //         for (let i = 0; i < files.length; i++) {
  //           formData.append("file",files[i], files[i].name);
  //           formData.append("path",'data/Tempimage')
  //           formData.append("uploadType",'3')
  //         }
  //         //serivce calling
  //         this.loader = true
  //         this._sharableService.uploadFile(formData).subscribe({
  //           next: (res) => {
  //             this.loader = false
  //             this.fileUploadRes=res;
  //             if(this.fileUploadRes.isUploaded==true) {
  //               this._alertService.swalPopSuccess('File Uploaded')
  //               this.addMultiTagArray.controls[index].get('upload_file')?.setValue(this.fileUploadRes.filedataList[0].filePath)
  //             } else {
  //               this._alertService.swalPopError(this.fileUploadRes.errorMsg || 'Upload Failed! Please Try Again.');
  //             }
  //           },
  //           error: () => {
  //             console.error('error caught in file uploading');
  //             // this.addMultiTagArray.controls[index].get('document_upload_path')?.setValue('');
  //             // this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(null);
  //             this.loader=false;
  //           }
  //         })
  //       }else{
  //         this._alertService.swalPopError('File size must not be more than 5mb')
  //       }
  //     }
  //     else {
  //       this._alertService.swalPopWarning('Only jpg, jpeg, png, pdf file is allowed!')
  //     }
  //   }
  // }

  getRegularTraining(data:any, formArr:FormArray, index:any){
    
     if(data.value == 0){ 
      // this.remarks = true;
      // formArr.controls[index].get('reason')?.enable()
      formArr.controls[index].get('reason')?.enable()
      this.addMultiTagArray.controls[index].get('training_Video_Link')?.setValue('');
      formArr.controls[index].get('training_Video_Link')?.disable();
     // this.addMultiTagArray.controls[index].get('upload_file')?.setValue(''); //this.fileUploadRes.filedataList[0].filePath
     }
     else{
      //this.addMultiTagArray.controls[index].get('upload_file')?.setValue('');
                this.addMultiTagArray.controls[index].get('reason')?.setValue('');
                formArr.controls[index].get('reason')?.disable();
                formArr.controls[index].get('training_Video_Link')?.enable()
                
     } 
  }
  handleYearSelected(normalizedYear: Moment, dp:any,index:any) {
    const ctrlValue = this.date.value;
    ctrlValue!.year(normalizedYear.year());
    this.addMultiTagArray.controls[index].get('year')?.setValue(ctrlValue);
    dp.close();

  }

}
