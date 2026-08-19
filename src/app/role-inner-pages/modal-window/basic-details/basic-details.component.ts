import { CommonModule, DatePipe } from '@angular/common';
import {Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Moment } from 'moment';
import { YearFormatDirective } from 'src/app/standalone_components/directives/year-format.directive';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { Enable_disableFormService } from 'src/app/_common/services/common-services/enable_disableForm.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { ProfileService } from 'src/app/_common/services/role-inner-pages-services/academy-services/profile.service';
import { SideBarNavStateService } from 'src/app/_common/sidebar.state';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ],
  standalone:true,
  imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule,YearFormatDirective]
})
export class BasicDetailsComponent implements OnInit {
  
  readonlyEdit:boolean=true
  basicDetailsForm!:FormGroup
  basicInformation:any
  mainLoader:boolean=false
  academyDetails:any

  constructor(public activeModal:NgbActiveModal,private formBuilder:FormBuilder,private alertService:AlertService
    ,private profileService:ProfileService,private storageService:StorageService,private enableDisableService:Enable_disableFormService,
    private _sideBarState:SideBarNavStateService) { }

  ngOnInit() {
    this.academyDetails=this.storageService.getAcademyDetails()
    this.basicDetailsReactiveForm()
    this.setInputValue()
  }

  basicDetailsReactiveForm(){
    this.basicDetailsForm=this.formBuilder.group({
      type:['',Validators.required],
      registrationNo:[''],
      status:['',Validators.required],
      academyName:['',Validators.required],
      year:['',Validators.required]
    })
  }

  

  setInputValue(){
    this.mainLoader=true
    this.profileService.getBasicInfo(this.academyDetails.user_id).subscribe({
      next:(res)=>{
        this.mainLoader=false
        this.basicInformation=res
        this.basicDetailsForm.controls['type'].setValue(this.basicInformation[0].legal_entity_name)
        this.basicDetailsForm.controls['registrationNo'].setValue(this.basicInformation[0].academy_registration_number)
        this.basicDetailsForm.controls['status'].setValue(this.basicInformation[0].status)
        this.basicDetailsForm.controls['academyName'].setValue(this.basicInformation[0].academy_name)
        this.basicDetailsForm.controls['year'].setValue(this.basicInformation[0].year_of_operation)
        this.yearToSent=this.basicInformation[0].year_of_operation
        this.enableDisableService.DisableField(this.basicDetailsForm,"type",true)
        this.enableDisableService.DisableField(this.basicDetailsForm,"registrationNo",true)
        this.enableDisableService.DisableField(this.basicDetailsForm,"status",true)
        this.enableDisableService.DisableField(this.basicDetailsForm,"academyName",true)
        this.enableDisableService.DisableField(this.basicDetailsForm,"year",true)
      },
      error:()=>{
        console.error('error caught in getting basic information')
        this.mainLoader=false
      }
    })
  }

  keyPressDenied() {
    return false
  }

  get f(){
    return this.basicDetailsForm.controls
  }

  editButton(){
    this.enableDisableService.enableField(this.basicDetailsForm,"type",false)
    this.enableDisableService.enableField(this.basicDetailsForm,"registrationNo",true)
    this.enableDisableService.enableField(this.basicDetailsForm,"status",true)
    this.enableDisableService.enableField(this.basicDetailsForm,"academyName",true)
    this.enableDisableService.enableField(this.basicDetailsForm,"year",true)
    this.readonlyEdit = !this.readonlyEdit
  }

  yearToSent:any
  handleYearSelected(event:Event,yearEstablish: MatDatepicker<Moment>) {
    this.basicDetailsForm.controls['year'].setValue(event)
    if (yearEstablish.opened) {
      yearEstablish.close();
    }
    this.yearToSent=this.basicDetailsForm.value.year.year()
    this.yearToSent=this.yearToSent.toString()
  }

  submitBasicDetails(){
    if (this.basicDetailsForm.invalid) {
      this.basicDetailsForm.markAllAsTouched();
      return;
    }
    // this.mainLoader=true
    this.profileService.saveBasicInfo(
      this.academyDetails.user_id,
      this.basicDetailsForm.value.academyName,
      this.academyDetails.nsrs_id,
      this.basicDetailsForm.value.registrationNo,
      this.basicDetailsForm.value.type,
      this.basicDetailsForm.value.status,
      this.yearToSent
    ).subscribe({
        next:(res)=>{
          this.mainLoader==false;
          if(res){
            this.alertService.swalPopSuccess('Saved Successfully!')
            this._sideBarState.SetAcademyDetailData(this.basicDetailsForm.value)
            this.activeModal.close(this.basicDetailsForm.value)
            this.readonlyEdit = !this.readonlyEdit;
            this.basicDetailsForm.disable();
          }else{
            this.alertService.swalPopError('Some Error Occured!');
          }
        },
        error:()=>{
          this.alertService.swalPopError('Some Error Occured!');
          console.error('error caught in submit basic details');
          this.mainLoader=false;
        }
      })
    // this.activeModal.close()
  }

}
