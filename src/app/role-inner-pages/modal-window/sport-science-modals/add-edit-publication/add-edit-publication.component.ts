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
    selector:'app-add-edit-publication',
    templateUrl:'./add-edit-publication.component.html',
    styleUrls:['./add-edit-publication.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class AddEditPublicationComponent implements OnInit{
    experienceForm!:FormGroup
    loader:boolean = false;
    userDetails:any;
    editData:any;


    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,
        private experienceService:researchExperienceService,private storageService:StorageService,
        private alertService:AlertService, private datePipe:DatePipe){}

    ngOnInit(): void {
        this.userDetails=this.storageService.getUserDetails();
        this.experienceForm = this.fb.group({
            type:['', [Validators.required]],            
            name:['', [Validators.required]],            
            date_of_publication:['',[Validators.required]],
            publication_detail_id:['']            
        });
        if(this.editData !=null){
            this.experienceForm.patchValue({
                type:this.editData.type,
                name:this.editData.name,
                date_of_publication:this.editData.date_of_publication,
                publication_detail_id:this.editData.publication_detail_id
            })
        }
             
    }

    save(){
        const official_detail_id = this.userDetails.user_id;
        //console.log(this.experienceForm.value)
        if(this.experienceForm.value.publication_detail_id == '') this.experienceForm.value.publication_detail_id = 0
        //console.log(this.experienceForm.value);
        if(this.experienceForm.valid){
            this.loader = true;
            this.experienceService.SavePublicationDetail(
                this.experienceForm.value.publication_detail_id,
                official_detail_id,
                this.experienceForm.value.type,
                this.experienceForm.value.name,
                this.datePipe.transform(this.experienceForm?.value?.date_of_publication,'yyyy-MM-dd')            
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