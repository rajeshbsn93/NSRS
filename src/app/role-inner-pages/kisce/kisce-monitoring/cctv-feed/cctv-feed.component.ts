import { state } from '@angular/animations';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { Months, RoleCode } from 'src/app/_common/_enums/role-code';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService,IUserDetails } from 'src/app/_common/services/common-services/storage.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { EquipmentProcurementService,IGetCctvList } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { KisceCctvFeedComponent } from 'src/app/standalone_components/modal-window/kisceMonitoringModalWindows/kisce-cctv-feed/kisce-cctv-feed.component';
import { environment } from 'src/environments/environment';

export interface trainingDetailList{
  id:number,
  kuid:string,
  covered_by_cctv:number,
  upload_cctv_link_with_username_password: string,
  upload_vedio:string,
  user_id:number,
  role_id:number,
 
}

@Component({
  selector: 'app-cctv-feed',
  templateUrl: './cctv-feed.component.html',
  styleUrls: ['./cctv-feed.component.css']
})
export class CctvFeedComponent implements OnInit {

 @Input() uniqueKUID:any
  displayedStateWiseColumns:string[] = ['sno','state','no_of_kic','pro_completed_kic','pro_incompleted_kic']

  displayedKicColumns: string[] = ['sno', 'year','month','covered_by_cctv','upload_vedio','action'];
  displayedStateColumns: string[] = ['sno','kiC_NAME','kiC_KUID','district','covered_by_cctv','upload_vedio'];
  // displayedRCColumns:string[]=['sno','stateName','kiC_NAME','kiC_KUID','year','month','district', 'covered_by_cctv','upload_vedio','action'];
  displayedRCColumns:string[]=['sno','stateName','kiC_NAME','kiC_KUID','district', 'covered_by_cctv','upload_vedio'];
  deleteInsuranceModal:any
  dataSource: any
  dataSourceFirst:any
  userDetails!:IUserDetails
  mainLoader:Boolean=false 
  cctvFeedList:Array<IGetCctvList>=[];
  fileurl:any=environment.fileUrl
  editable:Boolean=false
  cctvForm!:FormGroup
  loader:boolean=false
  date = new FormControl(moment());
  min_date = new Date(2017,1,1)
  max_date = new Date()
  KicUsersRoleId:any=RoleCode
  searchFilter!: FormGroup;
  monthsDetails:any=Months
  selected_cctv_details_list:any;
  unsubscribe: Subject<any> = new Subject();
  fileBaseUrl = environment.fileUrl;
  @ViewChild('statePaginator', { read: MatPaginator }) statePaginator!: MatPaginator
  @ViewChild('kicWISEPaginator', { read: MatPaginator }) kicWISEPaginator!: MatPaginator
  @ViewChild('delete') deleteInsurancePop: any;

  stateLoader:boolean=false;
  stateListForFilter:any

  constructor(
    private _cctvFeedService: EquipmentProcurementService,public activeModal:NgbActiveModal,
    private storageService:StorageService,private _alertService:AlertService,private _fb:FormBuilder,public _modalService: NgbModal,
    private fb: FormBuilder,private _sharableService:SharableService
  ) { }

  ngOnInit(): void {
    this.dataSourceFirst = [];
    this.searchFilter = this.fb.group({
    month: [''],
    year: [''],
    status: [''],
    state: [''],
    });
    this.userDetails=this.storageService.getUserDetails();
    this.getStateMasterList();
    this.getCctvFeedData();
    // this.createCctvForm();
  }

  getStateMasterList(){
    this.stateLoader=true;
    this._sharableService.stateList().subscribe({
      next:(stateRes:any)=>{
        this.stateListForFilter=stateRes
        this.stateLoader=false
      },
      error:()=>{
        this.stateLoader=false
      }
    })
  }

  // createCctvForm(){
  //   this.cctvForm=this._fb.group({
  //     id:[0,Validators.required],
  //     academy_kuid:[this.userDetails.role_id==82?this.userDetails.nsrs_id:'',Validators.required],
  //     cctv:['',Validators.required],
  //     upload_vedio_linkWitUsern:[{value:'',disabled:(this.userDetails.role_id == 82 ? false : true) },Validators.compose([Validators.required,Validators.maxLength(200)])],
  //     upload_vedio: ['',Validators.compose([Validators.required,Validators.maxLength(200)])], 
  //     user_id: [this.userDetails.user_id,Validators.required],
  //     role_id: [this.userDetails.role_id,Validators.required],
     
  //   })
  // }

  getCctvFeedData(){
    this.mainLoader=true
    
    this._cctvFeedService.getCctvFeedList(this.userDetails.user_id,this.userDetails.role_id,80).subscribe({
      next:(res:any)=>{
        this.mainLoader=false
       if(this.userDetails.role_id==this.KicUsersRoleId.kisceAdmin || this.userDetails.role_id==this.KicUsersRoleId.stateAdmin){
          this.cctvFeedList=res.data;
          this.dataSource=new MatTableDataSource(this.cctvFeedList)
          this.dataSource.paginator = this.kicWISEPaginator;
       }else{
        
         if(res.status){
               this.cctvFeedList = res.kiC_wisedata
               this.dataSource=new MatTableDataSource(this.cctvFeedList)
               this.dataSource.paginator = this.kicWISEPaginator;
         }else{
          //  this.cctvFeedList=res.data
           this.cctvFeedList=[]
           this.dataSource=new MatTableDataSource(this.cctvFeedList)
           this.dataSource.paginator = this.kicWISEPaginator; 
           // this.dataSource.paginator = this.paginator;
           // this.dataSource.sort = this.sort;
         }
        
       }

      },
      error:(error)=>{
        this.mainLoader=false
        this._alertService.swalPopError(error?.error?.message)
        if(error.error?.code==404 && error.error?.data==null && error.error?.status=='error'){
          this.cctvFeedList=[]
          this.dataSource=new MatTableDataSource(this.cctvFeedList)
         
         // this.cctvFeedList=[]
        }
      }
    })
  }


  openAddCctvModal(action:string,index:number){
    const modelRef = this._modalService.open(KisceCctvFeedComponent,{size:'xl',centered:true, backdrop: 'static'})
    const data = this.cctvFeedList[index]
     modelRef.componentInstance.equipmentModalData={action:action,data:data,kiuid:this.uniqueKUID};
 
     modelRef.result
     .then((res:any) => {
      if(res.saved){
        this.clearFilter();
        this.getCctvFeedData();
      }
     })
     .catch(() => {});
  }

  // editCctvFeed(action:string,data?:IGetCctvList){
  //   if(action == 'edit'){
  //     this.cctvForm.controls['id'].patchValue(data?.id);
  //     this.cctvForm.controls['academy_kuid'].patchValue(this.userDetails.role_id == 82 ? data?.kuid : data?.kiC_KUID);
  //     this.cctvForm.controls['cctv'].patchValue(data?.covered_by_cctv);
  //     this.cctvForm.controls['upload_vedio_linkWitUsern'].patchValue(data?.upload_cctv_link_with_username_password);
  //     this.cctvForm.controls['upload_vedio'].patchValue(data?.upload_vedio);
      
  //   }else{
  //     this.cctvFeedList=[
  //       {id:0,kuid:0,kiC_KUID:'',covered_by_cctv:0,upload_cctv_link_with_username_password: '', upload_vedio: 'abj.jpeg',user_id:0,role_id:0}
  //     ]
  //     this.dataSource=new MatTableDataSource(this.cctvFeedList)
  //   }
  //   this.editable=true
    
   
  // }

  // uploadBrandingFile(files:any){ 
  //   if(!files.length) return
  //   if(['jpg', 'jpeg', 'png','pdf'].includes(this.verifyDocumentFileExtension(files[0]))){
  //     if(files[0].size < 5242880){
  //       const formData = new FormData();
  //       formData.append("file", files[0], files[0].name);
  //       formData.append("path", `documents/Others`);
  //       formData.append("uploadType","1");
  //       this.mainLoader=true
  //       this._cctvFeedService.uploadFile(formData).pipe(takeUntil(this.unsubscribe)).subscribe({
  //         next:(response:any)=>{
  //           this.mainLoader=false
  //           if (response.isUploaded) {
  //             this._alertService.swalPopSuccess('File Uploaded');
  //             // imageUploadUrl = response.filedataList[0].filePath;
  //             this.cctvForm.get('upload_vedio')?.setValue(response.filedataList[0].filePath)
  //             // this.profilePicUrl=environment.fileUrl+imageUploadUrl;
  //           } else {
  //             // this.profilePicUrl=''
  //             this._alertService.swalPopError(response.errorMsg || 'Upload Failed! Please Try Again.');
  //           }
  //         },
  //         error:()=>{
  //           this.mainLoader=false
  //         }
  //       })
  //     }else{
  //       this._alertService.swalPopError('File Size must be less than 5mb.')
  //     }
  //   }else{
  //     this._alertService.swalPopError('File Format Not Supported.')
  //   }
  // }

  // saveOrUpdate(){
  

  //   if(this.cctvForm.valid){
  //     this.loader=true
  //     this._cctvFeedService.saveCctvForm(this.cctvForm.getRawValue()).pipe(takeUntil(this.unsubscribe)).subscribe({
  //       next: (response: any) => {
  //         this.loader=false
  //         if(response.status){
  //           this._alertService.swalPopSuccess(`${response.message}`)
  //           this.getCctvFeedData();
  //           this.editable = false;
  //         }else{
  //           this._alertService.swalPopError(`${response.message}`)
  //         }
  //       },
  //       error: (error:any) => {
  //         this.loader=false
  //         if(error?.error?.code==200){
  //           if(error?.error?.message){
  //             this._alertService.swalPopError(`${error.error.message}`)
  //           }
  //         }
  //       }
  //     });
  //  }else{
  //   this.cctvForm.markAllAsTouched();
  //  }
  // }

  // verifyDocumentFileExtension(file:any){
  //   var fileIndex = file.name.lastIndexOf(".") + 1;
  //   var fileExtension = file.name.substr(fileIndex, file.name.length).toLowerCase();
  //   return fileExtension;
  // }
  search() {
    this.selected_cctv_details_list = this.cctvFeedList
    
    if(this.searchFilter.value.state==''){
      this.selected_cctv_details_list=this.cctvFeedList
    }
    if(this.searchFilter.value.status=='' ){
      this.selected_cctv_details_list=this.cctvFeedList
    }
    if (this.searchFilter.value.month != '' && this.searchFilter.value.month != null) {
      this.selected_cctv_details_list = this.selected_cctv_details_list.filter((data: any) => {
        if (data.month == this.searchFilter.value.month) {
          return data;
        }
      });
    }
    if (this.searchFilter.value.year != '' && this.searchFilter.value.year != null) {
      let changed_year = new Date (this.searchFilter.value.year).getFullYear().toString()
      
      this.selected_cctv_details_list = this.selected_cctv_details_list.filter((data: any) => {
        if (data.year == changed_year) {
          return data;
        }
      });
    }
    if (this.searchFilter.value.status != '' && this.searchFilter.value.status != null) {
       this.selected_cctv_details_list = this.selected_cctv_details_list.filter((data: any) => {
        if (data.covered_by_cctv == this.searchFilter.value.status) {
          return data;
        }
      });
    }

    if (this.searchFilter.value.state != '' && this.searchFilter.value.state != null) {
       this.selected_cctv_details_list = this.selected_cctv_details_list.filter((data: any) =>data.state_name.toLowerCase().trim() == this.searchFilter.value.state.toLowerCase().trim())
     
    }


    if(this.userDetails.role_id==this.KicUsersRoleId.kisceAdmin){
      this.dataSource = new MatTableDataSource<trainingDetailList>(this.selected_cctv_details_list);
      this.dataSource.paginator = this.kicWISEPaginator;
    }
    //for state login 
    if(this.userDetails.role_id==this.KicUsersRoleId.stateAdmin || this.userDetails.role_id==this.KicUsersRoleId.hoAdmin){
      this.dataSource=new MatTableDataSource<any>(this.selected_cctv_details_list);
      this.dataSource.paginator = this.kicWISEPaginator;
    }
    
  }


  handleYearSelected(normalizedYear: Moment, dp: any) {
    const ctrlValue = this.date.value;
    ctrlValue!.year(normalizedYear.year());
    this.searchFilter.controls['year'].setValue(ctrlValue);
    this.search();
    dp.close();

  }


  deleteInsuranceData:any

  deleteEquipment(elementData:any){
    console.log('aaaaaaaaaaaaaaaaaaaaaa------------------');
    
    this.deleteInsuranceData=elementData
    this.deleteInsuranceModal = this._modalService.open(this.deleteInsurancePop, {
      size: 'md',
      centered: true,
    });

  }

  confirmDeleteInsurance(){
    console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb--------------------');
    
    this.deleteInsuranceModal.close()
    this.mainLoader=true;
    this._cctvFeedService.deleteCctvDetails(this.deleteInsuranceData.id)
    .subscribe({
      next:(res:any)=>{
        this.mainLoader=false
        if(res){
          this._alertService.swalPopSuccess("CCTV Feed Details deleted successfully!")
          this.clearFilter();
          this.getCctvFeedData()
        }else{
          this._alertService.swalPopError("CCTV Feed Details can't delete!")
        }
      },
      error:()=>{
        this.mainLoader = false;
      }
    })
    this.deleteInsuranceModal.close()
  }

  get(month:any){
    if(month){
       var name=this.monthsDetails.filter((data:any)=>{
        if(data.id==Number(month)){
          return data.name
        }
      })
      return name[0].name
    }
      return 'N/A'
  }


  clearFilter(check?:Boolean){
    // this.searchFilter.reset();
    this.searchFilter.get('state')?.setValue('')
    this.searchFilter.get('status')?.setValue('')
    if(check){
      this.dataSource=new MatTableDataSource(this.cctvFeedList)
      this.dataSource.paginator = this.kicWISEPaginator;
    }
  }

}
