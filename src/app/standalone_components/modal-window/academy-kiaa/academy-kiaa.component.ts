import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import {MY_DATE_FORMATS} from '../../../_common/models/my_dateFormat'
import { AcademyService } from '../../../_common/services/innerPagesServices/academy.service';
import { KIAAService } from '../../../_common/services/innerPagesServices/KIAA.service';
import { LoaderComponent } from '../../loader/loader.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-academy-kiaa',
  templateUrl: './academy-kiaa.component.html',
  styleUrls: ['./academy-kiaa.component.css'],
  standalone:true,
  imports:[LoaderComponent,ReactiveFormsModule,MaterialModule,CommonModule,FormsModule],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ]
})
export class AcademyKiaaComponent implements OnInit {
  userId: any;
  distinctRecords: any;
  residentialType: any = [];
  EresidentialType: any = [];
  Eresidential:any=[]
  kiaaElementData: any;
  sportDefaultVal: any;
  EresidentialDefaultVal: any;
  Eaccrediation_status_defaultVal: any;
  EncoE_type_defaultVal: any;
  disableSelected:boolean = true
  academyBasicDataKIAA: any
  weedoutKiaaform!:FormGroup
  kiaaWeedOutRes:any
  weedOutReasonDropdown:any
  dateKiaaFrom:any
  accederationFileUploadRes:any
  accederationFileUrl:any
  firstKiaaDocumentUrl:any
  secondKiaaDocumentUrl:any
  thirdKiaaDocumentUrl:any
  forthKiaaDocumentUrl:any
  fifthKiaaDocumentUrl:any
  sixthKiaaDocumentUrl:any
  scoreMatrixKiaaDocumentUrl:any
  notificationMatrixKiaaDocumentUrl:any
  academy_detail_id:any
  innerLoader:boolean = false;
  fileBaseUrl = environment.fileUrl;

  AddKiaaForm:FormGroup = this.formBuilder.group({
    AnsrsId: ['', [Validators.required]],
    accreditationFile:['',Validators.required],
    Aacademy_name: ['', [Validators.required]],
    AresidentialType: ['', [Validators.required]],
    EUploadPPIcons:['',Validators.required],
    EUploadRCIcons:['',Validators.required],
    EUploadBSIcons:['',Validators.required],
    EUploadDOAIcons:['',Validators.required],
    EUploadTQIcons:['',Validators.required],
    EUploadPDIcons:['',Validators.required],
    EUploadScoreMatrix:['',Validators.required],
    EUploadnotificationMatrix:['',Validators.required],
    Asport_name: ['', [Validators.required]],
    AfromDate: ['', [Validators.required]],
    AtoDate: ['', [Validators.required]],
    AncoE_type: ['', [Validators.required]],
    Aremark: ['', [Validators.required]],
    Aaccrediation_status: ['', [Validators.required]],
    AisTops: ['', [Validators.required]],
  });

  EditKiaaForm:FormGroup = this.formBuilder.group({
    EnsrsId: ['', [Validators.required]],      
    accreditationFile:[''],
    Eacademy_name: ['', [Validators.required]],
    EresidentialType: ['', [Validators.required]],
    EUploadPPIcons:[''],
    EUploadRCIcons:[''],
    EUploadBSIcons:[''],
    EUploadDOAIcons:[''],
    EUploadTQIcons:[''],
    EUploadPDIcons:[''],
    Esport_name: ['', [Validators.required]],
    EfromDate: ['', [Validators.required]],
    EtoDate: ['', [Validators.required]],
    Eaccrediation_status: ['', [Validators.required]],
    EncoE_type: ['', [Validators.required]],
    EUploadScoreMatrix:[''],
    EUploadnotificationMatrix:[''],
    Eremark: ['', [Validators.required]],
    EisTops: ['', [Validators.required]],
  })

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private academyService: AcademyService,
    private _kiaaService: KIAAService,
    private alertService: AlertService,
    private datePipe: DatePipe
    ) {}

  ngOnInit() {
    var user:any=localStorage.getItem('loginUserdata')
    var userid=JSON.parse(user)
    this.userId=userid.user_id
    //console.log("kiaaElementData", this.kiaaElementData);
    //console.log(this.academy_detail_id)

    this.weedoutReason()

    this.weedoutKiaaform=this.formBuilder.group({
      kiaaWeedoutDate:['',Validators.required],
      kiaaWeedOutReason:['',Validators.required],
      kiaaWeedOutRemark:['',Validators.required]
    })

    // var user: any = localStorage.getItem('loginUserdata')
    // var userid = JSON.parse(user)
    // this.userId = userid[0].user_id;
    
    this.setDefaultValEdit();
  }

  weedoutReason(){
    this.innerLoader = true
    this._kiaaService.weedoutReason().subscribe(res=>{
      this.innerLoader = false
      //console.log(res)
      this.weedOutReasonDropdown=res
      this.weedOutReasonDropdown=this.weedOutReasonDropdown.value.split(',')
      //console.log(this.weedOutReasonDropdown)
    },
    (error)=>{
      console.error('error caught in weedoutreason list')
      this.innerLoader = false
    })
  }

  kiaafromDate(date:any){
    this.dateKiaaFrom=date
    // console.log(this.dateKiaaFrom)
  }

  weedOutKiaa(){
    //console.log(this.weedoutKiaaform.value)
    this.innerLoader = true
    if(this.weedoutKiaaform.valid){
      this._kiaaService.weedoutKiaa(this.kiaaElementData.kiaaId,this.kiaaElementData.academy_id,this.userId,this.weedoutKiaaform.value).subscribe({
        next:(res)=>{
          this.innerLoader = false
          // console.log(res)
          this.kiaaWeedOutRes=res
          var msg=this.kiaaWeedOutRes.messaage
          var value=this.kiaaWeedOutRes.value
          if(value==1){
            this.alertService.swalPopSuccess(msg)
            this.activeModal.close()
          }else{
            this.alertService.swalPopError(msg)
          }
          this.activeModal.close()
        },
        error:()=>{
          //console.log("error caught in weedoutKiaa")
          this.innerLoader=false
        }
      })
    }else{
      this.weedoutKiaaform.markAllAsTouched()
    }
    
  }

  onChangeNSRSID(event: any) {
    let nsrsid = event.target.value;
    if (event.target.value != '') {
      this.innerLoader = true
      this.academyService.academyBasicDataKIAA(this.userId, nsrsid).subscribe(res => {
        this.innerLoader = false
        this.academyBasicDataKIAA = res;
        //console.log("academyBasicDataKIAA", this.academyBasicDataKIAA);
        if (this.academyBasicDataKIAA?.academy_detail_id == 0) {
          this.alertService.swalPopError(this.academyBasicDataKIAA.errorMsg)
          this.activeModal.close();
        }
        else if (this.academyBasicDataKIAA.academySport == null) {
          this.alertService.swalPopError('Sorry!! You can not add more KIAA in this NSRS Id.')
          this.activeModal.close();
        }
        else {
          this.AddKiaaForm.patchValue({
            Aacademy_name: this.academyBasicDataKIAA.academy_name,
          })
        }
        this.distinctRecords = this.academyBasicDataKIAA.academySport.filter(
          (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.sport_detail_id === thing.sport_detail_id) === i
        );
      },(error)=>{
        //console.log("error caught basic data")
        this.innerLoader=false
      })
    }
  }

  changeDiscipline(event: any) {
    this.residentialType = []
    for (let i = 0; i < this.academyBasicDataKIAA.academySport.length; i++) {
      if (this.academyBasicDataKIAA.academySport[i].sport_detail_id == event.value) {
        this.residentialType.push(this.academyBasicDataKIAA.academySport[i].residentialType)
      }
    }
    
  };

  fileError(){
    console.error("error caught in file uploading")
    this.innerLoader=false
  }


  public uploadAccederationFile = (files: any) => {
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      var fileSize=this.verifyFileSize(files)
      //   if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      if (extFile == "pdf") {
        if(fileSize<=500000){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("param",'_uploadAfIcons')
            formData.append("existingUploads",'')
            formData.append("academy_detail_id",this.academy_detail_id)
          }
          this.innerLoader = true
          this._kiaaService.fileUpload(formData).subscribe(res=>{
            this.innerLoader = false
            this.accederationFileUploadRes=res;
            // let filePath = this.accederationFileUploadRes.filedataList[0].filepath;
            if(this.accederationFileUploadRes.isUploaded==true){
              this.alertService.swalPopSuccessTimer('File Uploaded')
            // this.EditKiaaForm.get('accreditationFile')?.setValue(this.accederationFileUploadRes.filedataList[0].filePath);
            this.accederationFileUrl=this.accederationFileUploadRes.filedataList[0].filePath;
            //console.log(this.accederationFileUrl)
            }else{
              var errMsg
              if(this.accederationFileUploadRes.errorMsg){
                errMsg=this.accederationFileUploadRes.errorMsg
              }else{
                errMsg='Failed Please Try Again!'
              }
              this.alertService.swalPopErrorTimer(errMsg)
            }
          },(error)=>{
            this.fileError()
          })
  
        }else{
          this.swalFileSizeExceed()
        }
      } 
      else {
        this.alertService.swalPopError('Only PDF file is allowed!')
      }      
    }
  }

  verifyFileSize(files:any){
    var fileSize = files[0].size
    //console.log(fileSize)
    return fileSize
  }

  verifyDocumentFileExtension(files:any){
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile 
  }

  FirstKiaaDocumentsRes:any
  public uploadFirstKiaaDocuments=(files:any)=>{
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      // if (extFile == "pdf") {
        var fileSize=this.verifyFileSize(files)
        if(fileSize<=500000){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("param","UploadPPIcons")
            formData.append("existingUploads",'')
            formData.append("academy_detail_id",this.academy_detail_id)
          }
          //serivce calling
          this.innerLoader = true
          this._kiaaService.fileUpload(formData).subscribe(res=>{
            this.innerLoader = false
            this.FirstKiaaDocumentsRes=res;
            if(this.FirstKiaaDocumentsRes.isUploaded==true){
              this.swalFileUploadSuccess()
              // this.EditKiaaForm.get('EUploadPPIcons')?.setValue(this.FirstKiaaDocumentsRes.filedataList[0].filePath);
              this.firstKiaaDocumentUrl = this.FirstKiaaDocumentsRes.filedataList[0].filePath;;
              //console.log(this.EditKiaaForm.get('EUploadPPIcons')?.value);
            }else{
              var errMsg
              if(this.FirstKiaaDocumentsRes.errorMsg){
                errMsg=this.FirstKiaaDocumentsRes.errorMsg
              }else{
                errMsg='Failed Please Try Again!'
              }
              this.swalFileUploadError(errMsg)
            }
         },(error)=>{
          this.fileError()
        })
        }else{
          this.swalFileSizeExceed()
        }
      } 
      else {
        this.alertService.swalPopError('Only jpg, jpeg, png, pdf file is allowed!')
      }
      
      
    }
  }
  secondKiaaDocumentsRes:any
  public uploadSecondKiaaDocuments=(files:any)=>{
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      // if (extFile == "pdf") {
        var fileSize=this.verifyFileSize(files)
        if(fileSize<=500000){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("param","UploadRCIcons")
            formData.append("existingUploads",'')
            formData.append("academy_detail_id",this.academy_detail_id)
          }
          //serivce calling
          this.innerLoader = true
          this._kiaaService.fileUpload(formData).subscribe(res=>{
            this.innerLoader = false
            this.secondKiaaDocumentsRes=res;
            if(this.secondKiaaDocumentsRes.isUploaded==true){
              this.swalFileUploadSuccess()
              // this.EditKiaaForm.get('EUploadRCIcons')?.setValue(this.secondKiaaDocumentsRes.filedataList[0].filePath);
              this.secondKiaaDocumentUrl = this.secondKiaaDocumentsRes.filedataList[0].filePath;;
              //console.log(this.secondKiaaDocumentUrl)
            }else{
              var errMsg
              if(this.secondKiaaDocumentsRes.errorMsg){
                errMsg=this.secondKiaaDocumentsRes.errorMsg
              }else{
                errMsg='Failed Please Try Again!'
              }
              this.swalFileUploadError(errMsg)
            }
          },(error)=>{
            this.fileError()
          })
        }else{
          this.swalFileSizeExceed()
        }
      } 
      else {
        this.alertService.swalPopError('Only jpg, jpeg, png, pdf file is allowed!')
      }
      
      
    }
  }  
  thirdKiaaDocumentsRes:any
  public uploadThirdKiaaDocuments=(files:any)=>{
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      // if (extFile == "pdf") {
        var fileSize=this.verifyFileSize(files)
        if(fileSize<=500000){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("param","UploadBSIcons")
            formData.append("existingUploads",'')
            formData.append("academy_detail_id",this.academy_detail_id)
          }
          //serivce calling
          this.innerLoader = true
          this._kiaaService.fileUpload(formData).subscribe(res=>{
            this.innerLoader = false
            this.thirdKiaaDocumentsRes=res;
            if(this.thirdKiaaDocumentsRes.isUploaded==true){
              this.swalFileUploadSuccess()
              // this.EditKiaaForm.get('EUploadBSIcons')?.setValue(this.thirdKiaaDocumentsRes.filedataList[0].filePath);
              this.thirdKiaaDocumentUrl = this.thirdKiaaDocumentsRes.filedataList[0].filePath;;
              //console.log(this.thirdKiaaDocumentUrl)
            }else{
              var errMsg
              if(this.thirdKiaaDocumentsRes.errorMsg){
                errMsg=this.thirdKiaaDocumentsRes.errorMsg
              }else{
                errMsg='Failed Please Try Again!'
              }
              this.swalFileUploadError(errMsg)
            }
          },(error)=>{
            this.fileError()
          })
        }else{
          this.swalFileSizeExceed()
        }
      } 
      else {
        this.alertService.swalPopError('Only jpg, jpeg, png, pdf file is allowed!')
      }
    }
  } 
  forthKiaaDocumentsRes:any
  public uploadForthKiaaDocuments=(files:any)=>{
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      // if (extFile == "pdf") {
        var fileSize=this.verifyFileSize(files)
        if(fileSize<=500000){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("param","UploadDOAIcons")
            formData.append("existingUploads",'')
            formData.append("academy_detail_id",this.academy_detail_id)
          }
          //serivce calling
          this.innerLoader = true
          this._kiaaService.fileUpload(formData).subscribe(res=>{
            this.innerLoader = false
            this.forthKiaaDocumentsRes=res;
            if(this.forthKiaaDocumentsRes.isUploaded==true){
              this.swalFileUploadSuccess()
              // this.EditKiaaForm.get('EUploadDOAIcons')?.setValue(this.forthKiaaDocumentsRes.filedataList[0].filePath);
              this.forthKiaaDocumentUrl = this.forthKiaaDocumentsRes.filedataList[0].filePath;;
              //console.log(this.forthKiaaDocumentUrl)
            }else{
              var errMsg
              if(this.forthKiaaDocumentsRes.errorMsg){
                errMsg=this.forthKiaaDocumentsRes.errorMsg
              }else{
                errMsg='Failed Please Try Again!'
              }
              this.swalFileUploadError(errMsg)
            }
          },(error)=>{
            this.fileError()
          })
        }else{
          this.swalFileSizeExceed()
        }
      } 
      else {
        this.alertService.swalPopError('Only jpg, jpeg, png, pdf file is allowed!')
      }
      
      
    }
  }
  fifthKiaaDocumentsRes:any
  public uploadFifthKiaaDocuments=(files:any)=>{
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      // if (extFile == "pdf") {
        var fileSize=this.verifyFileSize(files)
        if(fileSize<=500000){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("param","UploadTQIcons")
            formData.append("existingUploads",'')
            formData.append("academy_detail_id",this.academy_detail_id)
          }
          //serivce calling
          this.innerLoader = true
          this._kiaaService.fileUpload(formData).subscribe(res=>{
            this.innerLoader = false
            this.fifthKiaaDocumentsRes=res;
            if(this.fifthKiaaDocumentsRes.isUploaded==true){
              this.swalFileUploadSuccess()
              // this.EditKiaaForm.get('EUploadTQIcons')?.setValue(this.fifthKiaaDocumentsRes.filedataList[0].filePath);
              this.fifthKiaaDocumentUrl = this.fifthKiaaDocumentsRes.filedataList[0].filePath;;
              //console.log(this.fifthKiaaDocumentUrl)
            }else{
              var errMsg
              if(this.fifthKiaaDocumentsRes.errorMsg){
                errMsg=this.fifthKiaaDocumentsRes.errorMsg
              }else{
                errMsg='Failed Please Try Again!'
              }
              this.swalFileUploadError(errMsg)
            }
          },(error)=>{
            this.fileError()
          })  
        }else{
          this.swalFileSizeExceed()
        }
      }else {
        this.alertService.swalPopError('Only jpg, jpeg, png, pdf file is allowed!')
      }
      
      
    }
  }
  sixthKiaaDocumentsRes:any
  public uploadSixthKiaaDocuments=(files:any)=>{
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      // if (extFile == "pdf") {
        var fileSize=this.verifyFileSize(files)
        if(fileSize<=500000){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("param","UploadPDIcons")
            formData.append("existingUploads",'')
            formData.append("academy_detail_id",this.academy_detail_id)
          }
          //serivce calling
          this.innerLoader = true
          this._kiaaService.fileUpload(formData).subscribe(res=>{
            this.innerLoader = false
            this.sixthKiaaDocumentsRes=res;
            if(this.sixthKiaaDocumentsRes.isUploaded==true){
              this.swalFileUploadSuccess()
              // this.EditKiaaForm.get('EUploadPDIcons')?.setValue(this.sixthKiaaDocumentsRes.filedataList[0].filePath);
              this.sixthKiaaDocumentUrl = this.sixthKiaaDocumentsRes.filedataList[0].filePath;;
              //console.log(this.sixthKiaaDocumentUrl)
            }else{
              var errMsg
              if(this.sixthKiaaDocumentsRes.errorMsg){
                errMsg=this.sixthKiaaDocumentsRes.errorMsg
              }else{
                errMsg='Failed Please Try Again!'
              }
              this.swalFileUploadError(errMsg)
            }
          },(error)=>{
            this.fileError()
          })
        }else{
          this.swalFileSizeExceed()
        }
      }
      else {
        this.alertService.swalPopError('Only jpg, jpeg, png, pdf file is allowed!')
      }
      
      
    }
  }
  scoreMatricDocumentRes:any
  public uploadScoreMatrixDocument=(files:any)=>{
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
        var fileSize=this.verifyFileSize(files)
        if(fileSize<=500000){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("param","UploadscoreMatrixFolder")
            formData.append("existingUploads",'')
            formData.append("academy_detail_id",this.academy_detail_id)
          }
          //serivce calling
          this.innerLoader = true
          this._kiaaService.fileUpload(formData).subscribe(res=>{
            this.innerLoader = false
            this.scoreMatricDocumentRes=res;
            if(this.scoreMatricDocumentRes.isUploaded==true){
              this.swalFileUploadSuccess()
              // this.EditKiaaForm.get('EUploadScoreMatrix')?.setValue(this.scoreMatricDocumentRes.filedataList[0].filePath);
              this.scoreMatrixKiaaDocumentUrl = this.scoreMatricDocumentRes.filedataList[0].filePath;;
              //console.log(this.scoreMatrixKiaaDocumentUrl)
            }else{
              var errMsg
              if(this.scoreMatricDocumentRes.errorMsg){
                errMsg=this.scoreMatricDocumentRes.errorMsg
              }else{
                errMsg='Failed Please Try Again!'
              }
              this.swalFileUploadError(errMsg)
            }
          },(error)=>{
            this.fileError()
          })
        }else{
          this.swalFileSizeExceed()
        }
      } 
      else {
        this.alertService.swalPopError('Only jpg, jpeg, png, pdf file is allowed!')
      }
      
      
    }
  }
  notificationMatrixDocumentRes:any
  public uploalNotificationMatrixDocument=(files:any)=>{
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      // if (extFile == "pdf") {
        var fileSize=this.verifyFileSize(files)
        if(fileSize<=500000){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("param","UploadscoreMatrixFolder")
            formData.append("existingUploads",'')
            formData.append("academy_detail_id",this.academy_detail_id)
          }
          //serivce calling
          this.innerLoader = true
          this._kiaaService.fileUpload(formData).subscribe(res=>{
            this.innerLoader = false
            this.notificationMatrixDocumentRes=res;
            if(this.notificationMatrixDocumentRes.isUploaded==true){
              this.swalFileUploadSuccess()
              // this.EditKiaaForm.get('EUploadScoreMatrix')?.setValue(this.notificationMatrixDocumentRes.filedataList[0].filePath);
              this.notificationMatrixKiaaDocumentUrl = this.notificationMatrixDocumentRes.filedataList[0].filePath;;
              //console.log(this.notificationMatrixKiaaDocumentUrl)
            }else{
              var errMsg
              if(this.notificationMatrixDocumentRes.errorMsg){
                errMsg=this.notificationMatrixDocumentRes.errorMsg
              }else{
                errMsg='Failed Please Try Again!'
              }
              this.swalFileUploadError(errMsg)
            }
          },(error)=>{
            this.fileError()
          })
        }else{
          this.swalFileSizeExceed()
        }
      }
      else {
        this.alertService.swalPopError('Only jpg, jpeg, png, pdf file is allowed!')
      }
      
      
    }
  }

  swalFileUploadSuccess(){
    this.alertService.swalPopSuccessTimer('File Uploaded')
  }
  
  swalFileUploadError(errMsg:any){
    this.alertService.swalPopSuccessTimer(errMsg)
  }

  swalFileSizeExceed(){
    this.alertService.swalPopError('File Size must be Below 500kb')
  }
  

  setDefaultValEdit() {
    //console.log(this.kiaaElementData)
    if (this.kiaaElementData != null) {
      if (['Expired', 'Rejected'].includes(this.kiaaElementData.accrediation_status)) {
        this.accederationFileUrl = null;
        this.firstKiaaDocumentUrl = null;
        this.secondKiaaDocumentUrl = null;
        this.thirdKiaaDocumentUrl = null;
        this.forthKiaaDocumentUrl = null;
        this.fifthKiaaDocumentUrl = null;
        this.sixthKiaaDocumentUrl = null;
        this.scoreMatrixKiaaDocumentUrl = null;
        this.notificationMatrixKiaaDocumentUrl = null;  
      } else {
        this.EditKiaaForm.get('EisTops')?.setValue(this.kiaaElementData.is_tops);
        // this.EditKiaaForm.get('accreditationFile')?.setValue(this.kiaaElementData.accreditation_form);
        // this.EditKiaaForm.get('EUploadPPIcons')?.setValue(this.kiaaElementData.prescribed_performa_requisite_fee);
        // this.EditKiaaForm.get('EUploadRCIcons')?.setValue(this.kiaaElementData.registration_certificate);
        // this.EditKiaaForm.get('EUploadBSIcons')?.setValue(this.kiaaElementData.audited_balanced_sheet);
        // this.EditKiaaForm.get('EUploadDOAIcons')?.setValue(this.kiaaElementData.trainees_detail_achievement);
        // this.EditKiaaForm.get('EUploadTQIcons')?.setValue(this.kiaaElementData.certification_technical_qualification);
        // this.EditKiaaForm.get('EUploadPDIcons')?.setValue(this.kiaaElementData.participation_certificate_national_international);
        // this.EditKiaaForm.get('EUploadScoreMatrix')?.setValue(this.kiaaElementData.score_matrix_document);
        // this.EditKiaaForm.get('EUploadnotificationMatrix')?.setValue(this.kiaaElementData.notification_document);
        this.accederationFileUrl = this.kiaaElementData.accreditation_form;
        this.firstKiaaDocumentUrl = this.kiaaElementData.prescribed_performa_requisite_fee;
        this.secondKiaaDocumentUrl = this.kiaaElementData.registration_certificate;
        this.thirdKiaaDocumentUrl = this.kiaaElementData.audited_balanced_sheet;
        this.forthKiaaDocumentUrl = this.kiaaElementData.trainees_detail_achievement;
        this.fifthKiaaDocumentUrl = this.kiaaElementData.certification_technical_qualification;
        this.sixthKiaaDocumentUrl = this.kiaaElementData.participation_certificate_national_international;
        this.scoreMatrixKiaaDocumentUrl = this.kiaaElementData.score_matrix_document;
        this.notificationMatrixKiaaDocumentUrl = this.kiaaElementData.notification_document;

      }
      let nsrsId = this.kiaaElementData.nsrsID
      let sport_name=this.kiaaElementData.sport_detail_id
      this.EditKiaaForm.controls["EnsrsId"].setValue(this.kiaaElementData.nsrsID);
      this.innerLoader = true
      this.academyService.academyBasicDataKIAA(this.userId, nsrsId).subscribe(res => {
        this.innerLoader = false
        this.academyBasicDataKIAA = res;
        //console.log("academyBasicDataKIAA", this.academyBasicDataKIAA);
          this.EditKiaaForm.patchValue({
            Eacademy_name: this.academyBasicDataKIAA.academy_name,
          });
          this.EresidentialDefaultVal=this.kiaaElementData.residential_type
          this.EditKiaaForm.patchValue({
            EresidentialType:this.EresidentialDefaultVal
          })
          if(this.academyBasicDataKIAA.academySport!=null){
            this.distinctRecords = this.academyBasicDataKIAA.academySport.filter(
              (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.sport_detail_id === thing.sport_detail_id) === i
            );
            for(let i of this.distinctRecords){
              if(i.sport_detail_id==sport_name){
                this.Eresidential.push(i)
              }
            }
            this.sportDefaultVal = this.kiaaElementData.sport_detail_id;
          }else{
            this.distinctRecords=[{
              sport_detail_id:this.kiaaElementData.sport_detail_id,
              sport_name:this.kiaaElementData.sport
            }]
            this.sportDefaultVal = this.kiaaElementData.sport_detail_id
          }
          
          this.EditKiaaForm.patchValue({
            EfromDate: ['Expired', 'Rejected'].includes(this.kiaaElementData.accrediation_status) ? null : moment(this.kiaaElementData.from_date),
            EtoDate: ['Expired', 'Rejected'].includes(this.kiaaElementData.accrediation_status) ? null : moment(this.kiaaElementData.to_date)
          });
       
          this.EditKiaaForm.controls["Eremark"].setValue(this.kiaaElementData.remark);
          this.Eaccrediation_status_defaultVal = this.kiaaElementData.accrediation_status;
          this.EncoE_type_defaultVal = this.kiaaElementData.ncoE_type;
      },(error)=>{
        console.error("error caught in academyBasicdataKiaa")  
        this.innerLoader=false
      });
    };
  }

  changeNECO(event: any) {
    if (event.source.value == "NCOE") {
      this.AddKiaaForm.controls['AisTops'].setValue("false");
    };
    if (event.source.value == "Others") {
      this.AddKiaaForm.controls['AisTops'].setValue("false");
    };
  };

  EditchangeNECO(event:any){
    if (event.source.value == "NCOE") {
      this.EditKiaaForm.controls['EisTops'].setValue("false");
    };
    if (event.source.value == "Others") {
      this.EditKiaaForm.controls['EisTops'].setValue("false");
    };
  }

  addKiaaData() {
    if(this.AddKiaaForm.valid){
      let kiaaId = 0;
      let kiaaId_update = 0;
      let academy_id = this.academyBasicDataKIAA.academy_detail_id;
      let sport_detail_id = this.AddKiaaForm.controls["Asport_name"].value 
      let residential_type = this.AddKiaaForm.controls["AresidentialType"].value; 
      let from_date = this.datePipe.transform(this.AddKiaaForm.controls["AfromDate"].value, 'yyyy-MM-dd') 
      let to_date = this.datePipe.transform(this.AddKiaaForm.controls["AtoDate"].value, 'yyyy-MM-dd') 
      let ncoE_type = this.AddKiaaForm.controls["AncoE_type"].value
      let academy_type = "";
      let is_tops = Boolean(this.AddKiaaForm.controls["AisTops"].value);
      let created_by = this.userId 
      let prescribed_performa_requisite_fee = this.FirstKiaaDocumentsRes.filedataList[0].filePath;
      let registration_certificate =  this.secondKiaaDocumentsRes.filedataList[0].filePath;
      let audited_balanced_sheet = this.thirdKiaaDocumentsRes.filedataList[0].filePath;
      let trainees_detail_achievement =  this.forthKiaaDocumentsRes.filedataList[0].filePath;
      let certification_technical_qualification =  this.fifthKiaaDocumentsRes.filedataList[0].filePath;
      let participation_certificate_national_international = this.sixthKiaaDocumentsRes.filedataList[0].filePath;
      let accreditation_form = this.accederationFileUploadRes.filedataList[0].filePath;
      let accrediation_status = this.AddKiaaForm.controls["Aaccrediation_status"].value; 
      let score_matrix_document = this.scoreMatricDocumentRes.filedataList[0].filePath;
      let notification_document = this.notificationMatrixDocumentRes.filedataList[0].filePath;
      let comments = this.AddKiaaForm.controls["Aremark"].value;
      this.innerLoader = true;
      this._kiaaService.addEditKiaa(
        kiaaId,
        kiaaId_update,
        academy_id,
        sport_detail_id,
        residential_type,
        from_date,
        to_date,
        ncoE_type,
        academy_type,
        is_tops,
        created_by,
        prescribed_performa_requisite_fee,
        registration_certificate,
        audited_balanced_sheet,
        trainees_detail_achievement,
        certification_technical_qualification,
        participation_certificate_national_international,
        accreditation_form,
        accrediation_status,
        score_matrix_document,
        notification_document,
        comments,
      )
        .subscribe(res => {
          this.innerLoader = false
          if(res){
            this.activeModal.close();
            this.alertService.swalPopSuccess('ADDED SUCCESSFULLY!')
          }else {
            this.alertService.swalPopError('SOMETHING WENt WRONG!! PLEASE TRY AGAIN')
          }
          this.activeModal.close();
        },
        (error)=>{
          console.error("error caught in add kIaa")
          this.innerLoader=false
        })
    }else{
      this.AddKiaaForm.markAllAsTouched()
    }
  };


  editRes:any
  editMsz:any
  editKia() {
    if(this.EditKiaaForm.valid &&
      this.accederationFileUrl &&
      this.firstKiaaDocumentUrl &&
      this.secondKiaaDocumentUrl &&
      this.thirdKiaaDocumentUrl &&
      this.forthKiaaDocumentUrl &&
      this.fifthKiaaDocumentUrl &&
      this.sixthKiaaDocumentUrl &&
      this.scoreMatrixKiaaDocumentUrl &&
      this.notificationMatrixKiaaDocumentUrl
      ){
      let kiaaId = ['Expired', 'Rejected'].includes(this.kiaaElementData.accrediation_status) ? 0 : this.kiaaElementData.kiaaId;
      let kiaaId_update = this.kiaaElementData.kiaaId;
      let academy_id = this.kiaaElementData.academy_id;
      let sport_detail_id = Number(this.EditKiaaForm.controls["Esport_name"].value)
      let residential_type = this.EditKiaaForm.controls["EresidentialType"].value;
      let from_date = this.EditKiaaForm.controls["EfromDate"].value
      let to_date = this.EditKiaaForm.controls["EtoDate"].value
      let ncoE_type = this.EditKiaaForm.controls["EncoE_type"].value
      let academy_type = this.kiaaElementData.academy_type;
      let is_tops = this.kiaaElementData.is_tops
      let created_by = this.userId
      let prescribed_performa_requisite_fee = this.firstKiaaDocumentUrl
      let registration_certificate =  this.secondKiaaDocumentUrl
      let audited_balanced_sheet = this.thirdKiaaDocumentUrl
      let trainees_detail_achievement =  this.forthKiaaDocumentUrl
      let certification_technical_qualification = this.fifthKiaaDocumentUrl 
      let participation_certificate_national_international = this.sixthKiaaDocumentUrl
      let accreditation_form = this.accederationFileUrl
      let accrediation_status = this.EditKiaaForm.controls["Eaccrediation_status"].value
      let score_matrix_document = this.scoreMatrixKiaaDocumentUrl
      let notification_document = this.notificationMatrixKiaaDocumentUrl
      let comments = this.EditKiaaForm.controls["Eremark"].value
      this.innerLoader = true
      this._kiaaService.addEditKiaa(
        kiaaId,
        kiaaId_update,
        academy_id,
        sport_detail_id,
        residential_type,
        this.datePipe.transform(from_date, 'yyyy-MM-dd'),
        this.datePipe.transform(to_date, 'yyyy-MM-dd'),
        ncoE_type,
        academy_type,
        is_tops,
        created_by,
        prescribed_performa_requisite_fee,
        registration_certificate,
        audited_balanced_sheet,
        trainees_detail_achievement,
        certification_technical_qualification,
        participation_certificate_national_international,
        accreditation_form,
        accrediation_status,
        score_matrix_document,
        notification_document,
        comments,
      )
        .subscribe(res => {
          this.innerLoader = false
          this.editRes=res;
          if(this.editRes.value == true){
            this.activeModal.close();
            this.alertService.swalPopSuccess('SAVED SUCCESSFULLY!')
          }else {
            this.alertService.swalPopError('SOMETHING WENT WRONG!! PLEASE TRY AGAIN')
          }
          this.activeModal.close();
        },
        (error)=>{
          console.error("error caught in add kIaa")
          this.innerLoader=false
        })
    }else{
      this.EditKiaaForm.markAllAsTouched()
    }
    
  }
}
