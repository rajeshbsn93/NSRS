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
    selector:'app-add-edit-membership-scientific',
    templateUrl:'./add-edit-membership-scientific.component.html',
    styleUrls:['./add-edit-membership-scientific.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule,YearFormatDirective],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class AddEditMembershipScientificComponent implements OnInit{
    experienceForm!:FormGroup
    loader:boolean = false;
    userDetails:any;
    yearVal:any;
    editData:any;
    // maxDate = new Date(2023, 0, 1);
    maxDate = new Date(new Date().getFullYear(), 11, 31);
    awarList$:Observable<any> = new Observable();


    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,
        private experienceService:researchExperienceService,private storageService:StorageService,
        private alertService:AlertService, private datePipe:DatePipe, private commonSharableService:CommonSharableService){}

    ngOnInit(): void {
        //console.log(this.editData)
        this.getCentralAwards();
        this.userDetails=this.storageService.getUserDetails();
        this.experienceForm = this.fb.group({
            body_type:['', [Validators.required]],            
            body_name:['', [Validators.required]],            
            body_year:['',[Validators.required]],
            remark:['',[Validators.required]],
            id:['']            
        });
        if(this.editData !=null){
            this.experienceForm.patchValue({
                body_type:this.editData.type,
                body_name:this.editData.name_of_scientific_body,
                body_year: new Date(this.editData.year,0,1),
                remark:this.editData.remark,
                id:this.editData.id
            });
            this.yearVal = this.editData.year
        } 
    }

    getCentralAwards(){
        this.awarList$ = this.commonSharableService.centralAwards()
    }

    handleYearSelected(event:Moment,yearOpen: MatDatepicker<Moment>) {
        // console.log(event.toDate().getFullYear())
        this.yearVal = event.toDate().getFullYear();
        this.experienceForm.controls['body_year'].setValue(event)
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
            this.experienceService.saveMemberScientificBodiesDetails(
                this.experienceForm.value.id,official_detail_id,this.yearVal,this.experienceForm.value.body_type,
                this.experienceForm.value.body_name,this.experienceForm.value.remark
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