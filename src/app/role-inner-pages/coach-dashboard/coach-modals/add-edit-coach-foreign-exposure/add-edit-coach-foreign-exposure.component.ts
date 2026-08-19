import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, first, map } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { SharableService } from "src/app/_common/services/innerPagesServices/innerpagesSharable.service";
import { CoachAchievementService } from "src/app/_common/services/role-inner-pages-services/coach-services/coach-achievement.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-add-edit-coach-foreign-exposure',
    templateUrl:'./add-edit-coach-foreign-exposure.component.html',
    styleUrls:['./add-edit-coach-foreign-exposure.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class AddEditCoachForeignExposureComponent implements OnInit{
    experienceForm!:FormGroup
    loader:boolean = false;
    userDetails:any;
    editData:any;
    designation$:Observable<any> = new Observable();
    maxDate:any;
    countryList:any
    filteredCountryList$:Observable<any> = new Observable();


    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,private storageService:StorageService,
        private alertService:AlertService, private datePipe:DatePipe,private sharableService:SharableService,
        private coachAchievementService:CoachAchievementService){}

    ngOnInit(): void {
        // console.log(this.editData);
        this.maxDate = new Date()
        this.getDesignation();
        this.userDetails=this.storageService.getUserDetails();
        this.experienceForm = this.fb.group({
            designation:['', [Validators.required]],            
            category_of_player:['', [Validators.required]],            
            from_date:['', [Validators.required]],            
            to_date:['', Validators.required],
            exposure:['', Validators.required],
            country:['', [Validators.required, this.countryValidator.bind(this)]],
            id:['']            
        });
        if(this.editData !=null){
            this.experienceForm.patchValue({
                designation:this.editData.designation,
                category_of_player:this.editData.category_of_player,
                from_date:this.editData.from_date,
                to_date:this.editData.to_date,
                exposure:this.editData.exposure,
                country:this.editData.country,
                id:this.editData.id
            })
        }
        this.sharableService.countryMasterList().pipe(first()).subscribe({
            next:(response)=>{
                this.countryList = response;
                this.experienceForm.get('country')?.updateValueAndValidity();
            },
            error:(err)=>{
                console.error(err)
            }
        })

        this.filteredCountryList$ = this.experienceForm.get('country')!.valueChanges.pipe(map(value => this._countryFilter(value || '')));
             
    }
    getDesignation(){
       this.designation$ = this.sharableService.getDesignation('coach')
    }
    changeCampDate(event:any){
        //console.log(event)
        this.experienceForm.get('to_date')?.reset(null)
    }
    private _countryFilter(value: string): string[] {
        const filterValue = value.toLowerCase();    
        return this.countryList.filter((option:any) => option.country_name.toLowerCase().includes(filterValue));
    }
    private countryValidator(control: AbstractControl): ValidationErrors | null {
        return control.value && !this.countryList?.some((item: any) => item.country_name === control.value)
        ? {countryError: true}
        : null;
      }

    save(){
        const official_detail_id = this.userDetails.user_id;
        //console.log(this.experienceForm.value)
        if(this.experienceForm.value.id == '') this.experienceForm.value.id = 0
        if(this.experienceForm.valid){
            this.loader = true;
            this.coachAchievementService.saveCoachForeignExposure(
                this.experienceForm.value.id,
                official_detail_id,
                this.experienceForm.value.designation,
                this.experienceForm.value.category_of_player,
                this.datePipe.transform(this.experienceForm.value.from_date,'yyyy-MM-dd'),
                this.datePipe.transform(this.experienceForm?.value?.to_date,'yyyy-MM-dd'),
                this.experienceForm.value.exposure,
                this.experienceForm.value.country          
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