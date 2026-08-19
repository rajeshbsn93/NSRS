import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { YearFormatDirective } from 'src/app/standalone_components/directives/year-format.directive';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-brandingModal',
  templateUrl: './brandingModal.component.html',
  styleUrls: ['./brandingModal.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent,YearFormatDirective]
})
export class BrandingModalComponent implements OnInit {

  multiEquipmentTagForm!:FormGroup;
  userDetails!:IUserDetails

  fileBaseUrl=environment.fileUrl

  loader:boolean=false

  unsubscribe: Subject<any> = new Subject();

  mainLoader:boolean=false

  brandingModalData:any;
  date = new FormControl(moment());
  min_date = new Date(2017,1,1)
  max_date = new Date();
  
  constructor(public activeModal:NgbActiveModal, private fb:FormBuilder,private _alertService:AlertService,
    private _storageService:StorageService,
     private _equipmentProcurementService : EquipmentProcurementService) { }

  ngOnInit() {   
    this.userDetails=this._storageService.getUserDetails()

    this.multiEquipmentTagForm = this.fb.group({
      addMultiTagArray:this.fb.array([])
    });

    this.addMultiTagArray.push(this.AddMultiTagArray(this.brandingModalData));
  }

  get addMultiTagArray(): FormArray{
    return this.multiEquipmentTagForm.get('addMultiTagArray') as FormArray
  }
  
  AddMultiTagArray(modal:any):FormGroup{
    return this.fb.group({
      branding_kic:[modal.action=='edit'? this.userDetails.role_id==82 ? modal.data.branding_done: modal.data.branding_done :'',Validators.required],
      upload_image:[modal.action=='edit'? this.userDetails.role_id==82 ? modal.data.upload_image : modal.data.upload_image :'' ],
      remarks:[modal.action=='edit'?modal.data.remarks:'',Validators.compose([Validators.maxLength(200)])],
      year:[modal.action=='edit'?new Date(Number(modal.data.year),1,1):''],
      // status: [1,Validators.required],
      // year_of_operation: ['2023',Validators.required],
      user_id: [this.userDetails.user_id,Validators.required],
      role_id: [this.userDetails.role_id,Validators.required],
      kiuid: [this.userDetails.role_id==82 ? this.brandingModalData.kiuid ?  this.brandingModalData.kiuid : '' : this.brandingModalData.data.kiC_KUID],
      bid: [modal.action=='edit' ? this.userDetails.role_id==82 ? modal.data.bid : modal.data.bid :0,Validators.required]
    })
  }


  uploadBrandingFile(files:any,index:number){
    if(!files.length) return
    if(['jpg', 'jpeg', 'png','pdf'].includes(this.verifyDocumentFileExtension(files[0]))){
      if(files[0].size < 5242880){
        const formData = new FormData();
        formData.append("file", files[0], files[0].name);
        formData.append("path", `documents/Others`);
        formData.append("uploadType","3");
        this.mainLoader=true
        this._equipmentProcurementService.uploadFile(formData).pipe(takeUntil(this.unsubscribe)).subscribe({
          next:(response:any)=>{
            this.mainLoader=false
            if (response.isUploaded) {
              this._alertService.swalPopSuccess('File Uploaded');
              // imageUploadUrl = response.filedataList[0].filePath;
              this.addMultiTagArray.controls[index].get('upload_image')?.setValue(response.filedataList[0].filePath)
              // this.profilePicUrl=environment.fileUrl+imageUploadUrl;
            } else {
              // this.profilePicUrl=''
              this._alertService.swalPopError(response.errorMsg || 'Upload Failed! Please Try Again.');
            }
          },
          error:()=>{
            this.mainLoader=false
          }
        })
      }else{
        this._alertService.swalPopError('File Size must be less than 5mb.')
      }
    }else{
      this._alertService.swalPopError('File Format Not Supported.')
    }
  }

  verifyDocumentFileExtension(file:any){
    var fileIndex = file.name.lastIndexOf(".") + 1;
    var fileExtension = file.name.substr(fileIndex, file.name.length).toLowerCase();
    return fileExtension;
  }



  saveBranding(){
    if(this.multiEquipmentTagForm.valid){
      let rawData = this.multiEquipmentTagForm.getRawValue()

   rawData.addMultiTagArray[0].year =new Date (rawData.addMultiTagArray[0].year).getFullYear();
      this._equipmentProcurementService.saveBranding(rawData.addMultiTagArray).pipe(takeUntil(this.unsubscribe)).subscribe({
        next:(res:any)=>{
          if(res.status){
            this._alertService.swalPopSuccess(`${res.message}`)
            this.activeModal.close({
              saved:true
            })
          }else{
            this._alertService.swalPopError(`${res.message}`)
          }
        },
        error:(error)=>{
          this._alertService.swalPopError('Something Went Wrong!')
        }
      })
    }else{
      this.multiEquipmentTagForm.markAllAsTouched()
    }
  }

  ngOnDestroy(){
    this.unsubscribe.complete()
  }
  handleYearSelected(normalizedYear: Moment, dp:any,index:any) {
    const ctrlValue = this.date.value;
    ctrlValue!.year(normalizedYear.year());
    this.addMultiTagArray.controls[index].get('year')?.setValue(ctrlValue);
    dp.close();

  }

}
