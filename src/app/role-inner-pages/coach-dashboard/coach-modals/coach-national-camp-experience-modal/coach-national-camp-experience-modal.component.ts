import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CoachDashboardService } from "src/app/_common/services/role-inner-pages-services/coach-services/coach-dashboard.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
selector:'app-coach-national-camp-experience-modal',
templateUrl:'./coach-national-camp-experience-modal.component.html',
styleUrls:['./coach-national-camp-experience-modal.component.css'],
standalone:true,
imports:[CommonModule, MaterialModule, ReactiveFormsModule, LoaderComponent]
})
export class CoachNationalCampExperienceModalComponent implements OnInit{
  form!:FormGroup;
  loader:boolean = false;
  minDate:any;
  maxDate:any;

  constructor(
    public activeModal:NgbActiveModal, 
    private formBuilder:FormBuilder, 
    private storageService:StorageService, 
    private coachDashboardService:CoachDashboardService, 
    private alertService:AlertService
  ) {}

  ngOnInit(): void {
    this.basicDetailsReactiveForm();
  }

  basicDetailsReactiveForm(){
    this.form=this.formBuilder.group({
      course_name: [''],
      passing_yr: [''],
      remarks: ['']
    })
    this.form.disable();
  }

  setFormValues(){
    // this.loader = true
    // this.coachDashboardService.getCoachPersonalInfo(this.bankDetails.user_id).subscribe({
    //   next:(response:any)=>{
    //     this.loader=false
    //     this.form.controls['official_detail_id'].setValue(response.official_detail_id)
    //     this.form.controls['name'].setValue(response.full_name)
    //     this.form.controls['gender'].setValue(response.gender)
    //     this.form.controls['dob'].setValue(response.date_of_birth)
    //     this.form.controls['discipline'].setValue(response.discipline)
    //     if(response.date_of_birth !=null){
    //       this.minDate = new Date(response.date_of_birth.split('-')[0], 0, 1);
    //       this.maxDate = new Date(response.date_of_birth.split('-')[0], 11, 31);
    //     }
    //     this.form.disable();
    //     // this.enableDisableService.DisableField(this.form,'name',true)
    //   },
    //   error:()=>{
    //     this.loader = false
    //     console.error('Caught in GetCoachPersonalInfo API')
    //   }
    // })
  }

  save() {
    // if(this.form.valid){
    //   this.form.value.official_detail_id = this.bankDetails.user_id;
    //   this.form.value.dob = this.datePipe.transform(this.form.value.dob,'yyyy-MM-dd')
    //   this.coachDashboardService.updateCoachPersonalInfo(this.form.value).subscribe({
    //     next:(response)=>{
    //       if(response){
    //         this.alertService.swalPopSuccess('Personal Details Updated Successfully!');
    //         this._sideBarState.SetAcademyDetailData(this.form.value)
    //         this.activeModal.close();
    //       }
    //     },
    //     error:()=>{
    //       console.error('Caught in EditCoachPersonalInfo API')
    //     }
    //   })
    //   //this.activeModal.close()
    // }else{
    //   this.form.markAllAsTouched();
    //   this.enableDisableService.DisableField(this.form,'gender',true)
    // }
  }
}