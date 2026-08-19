import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { EquipmentProcurementComponent } from '../equipmentProcurement/equipmentProcurementModal.component';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';

@Component({
  selector: 'app-pcaEdit',
  templateUrl: './pcaEdit.component.html',
  styleUrls: ['./pcaEdit.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent]
})
export class PcaEditComponent implements OnInit {

  multiEquipmentTagForm!:FormGroup;
  userDetails!:IUserDetails

  pcaModalData:any;
  loader:Boolean=false
  mainloader:Boolean=false

  unsubscribe: Subject<any> = new Subject();

  constructor(private _storageService:StorageService,private fb:FormBuilder,public activeModal:NgbActiveModal,
    private _equipmentProcurementService:EquipmentProcurementService,private _alertService:AlertService) { }

  ngOnInit() {
    this.userDetails=this._storageService.getUserDetails()

    this.multiEquipmentTagForm = this.fb.group({
      addMultiTagArray:this.fb.array([])
    });

    this.addMultiTagArray.push(this.AddMultiTagArray(this.pcaModalData));
  }

   
  get addMultiTagArray(): FormArray{
    return this.multiEquipmentTagForm.get('addMultiTagArray') as FormArray
  }
  
  AddMultiTagArray(modal:any):FormGroup{
    return this.fb.group({
      kuid:[this.pcaModalData.kiud ? this.pcaModalData.kiud : '0',Validators.required],
      name:[{value:modal.data.pcA_NAME,disabled:true},Validators.required],
      discipline:[{value:modal.data.desipline,disabled:true},Validators.required],
      aadharStatus:[this.getAadharStatus(modal.data.pcA_AADHAR_VALIDATION),Validators.required],
      joiningDate:[{value:modal.data.pcA_JOINING_DATE,disabled:true},Validators.required],
      pca_kiuid: [{value:modal.data.pcA_KIUD,disabled:true},Validators.required],
      eligibility_criteria:[modal.data.eligibility_criteria,Validators.compose([Validators.required,Validators.maxLength(200)])],
      reason: [modal.data.reason,Validators.compose([Validators.maxLength(200)])],
      userid: this.userDetails.user_id,
      roleid: this.userDetails.role_id,
      id: [modal.data.pst_id]
    })
  }

  getAadharStatus(data:any){
    if(data){
      return {value:'N/A',disabled:true}
    }
    return {value:'N/A',disabled:true}
  }


  submitMultiTagged(){
    let payload=
      {
      kuid: "",
      pca_kiuid: "",
      eligibility_criteria: "",
      reason: "",
      userid: 0,
      roleid: 0,
      id: 0
    }
    for(let i of this.multiEquipmentTagForm.getRawValue().addMultiTagArray){
      payload.kuid=i.kuid
      payload.pca_kiuid=i.pca_kiuid
      payload.eligibility_criteria=i.eligibility_criteria
      payload.reason=i.reason
      payload.userid=i.userid
      payload.roleid=i.roleid
      payload.id=i.id
    }
    if(this.multiEquipmentTagForm.valid){
      this.loader=true
      this._equipmentProcurementService.savePCAUpdate(payload).pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (response: any) => {
          this.loader=false
          if(response.status){
            this._alertService.swalPopSuccess(`${response.message}`)
            this.activeModal.close({
              saved:true,
            })
          }else{
            this._alertService.swalPopError(`${response.message}`)
          }
        },
        error: (error:any) => {
          this.loader=false
          if(error?.error?.code==200){
            if(error?.error?.message){
              this._alertService.swalPopError(`${error.error.message}`)
            }
          }
        }
      });
   }else{
    this.multiEquipmentTagForm.markAllAsTouched();
   }   
  }

 

}
