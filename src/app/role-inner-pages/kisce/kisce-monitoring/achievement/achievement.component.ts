import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { AchievementModalComponent } from 'src/app/standalone_components/modal-window/kicMonitoringModalWindows/achievementModal/achievementModal.component';
import { ScheduleMeetingModalComponent } from 'src/app/standalone_components/modal-window/kicMonitoringModalWindows/scheduleMeetingModal/scheduleMeetingModal.component';
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
  selector: 'app-achievement',
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.css']
})
export class AchievementComponent implements OnInit {

 @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('content') contentDialog: any
  deleteInsuranceModal:any
  @ViewChild('delete') deleteInsurancePop: any;

  displayedColumns : string[] = ['sno', 'KID', 'name', 'discipline', 'tournamentName', 'date','level', 'position'];
  
  userDetails!:IUserDetails
  KicUsersRoleId:any=RoleCode
  dataSource:any
  achievementList:any;
  mainLoader:Boolean=false

  constructor(private _storageService:StorageService,private _equipmentProcurementService:EquipmentProcurementService,
    private _alertService:AlertService,public _modalService: NgbModal,) { }

  ngOnInit() {
    this.userDetails=this._storageService.getUserDetails()
    this.getAchievementList()
  }

  getAchievementList(){
    this.mainLoader=true
    this._equipmentProcurementService.getAchcievementData(this.userDetails.user_id,this.userDetails.role_id,80).subscribe({
      next:(res:any)=>{
        this.achievementList=res.data
        this.dataSource=new MatTableDataSource<any>(this.achievementList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.mainLoader=false
      },
      error:()=>{
        this.mainLoader=false
      }
    })
  }
 
  

  // openAddModal(action:string,elementRowData?:any){
  //   console.log('elementRowData',elementRowData)

  //   const modelRef = this._modalService.open(AchievementModalComponent,{size:'xl',centered:true, backdrop: 'static'})
  //    modelRef.componentInstance.achievementModalData={action:action,data:elementRowData};
 
  //    modelRef.result
  //    .then((res:any) => {
  //     if(res.saved){
  //       this.getAchievementList()
  //     }
  //    })
  //    .catch(() => {});
  // }

  


}
