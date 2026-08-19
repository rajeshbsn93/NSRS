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
import { CoachDetailListService, IDesignationList } from 'src/app/_common/services/role-inner-pages-services/academy-services/coach-detail-list.service';

@Component({
  selector: 'app-coach-EditDetails-Weedout',
  templateUrl: './coach-EditDetails-Weedout.component.html',
  styleUrls: ['./coach-EditDetails-Weedout.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent],
  standalone:true
})
export class CoachEditDetailsWeedoutComponent implements OnInit {

  coachRowData:any;
  coachEditDetailForm!:FormGroup;
  coachWeedOutForm!:FormGroup
  userDetails:any
  loader:Boolean=false
  resetPasswordRes:any
  resetPasswordCoachModal:any;
  deleteCoachModal:any;
  @ViewChild('resetPasswordAthlete') resetPasswordpopup:any;
  @ViewChild('deleteAthlete') deleteCoachmodal:any;
  designationsList: IDesignationList[] = [];
  pcaCoachData:any;

  constructor(public activeModal:NgbActiveModal,private fb:FormBuilder, private alertService:AlertService,
    private storageService:StorageService,private modalService:NgbModal,
    private academySharableService:AcademySharableService,private athleteDetailService:AthleteDetailListService,
    private coachDetailService:CoachDetailListService) { }

  ngOnInit() {
    this.userDetails=this.storageService.getAcademyDetails()
    // console.log(this.pcaCoachData)
    // console.log(this.coachRowData)
    this.editDetailReactiveForm()
    this.coachRowData = {...this.coachRowData, date_of_joining:this.coachRowData.date_of_joining ? this.coachRowData.date_of_joining.split('/').reverse().join('/') : this.coachRowData.date_of_joining}
    this.setValuesEditDetailForm()
    this.setWeedOutReactiveForm();
    this.coachDetailService.getCoachDesignationList().subscribe((response: IDesignationList[]) => this.designationsList = response);
  }


  editDetailReactiveForm(){
    this.coachEditDetailForm = this.fb.group({
      ki_unique_id:[''],
      coach_name:[''],
      designation:['',Validators.required],
      date_of_joining:['',Validators.required],
      sport_detail_id:[''],
      academy_detail_id:[''],
      is_pca:[0],
      employmenttype:['',Validators.required]
    })
  }

  setWeedOutReactiveForm(){
    this.coachWeedOutForm=this.fb.group({
      pUserId:[''],
      pRoleId:['2'],
      pStakeHolderRoleId:[this.userDetails.role_id],
      pStakeHolderUserId:[this.userDetails.user_id],
      pWeedOutDate:['',Validators.required],
      pWeedOutRemark:['',Validators.required],
    })
  }

  setValuesEditDetailForm(){
    // console.log(this.coachRowData)
    this.coachEditDetailForm.patchValue({
      academy_detail_id:this.userDetails.user_id,
      ki_unique_id:this.coachRowData.kitd_unique_id,
      coach_name:this.coachRowData.full_name,
      designation:this.coachRowData.designation,
      date_of_joining:this.coachRowData.date_of_joining ? new Date(this.coachRowData.date_of_joining) : null,
      sport_detail_id:this.coachRowData.sport_detail_id,
      is_pca:this.getPCA(this.coachRowData.is_pca),
      employmenttype:this.coachRowData.employmenttype
      
    })
    // this.coachEditDetailForm.get('is_pca')?.setValue(this.coachRowData.is_pca)
    this.DisableField('ki_unique_id',true)
    this.DisableField('coach_name',true)
  }

  getPCA(value:any){
    if(value){
      return '1'
    }else{
      return '0'
    }
  }

  private DisableField(formControlName:string,disableVal?:boolean){
    this.coachEditDetailForm.get(formControlName)?.disable({onlySelf:disableVal})
  }

  dojChange() {
    this.coachEditDetailForm.value.date_of_joining=(this.coachEditDetailForm.value.date_of_joining).utc('dd-MM-YYYY')
    this.coachEditDetailForm.controls['date_of_joining'].setValue( this.coachEditDetailForm.value.date_of_joining)

    //console.log(this.coachEditDetailForm.getRawValue())

  }
  
  saveEditCoachInfo(){
    var coachEditData=[]
    coachEditData.push(this.coachEditDetailForm.getRawValue())
    if(this.coachEditDetailForm.get('date_of_joining')?.dirty){
      for(let data of coachEditData){
        data.date_of_joining=data.date_of_joining.utc('dd-MM-YYYY')
      }
    }
    this.loader=true
    this.academySharableService.saveCoachData(this.userDetails.user_id,coachEditData).subscribe({
      next:(res:any)=>{
        this.loader=false
        this.activeModal.close()
        
          if(res.status) this.alertService.swalPopSuccess(res.error)
          else this.alertService.swalPopError(res.error)
      },
      error:()=>{
        console.error('error caught in saving coach data')
        this.loader=false
      }
    })
  }

  weedoutSave(){
    if(this.coachWeedOutForm.valid){
      this.coachWeedOutForm.value.pUserId=this.coachRowData.official_detail_id
      this.loader=true
      this.academySharableService.weedOut(this.coachWeedOutForm.value).subscribe({
        next:(res:any)=>{
          this.loader=false
          //console.log(res)
          this.activeModal.close()
          if(res.isWeedOut){
            this.alertService.swalPopSuccess(`${res.weedoutMsg}`)
          }else{
            this.alertService.swalPopError(`${res.weedoutMsg}`)
          }
        },
        error:()=>{
          console.error("error caught saving coach data")
          this.loader=false
        }
      })
    }else{
      this.coachWeedOutForm.markAllAsTouched()
    }
  }

  resetPassword(){
    this.resetPasswordCoachModal = this.modalService.open(this.resetPasswordpopup,{size: 'md', centered: true,})
  }

  confirmResetPassword(){
    this.loader = true
    this.athleteDetailService.ResetPassword(this.coachRowData.kitd_unique_id).subscribe({
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
    this.deleteCoachModal = this.modalService.open(this.deleteCoachmodal,{size: 'md', centered: true,})
  }

  confirmDelete(){
    let option_type = 2;
    let academy_detail_id = this.userDetails.user_id;
    let nsrs_id = this.coachRowData.kitd_unique_id; 
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
