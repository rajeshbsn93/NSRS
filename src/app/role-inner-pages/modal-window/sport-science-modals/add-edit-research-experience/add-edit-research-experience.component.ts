import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import {researchExperienceService } from "src/app/_common/services/role-inner-pages-services/sport-scientist-services/research-experience.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-add-edit-research-experience',
    templateUrl:'./add-edit-research-experience.component.html',
    styleUrls:['./add-edit-research-experience.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule]
})

export class AddEditResearchExperienceComponent implements OnInit{
    researchExperienceForm!:FormGroup
    loader:boolean = false;
    experienceList:Array<any> = [];
    userDetails:any;
    editData:any;


    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,
        private experienceService:researchExperienceService,private storageService:StorageService,
        private alertService:AlertService){}

    ngOnInit(): void {
        this.userDetails=this.storageService.getUserDetails();
        this.researchExperienceForm = this.fb.group({
            year_of_experience:['', [Validators.required]],            
            institute_of_research:['', [Validators.required]],            
            remark:[''],
            research_experience_details_id:['']            
        });
        this.createExperience(100);
        if(this.editData !=null){
            this.researchExperienceForm.patchValue({
                year_of_experience:this.editData.year_of_experience,
                institute_of_research:this.editData.institute_of_research,
                remark:this.editData.remark,
                research_experience_details_id:this.editData.research_experience_details_id
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
        const official_detail_id = this.userDetails.user_id
        if(this.researchExperienceForm.value.research_experience_details_id == '')  this.researchExperienceForm.value.research_experience_details_id = 0
        //console.log(this.researchExperienceForm.value,official_detail_id);
        if(this.researchExperienceForm.valid){
            this.loader = true;
            this.experienceService.SaveResarchExperience(
                this.researchExperienceForm.value.research_experience_details_id,
                official_detail_id,
                this.researchExperienceForm.value.year_of_experience,
                this.researchExperienceForm.value.institute_of_research,
                this.researchExperienceForm.value.remark
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
            this.researchExperienceForm.markAllAsTouched()
        }
    }
}