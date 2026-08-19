import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Athelete_insuranceService } from '../../../_common/services/innerPagesServices/athelete_insurance.service';
import { AthleteService } from '../../../_common/services/innerPagesServices/athlete.service';
import { NewOnlyCharactervalidator, OnlyNumbervalidator } from '../../../_common/validators/only-character.validator';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {MY_DATE_FORMATS} from '../../../_common/models/my_dateFormat'
import { CommonModule, DatePipe } from '@angular/common';
import { CoachInsuranceService } from '../../../_common/services/innerPagesServices/coach-insurance.service';
import { ReimbursementDetailsComponent } from '../../../_common/modal-window/reimbursement-details/reimbursement-details.component';
import { SharableService } from '../../../_common/services/innerPagesServices/innerpagesSharable.service';
import { StorageService } from '../../../_common/services/common-services/storage.service';
import { AlertService } from '../../../_common/services/common-services/alert.service';
import { MaterialModule } from 'src/app/_common/material.module';
import { LoaderComponent } from '../../loader/loader.component';
import { environment } from 'src/environments/environment';




export interface PeriodicElement {
  amount: number;
  position: number;
  date: string;
  isReleased: string;
  reason:string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, amount: 12345, date: '10-12-2022', isReleased: 'yes',reason:'2345335'},
];

@Component({
  selector: 'app-athleteInsuranceSuccess',
  templateUrl: './athleteInsuranceSuccess.component.html',
  styleUrls: ['./athleteInsuranceSuccess.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ],
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent]
})

export class AthleteInsuranceSuccessComponent implements OnInit {
  displayedColumns: string[] = ['sn', 'amount', 'date', 'isReleased', 'reason', 'remove'];
  dataSource = ELEMENT_DATA;
  athleteData:any=[];
  userDetails:any
  insuranceForm1:any;
  insuranceList:any
  dateinsuredFrom:any
  amountSum:any=0;
  playerdetailId:any;
  dropdownOption:any
  tag_id:any;
  public moment = moment
  insuredFromDate1:any
  ReimbursementDetailsData:any;
  getAthleteInsuranceData:any;
  playerInsuranceId:any
  athleteInsuranceHistoryToMap:any
  athleteInsuranceHistoryToMapLength:any
  athleteInsuranceHistoryRes:any=[]
  insuranceHistroySumReimbursement:any
  athleteInsuranceHistoryResLength:any
  menuName:any
  coachData:any
  coachGetData:any
  coachDataInsuranceHistory:any=[]
  coachDataInsuranceHistoryLength:any
  insurancePermissionData:any
  insuranceSuccessFileUploadRes:any
  insuranceSuccessFileUploadUrl:any;
  innerLoaderMainData:boolean = false;
  staticFileUrl=environment.fileUrl
  
  constructor(public activeModal: NgbActiveModal,private athleteService:AthleteService,
    private fb:FormBuilder,private modal:NgbModal,
    private sharableService:SharableService,
    private atheleteInsuranceService:Athelete_insuranceService,
    private coachInsuranceService:CoachInsuranceService,
    private storageService:StorageService,private swalAlert:AlertService) {}

  ngOnInit() {

    this.userDetails=this.storageService.getUserDetails()
    this.insuranceReactiveForm()
    this.shift_Between_Coach_Athlete()    
  }
  
  private DisableField(formControlName:string,disableVal?:boolean){
    this.insuranceForm1.get(formControlName)?.disable({onlySelf:disableVal})
  }

  insuranceReactiveForm(){
    this.insuranceForm1 = this.fb.group({
      insurer:['', Validators.required,],
      insurerName:['',Validators.compose([Validators.required,NewOnlyCharactervalidator]) ],
      policynumber:['',Validators.required],
      insuredFromDate:['',Validators.required],
      insuredToDate:['',Validators.required],
      nominee:['',Validators.compose([Validators.required,NewOnlyCharactervalidator])],
      sumInsured:['',Validators.compose([Validators.required,OnlyNumbervalidator])],
      reason1:[''],
      file:[''],
      sumReimburesement:this.fb.array([]),
    })   
    this.sumReimburesement.push(this.newSumReimbresement());  
  }

  shift_Between_Coach_Athlete(){
    if(this.menuName=='athlete'){
      this.athleteInsuranceHistory()
    }

    if(this.menuName=='coach'){
      this.coachInsuranceSuccess()
    }
  }

  get insuranceForm1Control(){
    return this.insuranceForm1.controls
  }

  get sumReimburesement() : FormArray {
    return this.insuranceForm1.get("sumReimburesement") as FormArray
  }

  newSumReimbresement(): FormGroup {
    return this.fb.group({
      amount: ['',OnlyNumbervalidator],
      date: [''],
      isReleased:[''],
      reason:['']
    })
  }

  verifyDocumentFileExtension(files:any){
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile 
  }

  insuranceFileUpload(files: any) {
    if (files.length === 0){
      this.insuranceForm1.get('file').setValue('')
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" ) {
      // if (extFile == "pdf") {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("file",files[i], files[i].name);
          formData.append("path","documents\\insurancedocument")
          formData.append("uploadType","1")
          // formData.append("academy_detail_id",this.academy_detail_id)
        }
        //serivce calling
        this.innerLoaderMainData = true;
        this.sharableService.uploadFile(formData).subscribe(res=>{
          this.innerLoaderMainData = false;
          this.insuranceSuccessFileUploadRes=res;
          if(this.insuranceSuccessFileUploadRes.isUploaded==true){
            this.swalFileUploadSuccess()
            // this.insuranceForm1.controls['file'].setValue=this.insuranceSuccessFileUploadRes.filedataList[0].filepath
            this.insuranceSuccessFileUploadUrl=this.staticFileUrl+this.insuranceSuccessFileUploadRes.filedataList[0].filePath
          }else{
            var errMsg
            if(this.insuranceSuccessFileUploadRes.errorMsg){
              errMsg=this.insuranceSuccessFileUploadRes.errorMsg
            }else{
              errMsg='Failed Please Try Again!'
            }
            this.insuranceForm1.get('file').setValue('')
            this.swalFileUploadError(errMsg)
          }
        },(error)=>{
          console.error("error caught in upload file")
          this.innerLoaderMainData=false
        })

      } 
      else {
        this.insuranceForm1.get('file').setValue('')
        Swal.fire({
          icon: 'error',
          // title: 'Oops...',
          text: 'Only jpg, jpeg, png files is allowed!',
        })
      }
      
      
    }
  }

  swalFileUploadSuccess(){
    Swal.fire({
      position: 'center',
      icon: 'success',
      text: `File Uploaded`,
      showConfirmButton: false,
      timer:1500
    });
  }
  
  swalFileUploadError(errMsg:any){
    Swal.fire({
      position: 'center',
      icon: 'error',
      text: errMsg,
      showConfirmButton: false,
      timer:1500
    });
  }


  coachInsuranceSuccess(){
    this.ReimbursementDetailsData = this.coachGetData[0].officialInsurance_ReimbursementHistories
    this.setInputValue()
    this.coachInsuranceHistory()
  }

  athleteInsuranceHistory(){
    this.DisableField('reason1',true)
    this.innerLoaderMainData = true;
    this.atheleteInsuranceService.getInsuranceHistory(this.athleteData.player_detail_id).subscribe({
      next:(res:any)=>{
        this.innerLoaderMainData = false;
        this.athleteInsuranceHistoryToMap=res[0]
        this.ReimbursementDetailsData=this.athleteInsuranceHistoryToMap.athleteInsurance_ReimbursementHistory
        for(let i in res){
          if(i=='0'){
          }
          else{
            this.athleteInsuranceHistoryRes.push(res[i])
          }    
        }
        this.athleteInsuranceHistoryToMapLength=this.athleteInsuranceHistoryToMap?.length 
        this.athleteInsuranceHistoryResLength=this.athleteInsuranceHistoryRes?.length
        this.setInputValue()
      },
      error:()=>{
        console.error("error caught ingetting athlete insurance history")
        this.innerLoaderMainData=false
      }
    })
  }

  reimbursementModal(menuName:any,insuranceData:any,commonData:any){
    const modalRefInsurance = this.modal.open(ReimbursementDetailsComponent, { size: 'xl', centered: true,keyboard:false });
    modalRefInsurance.componentInstance.insuranceData = insuranceData;
    modalRefInsurance.componentInstance.commonData=commonData
    modalRefInsurance.componentInstance.menuName=menuName
    // modalRefInsurance.result.then(()=>{})
  }

  coachInsuranceHistory(){
    this.innerLoaderMainData = true;
    this.coachInsuranceService.coachGetHistoryData(this.coachData.official_detail_id).subscribe(res=>{
      this.innerLoaderMainData = false;
      var respo:any=res
      
      for(let i in respo){
        if(i=='0'){

        }else{
          this.coachDataInsuranceHistory.push(respo[i])
        }       
      }
      this.coachDataInsuranceHistoryLength=this.coachDataInsuranceHistory?.length
    },(error)=>{
      console.error("error caught in coach history")
      this.innerLoaderMainData=false
    })
  }

  setInputValue(){
    this.innerLoaderMainData = true;
    this.athleteService.insuranceList().subscribe({
      next:(res)=>{
        this.innerLoaderMainData = false;
        this.insuranceList=res
        if(this.menuName=='athlete'){
          for(let i of this.insuranceList){
            if(i.text==this.athleteInsuranceHistoryToMap.insurer){
              this.dropdownOption=i.value
            }
          }          
          this.insuranceForm1.controls.insurerName.setValue(this.athleteData.ath_Name);
          this.DisableField('insurerName',true)

          this.insuranceSuccessFileUploadUrl=this.staticFileUrl+ this.athleteInsuranceHistoryToMap.insurance_document
          this.insuranceForm1.controls.policynumber.setValue(this.athleteInsuranceHistoryToMap.policy_number);
          this.insuranceForm1.controls.nominee.setValue(this.athleteInsuranceHistoryToMap.nominee);
          this.insuranceForm1.controls.sumInsured.setValue(this.athleteInsuranceHistoryToMap.sum_insured);
          this.insuranceForm1.controls.reason1.setValue(this.athleteInsuranceHistoryToMap.reason);
          this.insuranceForm1.patchValue({
            insuredFromDate: moment(this.athleteInsuranceHistoryToMap.insured_period_from),
            insuredToDate:moment(this.athleteInsuranceHistoryToMap.insured_period_to)
          })
        }

        if(this.menuName=='coach'){
          // this.coachDataInuranceHistory=
          for(let i of this.insuranceList){
            if(i.value==this.coachGetData[0].insurer){
              this.dropdownOption=i.value
            }
          }
          this.insuranceForm1.controls.insurerName.setValue(this.coachGetData[0].insuredPerson);
          // this.insuranceForm1.controls['file']=this.coachGetData[0].filepath
          this.insuranceSuccessFileUploadUrl=this.staticFileUrl + this.coachGetData[0].filepath
          this.insuranceForm1.controls.policynumber.setValue(this.coachGetData[0].policyNo);
          this.insuranceForm1.controls.nominee.setValue(this.coachGetData[0].nominee);
          this.insuranceForm1.controls.sumInsured.setValue(this.coachGetData[0].sumInsured);
          this.insuranceForm1.controls.reason1.setValue(this.coachGetData[0].reason);
          this.insuranceForm1.patchValue({
            insuredFromDate: moment(this.coachGetData[0].period_from),
            insuredToDate:moment(this.coachGetData[0].period_to)
          })
        }
      },
      error:()=>{
        console.error("error caught in insurance list")
        this.innerLoaderMainData=false
      }
    })
  }

  insuredFromDate(date:any){
    this.dateinsuredFrom=date
  }

  addMoreForm(){
    this.sumReimburesement.push(this.newSumReimbresement());
  }

  insuranceRemovedata(index:any){
    this.sumReimburesement.removeAt(index);
  }

  amt:any=0

  submitInsurance(){
    for(let data of this.ReimbursementDetailsData){
      this.amountSum+=parseFloat(data.amount)
    }
    var arrData=this.insuranceForm1.value.sumReimburesement
    for(let amount of arrData){
      this.amt= (amount.amount)
      this.amountSum=parseFloat(this.amountSum) + parseFloat(this.amt)
    }
    if(this.amountSum>this.insuranceForm1.value.sumInsured)
    {
      this.swalAlert.swalPopWarning("Amount Sum can not be more than the Sum Insured")
    }else{        
      if(this.menuName=='athlete'){
        this.insuranceForm1.controls['reason1'].setValidators([Validators.required])
        if(this.insuranceForm1.valid){
          var filePath
          if(this.insuranceSuccessFileUploadRes){
            filePath=this.insuranceSuccessFileUploadRes.filedataList[0].filePath
          }else{
            filePath=this.athleteInsuranceHistoryToMap.insurance_document
          }
          this.innerLoaderMainData=true
          this.atheleteInsuranceService.saveAthleteSuccessInsuranceDetails(this.athleteInsuranceHistoryToMap.player_insurance_id,
            this.athleteData.player_detail_id,this.insuranceForm1.getRawValue(),this.userDetails.user_id,this.userDetails.role_id,filePath).subscribe({
            next:(res)=>{
              if(res){
                this.swalAlert.swalPopSuccess('Updated SuccessFully!')
              }else{
                this.swalAlert.swalPopError('Something Went Wrong!')
              }
              this.innerLoaderMainData=false
            },
            error:()=>{
              console.error('error caught in saving athlete insurance')
              this.innerLoaderMainData=false
            }
          })
          this.activeModal.close()
        }else{
          this.insuranceForm1.markAllAsTouched()
        }
      }
  
      if(this.menuName=='coach'){
        if(this.insuranceForm1.valid){
          var file;
          this.innerLoaderMainData = true;
          if(this.insuranceSuccessFileUploadRes==undefined){
            file=this.coachGetData[0].filepath
          }else{
            file=this.insuranceSuccessFileUploadRes.filedataList[0].viewPath
          }
          this.coachInsuranceService.coachSaveInsuranceTagging(this.insuranceForm1.value,this.coachData.insurance_tagId,this.userDetails.user_id,file).subscribe(res=>{
            this.innerLoaderMainData = false;
            if(res==true){
              this.activeModal.close('ram')
              Swal.fire({
                position: 'center',
                icon: 'success',
                text: 'Insured successfully!',
                showConfirmButton: true,
                // timer: 2000
              });
            }else{
              Swal.fire({
                position: 'center',
                icon: 'error',
                text: 'Request can not be processed!',
                showConfirmButton: false,
                timer: 2000
              });
            }
          },()=>{
            console.error("error caught in save coach insurance tagging")
            this.innerLoaderMainData=false
          })
        }else{
            this.insuranceForm1.markAllAsTouched()
        }
      } 
    }
    this.amountSum=0
  }

}
