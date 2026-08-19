import { CommonModule, DatePipe } from '@angular/common';
import {Component, OnInit} from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/_common/material.module';
import { LoaderComponent } from '../../loader/loader.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { Observable } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import Swal from 'sweetalert2';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
@Component({
    selector:'app-admin-coach-mapping',
    templateUrl:'./admin-coach-mapping.component.html',
    styleUrls:['./admin-coach-mapping.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
    providers:[
        {provide:DateAdapter, useClass:MomentDateAdapter, deps:[MAT_DATE_LOCALE]},
        {provide:MAT_DATE_FORMATS, useValue:MY_DATE_FORMATS},
        DatePipe
    ]    
})

export class AdminCoachMappingComponent implements OnInit{
    otherCoachForm!:FormGroup;
    loader:boolean = false;
    designation$:Observable<any> = new Observable()
    jobTypes$:Observable<any> = new Observable();
    userDetails:any;

    constructor(public activeModal:NgbActiveModal, private fb:FormBuilder,
        private innerPagesSharableService:SharableService,
        private storageService:StorageService,
        private datePipe:DatePipe){}
    ngOnInit(): void {
        this.userDetails = this.storageService.getUserDetails();
       this.otherCoachForm = this.fb.group({
        nsrsid:['',[Validators.required]],
        name:[{value:'', disabled:true},[]],
        designation:['',[Validators.required]],
        job_type:['',[Validators.required]],
        joining_date:[null],
        official_detail_id:['']
       }) 
       this.getStakeHolderDesignations();
       this.getStakeHolderJobTypes();
    }

    getStakeHolderDesignations(){
      this.designation$ =  this.innerPagesSharableService.getDesignation('coach')
    }
    getStakeHolderJobTypes(){
        this.jobTypes$ = this.innerPagesSharableService.getStakeHolderJobType()
    }

    get f(){
        return this.otherCoachForm.controls;
    }

    changeNSRSID(event:any){
        if(event.target.value !=''){
            this.loader = true
            this.innerPagesSharableService.getOtherCoachDetail(event.target.value).subscribe({
                next: async (response:any)=>{
                    this.loader = false
                    if(response != null){
                        this.otherCoachForm.get('name')?.setValue(response?.name)
                        this.otherCoachForm.get('official_detail_id')?.setValue(response?.official_detail_id)
                    }else{
                     let swalRef = await  this.swalAlert(`Cannot add this coach!`,'warning');
                     if(swalRef.isConfirmed){
                        this.otherCoachForm.get('nsrsid')?.reset()
                        this.otherCoachForm.get('name')?.reset()
                        this.otherCoachForm.get('official_detail_id')?.reset()
                     }
                    }
                },
                error:(err)=>{
                    this.loader = false;
                    console.error(err)
                }
            })
        }else{
            this.otherCoachForm.get('name')?.reset()
        }
    }

    swalAlert(textMsg:string,iconText:any){
        return Swal.fire({
            position: 'center',
            icon: iconText,
            text: textMsg,
            showConfirmButton:true
        })
    }

    save(){
        let official_detail_id = this.otherCoachForm.value?.official_detail_id;
        let designation = this.otherCoachForm.value?.designation;
        let joining_date = this.datePipe.transform(this.otherCoachForm.value?.joining_date,'yyyy-MM-dd') ;
        let job_type = this.otherCoachForm.value?.job_type;
        let mapped_user = this.userDetails.user_id;

        this.loader = true
        this.innerPagesSharableService.MapOtherCoaches(official_detail_id,designation,joining_date,mapped_user,job_type).subscribe({
            next:(response)=>{
                this.loader = false;
                if(response){
                    this.activeModal.close(response);
                    this.swalAlert('Mapped successfully!','success')
                }
            },
            error:(err)=>{
                this.loader = false;
                console.error(err)
            }
        })
    }
}