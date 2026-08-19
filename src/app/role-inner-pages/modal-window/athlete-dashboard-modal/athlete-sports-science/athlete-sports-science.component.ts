import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { AthleteOfficialInfoService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-official-info.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import Swal from "sweetalert2";

@Component({
    selector:'app-athlete-sports-science',
    templateUrl:'./athlete-sports-science.component.html',
    styleUrls:['./athlete-sports-science.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
        DatePipe
      ],
})

export class AthleteSportsScienceComponent implements OnInit{
    sportScienceForm!:FormGroup;
    academyDetails:any;
    loader:boolean = false;
    minStartDate = new Date();

    constructor(public activeModal:NgbActiveModal, private fb:FormBuilder, private storageService:StorageService,
        private athleteOfficialInfoService:AthleteOfficialInfoService, private datePipe:DatePipe,private alertService:AlertService){}

    ngOnInit(): void {
        this.academyDetails=this.storageService.getAcademyDetails();
        this.sportScienceForm = this.fb.group({
            nsrs_id:[''],
            ssName:['', Validators.required],
            fromDate:['',Validators.required],
            toDate:[''],
            ss_id:[null],
        })
        
    }

    changeNsrsid(inputVal:any){
        //console.log(inputVal.target.value)
        if(inputVal.target.value !=''){
            this.loader = true;
           this.athleteOfficialInfoService.getSportScientistDetailsforOtherCoachingMapping(this.academyDetails.user_id,inputVal.target.value).subscribe({
            next:(response:any)=>{
                this.loader  = false;
                //console.log(response)
                if(response!=null){
                    if(response?.name!=null){
                        this.sportScienceForm.get('ssName')?.setValue(response?.name);
                        this.sportScienceForm.get('ssName')?.disable();                
                        this.sportScienceForm.get('ss_id')?.setValue(response?.ss_id);
                    }else{
                        Swal.fire({
                            icon:'warning',
                            text:`${response?.reason}`,
                            showConfirmButton:true
                        }).then((swalRes)=>{
                            if(swalRes.isConfirmed){
                                this.sportScienceForm.controls['nsrs_id'].reset()
                            }
                        })                        
                    }
                }else{
                    Swal.fire({
                        icon:'warning',
                        text:'Please enter valid NSRS ID',
                        showConfirmButton:true
                    }).then((swalRes)=>{
                        if(swalRes.isConfirmed){
                            this.sportScienceForm.controls['nsrs_id'].reset()
                        }
                    })
                }
            },
            error:(err)=>{
                this.loader = false;
                console.error(err)
            }
           })
        }else{
            this.sportScienceForm.get('ssName')?.reset();
            this.sportScienceForm.get('ssName')?.enable();                
            this.sportScienceForm.get('ss_id')?.reset();
        }
    }

    save(){
        if(this.sportScienceForm.valid){
            this.sportScienceForm.enable();
            this.loader= true;
            // const mappingRequestById = 1;
            this.athleteOfficialInfoService.insertAthleteOtherSportScienceInformation(
                this.academyDetails.user_id,this.sportScienceForm.value.ss_id,
                this.sportScienceForm.value.ssName,
                this.datePipe.transform(this.sportScienceForm.value.fromDate,'yyyy-MM-dd'),this.datePipe.transform(this.sportScienceForm.value.toDate,'yyyy-MM-dd')
                ).subscribe({
                    next:(response)=>{
                        //console.log(response)
                        this.loader = false;
                        if(response){
                            this.activeModal.close(response)
                            this.alertService.swalPopSuccess('Save successfully!')
                        }else{
                            this.alertService.swalPopWarning('Either sport scientist & athlete are in same training center or mapping already exist for selected date range');
                            this.sportScienceForm.reset()
                        }
                    },
                    error:(err)=>{
                        console.error(err);
                        this.loader = false;
                    }
                })
        }
        else{
            this.sportScienceForm.markAllAsTouched();
        }
    }
}