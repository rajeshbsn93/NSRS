import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import { NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { Moment } from "moment";
import { Observable } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { CommonSharableService, centralAwardsEntity } from "src/app/_common/services/common-services/commonSharable.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { researchExperienceService } from "src/app/_common/services/role-inner-pages-services/sport-scientist-services/research-experience.service";
import { YearFormatDirective } from "src/app/standalone_components/directives/year-format.directive";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-add-edit-award-sport-scientist',
    templateUrl:'./add-edit-award-sport-scientist.component.html',
    styleUrls:['./add-edit-award-sport-scientist.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule,YearFormatDirective],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class AddEditAwardSportScientistComponent implements OnInit{
    experienceForm!:FormGroup
    loader:boolean = false;
    userDetails:any;
    yearVal:any;
    editData:any;
    // maxDate = new Date(2023, 0, 1);
    maxDate = new Date((new Date().getFullYear()), 11, 31);
    awardNameFieldChange:boolean = true;
    awarList$:Observable<any> = new Observable();


    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,
        private experienceService:researchExperienceService,private storageService:StorageService,
        private alertService:AlertService, private datePipe:DatePipe, private commonSharableService:CommonSharableService){}

    ngOnInit(): void {
        //console.log(this.editData)
        this.getCentralAwards();
        this.userDetails=this.storageService.getUserDetails();
        this.experienceForm = this.fb.group({
            award_recieved_from:['', [Validators.required]],            
            award_name:['', [Validators.required]],            
            award_year:['',[Validators.required]],
            id:['']            
        });
        if(this.editData !=null){
            if(this.editData.award_recieved_from ==='State Govt') {
                this.awardNameFieldChange = false;
            }else if(this.editData.award_recieved_from === 'Other Agencies'){
                this.awardNameFieldChange = false;
            }else{
                this.awardNameFieldChange = true
            }
            this.experienceForm.patchValue({
                award_recieved_from:this.editData.award_recieved_from,
                award_name:this.editData.award_name,
                award_year: new Date(this.editData.award_year,0,1),
                id:this.editData.id
            })
        } 
    }

    getCentralAwards(){
        this.awarList$ = this.commonSharableService.centralAwards()
    }

    changeReceivedForm(eventVal:any){
        this.experienceForm.controls['award_name'].reset('');
        this.experienceForm.controls['award_year'].reset('');
        if(eventVal==='Central Govt'){
            this.awardNameFieldChange = true
        }else if(eventVal==='State Govt' || eventVal==='Other Agencies'){
            this.awardNameFieldChange = false
        }
    }
    chamgeAwardName(event:any){
        this.experienceForm.get('award_year')?.reset('')        
    }

    handleYearSelected(event:Moment,yearOpen: MatDatepicker<Moment>) {
        // console.log(event.toDate().getFullYear())
        this.yearVal = event.toDate().getFullYear();
        this.experienceForm.controls['award_year'].setValue(event)
        if (yearOpen.opened) {
            yearOpen.close();
        }
      }

    save(){
        const official_detail_id = this.userDetails.user_id;
        //console.log(this.experienceForm.value,this.yearVal)
        if(this.experienceForm.value.id == '') this.experienceForm.value.id = 0
        //console.log(this.experienceForm.value);
        if(this.experienceForm.valid){
            this.loader = true;
            this.experienceService.saveOfficialAwardDetails(
                this.experienceForm.value.id,official_detail_id,this.yearVal,this.experienceForm.value.award_recieved_from,
                this.experienceForm.value.award_name,
                ).subscribe({
                    next:(response)=>{
                        this.loader = false;
                        if(response){
                            this.activeModal.close(response);
                            this.alertService.swalPopSuccess('Saved Successfully!');
                        }
                    },
                    error:(err)=>{
                        this.loader= false;
                        console.error(err)
                    }
                })
        }else{
            this.experienceForm.markAllAsTouched()
        }
    }
}