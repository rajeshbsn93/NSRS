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

@Component({
selector:'app-other-role-personal-details',
templateUrl:'./other-role-personal-details.component.html',
styleUrls:['./other-role-personal-details.component.css'],
standalone:true,
imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
providers: [
  {provide: DateAdapter, useClass: MomentDateAdapter},
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  DatePipe
],
})
export class OtherRolePersonalDetailsComponent implements OnInit{
    readonlyEdit:boolean = true
    personalDetailsForm!:FormGroup;
    userDetails:any;
    loader:boolean = false;
    loader2:boolean = false;
    minDate:any;
    maxDate:any;
    subscription:Subscription = new Subscription();

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
          this.personalDetailsForm.disable();
        this.setFormValues()
    }
    
    basicDetailsReactiveForm(){
        this.personalDetailsForm=this.formBuilder.group({
          name:['',[Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
          father_name:['',[this.userDetails.role_id == 4 ? Validators.nullValidator : Validators.required,Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
          mother_name:['',[this.userDetails.role_id == 4 ? Validators.nullValidator : Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
          gender:['', [Validators.required]],
          dob:[null, [Validators.required]], 
          level:['', [Validators.required]] ,      
          designation:['', [this.userDetails.role_id == 4 ? Validators.required : Validators.nullValidator]] ,      
        })
      }

      setFormValues(){
        this.loader = true
        this._otherRoleService.getOtherOfficial_PersonalDetail(this.userDetails.user_id).subscribe({
          next:(response:any)=>{
            this.loader=false
            //console.log(response)
            this.personalDetailsForm.controls['name'].setValue(response[0]?.name)
            this.personalDetailsForm.controls['father_name'].setValue(response[0]?.fatherName)
            this.personalDetailsForm.controls['mother_name'].setValue(response[0]?.motherName)
            this.personalDetailsForm.controls['gender'].setValue(response[0]?.gender)
            this.personalDetailsForm.controls['dob'].setValue(response[0]?.date_of_birth)
            this.personalDetailsForm.controls['level'].setValue(response[0]?.level_of_technical_off)
            this.personalDetailsForm.controls['designation'].setValue(response[0]?.designation)
            if(response[0].date_of_birth !=null){
              this.minDate = new Date(response[0].date_of_birth.split('-')[0], 0, 1);
              this.maxDate = new Date(response[0].date_of_birth.split('-')[0], 11, 31);
              console.log(this.minDate)
              console.log(this.maxDate)
            }
            this.personalDetailsForm.disable()
            // this.enableDisableService.DisableField(this.personalDetailsForm,'name',true)
          },
          error:()=>{
            this.loader = false
            console.error('Caught in GetAthletePersonalInfo API')
          }
        })
        
      }


      editButton(){
        this.personalDetailsForm.enable();
        this.personalDetailsForm.controls['gender'].disable();
        this.personalDetailsForm.updateValueAndValidity();
        this.readonlyEdit = !this.readonlyEdit
      }

      save(){
        if(this.userDetails.role_id!=4){
          this.personalDetailsForm.get('level')?.setValidators(Validators.nullValidator)
          this.personalDetailsForm.get('level')?.updateValueAndValidity();
        }

        console.log( this.personalDetailsForm.valid)
        if(this.personalDetailsForm.valid){          
          // this.personalDetailsForm.value.player_detail_id = this.userDetails.user_id;
          // this.personalDetailsForm.value.dob = this.datePipe.transform(this.personalDetailsForm.value.dob,'yyyy-MM-dd')
          const payload = {
            official_detail_id: this.userDetails.user_id,
            full_name: this.personalDetailsForm.get('name')?.getRawValue(),
            father_full_name: this.personalDetailsForm.get('father_name')?.getRawValue(),
            mother_full_name: this.personalDetailsForm.get('mother_name')?.getRawValue(),
            date_of_birth: this.personalDetailsForm.get('dob')?.getRawValue() ? this.datePipe.transform(this.personalDetailsForm.get('dob')?.getRawValue(),'yyyy-MM-dd') : null,
            level_of_technical_off: this.personalDetailsForm.get('level')?.getRawValue() == "National" ? 1 : 2,
            designation:  this.personalDetailsForm.get('designation')?.getRawValue()
          }
          // console.log(this.personalDetailsForm.getRawValue())
          // console.log(payload)
          // debugger
          this._otherRoleService.save_Otherofficial_Personal_detail(payload).subscribe({
            next:(response)=>{
              if(response){
                this.readonlyEdit = !this.readonlyEdit;
                this.alertService.swalPopSuccess('Personal Details Updated Successfully!');
                this._sideBarState.SetAcademyDetailData(this.personalDetailsForm.getRawValue())
                this.activeModal.close();
              }
            },
            error:()=>{
              console.error('Caught in EditAthletePersonalInfo API')
            }
          })
          //this.activeModal.close()
        }else{
          this.personalDetailsForm.markAllAsTouched();
        }
      }
}