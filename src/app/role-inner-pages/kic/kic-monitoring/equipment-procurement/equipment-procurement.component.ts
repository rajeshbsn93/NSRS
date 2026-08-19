import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EquipmentProcurementComponent as EpComponent} from '../../../../standalone_components/modal-window/kicMonitoringModalWindows/equipmentProcurement/equipmentProcurementModal.component';
import { AfterViewInit, Component, EventEmitter, Input, OnInit,Output,ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { EquipmentProcurementService, IGetTypeStatusList, } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { environment } from 'src/environments/environment';
import { Moment } from 'moment';
import * as moment from 'moment';
import { KicMonitoringModalViewComponent } from '../../kic-monitoring-modal-view/kic-monitoring-modal-view.component';
import { ITabbingLink } from '../kic-monitoring.component';


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
  styleUrls: ['./equipment-procurement.component.css'],
})
export class EquipmentProcurementComponent implements OnInit {

 
  // @ViewChild('content') contentDialog: any
  displayedColumnsKIC: string[] = ['sno', 'type', 'status', 'date_procurement', 'reason_for_delay', 'uploadDocuments', 'remark','action'];
  displayedColumnsSTATE: string[] = ['sno','kicName','nsrsID','district', 'type', 'status', 'date_procurement', 'reason_for_delay', 'uploadDocuments', 'remark','action'];
  // displayedColumnsKICWiseRC: string[] = ['sno','stateName','kicName','nsrsID','district', 'type', 'status', 'date_procurement', 'reason_for_delay', 'uploadDocuments', 'remark','action'];
  displayedColumnsKICWiseRC: string[] = ['sno','stateName','kicName','nsrsID','district', 'type', 'status', 'date_procurement', 'reason_for_delay', 'uploadDocuments', 'remark'];
  
  
  displayedColumnsRDState: string[] = ['sno', 'state', 'noOfKIC', 'kicProcurementCompleted', 'kicProcurementNotCompleted'];
  // displayedColumnsHO: string[] = ['sno', 'type', 'status', 'date_procurement', 'reason_for_delay', 'uploadDocuments', 'remark','action'];
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
  // @ViewChild('kicWisePaginator', { read: MatPaginator }) kicWisePaginator!: MatPaginator

  @ViewChild(MatSort) sort!: MatSort;

  deleteInsuranceModal:any
  
  userDetails!:IUserDetails
  searchFilter!:FormGroup
  mainLoader:Boolean=false
  mainLoader1:Boolean=false
  // typeListDropDown!:Array<IGetTypeStatusList>
  fileurl:any=environment.fileUrl
  KicUsersRoleId:any=RoleCode
  stateWiseData:any
  rcListForHo:any
  dataSourceForRC:any
  stateWiseRcData:any
  kicWiseRcData:any
  kicWiseData:any
  // monthsDetails:any=Months
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
    // this.getTypeList();
  }


  createFilterForm(){
    this.searchFilter=this._fb.group({
      year:[''],
      status:['']
    })
  }

  search() {
    // for kic login
    if(this.userDetails.role_id==this.KicUsersRoleId.kicAdmin  || this.userDetails.role_id==this.KicUsersRoleId.stateAdmin){
      this.searchedList = this.equipment_list  
      //to filter on the basics of year selected by the user
      this.filterByDate(this.searchedList);
      //to filter the data on the basics of status
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
      // this.dataSource.paginator = this.kicWISEPaginator;
      setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
    }
   
  }

  filterByDate(listFromSearch:any){
    if (this.searchFilter.value.year != ''  && this.searchFilter.value.year != null) {
      // if(this.searchFilter.value.year!=null){
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
      // }
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
    // var academy_id;
    // if(this.userDetails.role_id==82) academy_id=this.userDetails.user_id
    this.mainLoader=true
    this._equipmentProcurementService.getEquipmentProcurement(this.userDetails.user_id,this.userDetails.role_id).subscribe({
      next:(res:any)=>{
        this.equipment_list = res.data;
        if((this.userDetails.role_id==this.KicUsersRoleId.kicAdmin || this.userDetails.role_id==this.KicUsersRoleId.stateAdmin)){
          if(res.data.length>=1){
            this.dataFromProcurement.emit({
              uniqueKUID:res.data[0].ki_uid
            })
          }
        }

        
        // for KIC login
        if(this.userDetails.role_id==this.KicUsersRoleId.kicAdmin){
          this.rdListshow=true
          this.dataSource = new MatTableDataSource<equipmentList>(this.equipment_list);
          // this.dataSource.paginator = this.kicWISEPaginator;
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
          // this.dataSourceForState.paginator = this.statePaginator;
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
          // this.dataSource.paginator = this.kicWISEPaginator;
          setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
          this.mainLoader=false
        }
        //for ho login
        if(this.userDetails.role_id==this.KicUsersRoleId.hoAdmin){
          if(this.tabbingLinkData==undefined || check==1){
            this.rdListshow=false
            this.rcListForHo=res.rcData
            this.dataSourceForRC=new MatTableDataSource<any>(res.rcData)
            // this.dataSourceForRC.paginator=this.rdListPaginator
            setTimeout(() => this.dataSourceForRC.paginator=this.rdListPaginator);
            this.stateWiseRcData=res.statewise
            this.kicWiseRcData=res.kicWiseData
            // this.stateWiseData=res.statewise
            // this.dataSourceForState=new MatTableDataSource<any>(res.statewise);
            // this.dataSourceForState.paginator = this.statePaginator;
            // var stateId=res.statewise[0].address_state_id
            // this.stateName=res.statewise[0].state_name
            // var stateIdData=res.kicWiseData.filter((kic:any)=>{
            //   if(kic.address_state_id==res.statewise[0].address_state_id){
            //     return kic
            //   }
            // })
            // this.kicWiseData=res.kicWiseData
            // this.dataSource=new MatTableDataSource<any>(stateIdData);
            // this.dataSource.paginator = this.kicWISEPaginator;
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
        // if(error.error?.data.length==0 ){
        //   this.dataSource=new MatTableDataSource()
        //   this.dataSource.paginator = this.kicWISEPaginator;
        //   this.dataSource.sort = this.sort;
        //   this.equipment_list=[]
        // }
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
    this._equipmentProcurementService.getEquipmentProcurement(elementData.user_id,elementData.role_id).subscribe({
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
        // this.dataSourceForState.paginator=this.statePaginator
        
        setTimeout(() => this.dataSourceForState.paginator = this.statePaginator);
        this.dataSource=new MatTableDataSource<any>(stateData);
        setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);

        // this.dataSource.paginator = this.kicWISEPaginator;
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
    // debugger
   this.dataOfTabClicked.emit({
    data:this.tabbingLinkData?.data,
    check:this.tabbingLinkData?.check,
    stateId:address_state_id,
    stateName:stateName
  })
    this.clearFilter()
    this.stateName=stateName
   if(this.KicUsersRoleId.rcAdmin == this.userDetails.role_id){
    //  this.stateName=address_state_id
    var stateIdData=this.kicWiseData.filter((kic:any)=>{
      if(kic.state_name==address_state_id){
        return kic 
      }
      
    })
   }else{
    var stateIdData=this.kicWiseData.filter((kic:any)=>{
      
      if(kic.state_name.toLowerCase().trim()==stateName.toLowerCase().trim()){
        // this.stateName=kic.state_name
        return kic 
      }
      
    })
   }
    this.dataSource=new MatTableDataSource<any>(stateIdData);
    // this.dataSource.paginator = this.kicWISEPaginator;
    setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
  }

  // getTypeList(){
  //   this.mainLoader1=true
  //   this._equipmentProcurementService.getTypeList().subscribe({
  //     next:(res:any)=>{
  //       console.log(res)
  //       this.mainLoader1=false
  //       if(res.code==200 && res.status=='success'){
  //         this.typeListDropDown=res.data
  //       }else{
  //         this._alertService.swalPopError('Something went Wrong')
  //       }
  //     },
  //     error:(error)=>{
  //       this.mainLoader1=false
  //       this._alertService.swalPopError(error?.error?.message)
  //     }
  //   })
  // }

  //opening Add modal for addding equipment DATA 
  openAddModal(action:string,elementData?:any){
    const modelRef = this._modalService.open(EpComponent,{size:'xl',centered:true, backdrop: 'static'})
    //  const data =  {sno:'1',type:'Sports Kit',status:'Completed',date_procurement:'17-10-2023',reason_for_delay:'Comp. Off',uploadDocuments:'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',remark:'remarks'};
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
      // this.stateChange()
      this.search()
    }
  }

  openKicDetailsModal(elementData:any){
    const modelRefForEquipmentModal = this._modalService.open(KicMonitoringModalViewComponent,{size:'xl',centered:true, backdrop: 'static'})
    //  const data =  {sno:'1',type:'Sports Kit',status:'Completed',date_procurement:'17-10-2023',reason_for_delay:'Comp. Off',uploadDocuments:'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',remark:'remarks'};
    modelRefForEquipmentModal.componentInstance.equipmentModalViewData=elementData;
    modelRefForEquipmentModal.componentInstance.equipmentModalToViewFor='kic';

    modelRefForEquipmentModal.result.then((res:any) => {
        
      })
      .catch(() => {});
  }

}
