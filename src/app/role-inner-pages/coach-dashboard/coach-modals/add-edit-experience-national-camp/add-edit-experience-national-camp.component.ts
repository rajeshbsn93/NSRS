import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { CommonSharableService } from "src/app/_common/services/common-services/commonSharable.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { SharableService } from "src/app/_common/services/innerPagesServices/innerpagesSharable.service";
import { CoachAchievementService } from "src/app/_common/services/role-inner-pages-services/coach-services/coach-achievement.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-add-edit-experience-national-camp',
    templateUrl:'./add-edit-experience-national-camp.component.html',
    styleUrls:['./add-edit-experience-national-camp.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class AddEditExperienceNationalCampComponent implements OnInit{
    experienceForm!:FormGroup
    loader:boolean = false;
    userDetails:any;
    editData:any;
    designation$:Observable<any> = new Observable();
    maxDate:any


    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,private storageService:StorageService,
        private alertService:AlertService, private datePipe:DatePipe,private sharableService:SharableService,
        private commonSharableService:CommonSharableService,
        private coachAchievementService:CoachAchievementService){}

    ngOnInit(): void {
        // console.log(this.editData);
        this.maxDate = new Date()
        this.getDesignation();
        this.userDetails=this.storageService.getUserDetails();
        this.experienceForm = this.fb.group({
            designation:['', [Validators.required]],            
            category_of_player:['', [Validators.required]],            
            camp_from:['', [Validators.required]],            
            camp_to:['', Validators.required],
            uid_training_center:[''],
            name_of_training_center:[{value:'',disabled:true}],
            // name_of_training_center:[{value:'',disabled:true}, Validators.required],
            id:['']            
        });
        if(this.editData !=null){
            this.experienceForm.patchValue({
                designation:this.editData.designation,
                category_of_player:this.editData.category_of_player,
                camp_from:this.editData.camp_from,
                camp_to:this.editData.camp_to,
                uid_training_center:this.editData.uid_training_center,
                name_of_training_center:this.editData.name_of_training_center,
                id:this.editData.id
            })
        }
             
    }
    getDesignation(){
       this.designation$ = this.sharableService.getDesignation('coach')
    }
    changeCampDate(event:any){
        //console.log(event)
        this.experienceForm.get('camp_to')?.reset(null)
    }
    changeNsrsid(event:any){
        if(event.target.value !=''){
            this.loader = true;
            this.commonSharableService.getBasicData_Academy(event.target.value).subscribe({
                next:(response:any)=>{
                    this.loader = false;
                    if(response.length > 0){
                        this.experienceForm.get('name_of_training_center')?.setValue(response[0].academy_name)
                    }else{
                     this.alertService.swalPopWarning('Please enter valid NSRS ID');
                     this.experienceForm.get('uid_training_center')?.reset('')
                    }
                    
                },
                error:(err)=>{
                    this.loader = false;
                    console.error(err)
                }
            })            
        }else{
           this.experienceForm.get('name_of_training_center')?.reset('') 
        }
    }

    save(){
        const official_detail_id = this.userDetails.user_id;
        //console.log(this.experienceForm.value)
        if(this.experienceForm.value.id == '') this.experienceForm.value.id = 0
        //console.log(this.experienceForm.value);
        //console.log(this.experienceForm.getRawValue().name_of_training_center);
        if(this.experienceForm.valid){
            this.loader = true;
            this.coachAchievementService.SaveCoachExpNationalCamp(
                this.experienceForm.value.id,
                official_detail_id,
                this.experienceForm.value.designation,
                this.experienceForm.value.category_of_player,
                this.datePipe.transform(this.experienceForm.value.camp_from,'yyyy-MM-dd'),
                this.datePipe.transform(this.experienceForm?.value?.camp_to,'yyyy-MM-dd'),
                this.experienceForm.value.uid_training_center,
                this.experienceForm.getRawValue().name_of_training_center          
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