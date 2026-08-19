import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AthleteService } from '../../../_common/services/innerPagesServices/athlete.service';
import {MY_DATE_FORMATS} from '../../../_common/models/my_dateFormat'
import { NewOnlyCharactervalidator, OnlyNumbervalidator } from '../../../_common/validators/only-character.validator';
import { Athelete_insuranceService } from '../../../_common/services/innerPagesServices/athelete_insurance.service';
import { CoachInsuranceService } from '../../../_common/services/innerPagesServices/coach-insurance.service';
import { ReimbursementDetailsComponent } from '../../../_common/modal-window/reimbursement-details/reimbursement-details.component';
import { SharableService } from '../../../_common/services/innerPagesServices/innerpagesSharable.service';
import { AlertService } from '../../../_common/services/common-services/alert.service';
import { StorageService } from '../../../_common/services/common-services/storage.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
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
  selector: 'app-athlete-insurance',
  templateUrl: './athlete-insurance.component.html',
  styleUrls: ['./athlete-insurance.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,LoaderComponent,MaterialModule,]
})

export class AthleteInsuranceComponent implements OnInit {
  displayedColumns: string[] = ['sn', 'amount', 'date', 'isReleased', 'reason', 'remove'];
  dataSource = ELEMENT_DATA;
  athleteData:any=[];
  userDetails:any
  insuranceForm1:any;
  insuranceList:any
  dateinsuredFrom:any
  amountSum:any=0;
  insuranceHistoryRes:any
  insuranceHistoryResLength:any
  menuName:any
  coachData:any
  coachHistory:any=[]
  coachHistoryLength:any
  insurancePermissionData:any
  insuranceFileUploadRes:any
  insuranceFileUploadUrl:any
  innerLoaderMainData:boolean = false;
  staticFileUrl=environment.fileUrl

  constructor(public activeModal: NgbActiveModal,private athleteService:AthleteService,
    private fb:FormBuilder,private atheleteInsuranceService:Athelete_insuranceService,
    private coachInsuranceService:CoachInsuranceService,
    private modal:NgbModal,private sharableService:SharableService,
    private alertService:AlertService, private _storageService:StorageService) {}

  ngOnInit() {
    this.insuranceReactiveForm()
    this.userDetails=this._storageService.getUserDetails()
    this.insurerList()
  }

  insuranceReactiveForm(){
    this.insuranceForm1 = this.fb.group({
      insurer:['', Validators.required,],
      insurerName:['',Validators.required ],
      policynumber:['',Validators.required],
      insuredFromDate:['',Validators.required],
      insuredToDate:['',Validators.required],
      nominee:['',Validators.compose([Validators.required,NewOnlyCharactervalidator])],
      sumInsured:['',Validators.compose([Validators.required,OnlyNumbervalidator])],
      reason1:['',Validators.required],
      file:['',Validators.required],
      sumReimburesement:this.fb.array([]),
    })
    this.sumReimburesement.push(this.newSumReimbresement());
  }

  private DisableField(formControlName:string,disableVal?:boolean){
    this.insuranceForm1.get(formControlName)?.disable({onlySelf:disableVal})
  }

  insurerList(){
    // console.log('menuName' + this.menuName)
    this.innerLoaderMainData = true;
    this.athleteService.insuranceList().subscribe({
      next:(res)=>{
        this.innerLoaderMainData = false;
        this.insuranceList=res
        if(this.menuName=='athlete'){
          this.insuranceForm1.controls.insurerName.setValue(this.athleteData.ath_Name);
          this.DisableField('insurerName',true)
          this.athleteInsuranceHistory()
        }
    
        if(this.menuName=='coach'){
          this.insuranceForm1.controls.insurerName.setValue(this.coachData.full_name);
          this.coachInsuranceHistory()
        }
      },
      error:()=>{
        console.error("error caught in Insurance List")
        this.innerLoaderMainData=false
      }
    })

    if(this.userDetails.role_id == 47){
      this.insuranceForm1.controls['reason1'].setValue('National Camper')

    }else if(this.userDetails.role_id == 29 || this.userDetails.role_id ==40){
      this.insuranceForm1.controls['reason1'].setValue('Athlete General Insurance')
    }else {
      this.insuranceForm1.controls['reason1'].setValue(' ')
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


  athleteInsuranceHistory(){
    this.innerLoaderMainData = true;
    this.atheleteInsuranceService.getInsuranceHistory(this.athleteData.player_detail_id).subscribe({
      next:(res)=>{
        this.innerLoaderMainData = false;
        this.insuranceHistoryRes=res
        this.insuranceHistoryResLength=this.insuranceHistoryRes.length
      },
      error:()=>{
        console.error("error caught in Insurance History")
        this.innerLoaderMainData=false
      }
    })
  }

  verifyDocumentFileExtension(files:any){
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile 
  }

  verifyFileSize(files:any){
    var fileSize = files[0].size
    return fileSize
  }

  insuranceFileUpload(files: any) {
    if (files.length === 0){
      this.insuranceForm1.get('file').setValue('')
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf" ) {
      // if (extFile == "pdf") {
        var fileSize=this.verifyFileSize(files)
        if(fileSize<=500000){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("path","documents\\UploadJoining")
            formData.append("uploadType","3")
            // formData.append("academy_detail_id",this.academy_detail_id)
          }
          //serivce calling
          this.innerLoaderMainData = true;
          this.sharableService.uploadFile(formData).subscribe(res=>{
            this.innerLoaderMainData = false;
            this.insuranceFileUploadRes=res;
            if(this.insuranceFileUploadRes.isUploaded==true){
              this.swalFileUploadSuccess()
              this.insuranceForm1.controls['file'].setValue= this.insuranceFileUploadRes.filedataList[0].filePath
              this.insuranceFileUploadUrl=environment.fileUrl + this.insuranceFileUploadRes.filedataList[0].filePath
              
            }else{
              var errMsg
              if(this.insuranceFileUploadRes.errorMsg){
                errMsg=this.insuranceFileUploadRes.errorMsg
              }else{
                errMsg='Failed Please Try Again!'
              }
              this.swalFileUploadError(errMsg)
            }
          },()=>{
            console.error("error caught in upload file ")
            this.innerLoaderMainData=false
          })
          }else{
            this.insuranceForm1.get('file').setValue('')
            this.alertService.swalPopWarning("File Size must be Below 500kb")
          }
        } 
        else {
          this.insuranceForm1.get('file').setValue('')
          this.alertService.swalPopError('Only jpg, jpeg, png files is allowed!')
        }
    }
  }

  swalFileUploadSuccess(){
    this.alertService.swalPopSuccessTimer("File Uploaded")
  }
  
  swalFileUploadError(errMsg:any){
    this.alertService.swalPopErrorTimer(errMsg)
  }

  coachInsuranceHistory(){
    this.innerLoaderMainData = true;
    this.coachInsuranceService.coachGetHistoryData(this.coachData.official_detail_id).subscribe(res=>{
      this.innerLoaderMainData = false;
      var respo:any=res
      
      for(let i in respo){
        // console.log(respo[i])
        if(i=='0'){

        }else{
          this.coachHistory.push(respo[i])
        }       
      }
      this.coachHistoryLength=this.coachHistory?.length
    
    },(error)=>{
      console.error("error caught in coach history")
      this.innerLoaderMainData=false
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

  reimbursementModal(menuName:any,insuranceData:any,commonData:any){
    const modalRefInsurance = this.modal.open(ReimbursementDetailsComponent, { size: 'xl', centered: true,keyboard:false });
    modalRefInsurance.componentInstance.insuranceData = insuranceData;
    modalRefInsurance.componentInstance.commonData=commonData
    modalRefInsurance.componentInstance.menuName=menuName
    // modalRefInsurance.result.then(()=>{})
  }

  amt:any=0

  submitInsurance(){
    if(this.insuranceForm1.valid){
      var arrData=this.insuranceForm1.value.sumReimburesement
      for(let amount of arrData){
        this.amt= (amount.amount)
        this.amountSum=parseFloat(this.amountSum) + parseFloat(this.amt)
      }
      if(this.amountSum>this.insuranceForm1.value.sumInsured)
      {
        this.alertService.swalPopWarning("Amount Sum can not be more than the Sum Insured")
      }else{
        if(this.menuName=='athlete'){          
          this.innerLoaderMainData = true;
          this.atheleteInsuranceService.saveAthleteInsuranceDetails(0,this.athleteData.player_detail_id,this.userDetails.user_id,this.userDetails.role_id,
            this.insuranceForm1.getRawValue(),this.insuranceFileUploadRes.filedataList[0].filePath)
          .subscribe({
            next:(res)=>{
              this.innerLoaderMainData = false;
              // console.log(res)
              if(res==true){
                this.activeModal.close()
                this.alertService.swalPopSuccess("Insured Successfully!")
              }else{
                this.alertService.swalPopErrorTimer("Request can not be processed!")      
              }
            },
            error:()=>{
              console.error("error caught in save athlete insurance")
              this.innerLoaderMainData=false
            }
          })
        }

        if(this.menuName=='coach'){
          // console.log(this.insuranceForm1.value)
          // console.log(this.coachData.insurance_tagId);
          this.innerLoaderMainData = true;
          this.coachInsuranceService.coachSaveInsuranceTagging(this.insuranceForm1.value,this.coachData.insurance_tagId,this.userDetails.user_id,this.insuranceFileUploadRes.filedataList[0].filePath).subscribe(res=>{
            this.innerLoaderMainData = false;
            if(res==true){
              this.activeModal.close()
              this.alertService.swalPopSuccess("Insured successfully!")
            }else{
              this.alertService.swalPopErrorTimer("Request can not be processed!")      
            }
          },()=>{
            console.error("error caught in save insurance tagging")
            this.innerLoaderMainData=false
          })
        }      
      }
      this.amountSum=0
    }else{
      this.insuranceForm1.markAllAsTouched()
    }
  }

  keyPressDenied() {
    return false
  }

}
