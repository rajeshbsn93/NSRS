import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { researchExperienceService } from "src/app/_common/services/role-inner-pages-services/sport-scientist-services/research-experience.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-add-edit-training-workshop',
    templateUrl:'./add-edit-training-workshop.component.html',
    styleUrls:['./add-edit-training-workshop.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class AddEditTrainingWorkshopComponent implements OnInit{
    experienceForm!:FormGroup
    loader:boolean = false;
    userDetails:any;
    editData:any;


    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,
        private experienceService:researchExperienceService,private storageService:StorageService,
        private alertService:AlertService, private datePipe:DatePipe){}

    ngOnInit(): void {
        //console.log(this.editData)
        this.userDetails=this.storageService.getUserDetails();
        this.experienceForm = this.fb.group({
            type:['', [Validators.required]],            
            level:['', [Validators.required]],            
            name:['', [Validators.required]],            
            date:['', Validators.required],
            training_workshop_conference_detail_id:['']            
        });
        if(this.editData !=null){
            this.experienceForm.patchValue({
                type:this.editData.type,
                level:this.editData.level,
                name:this.editData.name,
                date:this.editData.date,
                training_workshop_conference_detail_id:this.editData.training_workshop_conference_detail_id
            })
        }
             
    }

    save(){
        const official_detail_id = this.userDetails.user_id;
        //console.log(this.experienceForm.value)
        if(this.experienceForm.value.training_workshop_conference_detail_id == '') this.experienceForm.value.training_workshop_conference_detail_id = 0
        //console.log(this.experienceForm.value);
        if(this.experienceForm.valid){
            this.loader = true;
            this.experienceService.saveTrainingWorkshopConferenceDetails(
                this.experienceForm.value.training_workshop_conference_detail_id,
                official_detail_id,
                this.experienceForm.value.type,
                this.experienceForm.value.level,
                this.experienceForm.value.name,
                this.datePipe.transform(this.experienceForm?.value?.date,'yyyy-MM-dd')            
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