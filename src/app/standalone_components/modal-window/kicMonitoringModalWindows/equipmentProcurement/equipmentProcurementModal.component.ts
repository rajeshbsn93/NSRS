import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { environment } from 'src/environments/environment';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { EquipmentProcurementService, IGetTypeStatusList } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { Subject, takeUntil,pipe } from 'rxjs';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';


// export interface IGetEquipmentModalData {
//   action: string
//   data: IEuipmentModalUseData
// }

// export interface IEuipmentModalUseData {
//   sno: number
//   type:number
//   status: number
//   date_procurement: string
//   reason_for_delay: boolean
//   uploadDocuments:string
//   remark:string
// }


@Component({
  selector: 'app-equipmentProcurement',
  templateUrl: './equipmentProcurementModal.component.html',
  styleUrls: ['./equipmentProcurementModal.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent]
})

export class EquipmentProcurementComponent implements OnInit {

  displayedColumns: string[] = ['nsrsId', 'ath_Name','sport_name','gender','mobile_number','state_name','date_of_joining','is_insured','is_kiaa','is_tops','type_of_athelete','geoLocation','joining_status',];
  dataSource:any
  multiEquipmentTagForm!:FormGroup;
  loader:boolean=false
  mainloader1:boolean=false
  fileUploadRes:any
  fileUrl:any
  fileBaseUrl = environment.fileUrl;
  equipmentModalData:any;

  userDetails!:IUserDetails
  equipmentStatusList!:Array<IGetTypeStatusList>
  equipmentTypeList!:Array<IGetTypeStatusList>

  unsubscribe: Subject<any> = new Subject();
 
  pipe: DatePipe | undefined;
  min_date = new Date(2017,1,1)
  max_date = new Date()
  constructor(public activeModal:NgbActiveModal, private fb:FormBuilder,private _alertService:AlertService,
    private _sharableService:SharableService, private _datePipe:DatePipe,private _storageService:StorageService,
     private _equipmentProcurementService : EquipmentProcurementService) { }

  ngOnInit() {

    this.userDetails=this._storageService.getUserDetails()

    this.multiEquipmentTagForm = this.fb.group({
      addMultiTagArray:this.fb.array([])
    });

    this.addMultiTagArray.push(this.AddMultiTagArray(this.equipmentModalData));

    this.getEquipementStatusList()
    this.getEquipementTypeList()
  }

  getEquipementTypeList(){
    this.mainloader1=true
    this._equipmentProcurementService.getEquipementTypeList().pipe(takeUntil(this.unsubscribe)).subscribe({
      next:(res:any)=>{
        this.mainloader1=false
        if(res.status=='1'){
          this.equipmentTypeList=res.data
        }else{
          this._alertService.swalPopError('Something went Wrong with Type!')
        }
      },
      error:()=>{
        this.mainloader1=false
      }
    })
  }

  getEquipementStatusList(){
    this.loader=true
    this._equipmentProcurementService.getEquipmentStatus().pipe(takeUntil(this.unsubscribe)).subscribe({
      next:(res:any)=>{
        this.loader=false
        if(res.status){
          this.equipmentStatusList=res.data
        }else{
          this._alertService.swalPopError('Something Went Wrong with Status!')
        }
      },
      error:()=>{
        this.loader=false
      }
    })
  }

  
  get addMultiTagArray(): FormArray{
    return this.multiEquipmentTagForm.get('addMultiTagArray') as FormArray
  }
  
  AddMultiTagArray(modal:any):FormGroup{
    var academy_id
    if(this.userDetails.role_id==82){
      academy_id=this.userDetails.user_id.toString()
    }
    if(this.userDetails.role_id==1005){
      academy_id=modal.data.academy_detail_id
    }
    if(this.userDetails.role_id==46){
      academy_id=modal.data.academy_detail_id
    }
    if(this.userDetails.role_id==68){
      academy_id=modal.data.academy_detail_id
    }
    // this.userDetails.role_id==82 ?  : "0"
    return this.fb.group({
      academy_id:[academy_id,Validators.required],
      // type:[modal.action == 'edit' ? Number(modal.data.equipment_type_value.split('-')[0]) : '',Validators.required],
      type:[this.getTypeAccordingToRoles(modal),Validators.required],
      status:[this.getStatusAccordingToRoles(modal),Validators.required],
      d_o_p:[modal.action == 'edit' ? modal.data.date_of_procurement :'',Validators.required],
      // reason_for_delay:[modal.action == 'edit' ? modal.data.reason_for_delay :'',Validators.compose([Validators.required,Validators.maxLength(200)])],
      reason_for_delay:[modal.action == 'edit' ? modal.data.reason_for_delay :'',Validators.compose([Validators.maxLength(200)])],
      // document_name:[modal.action=='edit' ? modal.data.document_name: '',Validators.required],
      document_name:[modal.action=='edit' ? modal.data.document_name: ''],
      remark:[modal.action == 'edit' ? modal.data.remark :'',Validators.compose([Validators.maxLength(200)])],
      year_of_operation:[modal.action == 'edit' ? modal.data.date_of_procurement.split('-')[0] : '',Validators.required],
      user_id:[this.userDetails.user_id,Validators.required],
      role_Id:[this.userDetails.role_id,Validators.required],
      id:[modal.action == 'edit' ? modal.data.id :0]
    })
  }

  newAddMultiTagArray(){
    this.addMultiTagArray.push(this.AddMultiTagArray(this.equipmentModalData))
  }

  removeAddMultiTagArray(index:any){
    this.addMultiTagArray.removeAt(index)
  }


  //Bind Equipment Types according dropdown according to user LoggedIn based on their role
  getTypeAccordingToRoles(modal:any){
    if(modal.action=='edit'){
      if(this.userDetails.role_id!=82){
        return {value:Number(modal.data.equipment_type_value.split('-')[0]),disabled:true};
      }else if(this.userDetails.role_id==82){
        return {value:Number(modal.data.equipment_type_value.split('-')[0]),disabled:false};
      }
    }
    // else if(modal.action=='add'){
    //   return {value:Number(modal.data?.equipment_type_value.split('-')[0]),disabled:false}
    // }
    return 
  }

  //Bind status dropdown value according user loggedIn based on their role
  getStatusAccordingToRoles(modal:any){
    if(modal.action=='add'){
      if(this.userDetails.role_id==82){
        return {value:1,disabled:true};
      }
      // if(this.userDetails.role_id==1005){
      //   return {value:Number(modal.data.status_type_value.split('-')[0])};
      // }
      // return {value:1,disabled:true};
    }else if(modal.action=='edit'){
      if(this.userDetails.role_id==82){
        return {value:Number(modal.data.status_type_value.split('-')[0]),disabled:true};
      }else {
        return {value:Number(modal.data.status_type_value.split('-')[0]),disabled:false};
      }
    }
    // modal.action == 'edit' ? modal.data.status :1
    return 1
  }

  //to calculate the fileSize of the file uploaded
  verifyFileSize(files:any){
    var fileSize = files[0].size
    return fileSize
  }

  //to finf the file extension of the file uploaded
  verifyDocumentFileExtension(files:any){
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile 
  }

  public uploadDocuments=(files:any,index:any)=>{
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files);
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
        var fileSize=this.verifyFileSize(files);
        if(fileSize<=5242880){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("path",'data/Tempimage')
            formData.append("uploadType",'3')
          }

          
          this.loader = true
          this._sharableService.uploadFile(formData).subscribe({
            next: (res) => {
              this.loader = false
              this.fileUploadRes=res;
              if(this.fileUploadRes.isUploaded==true) {
                this._alertService.swalPopSuccess('File Uploaded')
                this.addMultiTagArray.controls[index].get('document_name')?.setValue(this.fileUploadRes.filedataList[0].filePath);
              } else {
                this._alertService.swalPopError(this.fileUploadRes.errorMsg || 'Upload Failed! Please Try Again.');
              }
            },
            error: () => {
              this.loader=false;
            }
          })
        }else{
          this._alertService.swalPopError('File size must not be more than 5mb')
        }
      }
      else {
        this._alertService.swalPopWarning('Only jpg, jpeg, png, pdf file is allowed!')
      }
    }
  }

  datePickerDateChange(dateOfProcurement:any,index:any){
    this.addMultiTagArray.controls[index].get('year_of_operation')?.setValue(dateOfProcurement.split('/')[2])
  }


  submitMultiTagged(){
    if(this.multiEquipmentTagForm.valid){
            
      this.loader=true
      this._equipmentProcurementService.saveEquipmentForm(this.multiEquipmentTagForm.getRawValue().addMultiTagArray).pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (response: any) => {
          this.loader=false
          if(response.status){
            this._alertService.swalPopSuccess(`${response.message}`)
            this.activeModal.close({
              saved:response.data,
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
