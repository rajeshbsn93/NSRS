import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { CommonSharableService } from "src/app/_common/services/common-services/commonSharable.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CoachingInfoService } from "src/app/_common/services/role-inner-pages-services/coach-services/coaching-info.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import Swal from "sweetalert2";

@Component({
    selector:'app-sportscientist-current-previous-athlete',
    templateUrl:'./sport-scientist-current-previous-athlete.component.html',
    styleUrls:['./sport-scientist-current-previous-athlete.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
        DatePipe
      ],
})

export class SportScientistCurrentPreviousAthleteComponent implements OnInit{
    coachForm!:FormGroup;
    academyDetails:any;
    loader:boolean = false;
    minStartDate = new Date()

    constructor(public activeModal: NgbActiveModal, private fb:FormBuilder,private ssInfoService:CoachingInfoService,
        private storageService:StorageService, private alertService:AlertService, private datePipe:DatePipe,
        private commonSharableService:CommonSharableService) {}

    ngOnInit(): void {
        this.academyDetails=this.storageService.getAcademyDetails();
        this.coachForm = this.fb.group({
            nsrs_id:['', Validators.required],
            athleteName:[{value:'', disabled: true},[Validators.required]],
            fromDate:['',Validators.required],
            toDate:[''],
            athlete_id:[null],
        })
    }
    changeNSRS(inputVal:any){
        //console.log(inputVal.target.value)
        if(inputVal.target.value !=''){
            this.loader= true
            this.ssInfoService.athleteDetailsforOtherCoachingMapping(this.academyDetails.user_id,inputVal.target.value).subscribe({
                next:(response:any)=>{
                    this.loader = false;
                    //console.log(response)
                    if(response !=null){
                        if(response.name!=null){
                            this.coachForm.controls['athleteName'].setValue(response.name)
                            this.coachForm.controls['athleteName'].disable()
                            this.coachForm.controls['athlete_id'].setValue(response.athlete_id)
                        }else{
                            Swal.fire({
                                icon:'warning',
                                text:`${response.reason}`,
                                showConfirmButton:true
                            }).then((swalRes)=>{
                                if(swalRes.isConfirmed){
                                    this.coachForm.controls['nsrs_id'].reset()
                                }
                            })
                        }
                    }else{
                        Swal.fire({
                            icon:'warning',
                            text:'Plase enter valid NSRS ID',
                            showConfirmButton:true
                        }).then((swalRes)=>{
                            if(swalRes.isConfirmed){
                                this.coachForm.controls['nsrs_id'].reset()
                            }
                        })

                    }
                },
                error:(err)=>{
                    console.error(err);
                    this.loader = false;
                }
            })
        }else{
            this.coachForm.controls['athleteName'].reset('');
            this.coachForm.controls['athlete_id'].reset()
        }
    }

    save(){
        if(this.coachForm.valid){
            this.coachForm.enable();
            //console.log(this.coachForm.value);
            this.loader = true;
            this.commonSharableService.InsertOfficialOtherCoachingInformation(
                this.academyDetails.user_id,
                this.coachForm.value.athlete_id,
                this.datePipe.transform(this.coachForm.value.fromDate,'yyyy-MM-dd'),
                this.datePipe.transform(this.coachForm.value.toDate,'yyyy-MM-dd'),
                0
            ).subscribe({
                next:(response)=>{
                    //console.log(response)
                    this.loader = false;
                    if(response){
                        this.activeModal.close(response)
                        this.alertService.swalPopSuccess('Save successfully!')
                    }else{
                        this.alertService.swalPopWarning('Either sport scientist & athlete are in same training center or mapping already exist for selected date range');
                    }
                },
                error:(err)=>{
                    this.loader = false;
                    console.error(err)
                }
            })
        }else{
            this.coachForm.markAllAsTouched()
        }

    }
}