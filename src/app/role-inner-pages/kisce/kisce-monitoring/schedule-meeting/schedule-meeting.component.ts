import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { ScheduleMeetingModalComponent } from 'src/app/standalone_components/modal-window/kisceMonitoringModalWindows/schedule-meeting-modal/schedule-meeting-modal.component';
import { environment } from 'src/environments/environment';
export interface scheduleMeetingDetails{
  meeting_date:string,
  meeting_time:string,
  link: string,
  attended_by:string,
  minutes:string,
  remarks:string,
  modify_by:number, 
  created_by:number,
  user_id:number,
  role_id:number,
 
}

@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.css']
})
export class ScheduleMeetingComponent implements OnInit {

 @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('content') contentDialog: any
  deleteInsuranceModal:any
  @ViewChild('delete') deleteInsurancePop: any;
  displayedColumns : string[] = ['sno', 'requestMeetingDate', 'meetingTime', 'link', 'attendedBy', 'minutes','remarks', 'action'];
  
  userDetails!:IUserDetails
  KicUsersRoleId:any=RoleCode
  dataSource:any 
  scheduleMeetingList:any;
  fileurl:any=environment.fileUrl
  mainLoader:Boolean=false
  constructor(private _storageService:StorageService,private _equipmentProcurementService:EquipmentProcurementService,
    private _alertService:AlertService,public _modalService: NgbModal,) { }

  ngOnInit() {
    this.userDetails=this._storageService.getUserDetails();
    this.getScheduleMeetingList()
  }
 
  getScheduleMeetingList(){
    this.mainLoader=true
    this._equipmentProcurementService.getScheduleMeeting(this.userDetails.user_id,this.userDetails.role_id, 80).subscribe({
      next:(res:any)=>{
        this.mainLoader=false
        this.scheduleMeetingList = res.data;
        const ELEMENT_DATA : scheduleMeetingDetails[] = this.scheduleMeetingList;
        this.dataSource = new MatTableDataSource<scheduleMeetingDetails>(ELEMENT_DATA);
        console.log(this.dataSource)
        console.log(this.dataSource.paginator)
        console.log(this.paginator)
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource.paginator)
      },
      error:(error)=>{
        this.mainLoader=false
       
        if(error.error?.code==404 && error.error?.data==null && error.error?.status=='error'){
          this._alertService.swalPopError(error?.error?.message)
          this.dataSource=new MatTableDataSource()
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.scheduleMeetingList=[]
        }else{
          this._alertService.swalPopError(`No Data Found`)
          this.dataSource=new MatTableDataSource()
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.scheduleMeetingList=[]
        }
      }
    })
  }

  openAddModal(action:string,elementRowData?:any){
    const modelRef = this._modalService.open(ScheduleMeetingModalComponent,{size:'xl',centered:true, backdrop: 'static'})
    const data = elementRowData
     modelRef.componentInstance.scheduleMeetingModalData={action:action,data:data};
 
     modelRef.result
     .then((res:any) => {
      if(res.saved){
        this.getScheduleMeetingList()
      }
     })
     .catch(() => {});
  }

  // deleteEquipment(elementRowData:any){
  // }

}
