
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EquipmentProcurementComponent as kisceEpComponent} from '../../../../standalone_components/modal-window/kisceMonitoringModalWindows/equipment-procurement/equipment-procurement.component';
import {  Component, EventEmitter, Input, OnInit,Output,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { environment } from 'src/environments/environment';
import { Moment } from 'moment';
import * as moment from 'moment';
import { ITabbingLink } from '../kisce-monitoring.component';
import { KisceMonitoringModalViewComponent } from 'src/app/role-inner-pages/kisce/kisce-monitoring-modal-view/kisce-monitoring-modal-view.component';


export interface equipmentList{
  academy_id:string ;
  date_of_procurement:string ,
  document_name:string,
  reason_for_delay: string,
  remark:string,
  status:number,
  type:string,
}

@Component({
  selector: 'app-equipment-procurement',
  templateUrl: './equipment-procurement.component.html',
  styleUrls: ['./equipment-procurement.component.css']
})
export class EquipmentProcurementComponent implements OnInit {

  displayedColumnsKIC: string[] = ['sno', 'type', 'status', 'date_procurement', 'reason_for_delay', 'uploadDocuments', 'remark','action'];
  displayedColumnsSTATE: string[] = ['sno','kicName','nsrsID','district', 'type', 'status', 'date_procurement', 'reason_for_delay', 'uploadDocuments', 'remark','action'];
  displayedColumnsKICWiseRC: string[] = ['sno','stateName','kicName','nsrsID','district', 'type', 'status', 'date_procurement', 'reason_for_delay', 'uploadDocuments', 'remark'];
  displayedColumnsRDState: string[] = ['sno', 'state', 'noOfKIC', 'kicProcurementCompleted', 'kicProcurementNotCompleted'];
  displayedColumnsHO: string[] = ['sno', 'type', 'status', 'date_procurement', 'reason_for_delay', 'uploadDocuments', 'remark'];
  displayedColumnsForRCList:string[]=['sno','rdName','totalKic','stateName']
  
  dataSource: any;
  dataSourceForState:any;
  dataSourceForKICWise:any;
  equipment_list:any;
  searchedList:any;
  rdListshow:Boolean=false;
  
  @Output() dataFromProcurement:EventEmitter<any>= new EventEmitter<any>();
  @Output() dataOfTabClicked:EventEmitter<any>= new EventEmitter<any>();
  @Input() tabbingLinkData!:ITabbingLink;
  @ViewChild('delete') deleteEquipmentDetailsPop: any;
  @ViewChild('statePaginator', { read: MatPaginator}) statePaginator!: MatPaginator
  @ViewChild('kicWISEPaginator', { read: MatPaginator }) kicWISEPaginator!: MatPaginator
  @ViewChild('rdListPaginator', { read: MatPaginator }) rdListPaginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;

  deleteInsuranceModal:any
  
  userDetails!:IUserDetails
  searchFilter!:FormGroup
  mainLoader:Boolean=false
  mainLoader1:Boolean=false
  fileurl:any=environment.fileUrl
  KicUsersRoleId:any=RoleCode
  stateWiseData:any
  rcListForHo:any
  dataSourceForRC:any
  stateWiseRcData:any
  kicWiseRcData:any
  kicWiseData:any
  date = new FormControl(moment());
  min_date = new Date(2017,1,1)
  max_date = new Date()

  constructor(public _modalService: NgbModal,private _alertService:AlertService,private _equipmentProcurementService: EquipmentProcurementService,
    private storageService:StorageService,private _fb:FormBuilder) { 
      this.userDetails=this.storageService.getUserDetails()
    }

  ngOnInit(): void {
    this.createFilterForm()
    this.clearFilter();
    if(this.userDetails.role_id==this.KicUsersRoleId.hoAdmin){
      this.getEquipmentList()
      if(this.tabbingLinkData!=undefined){
        
        if(this.tabbingLinkData.stateId!=undefined || this.tabbingLinkData.stateName!=undefined){
          this.rdChange(this.tabbingLinkData.data,true)
        }else{
          this.rdChange(this.tabbingLinkData.data,false)
        }
      }
    }else if(this.userDetails.role_id==this.KicUsersRoleId.rcAdmin){
      if(this.tabbingLinkData?.stateName!=undefined){
        this.getEquipmentList(1)
      }else{
        this.getEquipmentList()
      }
    }else{
      this.getEquipmentList();
    }
  }


  createFilterForm(){
    this.searchFilter=this._fb.group({
      year:[''],
      status:['']
    })
  }

  search() {
    if(this.userDetails.role_id==this.KicUsersRoleId.kisceAdmin  || this.userDetails.role_id==this.KicUsersRoleId.stateAdmin){
      this.searchedList = this.equipment_list  
      this.filterByDate(this.searchedList);
      this.filterByStatus(this.searchedList);  
      this.dataSource = new MatTableDataSource(this.searchedList);
      this.dataSource.paginator = this.kicWISEPaginator;
    }

    if(this.userDetails.role_id==this.KicUsersRoleId.rcAdmin || this.userDetails.role_id==this.KicUsersRoleId.hoAdmin){
      this.searchedList=this.kicWiseData
      this.filterByDate(this.searchedList)
      this.filterByStatus(this.searchedList,this.stateName)
      var searchedListbYState=this.searchedList.filter((data:any)=>data.state_name.toLowerCase().trim()==this.stateName.toLowerCase().trim())
      this.dataSource=new MatTableDataSource<any>(searchedListbYState);
      setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
    }
   
  }

  filterByDate(listFromSearch:any){
    if (this.searchFilter.value.year != ''  && this.searchFilter.value.year != null) {
        let changed_year = new Date (this.searchFilter.value.year).getFullYear().toString()     
        var currentList;
        if(this.userDetails.role_id==this.KicUsersRoleId.hoAdmin || this.userDetails.role_id==this.KicUsersRoleId.rcAdmin){
          currentList=listFromSearch.filter((data:any)=>data.state_name.toLowerCase().trim()==this.stateName.toLowerCase().trim())
        }else{
          currentList=listFromSearch
        }
        this.searchedList = currentList.filter((data: any) => {
          if (data.date_of_procurement.split('-')[0] == changed_year) {
            return data;
          }
        });
    }
  }

  filterByStatus(listFromSearch:any,stateName?:string){
    if (this.searchFilter.value.status != ''   && this.searchFilter.value.status != null) {
      if(this.searchFilter.value.status!=0){
        var currentStateList;
        if(this.userDetails.role_id==this.KicUsersRoleId.hoAdmin || this.userDetails.role_id==this.KicUsersRoleId.rcAdmin){
          currentStateList=listFromSearch.filter((stateData:any)=>stateData.state_name.toLowerCase().trim()==stateName?.toLowerCase().trim())
        }else{
          currentStateList=listFromSearch
        }
        this.searchedList = currentStateList.filter((data: any) => {
          if (data.status_type_value.split('-')[0] == this.searchFilter.value.status) {
            return data;
          }
        });
      }else{
        if(this.userDetails.role_id==this.KicUsersRoleId.hoAdmin || this.userDetails.role_id==this.KicUsersRoleId.rcAdmin){
          this.searchedList=listFromSearch.filter((data:any)=>data.state_name.toLowerCase().trim()==stateName?.toLowerCase().trim());
        }else{
          this.searchedList=listFromSearch
        }
      }
    }
  }

  getEquipmentList(check?:any){
    this.mainLoader=true
    this._equipmentProcurementService.getEquipmentProcurement(this.userDetails.user_id,this.userDetails.role_id, 80).subscribe({
      next:(res:any)=>{
      
        this.mainLoader = false;
        this.equipment_list = res.data;
        if((this.userDetails.role_id==this.KicUsersRoleId.kisceAdmin || this.userDetails.role_id==this.KicUsersRoleId.stateAdmin)){
          if(res.data.length>=1){
            this.dataFromProcurement.emit({
              uniqueKUID:res.data[0].ki_uid
            })
          }
        }

        if(this.userDetails.role_id==this.KicUsersRoleId.kisceAdmin){
   
          this.rdListshow=true
          this.dataSource = new MatTableDataSource<equipmentList>(this.equipment_list);
          setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
          this.mainLoader=false
          
        }
        //for state login 
        if(this.userDetails.role_id==this.KicUsersRoleId.stateAdmin){
          this.rdListshow=true
          this.dataSource=new MatTableDataSource<any>(this.equipment_list);
          // this.dataSource.paginator = this.kicWISEPaginator;
          setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
          this.mainLoader=false
        }
        // for RD  login
        if(this.userDetails.role_id==this.KicUsersRoleId.rcAdmin){
          this.rdListshow=true
          this.stateWiseData=res.statedata
          this.dataSourceForState=new MatTableDataSource<any>(res.statedata);
          setTimeout(() => this.dataSourceForState.paginator = this.statePaginator);
          var stateName:any
          if(check==1){
            stateName=this.tabbingLinkData.stateName
          }else{
           
            stateName=res.statedata[0].state_name;
          }
          this.stateName=stateName
          var stateData=res.kicWisedata.filter((data:any)=>{
            if(data.state_name.toLowerCase().trim()==stateName.toLowerCase().trim()){
              return data
            }
          })
          this.kicWiseData=res.kicWisedata
          this.dataSource=new MatTableDataSource<any>(stateData);
          setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
          this.mainLoader=false
        }
        //for ho login
        if(this.userDetails.role_id==this.KicUsersRoleId.hoAdmin){
          if(this.tabbingLinkData==undefined || check==1){
            this.rdListshow=false
            this.rcListForHo=res.rcData
            this.dataSourceForRC=new MatTableDataSource<any>(res.rcData)
            setTimeout(() => this.dataSourceForRC.paginator=this.rdListPaginator);
            this.stateWiseRcData=res.statewise
            this.kicWiseRcData=res.kicWiseData
            this.mainLoader=false
          }
          this.mainLoader=false
        }
      },
      error:(error)=>{
        this.mainLoader=false
        if(error.status==500){

          this._alertService.swalPopError(error?.error?.message)
        }        
      }
    })
  }

  rdChange(elementData:any,isStateChange?:any){
    this.dataOfTabClicked.emit({
      data:elementData,
      check:'rc',
      stateId:this.tabbingLinkData?.stateId,
      stateName:this.tabbingLinkData?.stateName
    })
    this.mainLoader1=true
    this._equipmentProcurementService.getEquipmentProcurement(elementData.user_id,elementData.role_id,80).subscribe({
      next:(res:any)=>{
        this.rdListshow=true
        this.stateWiseData=res.statedata
        this.mainLoader1=false
        var stateName=res.statedata[0].state_name;
        this.stateName=stateName
        var stateData=res.kicWisedata.filter((data:any)=>{
          if(data.state_name.toLowerCase().trim()==stateName.toLowerCase().trim()){
            return data
          }
        })
        this.kicWiseData=res.kicWisedata
        this.dataSourceForState=new MatTableDataSource<any>(res.statedata);
        setTimeout(() => this.dataSourceForState.paginator = this.statePaginator);
        this.dataSource=new MatTableDataSource<any>(stateData);
        setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);

        if(isStateChange){
          this.stateChange(this.tabbingLinkData.stateId,this.tabbingLinkData.stateName)
        }
      },
      error:()=>{
        this.rdListshow=true
        this.mainLoader1=false
      }
    })
    
  }

  backToRD(){
    this.rdListshow=false
    this.getEquipmentList(1);
    this.tabbingLinkData==undefined
    this.dataOfTabClicked.emit(undefined)
  }

  handleYearSelected(normalizedYear: Moment, dp: any) {
    const ctrlValue = this.date.value;
    ctrlValue!.year(normalizedYear.year());
    this.searchFilter.controls['year'].setValue(ctrlValue);
    this.search();
    dp.close();

  }
  
  stateName:any=''

  stateChange(address_state_id:any,stateName:string){
    // 
   this.dataOfTabClicked.emit({
    data:this.tabbingLinkData?.data,
    check:this.tabbingLinkData?.check,
    stateId:address_state_id,
    stateName:stateName
  })
    this.clearFilter()
    this.stateName=stateName
   if(this.KicUsersRoleId.rcAdmin == this.userDetails.role_id){
    var stateIdData=this.kicWiseData.filter((kic:any)=>{
      if(kic.state_name==address_state_id){
        return kic 
      }
      
    })
   }else{
    var stateIdData=this.kicWiseData.filter((kic:any)=>{
      
      if(kic.state_name.toLowerCase().trim()==stateName.toLowerCase().trim()){
        return kic 
      }
      
    })
   }
    this.dataSource=new MatTableDataSource<any>(stateIdData);
    setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
  }

  openAddModal(action:string,elementData?:any){
    const modelRef = this._modalService.open(kisceEpComponent,{size:'xl',centered:true, backdrop: 'static'})
      modelRef.componentInstance.equipmentModalData={action:action,data:elementData};
      modelRef.result.then((res:any) => {
        this.dataFromProcurement.emit({
          uniqueKUID:res.saved
        })
        if(res.saved){
          this.clearFilter();
          this.getEquipmentList()
        }
      })
      .catch(() => {});
  }

  deleteInsuranceData:any
  deleteEquipment(elementData:any){
    this.deleteInsuranceData=elementData
    this.deleteInsuranceModal = this._modalService.open(this.deleteEquipmentDetailsPop, {
      size: 'md',
      centered: true,
    });
  }

  confirmDeleteInsurance(){
    this.deleteInsuranceModal.close()
    this.mainLoader=true;
    this._equipmentProcurementService.deleteEquipmentDetails(this.deleteInsuranceData.id)
    .subscribe({
      next:(res:any)=>{
        this.mainLoader=false
        if(res){
          this._alertService.swalPopSuccess("Equipment Details deleted successfully!")
          this.clearFilter();
          this.getEquipmentList()
        }else{
          this._alertService.swalPopError("Equipment Details can't delete!")
        }
      },
      error:()=>{
        this.mainLoader = false;
      }
    })
    this.deleteInsuranceModal.close()
  }

  clearFilter(check?:boolean){
  
    this.searchFilter.get('year')?.setValue('')
    this.searchFilter.get('status')?.setValue('')
    if(check){
      this.search()
    }
  }

  openKisceDetailsModal(elementData:any){
    const modelRefForEquipmentModal = this._modalService.open(KisceMonitoringModalViewComponent,{size:'xl',centered:true, backdrop: 'static'})
    modelRefForEquipmentModal.componentInstance.equipmentModalViewData=elementData;
    modelRefForEquipmentModal.componentInstance.equipmentModalToViewFor='kic';
    modelRefForEquipmentModal.result.then((res:any) => {
      })
      .catch(() => {});
  }


}
