import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { map, Observable } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { AthleteOfficialInfoService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-official-info.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import Swal from "sweetalert2";

@Component({
    selector:'app-athlete-current-coach',
    templateUrl:'./athlete-current-coach.component.html',
    styleUrls:['./athlete-current-coach.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
        DatePipe
      ],
})

export class AthleteCurrentCoachComponent implements OnInit{
    coachForm!:FormGroup;
    academyDetails:any;
    loader:boolean = false;
    minStartDate = new Date();
    trainingLevelList$:Observable<any> = new Observable();

    constructor(public activeModal: NgbActiveModal, private fb:FormBuilder,private athleteOfficialInfoService:AthleteOfficialInfoService,
        private storageService:StorageService, private alertService:AlertService, private datePipe:DatePipe) {}

    ngOnInit(): void {
        this.academyDetails=this.storageService.getAcademyDetails();
        this.coachForm = this.fb.group({
            nsrs_id:[''],
            coachName:['',Validators.required],
            fromDate:['',Validators.required],
            toDate:[''],
            coach_id:[null],
            trainingLevel_id:['', Validators.required]
        })
        this.getTrainingLevelMaster()
    }
    getTrainingLevelMaster(){
        this.trainingLevelList$ = this.athleteOfficialInfoService.getTrainingLevelMaster(this.academyDetails.role_id).pipe(map((res:any)=>{
            return res
        }))
    }
    changeNSRS(inputVal:any){
        //console.log(inputVal)
        if(inputVal !=''){
            this.loader= true
            this.athleteOfficialInfoService.getCoachDetailsforOtherCoachingMapping(this.academyDetails.user_id,inputVal).subscribe({
                next:(response:any)=>{
                    this.loader = false;
                    //console.log(response)
                    if(response !=null){
                        if(response.name!=null){
                            this.coachForm.controls['coachName'].setValue(response.name)
                            this.coachForm.controls['coachName'].disable()
                            this.coachForm.controls['coach_id'].setValue(response.coach_id)
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
            this.coachForm.controls['coachName'].reset('');
            this.coachForm.controls['coachName'].enable();
            this.coachForm.controls['coach_id'].reset()
        }
    }

    save(){
        if(this.coachForm.valid){
            this.coachForm.enable();
            // const mappingRequestById = 1
            // console.log(this.coachForm.value);
            this.loader = true;
            this.athleteOfficialInfoService.insertAthleteOtherCoachingInformation(
                this.academyDetails.user_id,
                this.coachForm.value.coach_id,
                this.coachForm.value.coachName,
                this.datePipe.transform(this.coachForm.value.fromDate,'yyyy-MM-dd'),
                this.datePipe.transform(this.coachForm.value.toDate,'yyyy-MM-dd'),
                this.coachForm.value.trainingLevel_id
            ).subscribe({
                next:(response)=>{
                    //console.log(response)
                    this.loader = false;
                    if(response){
                        this.activeModal.close(response)
                        this.alertService.swalPopSuccess('Save successfully!')
                    }else{
                        this.alertService.swalPopWarning('Either coach & athlete are in same training center or mapping already exist for selected date range');
                        this.coachForm.reset()
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