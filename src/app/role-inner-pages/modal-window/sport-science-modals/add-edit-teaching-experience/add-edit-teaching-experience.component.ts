import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { researchExperienceService } from "src/app/_common/services/role-inner-pages-services/sport-scientist-services/research-experience.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-add-edit-teaching-experience',
    templateUrl:'./add-edit-teaching-experience.component.html',
    styleUrls:['./add-edit-teaching-experience.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule]
})

export class AddEditTeachingExperienceComponent implements OnInit{
    experienceForm!:FormGroup
    loader:boolean = false;
    experienceList:Array<any> = [];
    userDetails:any;
    editData:any;


    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,
        private experienceService:researchExperienceService,private storageService:StorageService,
        private alertService:AlertService){}

    ngOnInit(): void {
        this.userDetails=this.storageService.getUserDetails();
        this.experienceForm = this.fb.group({
            year_of_experience:['', [Validators.required]],            
            institute_of_teaching:['', [Validators.required]],            
            remark:[''],
            teaching_experience_details_id:['']            
        });
        this.createExperience(100);
        if(this.editData !=null){
            this.experienceForm.patchValue({
                year_of_experience:this.editData.year_of_experience,
                institute_of_teaching:this.editData.institute_of_teaching,
                remark:this.editData.remark,
                teaching_experience_details_id:this.editData.teaching_experience_details_id
            })
        }
             
    }
    createExperience(number:number){
        for(let i =0; i<=number; i++){
            this.experienceList.push(i)
        }
        return this.experienceList
    }


    save(){
        const official_detail_id = this.userDetails.user_id;
        if(this.experienceForm.value.teaching_experience_details_id == ('')) this.experienceForm.value.teaching_experience_details_id = 0
        //console.log(this.experienceForm.value,official_detail_id);
        if(this.experienceForm.valid){
            this.loader = true;
            this.experienceService.SaveTeachingExperience(
                this.experienceForm.value.teaching_experience_details_id,
                official_detail_id,
                this.experienceForm.value.year_of_experience,
                this.experienceForm.value.institute_of_teaching,
                this.experienceForm.value.remark
                ).subscribe({
                    next:(response)=>{
                        this.loader = false;
                        if(response){
                            this.activeModal.close(response)
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