import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { Enable_disableFormService } from 'src/app/_common/services/common-services/enable_disableForm.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { SportscientistDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/sportscientist-detail-list.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';

@Component({
  selector: 'app-sport-scientist-detail-multiple-tag',
  templateUrl: './sport-scientist-detail-multiple-tag.component.html',
  styleUrls: ['./sport-scientist-detail-multiple-tag.component.css'],
  providers: [
    //{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  standalone:true,
  imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent]

})
export class SportScientistDetailMultipleTagComponent implements OnInit, OnDestroy {

  multiTagForm!:FormGroup;
  disciplineToAddID:any;
  userDetails:any;
  loader:boolean = false;
  dataByNsrsid:any;
private  subscription:Subscription | undefined;
designationList:Array<any> = [];

  constructor(public activeModal:NgbActiveModal, private fb:FormBuilder,private storageService:StorageService,
    private sportscientistDetailService:SportscientistDetailListService,private alertService:AlertService,
    private enableDisableService:Enable_disableFormService,
    private sharableService:SharableService
  ) { }

  ngOnInit() {
    this.getStakeHolderDesignations();
    this.userDetails=this.storageService.getAcademyDetails()
    this.multiTagForm = this.fb.group({
      addMultiTagArray:this.fb.array([])
    })
    this.addMultiTagArray.push(this.AddMultiTagArrayControls());
    //console.log(this.disciplineToAddID)
  }
  getStakeHolderDesignations(){
    this.loader = true
    this.sharableService.getDesignation('Support Staff').subscribe({
      next:(response:any)=>{
        this.loader = false;
        this.designationList = response
      },
      error:(err)=>{
        this.loader = false
      }
    })
  }

  get addMultiTagArray(): FormArray{
    return this.multiTagForm.get('addMultiTagArray') as FormArray
  }
  AddMultiTagArrayControls(): FormGroup{
    return this.fb.group({
      ki_unique_id:['',Validators.required],
      coach_name:[''],
      date_of_joining:['',Validators.required],
      academy_detail_id:[''],
      sport_detail_id:[''],
      designation:[''],
      employmenttype:['', Validators.required]
    })
  }
  newAddMultiTagArray(){  
    this.addMultiTagArray.push(this.AddMultiTagArrayControls())  
  }
  removeAddMultiTagArray(index:any){
    this.addMultiTagArray.removeAt(index)
  }
  changeNSRSID(event:any,index:any){
   let duplicateCheck = false;
   let nsrsid = (event.target as HTMLInputElement)?.value
    //console.log(this.disciplineToAddID,nsrsid);    
    if(nsrsid != ''){
      if(this.addMultiTagArray.length > 1){
        for(let j =0 ; j<index ; j++){
          if((this.addMultiTagArray.at(j).value.ki_unique_id)?.trim() == nsrsid?.trim()){
            duplicateCheck = true;
            break;
          }else{
            duplicateCheck = false
          }
        }
        if(duplicateCheck == true){
          //console.log('matches');
          this.addMultiTagArray.controls[index].get('ki_unique_id')?.reset();
          this.alertService.swalPopWarning("Duplicate entry is detected!");
        }else if(duplicateCheck == false){
          this.loader = true
        this.subscription =  this.sportscientistDetailService.academySportScientistMappingDetail(this.disciplineToAddID,nsrsid).subscribe({
          next:(res:any)=>{
            this.loader = false
            this.dataByNsrsid = res;
            if(this.dataByNsrsid.academy_name == null){
              if(this.dataByNsrsid.remark == ''){
                this.setmultiTagFormValues(index)
              }else{
                this.alertService.swalPopWarning(this.dataByNsrsid.remark);
                this.addMultiTagArray.controls[index].get('ki_unique_id')?.reset();
              }
            }
            
          },
          error:()=>{
            console.error('error caught in AcademySportScientistMappingDetail');
            this.loader = false
          }
        })

        }
      }else{
        this.loader = true
        this.subscription =  this.sportscientistDetailService.academySportScientistMappingDetail(this.disciplineToAddID,nsrsid).subscribe({
          next:(res:any)=>{
            this.loader = false
            this.dataByNsrsid = res;
            // if(res.length > 0){
            //   if(this.dataByNsrsid.academy_name == null){
            //     this.setmultiTagFormValues(index)
            //   }else{
            //     const msg = nsrsid + ' is already mapped with '+ this.dataByNsrsid.academy_name;
            //     this.alertService.swalPopWarning(msg);
            //     this.addMultiTagArray.controls[index].get('coach_name')?.reset()
            //   }
            // }else{
            //   const msg = nsrsid + ' is not valid'
            //   this.alertService.swalPopError(msg)
            // }
            if(this.dataByNsrsid.academy_name == null){
              if(this.dataByNsrsid.remark == ''){
                this.setmultiTagFormValues(index)
              }else{
                this.alertService.swalPopWarning(this.dataByNsrsid.remark);
                this.addMultiTagArray.controls[index].get('ki_unique_id')?.reset();                
              }
            }
            
          },
          error:()=>{
            this.loader = false
            console.error('error caught in AcademySportScientistMappingDetail');
          }
        })

      }    
    }else{
      const msg = "Please Enter NSRS ID";
      this.loader = false
      this.alertService.swalPopWarning(msg);
      this.addMultiTagArray.controls[index].get('coach_name')?.reset()
    }
  }

  setmultiTagFormValues(index:any){
    this.addMultiTagArray.at(index).patchValue({
      coach_name:this.dataByNsrsid.first_name,
      academy_detail_id:this.userDetails.user_id,
      sport_detail_id:this.dataByNsrsid.sport_detail_id,
      designation:""
    })
    this.enableDisableService.DisableFieldFormArray(this.addMultiTagArray,index,'coach_name',true)
  }

  submitMultiTagged(){   
    //console.log('dataByNsrsid',this.dataByNsrsid)
     
    if(this.multiTagForm.valid){
      //console.log(this.multiTagForm.getRawValue().addMultiTagArray)
      for(let i of this.multiTagForm.getRawValue().addMultiTagArray){
        i.date_of_joining=i.date_of_joining.utc('dd-MM-YYYY')
      }
      this.loader = true
    this.subscription =  this.sportscientistDetailService.saveSportScientistAddMultipleData(this.userDetails.user_id,this.multiTagForm.getRawValue().addMultiTagArray)
      .subscribe({
        next:(res:any)=>{
          //console.log(res)
          this.loader = false;
            this.alertService.swalPopSuccess(res.error)
            this.activeModal.close();
        },
        error:()=>{
          console.error('error caught in AcademySportScientistMapping');
          this.loader = false
        }
      })
      
    }else{
      this.multiTagForm.markAllAsTouched()
    }
  }

  ngOnDestroy(): void {
   this.subscription?.unsubscribe();
  }
  

}
