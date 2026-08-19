import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { Enable_disableFormService } from 'src/app/_common/services/common-services/enable_disableForm.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AcademySharableService } from 'src/app/_common/services/role-inner-pages-services/academy-services/academySharable.service';
import { CoachDetailListService, IDesignationList } from 'src/app/_common/services/role-inner-pages-services/academy-services/coach-detail-list.service';

@Component({
  selector: 'app-coach-detail-multiple-tag',
  templateUrl: './coach-detail-multiple-tag.component.html',
  styleUrls: ['./coach-detail-multiple-tag.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  standalone:true,
  imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent]
})
export class CoachDetailMultipleTagComponent implements OnInit {
  multiTagForm!:FormGroup
  sportDisciplineIdToAdd:any
  loader:boolean=false
  userDetails:any
  getDataByNsrsId:any;
  designationsList: IDesignationList[] = [];
  pcaCoachData:any
  employeeTypeOptions = [
    {
      type:'Regular'
    },
    {
      type:'Contract'
    },
    {
      type:'Deputation'
    },
    {
      type:'Academic Trainee'
    },
  ]

  constructor(public activeModal:NgbActiveModal, private fb:FormBuilder,private academySharableService:AcademySharableService,
    private storageService:StorageService,private alertService:AlertService,private coachDetailService:CoachDetailListService,
    private enableDisableService:Enable_disableFormService) { }

  ngOnInit() {
    console.log(this.pcaCoachData)
    this.userDetails=this.storageService.getAcademyDetails()
    //multitagging reactive formarray
    this.multiTagFormReactiveForm()
    //in case if dropdown is selected on coach detail component dropdown of sports discipline
    //console.log(this.sportDisciplineIdToAdd.disciplineToSearch);

    this.coachDetailService.getCoachDesignationList().subscribe((response: IDesignationList[]) => this.designationsList = response);
  }

  multiTagFormReactiveForm(){
    this.multiTagForm = this.fb.group({
      addMultiTagArray:this.fb.array([])
    })
    this.addMultiTagArray.push(this.AddMultiTagArrayControls())
  }

  get addMultiTagArray(): FormArray{
    return this.multiTagForm.get('addMultiTagArray') as FormArray
  }

  AddMultiTagArrayControls(): FormGroup{
    return this.fb.group({
      ki_unique_id:['',Validators.required],
      academy_detail_id:[''],
      coach_name:[''],
      designation:['',Validators.required],
      // resdentialStatus:['',Validators.required],
      date_of_joining:['',Validators.required],
      employmenttype:['',Validators.required],
      sport_detail_id:[''],
      is_pca:[0]
    })
  }

  newAddMultiTagArray(){  
    this.addMultiTagArray.push(this.AddMultiTagArrayControls())  
  }

  removeAddMultiTagArray(index:any){
    this.addMultiTagArray.removeAt(index)
  }

  nsrsId:any;
  duplicateCheck:boolean = false;
  getDataOnchangeNsrsid(event:Event,index:any){
    this.nsrsId=(event.target as HTMLInputElement)?.value
    if(this.nsrsId!=''){
      if(this.addMultiTagArray.length > 1){
        this.duplicateCheck = false;
        for(let j=0; j<index; j++){
          if((this.addMultiTagArray.at(j)?.value?.ki_unique_id)?.trim() === (this.nsrsId)?.trim()){
            this.duplicateCheck = true;
            break;
          }else{
            this.duplicateCheck = false;
          }
        }
        if(this.duplicateCheck == true){
          this.addMultiTagArray.controls[index].get('ki_unique_id')?.reset();
          this.addMultiTagArray.updateValueAndValidity();
          this.alertService.swalPopWarning("Duplicate entry is detected!");
        }else if(this.duplicateCheck == false){
          this.loader=true
          this.coachDetailService.getCoachDataByNsrsID(this.userDetails.user_id,this.nsrsId).subscribe({
            next:(res:any)=>{
              this.loader=false
              this.getDataByNsrsId=res[0]
              //console.log(this.getDataByNsrsId)
              if(this.getDataByNsrsId.academy_name==null){
                if(this.getDataByNsrsId.remark==''){
                  
                  this.setInputValues(index)
                }else{
                  this.alertService.swalPopError(this.getDataByNsrsId.remark)
                }
              }else{
                var msg=this.getDataByNsrsId.academy_name
                this.alertService.swalPopError(`Already mapped ${msg}`)
              }
            },
            error:()=>{
              console.error('error caught in athlete mapping details')
              this.loader=false
            }
          })          
        }
      }else{
        this.loader=true
      this.coachDetailService.getCoachDataByNsrsID(this.userDetails.user_id,this.nsrsId).subscribe({
        next:(res:any)=>{
          this.loader=false
          this.getDataByNsrsId=res[0]
          //console.log(this.getDataByNsrsId)
          // if(this.getDataByNsrsId.academy_name==''){
          //   this.setInputValues(index)
          // }else if(this.getDataByNsrsId.academy_name==null){
          //   if(this.getDataByNsrsId.remark==''){
          //     this.alertService.swalPopError("Mapped somewhere")
          //   }else{
          //     this.alertService.swalPopError(this.getDataByNsrsId.remark)
          //   }
          // }else if(this.getDataByNsrsId.academy_name!=''){
          //   var msg=this.getDataByNsrsId.academy_name
          //   this.alertService.swalPopError(`Already mapped ${msg}`)
          // }
          if(this.getDataByNsrsId.academy_name==null){
            if(this.getDataByNsrsId.remark==''){
              
              this.setInputValues(index)
            }else{
              this.alertService.swalPopError(this.getDataByNsrsId.remark)
            }
          }else{
            var msg=this.getDataByNsrsId.academy_name
            this.alertService.swalPopError(`Already mapped ${msg}`)
          }
        },
        error:()=>{
          console.error('error caught in athlete mapping details')
          this.loader=false
        }
      })
      }

    }else{
      this.alertService.swalPopWarning("Please enter a NSRSId")
      //console.log(this.nsrsId)
    }
  }

  setInputValues(index:any){
    // console.log(this.getDataByNsrsId)
    this.addMultiTagArray.at(index).patchValue({
      coach_name:this.getDataByNsrsId.first_name,
      sport_detail_id:this.getDataByNsrsId.sport_detail_id,
      academy_detail_id:this.userDetails.user_id
    });
    this.enableDisableService.DisableFieldFormArray(this.addMultiTagArray,index,"coach_name",true)
  }

  submitMultiAddCoach(){
    //console.log(this.multiTagForm.getRawValue().addMultiTagArray)
    if(this.multiTagForm.valid){
      for(let i of this.multiTagForm.getRawValue().addMultiTagArray){
        //console.log(i.date_of_joining)
        i.date_of_joining=i.date_of_joining.utc('dd-MM-YYYY')
      }
      this.loader=true
      this.academySharableService.saveCoachData(this.userDetails.user_id,this.multiTagForm.getRawValue().addMultiTagArray).subscribe({
        next:(res:any)=>{
          this.loader=false;
          if(res.status){
            this.alertService.swalPopSuccess(res.error)
            this.activeModal.close()
          }else{
            this.alertService.swalPopError(res.error)
          }            
        },
        error:()=>{
          console.error("error caught in AcademyCoachMapping")
          this.loader=false
        }
      })
    }else{
      this.multiTagForm.markAllAsTouched()
      //console.log("plz fill form data first")
    }
  }

}
