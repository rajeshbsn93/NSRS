import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { AthleteDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/athlete-detail-list.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-athlete-EditDetails-Weedout',
  templateUrl: './athlete-EditDetails-Weedout.component.html',
  styleUrls: ['./athlete-EditDetails-Weedout.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent],
  standalone:true,
})
export class AthleteEditDetailsWeedoutComponent implements OnInit, OnDestroy {
  userDetails:any
  editDetailForm!:FormGroup;
  elementRowData:any;
  loader:boolean = false;
  editDetailsUploadFileRes:any;
  editDetailsFileUrl:any
  @ViewChild('deleteAthlete') deleteAthletepopup:any;
  deleteAthleteModalRef:any
  @ViewChild('resetPasswordAthlete') resetPasswordAthletepopup:any;
  resetPasswordAthleteModalRef:any;  
  deleteAthlete:any;
  resetPasswordRes:any;
  weedoutForm!:FormGroup;
  baseFileUrl = environment.fileUrl;

  constructor(public activeModal:NgbActiveModal,private fb:FormBuilder, private alertService:AlertService,private _sharableService:SharableService,
    private storageService:StorageService, private athleteDetailService:AthleteDetailListService,private modalService:NgbModal) { }

  ngOnInit() {
    this.userDetails=this.storageService.getUserDetails();
    //console.log(this.userDetails)
    this.editDetailReactiveForm()
    //console.log(this.elementRowData);
    this.elementRowData = {
      ...this.elementRowData,
      date_of_joining: this.elementRowData.date_of_joining
      ? this.elementRowData.date_of_joining.split('/').reverse().join('/')
      : this.elementRowData.date_of_joining
    }
    this.setValueseditDetailForm()
    // this.editDetailsFileUrl = this.elementRowData.player_image_path
    this.weedoutFormReactiveForm()
  }

  editDetailReactiveForm(){
    this.editDetailForm = this.fb.group({
      ki_unique_id:['',Validators.required],
      athelete_name:['',Validators.required],
      geoLocation:['',Validators.required],
      type_of_athelete:['',Validators.required],
      joining_status:['',Validators.required],
      date_of_joining:[null,Validators.required],
      valid_upto:[null],
      document_upload_path:[undefined,Validators.required]
    })
  }
  weedoutFormReactiveForm(){
    this.weedoutForm = this.fb.group({
      pWeedOutDate:[null,Validators.required],
      pWeedOutRemark:['',Validators.required],
    })
  }
  setValueseditDetailForm(){
    this.editDetailForm.patchValue({
      ki_unique_id:this.elementRowData.nsrsId,
      athelete_name:this.elementRowData.ath_Name,
      geoLocation:this.elementRowData.geoLocation,
      type_of_athelete:this.elementRowData.type_of_athelete,
      joining_status:this.elementRowData.joining_status,
      date_of_joining:this.elementRowData.date_of_joining ? new Date(this.elementRowData.date_of_joining): null,
      valid_upto:this.elementRowData.valid_upto,
      //document_upload_path:this.elementRowData.player_image_path
    })
    this.editDetailsFileUrl = this.elementRowData.player_image_path;
    if(this.elementRowData.player_image_path){
      this.editDetailForm.controls['document_upload_path'].clearValidators()
    }
  }
  changeJoining(event: MatDatepickerInputEvent<Date>) {
    this.editDetailForm.value.date_of_joining=(this.editDetailForm.value.date_of_joining).utc('dd-MM-YYYY')
    this.editDetailForm.controls['date_of_joining'].setValue( this.editDetailForm.value.date_of_joining)

    //console.log(this.editDetailForm.getRawValue())

  }
  changePeriodDate(event: MatDatepickerInputEvent<Date>) {
    this.editDetailForm.value.valid_upto=(this.editDetailForm.value.valid_upto).utc('DD-MM-YYYY')
    // this.editDetailForm.controls['valid_upto'].setValue( this.editDetailForm.value.valid_upto)

  }

  saveDetail(){
    if(this.editDetailsFileUrl == this.elementRowData.player_image_path){
      this.editDetailForm.value.document_upload_path = this.elementRowData.player_image_path
      //console.log(this.editDetailForm.value.document_upload_path)
    } else this.editDetailForm.value.document_upload_path = this.editDetailsFileUrl;

    this.editDetailForm.value.sport_detail_id = this.elementRowData.sport_detail_id
    this.editDetailForm.value.academy_detail_id = this.userDetails.user_id
    this.editDetailForm.value.category = ""
    this.editDetailForm.value.scheme = ""
    this.editDetailForm.value.notification_no = ""
    this.editDetailForm.value.date_of_notification = ""
    //console.log(this.editDetailForm.value)
    if(this.editDetailForm.valid){
      this.loader=true
    this.athleteDetailService.saveAcademyAthleteData(this.userDetails.user_id,[this.editDetailForm.value]).subscribe({
      next:(res:any)=>{
        this.loader=false        
          this.alertService.swalPopSuccess(res.error)
          this.activeModal.close({...this.editDetailForm.value, actionType: 'EDIT'});
      },
      error:()=>{
        console.error('error caught in saving academy multiple athletes')
        this.loader=false
      }
    }
    )
    }else{
      this.editDetailForm.markAllAsTouched()
    }
  }

  verifyDocumentFileExtension(files:any){
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile 
  }

  public uploadTransferFile = (files: any) => {
    if (files.length === 0){
      return;
    }else{
      //console.log("files",files)
      var extFile=this.verifyDocumentFileExtension(files)    
        if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      // if (extFile == "pdf") {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("file",files[i], files[i].name);
          formData.append("path",'data/Tempimage')
          formData.append("uploadType",'3')
          // formData.append("academy_detail_id","fhhd")
        }
        this.loader = true;
        this._sharableService.uploadFile(formData).subscribe({
          next:(res)=>{
            this.loader = false;
            this.editDetailsUploadFileRes=res;
            if(this.editDetailsUploadFileRes.isUploaded==true){
              this.alertService.swalPopSuccessTimer("File Uploaded")
              this.editDetailForm.controls['document_upload_path'].setValue=this.editDetailsUploadFileRes.filedataList[0].filepath
              this.editDetailsFileUrl = this.editDetailsUploadFileRes.filedataList[0].filePath;
            }else{
              var errMsg
              if(this.editDetailsUploadFileRes.errorMsg){
                errMsg=this.editDetailsUploadFileRes.errorMsg
              }else{
                errMsg='Failed Please Try Again!'
              }
              this.alertService.swalPopErrorTimer(errMsg)
            }
          },
          error:()=>{
            console.error("error caught in file upload")
            this.loader=false
          }
        })
      } 
      else {
        this.alertService.swalPopErrorTimer('Only PDF file is allowed!')
      }
    }
  }

  delete(){  
    this.deleteAthleteModalRef = this.modalService.open(this.deleteAthletepopup,{size: 'md', centered: true,})
  }

  confirmDelete(){
    let option_type = 1;
    let academy_detail_id = this.userDetails.user_id;
    let nsrs_id = this.elementRowData.nsrsId; 
    this.loader = true;
    this.athleteDetailService.DeleteAcademyMapping(option_type,academy_detail_id,nsrs_id).subscribe({
      next:(res)=>{
        this.loader = false;
        if(res){ 
          this.activeModal.close({...this.editDetailForm.value, actionType: 'DELETE'})
          this.deleteAthleteModalRef.close();
          this.alertService.swalPopSuccess('Deleted Successfully!')
        }else{  
          this.alertService.swalPopError('Some Error occurred!')
        }
      },
      error:()=>{
        this.loader=false
        console.error("error caught in DeleteAcademyMapping")
      }
    })
  }
  resetPassword(){
    this.resetPasswordAthleteModalRef = this.modalService.open(this.resetPasswordAthletepopup,{size: 'md', centered: true,})
  }
  confirmResetPassword(){
    //resetPasswordRes
    //console.log(this.elementRowData.nsrsId)
    this.loader = true
    this.athleteDetailService.ResetPassword(this.elementRowData.nsrsId).subscribe({
      next:res=>{
        //console.log(res)
        this.loader= false;
        this.resetPasswordAthleteModalRef.close()
        this.resetPasswordRes = res
        this.alertService.swalPopSuccess(`Password reset successfully! ${this.resetPasswordRes}`)
      },
      error:()=>{
        this.loader = false;
        console.error('error caught in ResetPassword')
      }
    })
    
  }

  weedoutSubmit(){
    this.weedoutForm.value.pWeedOutDate = (this.weedoutForm.value.pWeedOutDate).utc('dd-MM-YYYY');
      this.weedoutForm.value.pStakeHolderUserId = this.userDetails.user_id
      this.weedoutForm.value.pStakeHolderRoleId = this.userDetails.role_id
      this.weedoutForm.value.pRoleId = 1
      this.weedoutForm.value.pUserId = this.elementRowData.player_detail_id
    if(this.weedoutForm.valid){      
      //console.log(this.weedoutForm.value)
      this.loader = true;
      this.athleteDetailService.WeedOut(this.weedoutForm.value).subscribe({
        next:(res:any)=>{
          this.loader = false
          //console.log(res);
          this.activeModal.close({...this.editDetailForm.value, actionType: 'WEEDOUT'});
          if(res.isWeedOut){
            this.alertService.swalPopSuccess(`${res.weedoutMsg}`)
          }else{
            this.alertService.swalPopError(`${res.weedoutMsg}`)
          }
        },
        error:()=>{
          this.loader = false
          console.error('error caught in weed out')
        }
      })
    }else{
      this.weedoutForm.markAllAsTouched()
    }
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}
