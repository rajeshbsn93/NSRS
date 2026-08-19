import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CoachDashboardService } from "src/app/_common/services/role-inner-pages-services/coach-services/coach-dashboard.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
selector:'app-coach-details-modal',
templateUrl:'./coach-details-modal.component.html',
styleUrls:['./coach-details-modal.component.css'],
standalone:true,
imports:[CommonModule, MaterialModule, ReactiveFormsModule, LoaderComponent]
})
export class CoachDetailsModalComponent implements OnInit{
  readonlyEdit:boolean = true
  form!:FormGroup;
  userDetails:any;
  loader:boolean = false;
  minDate:any;
  maxDate:any;

  constructor (
    public activeModal:NgbActiveModal,
    private formBuilder:FormBuilder,
    private storageService:StorageService,
    private coachDashboardService:CoachDashboardService,
    private alertService:AlertService,
  ) {}

  ngOnInit(): void {
    this.userDetails=this.storageService.getUserDetails();
    this.basicDetailsReactiveForm();
    this.setFormValues();
  }

  basicDetailsReactiveForm(){
    this.form=this.formBuilder.group({
      name:[''],
      gender:[''],
      dob:[null],
      discipline:['']
    });
  }

  setFormValues() {
    // this.loader = true
    // this.coachDashboardService.getCoachPersonalInfo(this.userDetails.user_id).subscribe({
    //   next:(response:any)=>{
    //     this.loader=false
    //     console.log(response)
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

  editButton(){
    // this.enableDisableService.enableField(this.form,'name',true)
    // this.enableDisableService.enableField(this.form,'mother_name',true)
    // this.enableDisableService.enableField(this.form,'mother_profession',true)
    // this.enableDisableService.enableField(this.form,'father_name',true)
    // this.enableDisableService.enableField(this.form,'father_profession',true)
    // this.enableDisableService.enableField(this.form,'dob',true)
    // this.enableDisableService.DisableField(this.form,'gender',true)
  }

  save(){
    // this.form.enable();
    // if(this.form.valid){
    //   this.readonlyEdit = !this.readonlyEdit;
    //   this.form.value.player_detail_id = this.userDetails.user_id;
    //   this.form.value.dob = this.datePipe.transform(this.form.value.dob,'yyyy-MM-dd')       
    //   console.log(this.form.value);
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