import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AcademySharableService } from 'src/app/_common/services/role-inner-pages-services/academy-services/academySharable.service';
import { AthleteDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/athlete-detail-list.service';
import { SportscientistDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/sportscientist-detail-list.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';

@Component({
  selector: 'app-sportScientist-EditDetails-Weedout',
  templateUrl: './sportScientist-EditDetails-Weedout.component.html',
  styleUrls: ['./sportScientist-EditDetails-Weedout.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent],
  standalone:true
})
export class SportScientistEditDetailsWeedoutComponent implements OnInit {

  ssEditForm!:FormGroup
  ssWeedOutForm!:FormGroup
  ssRowData:any
  userDetails:any
  loader:any
  deleteCoachModal:any
  resetPasswordCoachModal:any
  resetPasswordRes:any
  @ViewChild('resetPasswordSS') resetPasswordpopup:any;
  @ViewChild('deletess') deleteSSmodal:any;
  designationList:Array<any> = []

  constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,private alertService:AlertService,
    private ssListService:SportscientistDetailListService,private storageService:StorageService,
    private academySharableService:AcademySharableService,private modalService:NgbModal,private athleteDetailService:AthleteDetailListService,
    private sharableService:SharableService
  ) { }

  ngOnInit() {
    this.userDetails=this.storageService.getAcademyDetails()
    this.getStakeHolderDesignations();
    this.ssEditdetailsReactiveForm()
    this.ssRowData = {...this.ssRowData, date_of_joining:this.ssRowData.date_of_joining ? this.ssRowData.date_of_joining.split('/').reverse().join('/'):this.ssRowData.date_of_joining}
    this.setValuesEditDetailForm()
    this.setWeedoutReactiveForm()
  }
  getStakeHolderDesignations(){
    this.loader = true
    this.sharableService.getDesignation('Support Staff').subscribe({
      next:(response:any)=>{
        this.loader = false;
        this.designationList = response
      },
      error:(err)=>{
        this.loader = false
      }
    })
  }

  ssEditdetailsReactiveForm(){
    this.ssEditForm=this.fb.group({
      academy_detail_id: [''],
      ki_unique_id: [''],
      coach_name:[''],
      sport_detail_id:[''],
      designation:[''],
      date_of_joining:[''],
      employmenttype:['']
    })
  }

  setWeedoutReactiveForm(){
    this.ssWeedOutForm=this.fb.group({
      pUserId:[''],
      pRoleId:['103'],
      pStakeHolderRoleId:[this.userDetails.role_id],
      pStakeHolderUserId:[this.userDetails.user_id],
      pWeedOutDate:['',Validators.required],
      pWeedOutRemark:['',Validators.required],
    })
  }

  private DisableField(formControlName:string,disableVal?:boolean){
    this.ssEditForm.get(formControlName)?.disable({onlySelf:disableVal})
  }

  setValuesEditDetailForm(){
    this.ssEditForm.patchValue({
      academy_detail_id:this.userDetails.user_id,
      ki_unique_id:this.ssRowData.kitd_unique_id,
      coach_name:this.ssRowData.full_name,
      // designation:'',
      designation:this.ssRowData.designation,
      date_of_joining:this.ssRowData.date_of_joining ? new Date(this.ssRowData.date_of_joining): null,
      sport_detail_id:this.ssRowData.sport_detail_id,
      employmenttype:this.ssRowData.employmenttype
    })
    this.DisableField('ki_unique_id',true)
    this.DisableField('coach_name',true)
  }

  dojChange() {
    this.ssEditForm.value.date_of_joining=(this.ssEditForm.value.date_of_joining).utc('dd-MM-YYYY')
    this.ssEditForm.controls['date_of_joining'].setValue( this.ssEditForm.value.date_of_joining)
  }

  saveEditSSInfo(){
    if(this.ssEditForm.valid){
      var data=[]
      data.push(this.ssEditForm.getRawValue())
      this.loader=true
      this.ssListService.saveSportScientistAddMultipleData(this.userDetails.user_id,data).subscribe({
        next:(res:any)=>{
          this.loader=false
            this.activeModal.close()
            this.alertService.swalPopSuccess(res.error)
        },
        error:()=>{
          console.error('error caught in saving sportsScientist ')
          this.loader=false
        }
      })
    }else{
      this.ssEditForm.markAllAsTouched()
    }
  }

  weedoutSave(){
    if(this.ssWeedOutForm.valid){
      this.ssWeedOutForm.value.pUserId=this.ssRowData.official_detail_id
      this.loader=true
      this.academySharableService.weedOut(this.ssWeedOutForm.value).subscribe({
        next:(res:any)=>{
          this.loader=false
          this.activeModal.close()
          if(res.isWeedOut){
            this.alertService.swalPopSuccess(`${res.weedoutMsg}`)
          }else{
            this.alertService.swalPopError(`${res.weedoutMsg}`)
          }
        },
        error:()=>{
          console.error("error caught saving sports Scientist data")
          this.loader=false
        }
      })
    }else{
      this.ssWeedOutForm.markAllAsTouched()
    }
  }

  reset(){
    this.resetPasswordCoachModal = this.modalService.open(this.resetPasswordpopup,{size: 'md', centered: true,})
  }

  confirmResetPassword(){
    this.loader = true
    this.athleteDetailService.ResetPassword(this.ssRowData.kitd_unique_id).subscribe({
      next:(res)=>{
        this.loader= false;
        this.resetPasswordCoachModal.close()
        this.resetPasswordRes = res
        this.alertService.swalPopSuccess(`Password reset successfully! ${this.resetPasswordRes}`)
      },
      error:()=>{
        this.loader = false
        console.error('error caught in ResetPassword')
      }
    })
  }
  

  delete(){
    this.deleteCoachModal = this.modalService.open(this.deleteSSmodal,{size: 'md', centered: true,})
  }

  confirmDelete(){
    let option_type = 103;
    let academy_detail_id = this.userDetails.user_id;
    let nsrs_id = this.ssRowData.kitd_unique_id;
    this.loader = true;
    this.athleteDetailService.DeleteAcademyMapping(option_type,academy_detail_id,nsrs_id).subscribe({
      next:(res)=>{
        if(res){        
          this.loader = false;
          this.activeModal.close()
          this.alertService.swalPopSuccess('Deleted Successfully!')
        }else{
          this.alertService.swalPopError('SomeThing went Wrong!')
        }
        this.deleteCoachModal.close();
      },
      error:()=>{
        console.error("error caught in DeleteAcademyMapping")
        this.loader=false
        this.deleteCoachModal.close();
        this.activeModal.close()
      }
    })
  }

}
