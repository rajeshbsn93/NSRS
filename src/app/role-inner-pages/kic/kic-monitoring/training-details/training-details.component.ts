import { filter } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleCode, Months} from 'src/app/_common/_enums/role-code';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService,IUserDetails } from 'src/app/_common/services/common-services/storage.service';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { KicMonitoringTrainingDetailsComponent } from 'src/app/standalone_components/modal-window/kicMonitoringModalWindows/kicMonitoringTrainingDetails/kicMonitoringTrainingDetails.component';
import { environment } from 'src/environments/environment';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { KicMonitoringModalViewComponent } from '../../kic-monitoring-modal-view/kic-monitoring-modal-view.component';
import { ITabbingLink } from '../kic-monitoring.component';

export interface trainingDetailList{
  kuid:string,
  is_trainging_provided:string,
  reason: string,
  upload_doc_path:string,
  user_id:number,
  role_id:number,
}
export interface stateWiseList{
  user_id:number,
  state:string,
  state_id: number,
  academy_count:number,
  kicS_Where_Training_Being_Conducted:number,
  kicS_Where_Training_Not_Being_Conducted:number,
}
@Component({
  selector: 'app-training-details',
  templateUrl: './training-details.component.html',
  styleUrls: ['./training-details.component.css']
})
export class TrainingDetailsComponent implements OnInit {
  @ViewChild('statePaginator', { read: MatPaginator }) statePaginator!: MatPaginator
  @ViewChild('kicWISEPaginator', { read: MatPaginator }) kicWISEPaginator!: MatPaginator
  @ViewChild('rdListPaginator', { read: MatPaginator }) rdListPaginator!: MatPaginator

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('content') contentDialog: any
  deleteInsuranceModal:any
  @ViewChild('delete') deleteInsurancePop: any;

  @Input() uniqueKUID:any;
  @Input() tabbingLinkData!:ITabbingLink;
  @Output() dataOfTabClicked:EventEmitter<any>= new EventEmitter<any>();

  displayedStateWiseColumns:string[] = ['sno','state','no_of_kic','pro_completed_kic','pro_incompleted_kic']



  displayedKicColumns: string[] = ['sno','year','month','regularTrainingProvided','reasonForTrainingNotProvided','uploadedDocument','action'];
  displayedStateColumns: string[] = ['sno','kiC_NAME','kiC_KUID','district','regularTrainingProvided','reasonForTrainingNotProvided','uploadedDocument'];
  displayedRCHOColumns: string[] = ['sno','kiC_NAME','kiC_KUID','district','regularTrainingProvided','reasonForTrainingNotProvided','uploadedDocument'];
  
  displayedColumnsForRCList:string[]=['sno','rdName','totalKic','stateName']
  
  date = new FormControl(moment());
  dataSource: any;
  dataSourceForState: any;
  kicWiseData:any
  stateWiseData:any;

  rdListshow:Boolean=false

  dataSourceForRC:any
  training_details_list:any;  
  
  userDetails!:IUserDetails
  mainLoader:Boolean=false
  fileurl:any=environment.fileUrl
  min_date = new Date(2017,1,1)
  max_date = new Date()
  KicUsersRoleId:any=RoleCode
  monthsDetails:any=Months
  searchFilter!: FormGroup;
  selected_training_details_list:any;
  stateName:string='';
  constructor(
    public _modalService: NgbModal,
    public _trainingDetailsService: EquipmentProcurementService,
    private storageService:StorageService,private _alertService:AlertService,
    private fb: FormBuilder
    ) { }


  ngOnInit() {

    this.userDetails=this.storageService.getUserDetails()

    this.searchFilter = this.fb.group({
      month: [''],
      year: [''],
      status: [''],
     
    });
    if(this.userDetails.role_id==this.KicUsersRoleId.hoAdmin){
      if(this.tabbingLinkData!=undefined){
        if(this.tabbingLinkData.stateId!=undefined || this.tabbingLinkData.stateName!=undefined){
          this.rdChange(this.tabbingLinkData.data,true)
        }else{
          this.rdChange(this.tabbingLinkData.data,false)
        }
      }
      this.getTrainingDetailsList()
    }else if(this.userDetails.role_id==this.KicUsersRoleId.rcAdmin){
      if(this.tabbingLinkData?.stateName!=undefined){
        this.getTrainingDetailsList(1)
      }else{
        this.getTrainingDetailsList()
      }
    }else{
      this.getTrainingDetailsList();
    }
    
  }

  openAddTrainingDetailsModal(action:string,element:any){
    const modelRef = this._modalService.open(KicMonitoringTrainingDetailsComponent,{size:'xl',centered:true, backdrop: 'static'})
     modelRef.componentInstance.equipmentModalData={action:action,data:element,kiuid:this.uniqueKUID};
 
     modelRef.result
     .then((res:any) => {
      if(res.saved){
        this.clearFilter();
        this.getTrainingDetailsList()
      }
     })
     .catch(() => {});
  }
 


  getTrainingDetailsList(check?:any){
   
    this.mainLoader=true
    this._trainingDetailsService.getTrainingDetailsList(this.userDetails.user_id,this.userDetails.role_id).subscribe({
      next:(res:any)=>{
        this.mainLoader=false
        this.training_details_list = this.userDetails.role_id == this.KicUsersRoleId.rcAdmin ? res.kicWisedata : res.data;

        // for KIC login
        if(this.userDetails.role_id==this.KicUsersRoleId.kicAdmin){
          this.rdListshow=true
          this.dataSource = new MatTableDataSource<trainingDetailList>(this.training_details_list);
          // this.dataSource.paginator = this.kicWISEPaginator;
          setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
        }
        //for state login 
        if(this.userDetails.role_id==this.KicUsersRoleId.stateAdmin){
          this.rdListshow=true
          this.dataSource=new MatTableDataSource<any>(this.training_details_list);
          setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
        }
        // for RD 
        if(this.userDetails.role_id==this.KicUsersRoleId.rcAdmin){
          this.rdListshow=true
          this.stateName = res.stateWisedata[0].state;
          this.dataSourceForState=new MatTableDataSource<any>(res.stateWisedata);
          setTimeout(() => this.dataSourceForState.paginator = this.statePaginator);
          this.dataSource=new MatTableDataSource<any>(res.kicWisedata);
          setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
          this.training_details_list = res.kicWisedata;
          if(check==1){
            this.getKicByStateId(this.tabbingLinkData.stateName)
          }else{
            this.getKicByStateId(res.stateWisedata[0].state);
          }
        }
        if(this.userDetails.role_id==this.KicUsersRoleId.hoAdmin){
          if(this.tabbingLinkData==undefined  ||  check==1){
            this.rdListshow=false
            this.stateWiseData=res.stateWisedata
            this.kicWiseData=res.kicWisedata
            this.dataSourceForRC=new MatTableDataSource(res.rcData)
            setTimeout(() => this.dataSourceForRC.paginator = this.rdListPaginator);
            
            // this.stateName = res.stateWisedata[0].state;
            // this.dataSourceForState=new MatTableDataSource<any>(res.stateWisedata);
            // this.dataSourceForState.paginator = this.statePaginator;
            
            // this.training_details_list = res.kicWisedata;
            // this.getKicByStateId(res.stateWisedata[0].state)
            // this.dataSource=new MatTableDataSource<any>(res.kicWisedata);
            // this.dataSource.paginator = this.kicWISEPaginator;
          }
        }



        
      },
      error:(error)=>{
        this.mainLoader=false
       
        if(error.error?.code==404 && error.error?.data==null && error.error?.status=='error'){
          this._alertService.swalPopError(error?.error?.message)
          this.dataSource=new MatTableDataSource()
          this.dataSource.paginator = this.kicWISEPaginator;
          this.dataSource.sort = this.sort;
          this.training_details_list=[]
        }else{
          this._alertService.swalPopError(`No Data Found`)
          this.dataSource=new MatTableDataSource()
          this.dataSource.paginator = this.kicWISEPaginator;
          this.dataSource.sort = this.sort;
          this.training_details_list=[]
        }
      }
    })
  }

  rdChange(elementData:any,check?:any){
    // this.dataOfTabClicked.emit({
    //   data:elementData,
    //   check:'rc'
    // })
    this.dataOfTabClicked.emit({
      data:elementData,
      check:'rc',
      stateId:this.tabbingLinkData?.stateId,
      stateName:this.tabbingLinkData?.stateName
    })
    this.mainLoader=true
    this._trainingDetailsService.getTrainingDetailsList(elementData.user_id,elementData.role_id).subscribe({
      next:(res:any)=>{
        this.rdListshow=true
        this.mainLoader=false
        this.stateName = res.stateWisedata[0].state;
        this.dataSourceForState=new MatTableDataSource<any>(res.stateWisedata);
        setTimeout(() => this.dataSourceForState.paginator = this.statePaginator);
        // this.dataSourceForState.paginator = this.statePaginator;
        this.dataSource=new MatTableDataSource<any>(res.kicWisedata);
        // this.dataSource.paginator = this.kicWISEPaginator;
        setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
        this.training_details_list = res.kicWisedata;
        if(check){
          this.getKicByStateId(this.tabbingLinkData.stateName)
        }else{
          this.getKicByStateId(res.stateWisedata[0].state)
        }
      },
      error:()=>{
        this.rdListshow=true
        this.mainLoader=false
      }
    })
  }


  backToRD(){
    this.rdListshow=false
    this.getTrainingDetailsList(1)
    this.tabbingLinkData==undefined
    this.dataOfTabClicked.emit(undefined)
  }

  deleteInsuranceData:any

  deleteEquipment(elementData:any){
    this.deleteInsuranceData=elementData
    this.deleteInsuranceModal = this._modalService.open(this.deleteInsurancePop, {
      size: 'md',
      centered: true,
    });

  }

  confirmDeleteInsurance(){
    this.deleteInsuranceModal.close()
    this.mainLoader=true;
    this._trainingDetailsService.deleteTrainingDetails(this.deleteInsuranceData.id)
    .subscribe({
      next:(res:any)=>{
        this.mainLoader=false
        if(res){
          this._alertService.swalPopSuccess("Training Details deleted successfully!")
          this.clearFilter();
          this.getTrainingDetailsList()
        }else{
          this._alertService.swalPopError("Training Details can't delete!")
        }
      },
      error:()=>{
        this.mainLoader = false;
      }
    })
    this.deleteInsuranceModal.close()
  }

  getKicByStateId(state_name:string){
    this.dataOfTabClicked.emit({
      data:this.tabbingLinkData.data,
      check:this.tabbingLinkData.check,
      stateId:this.tabbingLinkData?.stateId,
      stateName:state_name
    })
  this.dataSource=new MatTableDataSource<any>(this.getKicWiseDataByStateId(state_name));
  this.dataSource.paginator = this.kicWISEPaginator;
    
  }


  getKicWiseDataByStateId(state_name:string){
    this.stateName = state_name;
    return this.training_details_list?.filter((res:any)=>{
      if(state_name == res.state_name){
        return res;
      }
     })    
  }


  
  search() {
    
    this.selected_training_details_list = this.training_details_list
    if (this.searchFilter.value.month != '' && this.searchFilter.value.month != null) {
      
      
      this.selected_training_details_list = this.selected_training_details_list.filter((data: any) => {
        if (data.month == this.searchFilter.value.month) {
          return data;
        }
      });
    }
    if (this.searchFilter.value.year != '' && this.searchFilter.value.year != null) {
      let changed_year = new Date (this.searchFilter.value.year).getFullYear().toString()
      
      this.selected_training_details_list = this.selected_training_details_list.filter((data: any) => {
        if (data.year == changed_year) {
          return data;
        }
      });
    }
    if (this.searchFilter.value.status != '' && this.searchFilter.value.status != null) {
       this.selected_training_details_list = this.selected_training_details_list.filter((data: any) => {
        if (data.is_trainging_provided == this.searchFilter.value.status) {
          return data;
        }
      });
    }

    if(this.userDetails.role_id==this.KicUsersRoleId.kicAdmin){
      this.dataSource = new MatTableDataSource<trainingDetailList>(this.selected_training_details_list);
      this.dataSource.paginator = this.kicWISEPaginator;
    }
    //for state login 
    if(this.userDetails.role_id==this.KicUsersRoleId.stateAdmin){
      this.dataSource=new MatTableDataSource<any>(this.selected_training_details_list);
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
    this.searchFilter.reset();
    if(check){
      this.search();
    }
  }

  openKicDetailsModal(elementData:any){
    const modelRefForEquipmentModal = this._modalService.open(KicMonitoringModalViewComponent,{size:'xl',centered:true, backdrop: 'static'})
    //  const data =  {sno:'1',type:'Sports Kit',status:'Completed',date_procurement:'17-10-2023',reason_for_delay:'Comp. Off',uploadDocuments:'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',remark:'remarks'};
    modelRefForEquipmentModal.componentInstance.equipmentModalViewData=elementData;
    modelRefForEquipmentModal.componentInstance.equipmentModalToViewFor='training';

    modelRefForEquipmentModal.result.then((res:any) => {
        
      })
      .catch(() => {});
  }


}
