import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { first, map } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { AthletePbifService } from "src/app/_common/services/common-services/athlete-pbif.service";
import { Enable_disableFormService } from "src/app/_common/services/common-services/enable_disableForm.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { AthleteDashboardService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-dashboard.service";
import { SideBarNavStateService } from "src/app/_common/sidebar.state";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
selector:'app-personal-detail',
templateUrl:'./personal-detail.component.html',
styleUrls:['./personal-detail.component.css'],
standalone:true,
imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
providers: [
  {provide: DateAdapter, useClass: MomentDateAdapter},
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  DatePipe
],
})
export class PersonalDetailComponent implements OnInit{
    readonlyEdit:boolean = true
    personalDetailsForm!:FormGroup;
    userDetails:any;
    loader:boolean = false;
    minDate:any;
    maxDate:any;
    isAtheltePBIF:boolean = false

    constructor(public activeModal:NgbActiveModal,private formBuilder:FormBuilder,private enableDisableService:Enable_disableFormService,
      private storageService:StorageService,private athleteDashboardService:AthleteDashboardService,private alertService:AlertService,
      private _sideBarState:SideBarNavStateService, private datePipe:DatePipe,
      private athletepbfiService:AthletePbifService
    ){}

    ngOnInit(): void {
      this.userDetails=this.storageService.getUserDetails()
        this.basicDetailsReactiveForm();
        this.setFormValues();
        this.getAthletePbif();
    }
    getAthletePbif(){
      this.athletepbfiService.atheltePBIF(this.userDetails.user_id).pipe(first()).subscribe({
        next:(res:any)=>{
          console.log(res)
          this.isAtheltePBIF = res
        },
        error:(err)=>{
          console.error(err)
        }
      })
    }
    basicDetailsReactiveForm(){
        this.personalDetailsForm=this.formBuilder.group({
          name:['',[Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
          father_name:['',[Validators.required,Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
          mother_name:['',[Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
          father_profession:['',[Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
          mother_profession:['',[Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
          gender:[''],
          dob:[null]
          
        })
      }

      setFormValues(){
        this.loader = true
        this.athleteDashboardService.getAthletePersonalInfo(this.userDetails.user_id).subscribe({
          next:(response:any)=>{
            this.loader=false
            //console.log(response)
            this.personalDetailsForm.controls['name'].setValue(response?.full_name)
            this.personalDetailsForm.controls['father_name'].setValue(response?.father_full_name)
            this.personalDetailsForm.controls['mother_name'].setValue(response?.mother_full_name)
            this.personalDetailsForm.controls['father_profession'].setValue(response?.father_profession)
            this.personalDetailsForm.controls['mother_profession'].setValue(response?.mother_profession)
            this.personalDetailsForm.controls['gender'].setValue(response?.gender)
            this.personalDetailsForm.controls['dob'].setValue(response?.date_of_birth)
            if(response.date_of_birth !=null){
              this.minDate = new Date(response.date_of_birth.split('-')[0], 0, 1);
              this.maxDate = new Date(response.date_of_birth.split('-')[0], 11, 31);
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
        if(this.isAtheltePBIF){
          this.alertService.swalPopWarning('PBIF form is already filled!')
        }
        else{
          this.personalDetailsForm.get('name')?.enable();
          this.personalDetailsForm.get('mother_name')?.enable();
          this.personalDetailsForm.get('mother_profession')?.enable();
          this.personalDetailsForm.get('father_name')?.enable();
          this.personalDetailsForm.get('father_profession')?.enable();
          this.personalDetailsForm.get('dob')?.enable();
          this.readonlyEdit = !this.readonlyEdit
        }        
      }

      save(){
        //console.log( this.personalDetailsForm.valid)
        if(this.personalDetailsForm.valid){          
          this.personalDetailsForm.value.player_detail_id = this.userDetails.user_id;
          if(this.personalDetailsForm.value.father_profession == null){
            this.personalDetailsForm.value.father_profession = ''
          }
          if(this.personalDetailsForm.value.mother_profession == null){
            this.personalDetailsForm.value.mother_profession = ''
          }
          this.personalDetailsForm.value.dob = this.datePipe.transform(this.personalDetailsForm.value.dob,'yyyy-MM-dd')       
          //console.log(this.personalDetailsForm.value);
          this.athleteDashboardService.updateAthletePersonalInfo(this.personalDetailsForm.value).subscribe({
            next:(response)=>{
              if(response){
                this.readonlyEdit = !this.readonlyEdit;
                this.alertService.swalPopSuccess('Personal Details Updated Successfully!');
                this._sideBarState.SetAcademyDetailData(this.personalDetailsForm.value)
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
          this.enableDisableService.DisableField(this.personalDetailsForm,'gender',true)
        }
      }
}