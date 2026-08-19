import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { Enable_disableFormService } from "src/app/_common/services/common-services/enable_disableForm.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { EncryptionService } from "src/app/_common/services/innerPagesServices/encryption.service";
import { SharableService } from "src/app/_common/services/innerPagesServices/innerpagesSharable.service";
import { AthleteDocumentService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-document.service";
import { BankInformationService } from "src/app/_common/services/role-inner-pages-services/athlete-services/bank_information.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
    selector:'app-athlete-documents',
    templateUrl:'./athlete-documents.component.html',
    styleUrls:['./athlete-documents.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
    providers: [
      {provide: DateAdapter, useClass: MomentDateAdapter},
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
      DatePipe
    ],

})

export class AthleteDocumentsComponent implements OnInit{
    readonlyPhotoIdEdit:boolean = true   
    documentForm!:FormGroup;
    userDetails:any;
    loader:boolean = false;
    athleteDocumentData:any
    aadharUploadRes:any;
    aadharUploadUrl:any
    drivingFileUploadRes:any;
    drivingFileUploadUrl:any
    passportFileUploadRes:any;
    passportFileUploadUrl:any
    voterFileUploadRes:any;
    voterFileUploadUrl:any
    rationFileUploadRes:any;
    rationFileUploadUrl:any
    panFileUploadRes:any;
    panFileUploadUrl:any
    bonafideFileUploadRes:any;
    bonafideFileUploadUrl:any
    tenthFileUploadRes:any;
    tenthFileUploadUrl:any
    twelfthFileUploadRes:any;
    twelfthFileUploadUrl:any
    birthFileUploadRes:any;
    birthFileUploadUrl:any
    otherFileUploadRes:any;
    otherFileUploadUrl:any;
    readonlydobEdit:boolean = true;
    dobForm!:FormGroup;
    dobFileUploadRes:any;
    dobFileUploadUrl:any;
    docPath: string = "Athlete\\playerdocumentinfo";
    fileBaseUrl = environment.fileUrl;

    constructor(public activeModal:NgbActiveModal,private formBuilder:FormBuilder,private enableDisableService:Enable_disableFormService,
      private storageService:StorageService,private alertService:AlertService,
      private sharableService:SharableService,private athleteDocumentService:AthleteDocumentService,
      private datePipe:DatePipe,
      private encryptionService:EncryptionService 
    ){}

    ngOnInit(): void {
      this.userDetails=this.storageService.getUserDetails()
        this.basicDetailsReactiveForm();
        this.setFormValues()
    }
    basicDetailsReactiveForm(){
        this.documentForm=this.formBuilder.group({
          aadhar_no:[''],
          aadhar_img_path:[''],
          // is_aadhar_verified:[''],
          driving_licence_no:[''],
          driving_licence_path:[''],
          passport_img_path:[''],
          passport_no:[''],
          passport_expiry:[null],
          voter_id:[''],
          voter_id_img_path:[''],
          ration_card_no:[''],
          ration_card_path:[''],
          pancard_no:[''],
          pancard_path:[''],
          bonafide_year:[null],
          bonafide_certificate:[''],
          tenth_pass_year:[null],
          tenth_certificate_path:[''],
          twelve_certificate_path:[''],
          birth_certi_issued_year:[null],
          birth_certificate_path:[''],
          other_document_name:[''],
          other_document_path:[''],
        })

        this.dobForm = this.formBuilder.group({
          dob_path:[''],
        })

      }

      setFormValues(){
        this.loader = true
        this.athleteDocumentService.athleteDocumentInfo(this.userDetails.user_id).subscribe({
          next:(response:any)=>{
            this.loader=false
            this.athleteDocumentData = response
            //console.log(response)
            // if(response !=null){
              // this.documentForm.get('aadhar_no')?.setValue(response?.aadhar_number);
            // this.aadharUploadUrl = response?.aadhar_image_path;
            this.documentForm.get('is_aadhar_verified')?.setValue(response?.is_aadhar_verified);
            this.documentForm.get('driving_licence_no')?.setValue(response?.driving_licence_number);
            this.drivingFileUploadUrl = response?.driving_licence_path;
            this.documentForm.get('passport_no')?.setValue(response?.passport_number);           
            this.documentForm.get('passport_expiry')?.setValue(response?.passport_expiry_date);           
            this.passportFileUploadUrl = response?.passport_image_path;
            this.documentForm.get('voter_id')?.setValue(response?.voter_id_number);
            this.voterFileUploadUrl = response?.voter_id_image_path;
            this.documentForm.get('ration_card_no')?.setValue(response?.ration_card_number);            
            this.rationFileUploadUrl = response?.ration_card_path;
            this.documentForm.get('pancard_no')?.setValue(response?.pancard_number);            
            this.panFileUploadUrl = response?.pancard_path;
            this.documentForm.get('bonafide_year')?.setValue(response?.bonafide_year);            
            this.bonafideFileUploadUrl = response?.bonafide_certificate;
            this.documentForm.get('tenth_pass_year')?.setValue(response?.tenth_pass_year);
            this.tenthFileUploadUrl = response?.tenth_certificate_path;
            this.twelfthFileUploadUrl = response?.twelve_certificate_path;
            this.documentForm.get('birth_certi_issued_year')?.setValue(response?.birth_certi_issued_year);
            this.birthFileUploadUrl = response?.birth_certificate_path;
            if(response?.other_document_name !=null)this.documentForm.get('other_document_name')?.setValue(response?.other_document_name);            
            this.otherFileUploadUrl = response?.other_document_path;
            this.documentForm.disable() ;
            this.dobForm.disable();
            this.dobFileUploadUrl = response?.dob_path;
            // }

          },
          error:()=>{
            this.loader = false
            console.error('Caught in GetAthleteDocumentInfo API');
            this.readonlyPhotoIdEdit = false;
          }
        })
        
      }


      editPhotoIdButton(){
        // this.enableDisableService.enableField(this.documentForm,'name',true)
        this.documentForm.enable()
        this.readonlyPhotoIdEdit = !this.readonlyPhotoIdEdit
      }

      verifyDocumentFileExtension(files:any){
        var fileIndex = files[0].name.lastIndexOf(".") + 1;
        var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
        return extFile 
      }

      aadharUpload(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path",this.docPath)
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.aadharUploadRes=res;
                if(this.aadharUploadRes.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['cancelled_cheque_upload'].setValue=this.aadharUploadRes.filedataList[0].filePath
                  this.aadharUploadUrl=this.aadharUploadRes.filedataList[0].filePath
                  //console.log(this.aadharUploadUrl)
                }else{
                  var errMsg
                  if(this.aadharUploadRes.errorMsg){
                    errMsg=this.aadharUploadRes.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }    
    
      drivingFileUpload(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path",this.docPath)
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.drivingFileUploadRes=res;
                if(this.drivingFileUploadRes.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['cancelled_cheque_upload'].setValue=this.drivingFileUploadRes.filedataList[0].filePath
                  this.drivingFileUploadUrl=this.drivingFileUploadRes.filedataList[0].filePath
                  //console.log(this.drivingFileUploadUrl)
                }else{
                  var errMsg
                  if(this.drivingFileUploadRes.errorMsg){
                    errMsg=this.drivingFileUploadRes.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }
      passportFileUpload(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path",this.docPath)
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.passportFileUploadRes=res;
                if(this.passportFileUploadRes.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['cancelled_cheque_upload'].setValue=this.passportFileUploadRes.filedataList[0].filePath
                  this.passportFileUploadUrl=this.passportFileUploadRes.filedataList[0].filePath
                  //console.log(this.passportFileUploadUrl)
                }else{
                  var errMsg
                  if(this.passportFileUploadRes.errorMsg){
                    errMsg=this.passportFileUploadRes.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }
      voterFileUpload(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path",this.docPath)
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.voterFileUploadRes=res;
                if(this.voterFileUploadRes.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['cancelled_cheque_upload'].setValue=this.voterFileUploadRes.filedataList[0].filePath
                  this.voterFileUploadUrl=this.voterFileUploadRes.filedataList[0].filePath
                  //console.log(this.voterFileUploadUrl)
                }else{
                  var errMsg
                  if(this.voterFileUploadRes.errorMsg){
                    errMsg=this.voterFileUploadRes.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }
      rationFileUpload(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path",this.docPath)
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.rationFileUploadRes=res;
                if(this.rationFileUploadRes.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['cancelled_cheque_upload'].setValue=this.rationFileUploadRes.filedataList[0].filePath
                  this.rationFileUploadUrl=this.rationFileUploadRes.filedataList[0].filePath
                  //console.log(this.rationFileUploadUrl)
                }else{
                  var errMsg
                  if(this.rationFileUploadRes.errorMsg){
                    errMsg=this.rationFileUploadRes.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }
      panFileUpload(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path",this.docPath)
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.panFileUploadRes=res;
                if(this.panFileUploadRes.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['cancelled_cheque_upload'].setValue=this.panFileUploadRes.filedataList[0].filePath
                  this.panFileUploadUrl=this.panFileUploadRes.filedataList[0].filePath
                  //console.log(this.panFileUploadUrl)
                }else{
                  var errMsg
                  if(this.panFileUploadRes.errorMsg){
                    errMsg=this.panFileUploadRes.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }
      bonafideFileUpload(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path",this.docPath)
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.bonafideFileUploadRes=res;
                if(this.bonafideFileUploadRes.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['cancelled_cheque_upload'].setValue=this.bonafideFileUploadRes.filedataList[0].filePath
                  this.bonafideFileUploadUrl=this.bonafideFileUploadRes.filedataList[0].filePath
                  //console.log(this.bonafideFileUploadUrl)
                }else{
                  var errMsg
                  if(this.bonafideFileUploadRes.errorMsg){
                    errMsg=this.bonafideFileUploadRes.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }
      tenthFileUpload(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path",this.docPath)
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.tenthFileUploadRes=res;
                if(this.tenthFileUploadRes.isUploaded==true){
                  this.swalFileUploadSuccess()
                  this.tenthFileUploadUrl=this.tenthFileUploadRes.filedataList[0].filePath
             
                }else{
                  var errMsg
                  if(this.tenthFileUploadRes.errorMsg){
                    errMsg=this.tenthFileUploadRes.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }
      twelfthFileUpload(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path",this.docPath)
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.twelfthFileUploadRes=res;
                if(this.twelfthFileUploadRes.isUploaded==true){
                  this.swalFileUploadSuccess()
                  this.twelfthFileUploadUrl=this.twelfthFileUploadRes.filedataList[0].filePath
              
                }else{
                  var errMsg
                  if(this.twelfthFileUploadRes.errorMsg){
                    errMsg=this.twelfthFileUploadRes.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }
      birthFileUpload(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path",this.docPath)
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.birthFileUploadRes=res;
                if(this.birthFileUploadRes.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['cancelled_cheque_upload'].setValue=this.birthFileUploadRes.filedataList[0].filePath
                  this.birthFileUploadUrl=this.birthFileUploadRes.filedataList[0].filePath
                  //console.log(this.birthFileUploadUrl)
                }else{
                  var errMsg
                  if(this.birthFileUploadRes.errorMsg){
                    errMsg=this.birthFileUploadRes.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }
      otherFileUpload(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path",this.docPath)
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.otherFileUploadRes=res;
                if(this.otherFileUploadRes.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['cancelled_cheque_upload'].setValue=this.otherFileUploadRes.filedataList[0].filePath
                  this.otherFileUploadUrl=this.otherFileUploadRes.filedataList[0].filePath
                  //console.log(this.otherFileUploadUrl)
                }else{
                  var errMsg
                  if(this.otherFileUploadRes.errorMsg){
                    errMsg=this.otherFileUploadRes.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }
      dobFileUpload(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path",this.docPath)
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.dobFileUploadRes=res;
                if(this.dobFileUploadRes.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['cancelled_cheque_upload'].setValue=this.dobFileUploadRes.filedataList[0].filePath
                  this.dobFileUploadUrl=this.dobFileUploadRes.filedataList[0].filePath
                  //console.log(this.dobFileUploadUrl)
                }else{
                  var errMsg
                  if(this.dobFileUploadRes.errorMsg){
                    errMsg=this.dobFileUploadRes.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }
    
      swalFileUploadSuccess(){
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: `File Uploaded`,
          showConfirmButton: false,
          timer:1500
        });
      }
      
      swalFileUploadError(errMsg:any){
        Swal.fire({
          position: 'center',
          icon: 'error',
          text: errMsg,
          showConfirmButton: false,
          timer:1500
        });
      }

      
      

      save(){
        this.documentForm.enable()
        if(this.documentForm.valid){
          this.readonlyPhotoIdEdit = !this.readonlyPhotoIdEdit;
          this.documentForm.value.player_detail_id = this.userDetails.user_id;
          this.documentForm.value.player_img_path = '';
          // if(this.documentForm.value.aadhar_no !=null){
          //   this.documentForm.value.aadhar_no = (this.documentForm.value.aadhar_no).toString();
          // }else{
          //   this.documentForm.value.aadhar_no = '';
          // }          
          this.documentForm.value.dob_path = '';
          if(this.athleteDocumentData !=undefined)this.documentForm.value.player_img_path = this.athleteDocumentData.player_image_path;
          // if(this.aadharUploadRes !=undefined){
          //   this.documentForm.value.aadhar_img_path  =this.aadharUploadRes.filedataList[0].filePath
          // }else{
          //   if(this.aadharUploadUrl !=null)this.documentForm.value.aadhar_img_path = this.aadharUploadUrl
          // }
          if(this.drivingFileUploadRes !=undefined){
            this.documentForm.value.driving_licence_path  =this.drivingFileUploadRes.filedataList[0].filePath
          }else{
            if(this.drivingFileUploadUrl !=null)this.documentForm.value.driving_licence_path = this.drivingFileUploadUrl
          }
          if(this.passportFileUploadRes !=undefined){
            this.documentForm.value.passport_img_path  =this.passportFileUploadRes.filedataList[0].filePath
          }else{
            if(this.passportFileUploadUrl !=null)this.documentForm.value.passport_img_path = this.passportFileUploadUrl
          }
          if(this.voterFileUploadRes !=undefined){
            this.documentForm.value.voter_id_img_path  =this.voterFileUploadRes.filedataList[0].filePath
          }else{
            if(this.voterFileUploadUrl !=null)this.documentForm.value.voter_id_img_path = this.voterFileUploadUrl
          }
          if(this.rationFileUploadRes !=undefined){
            this.documentForm.value.ration_card_path  =this.rationFileUploadRes.filedataList[0].filePath
          }else{
            if(this.rationFileUploadUrl !=null)this.documentForm.value.ration_card_path = this.rationFileUploadUrl
          }
          if(this.panFileUploadRes !=undefined){
            this.documentForm.value.pancard_path  =this.panFileUploadRes.filedataList[0].filePath
          }else{
            if(this.panFileUploadUrl !=null)this.documentForm.value.pancard_path = this.panFileUploadUrl
          }
          if(this.bonafideFileUploadRes !=undefined){
            this.documentForm.value.bonafide_certificate  =this.bonafideFileUploadRes.filedataList[0].filePath
          }else{
            if(this.bonafideFileUploadUrl !=null)this.documentForm.value.bonafide_certificate = this.bonafideFileUploadUrl
          }
          if(this.tenthFileUploadRes !=undefined){
            this.documentForm.value.tenth_certificate_path  =this.tenthFileUploadRes.filedataList[0].filePath
          }else{
            if(this.tenthFileUploadUrl !=null)this.documentForm.value.tenth_certificate_path = this.tenthFileUploadUrl
          }
          if(this.twelfthFileUploadRes !=undefined){
            this.documentForm.value.twelve_certificate_path  =this.twelfthFileUploadRes.filedataList[0].filePath
          }else{
            if(this.twelfthFileUploadUrl !=null)this.documentForm.value.twelve_certificate_path = this.twelfthFileUploadUrl
          }
          if(this.birthFileUploadRes !=undefined){
            this.documentForm.value.birth_certificate_path  =this.birthFileUploadRes.filedataList[0].filePath
          }else{
            if(this.birthFileUploadUrl !=null)this.documentForm.value.birth_certificate_path = this.birthFileUploadUrl
          }
          if(this.otherFileUploadRes !=undefined){
            this.documentForm.value.other_document_path  =this.otherFileUploadRes.filedataList[0].filePath
          }else{
            if(this.otherFileUploadUrl !=null)this.documentForm.value.other_document_path = this.otherFileUploadUrl
          } 
          if(this.documentForm.value.passport_expiry !=null) this.documentForm.value.passport_expiry =  this.datePipe.transform(this.documentForm.value.passport_expiry,'yyyy-MM-dd') 
            // encrypted data       
          // this.documentForm.value.aadhar_no = this.documentForm.value.aadhar_no ? this.encryptionService.encryptionAES(this.documentForm.value.aadhar_no): this.documentForm.value.aadhar_no
          this.documentForm.value.driving_licence_no = this.documentForm.value.driving_licence_no ? this.encryptionService.encryptionAES(this.documentForm.value.driving_licence_no): this.documentForm.value.driving_licence_no
          this.documentForm.value.passport_no = this.documentForm.value.passport_no ? this.encryptionService.encryptionAES(this.documentForm.value.passport_no): this.documentForm.value.passport_no
          this.documentForm.value.voter_id = this.documentForm.value.voter_id ? this.encryptionService.encryptionAES(this.documentForm.value.voter_id): this.documentForm.value.voter_id
          this.documentForm.value.ration_card_no = this.documentForm.value.ration_card_no ? this.encryptionService.encryptionAES(this.documentForm.value.ration_card_no): this.documentForm.value.ration_card_no
          this.documentForm.value.pancard_no = this.documentForm.value.pancard_no ? this.encryptionService.encryptionAES(this.documentForm.value.pancard_no): this.documentForm.value.pancard_no
          // console.log(this.documentForm.value);
          this.athleteDocumentService.saveAthleteDocumentInfo(this.documentForm.value).subscribe({
            next:(response:any)=>{
              if(response){
                this.alertService.swalPopSuccess('Documents save Successfully!');
                this.activeModal.close();
              }
            },
            error:()=>{
              console.error('Caught in saveAthleteDocumentInfo API')
            }
          })
          //this.activeModal.close()
        }else{
          this.documentForm.markAllAsTouched()
        }
      }
      editDob(){
        this.dobForm.enable();
        this.readonlydobEdit = !this.readonlydobEdit
      }
      saveDob(){        
        if(this.dobForm.valid){  
          this.readonlydobEdit = !this.readonlydobEdit;
          this.dobForm.value.player_detail_id = this.userDetails.user_id;
          this.dobForm.value.player_img_path = '';
          this.dobForm.value.aadhar_no = '';
          this.dobForm.value.aadhar_img_path = '';
          this.dobForm.value.passport_no = '';
          this.dobForm.value.passport_img_path = '';
          this.dobForm.value.voter_id = '';
          this.dobForm.value.voter_id_img_path = '';
          this.dobForm.value.tenth_pass_year = null;
          this.dobForm.value.tenth_certificate_path = '';
          this.dobForm.value.twelve_certificate_path = '';
          this.dobForm.value.pancard_no = '';
          this.dobForm.value.pancard_path = '';
          this.dobForm.value.birth_certi_issued_year = null;
          this.dobForm.value.birth_certificate_path = '';
          this.dobForm.value.bonafide_year = null;
          this.dobForm.value.passport_expiry = null;
          this.dobForm.value.ration_card_no = '';
          this.dobForm.value.ration_card_path = '';
          this.dobForm.value.driving_licence_no = '';
          this.dobForm.value.driving_licence_path = '';
          this.dobForm.value.other_document_name = '';
          this.dobForm.value.other_document_path = '';
          this.dobForm.value.bonafide_certificate = '';
          
          if(this.dobFileUploadRes !=undefined){
            this.dobForm.value.dob_path  =this.dobFileUploadRes.filedataList[0].filePath
          }else{
            if(this.dobFileUploadUrl !=null)this.dobForm.value.dob_path = this.dobFileUploadUrl
          }   
          // console.log(this.dobForm.value);  
          this.athleteDocumentService.saveAthleteDocumentInfo(this.dobForm.value).subscribe({
            next:(response:any)=>{
              if(response){
                this.alertService.swalPopSuccess('Document save Successfully!');
                this.activeModal.close();
              }
            },
            error:()=>{
              console.error('Caught in saveAthleteDocumentInfo API')
            }
          })
        }else{
          this.documentForm.markAllAsTouched()
        }
      }
}