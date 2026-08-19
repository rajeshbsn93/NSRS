import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { Enable_disableFormService } from "src/app/_common/services/common-services/enable_disableForm.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { SharableService } from "src/app/_common/services/innerPagesServices/innerpagesSharable.service";
import { OtherRoleService } from "src/app/_common/services/other-role-service/other-role.service";
import { AthleteEducationInfoService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-education-info.service";
import { SideBarNavStateService } from "src/app/_common/sidebar.state";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { environment } from "src/environments/environment";

@Component({
selector:'app-other-role-additional-info-document-modal',
templateUrl:'./other-role-additional-info-document-modal.component.html',
styleUrls:['./other-role-additional-info-document-modal.component.css'],
standalone:true,
imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
providers: [
  {provide: DateAdapter, useClass: MomentDateAdapter},
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  DatePipe
],
})
export class OtherRoleAdditionalInfoDocumentModalComponent implements OnInit{
    readonlyEdit:boolean = true
    additionalForm!:FormGroup;
    userDetails:any;
    loader:boolean = false;
    loader2:boolean = false;
    minDate:any;
    maxDate:any;
    subscription:Subscription = new Subscription();
    fileBaseUrl:String = environment.fileUrl

    constructor(
        public activeModal:NgbActiveModal,
        private formBuilder:FormBuilder,
        private enableDisableService:Enable_disableFormService,
        private storageService:StorageService,
        private alertService:AlertService,
        private _sideBarState:SideBarNavStateService, 
        private datePipe:DatePipe,
        private athleteEducationInfoService:AthleteEducationInfoService,
        private _sharableService:SharableService,
        private _otherRoleService:OtherRoleService

      ){}

    ngOnInit(): void {
      this.userDetails=this.storageService.getUserDetails()
        this.basicDetailsReactiveForm();
        this.setFormValues()
    }
    
    basicDetailsReactiveForm(){
        this.additionalForm=this.formBuilder.group({
            aadhaar_number:['',[Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
            passport_number:[''],
            pancard_number:['',[Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$/)]],
            aadhaarFile:['',[Validators.required]],      
            identityFile:[''],      
            certificateFile:[''],      
        })
      }

      setFormValues(){
        this.loader = true
        this._otherRoleService.getOtherOfficial_AdditionalInfo(this.userDetails.user_id).subscribe({
          next:(response:any)=>{
            this.loader=false
            console.log(response)
            this.additionalForm.controls['aadhaar_number'].setValue(response[0]?.aadhar_number)
            this.additionalForm.controls['passport_number'].setValue(response[0]?.passport_number)
            this.additionalForm.controls['pancard_number'].setValue(response[0]?.pancard_number)
            this.additionalForm.controls['aadhaarFile'].setValue(response[0]?.aadhar_image_path)
            this.additionalForm.controls['identityFile'].setValue(response[0]?.service_id_image_path)
            this.additionalForm.controls['certificateFile'].setValue(response[0]?.coaching_certificate_image)
            this.additionalForm.disable()
            // this.enableDisableService.DisableField(this.additionalForm,'name',true)
          },
          error:()=>{
            this.loader = false
            console.error('Caught in GetAthletePersonalInfo API')
          }
        })
        
      }
      
      uploadDocument(files: any, type: string) {
        if (!files.length) return
        if (['jpg', 'jpeg', 'png','pdf'].includes(this.verifyDocumentFileExtension(files[0]))) {
          let imageSize = type == 'header_image' ? 2000000 : 5000000
          if (files[0].size < imageSize) {
            this.loader = true
            const formData = new FormData();
            formData.append("file", files[0], files[0].name);
            formData.append("path", type == 'header_image' ? `Profile/Others` : `documents/Others`);
    
    
            formData.append("uploadType", "3");
            let imageUploadUrl: string
            //this.loader=true
            this._sharableService.uploadFile(formData).subscribe({
              next: (response: any) => {
                this.loader = false
                if (response.isUploaded) {
                    this.alertService.swalPopSuccess('File Uploaded')    
                  if (type == 'aadhaar') {
                    imageUploadUrl = response.filedataList[0].filePath;
                    this.additionalForm.get('aadhaarFile')?.setValue(imageUploadUrl)
                  } else if (type == 'certificate') {
                    imageUploadUrl = response.filedataList[0].filePath;
                    this.additionalForm.get('certificateFile')?.setValue(imageUploadUrl)
                  } else if (type == 'identity') {
                    imageUploadUrl = response.filedataList[0].filePath;
                    this.additionalForm.get('identityFile')?.setValue(imageUploadUrl)
                  }
                } else {
                  // this.profilePicUrl=''
                  this.loader = false;
                  this.alertService.swalPopError(response.errorMsg || 'Upload Failed! Please Try Again.');
                }
              },
              error: () => {
                this.loader = false;
                this.alertService.swalPopWarning('Something went wrong!!')
              }
            })
          } else {
            this.loader = false
            this.alertService.swalPopError(type == 'header_image' ? 'File Size is greater than  2mb.' : 'File Size is greater than  5mb.')
          }
    
        } else {
          this.loader = false;
          this.alertService.swalPopError('File Format Not Supported.')
        }
      }
      verifyDocumentFileExtension(file: any) {
        var fileIndex = file.name.lastIndexOf(".") + 1;
        var fileExtension = file.name.substr(fileIndex, file.name.length).toLowerCase();
        return fileExtension;
      }


      editButton(){
        this.additionalForm.enable();
        this.additionalForm.updateValueAndValidity();
        this.readonlyEdit = !this.readonlyEdit
      }

      save(){
        console.log( this.additionalForm.valid)
        if(this.additionalForm.valid){
          const payload = {
            official_detail_id: this.userDetails.user_id,
            aadhar_number:this.additionalForm.get('aadhaar_number')?.getRawValue(),
            aadhar_image_path:this.additionalForm.get('aadhaarFile')?.getRawValue(),
            passport_number:this.additionalForm.get('passport_number')?.getRawValue(),
            passport_image_path: null,
            passport_last_image_path: null,
            voter_id_number: null,
            voter_id_image_path: null,
            birth_certificate_path: null,
            service_id_image_path:this.additionalForm.get('identityFile')?.getRawValue(),
            coaching_certificate_image: this.additionalForm.get('certificateFile')?.getRawValue(),
            pancard_number: this.additionalForm.get('pancard_number')?.getRawValue(),
            pancard_image_path: null,
            passport_expiry_date: null
          }
          // console.log(payload)
          this._otherRoleService.saveOtherOfficialAddinationalInfo(payload).subscribe({
            next:(response)=>{
              if(response){
                this.readonlyEdit = !this.readonlyEdit;
                this.alertService.swalPopSuccess('Information Details Updated Successfully!');
                this.activeModal.close();
              }
            },
            error:()=>{
              console.error('Caught in EditAthletePersonalInfo API')
            }
          })
          //this.activeModal.close()
        }else{
          this.additionalForm.markAllAsTouched();
          this.enableDisableService.DisableField(this.additionalForm,'gender',true)
        }
      }
}