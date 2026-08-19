import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
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
import { AthleteDashboardService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-dashboard.service";
import { AthleteEducationInfoService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-education-info.service";
import { SideBarNavStateService } from "src/app/_common/sidebar.state";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
selector:'app-other-role-nsf-modal',
templateUrl:'./other-role-nsf-modal.component.html',
styleUrls:['./other-role-nsf-modal.component.css'],
standalone:true,
imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
providers: [
  {provide: DateAdapter, useClass: MomentDateAdapter},
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  DatePipe
],
})
export class OtherRoleNsfModalComponent implements OnInit{
    readonlyEdit:boolean = true
    sportForm!:FormGroup;
    userDetails:any;
    loader:boolean = false;
    loader2:boolean = false;
    subscription:Subscription = new Subscription();
    sportsList:Array<any> = [];
    nsfList:Array<any> = [];

    constructor(
        public activeModal:NgbActiveModal,
        private formBuilder:FormBuilder,
        private enableDisableService:Enable_disableFormService,
        private storageService:StorageService,
        private athleteDashboardService:AthleteDashboardService,
        private alertService:AlertService,
        private _sideBarState:SideBarNavStateService, 
        private datePipe:DatePipe,
        private athleteEducationInfoService:AthleteEducationInfoService,
        private _sharableService:SharableService,
        private _otherRoleService:OtherRoleService
      ){}

    ngOnInit(): void {
      this.userDetails=this.storageService.getUserDetails()
      this.getSports();
        this.basicDetailsReactiveForm();
          this.sportForm.disable();
        this.setFormValues()
    }
    
    basicDetailsReactiveForm(){
        this.sportForm=this.formBuilder.group({
          NSF_Name:['',[Validators.required]],
          disciplines:['',[Validators.required]],  
          Email_ID:['',[Validators.required]],        
          mobile:['',[Validators.required]],        
        })
      }

      getSports(){
        this.loader2 = true
        this._sharableService.sportList().subscribe({
          next:(res:any)=>{
            this.loader2 = false;
            this.sportsList = res;
          },
          error:(err)=>{
            this.loader2 = false;
            console.error(err)
          }
        })
      }

      setFormValues(){
        this.loader = true
        this._otherRoleService.getOtherOfficial_NSFInfo(this.userDetails.user_id).subscribe({
          next:(response:any)=>{
            this.loader=false
            // console.log(response)
            this.sportForm.controls['disciplines'].setValue(response[0]?.sport_detail_id)            
            this.get_Tectical_Officer_Detail_By_Id(response[0]?.sport_detail_id)
            this.sportForm.controls['NSF_Name'].setValue(response[0]?.nsf_user_id)                        
            this.sportForm.disable()
            // this.enableDisableService.DisableField(this.sportForm,'name',true)
          },
          error:()=>{
            this.loader = false
            console.error('Caught in GetAthletePersonalInfo API')
          }
        })
        
      }
      get_Tectical_Officer_Detail_By_Id(sporid:number){
        this.nsfList = [];
        this.sportForm.controls['NSF_Name'].reset('')
        this.sportForm.controls['Email_ID'].reset('')
        this.sportForm.controls['mobile'].reset('')
        this.loader = true;
        const roleId = 1002
        this._otherRoleService.get_Tectical_Officer_Detail_By_Id(sporid,roleId).subscribe({
          next:(res:any)=>{
            this.loader = false;
            this.nsfList = res;
            if(!this.sportForm.get('NSF_Name')?.dirty && !this.sportForm.get('disciplines')?.touched){
              this.setNsfDetail(this.sportForm.get('NSF_Name')?.value)
            }
          },
          error:(err)=>{
            this.loader = false;
            console.error(err)
          }
        })
      }
      setNsfDetail(event:any){
        const filterNSFData = this.nsfList.filter(item=>item.master_id==event)
        if(!filterNSFData[0].email_id) this.alertService.swalPopError('NSF EMAIL NOT FOUND!')
        if(!filterNSFData[0].mobile_no) this.alertService.swalPopError('NSF MOBILE NOT FOUND!')
        this.sportForm.controls['Email_ID'].setValue(filterNSFData[0]?.email_id)
        this.sportForm.controls['mobile'].setValue(filterNSFData[0]?.mobile_no)
      }


      editButton(){
        this.sportForm.enable();
        this.sportForm.controls['Email_ID'].disable();
        this.sportForm.controls['mobile'].disable();
        this.sportForm.updateValueAndValidity();
        this.readonlyEdit = !this.readonlyEdit
      }

      save(){
        //console.log( this.sportForm.valid)
        if(this.sportForm.valid){ 
          console.log(this.sportForm.getRawValue());
          console.log(!this.sportForm.get('mobile')?.getRawValue() ,!this.sportForm.get('Email_ID')?.getRawValue())
          const payload = {
            official_detail_id:this.userDetails.user_id,
            nsf_user_id:this.sportForm.get('NSF_Name')?.getRawValue(),
            designation:"",
            sport_detail_id:this.sportForm.get('disciplines')?.getRawValue(),
            universityId:0
          }
          console.log(payload)
          if(this.sportForm.get('mobile')?.getRawValue() && this.sportForm.get('mobile')?.getRawValue()!==null){
            this._otherRoleService.saveOtherOfficialNSFInfo(payload).subscribe({
              next:(response)=>{
                if(response){
                  this.readonlyEdit = !this.readonlyEdit;
                  this.alertService.swalPopSuccess('NSF Details Updated Successfully!');
                  this.activeModal.close();
                }
              },
              error:()=>{
                console.error('Caught in EditAthletePersonalInfo API')
              }
            })
          }else{
            this.alertService.swalPopWarning('Please Set Mobile Number.')
          }
          //this.activeModal.close()
        }else{
          this.sportForm.markAllAsTouched();
          this.enableDisableService.DisableField(this.sportForm,'gender',true)
        }
      }
}