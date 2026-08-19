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
import { AthleteDashboardService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-dashboard.service";
import { AthleteEducationInfoService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-education-info.service";
import { SideBarNavStateService } from "src/app/_common/sidebar.state";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
selector:'app-other-role-sport-modal',
templateUrl:'./other-role-sport-modal.component.html',
styleUrls:['./other-role-sport-modal.component.css'],
standalone:true,
imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
providers: [
  {provide: DateAdapter, useClass: MomentDateAdapter},
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  DatePipe
],
})
export class OtherRoleSportModalComponent implements OnInit{
    @ViewChild('insttSearch', {static: false}) insttSearch?: ElementRef<HTMLInputElement>;
    readonlyEdit:boolean = true
    sportForm!:FormGroup;
    userDetails:any;
    loader:boolean = false;
    loader2:boolean = false;
    minDate:any;
    maxDate:any;
    universityList:any;
    filterUniversityList:any;
    subscription:Subscription = new Subscription();
    insttNameSearch: FormControl = new FormControl(null);
    sportsList:Array<any> = [];
    officialNSFInfoData:any

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
      this.getUniversity();
      this.getSports();
        this.basicDetailsReactiveForm();
        this.subscription.add(
            this.insttNameSearch.valueChanges.subscribe((value) => {
              if (value && this.universityList?.length)
                this.filterUniversityList = this.universityList.filter(
                  (item:any) => item.university_name?.toLowerCase()?.trim()?.includes(value?.toLowerCase()?.trim())
                );
              else this.filterUniversityList = this.universityList;
            })
          );
        this.setFormValues()
    }
    
    basicDetailsReactiveForm(){
        this.sportForm=this.formBuilder.group({
          university:['',[Validators.required]],
          disciplines:['',[Validators.required]],          
        })
      }
      getUniversity(){
        this.athleteEducationInfoService.getUniversityList().subscribe({
          next:(res:any)=>{
            this.loader = false;
            // console.log(res)
            this.universityList= this.filterUniversityList = res
            if(this.officialNSFInfoData?.length && !this.sportForm.get('university')?.touched){
              // this.state_univ_form.get('part_state_uni')?.setValue(this.rowData.stuniId);
              this.sportForm.controls['university'].setValue(this.officialNSFInfoData[0]?.university_detail_id) 
            }
          },
          error:(err)=>{
            this.loader = false;
            console.error(err)
          }
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
            this.officialNSFInfoData = response
            // console.log(response)
            this.sportForm.controls['disciplines'].setValue(response[0]?.sport_detail_id)               
            this.sportForm.controls['university'].setValue(response[0]?.university_detail_id)               
            this.sportForm.disable()
            // this.enableDisableService.DisableField(this.sportForm,'name',true)
          },
          error:()=>{
            this.loader = false
            console.error('Caught in GetAthletePersonalInfo API')
          }
        })
        
      }


      editButton(){
        this.sportForm.enable();
        this.sportForm.updateValueAndValidity();
        this.readonlyEdit = !this.readonlyEdit
      }

      onInsttNameSelectOpen() {
        this.insttSearch?.nativeElement.focus();
      }
      
      onInsttSearchBlur() {
        setTimeout(() => {
          this.insttNameSearch.setValue('');
        }, 400);
      }

      save(){
        console.log( this.sportForm.value)
        if(this.sportForm.valid){   
          const payload = {
            official_detail_id: this.userDetails.user_id,
            nsf_user_id: 0,
            designation: "",
            sport_detail_id: this.sportForm.get('disciplines')?.getRawValue(),
            universityId: this.sportForm.get('university')?.getRawValue()
          }
          console.log(payload)
          this._otherRoleService.saveOtherOfficialNSFInfo(payload).subscribe({
            next:(response)=>{
              if(response){
                this.readonlyEdit = !this.readonlyEdit;
                this.alertService.swalPopSuccess('Saved Successfully!');
                this.activeModal.close();
              }
            },
            error:()=>{
              console.error('Caught in EditAthletePersonalInfo API')
            }
          })
          //this.activeModal.close()
        }else{
          this.sportForm.markAllAsTouched();
          this.enableDisableService.DisableField(this.sportForm,'gender',true)
        }
      }
}