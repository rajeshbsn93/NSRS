import { Component, OnInit } from '@angular/core';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';

@Component({
  selector: 'app-kic-monitoring',
  templateUrl: './kic-monitoring.component.html',
  styleUrls: ['./kic-monitoring.component.css']
})
export class KicMonitoringComponent implements OnInit {

  discipline_id!:number;
  userDetails!:IUserDetails
  KicUsersRoleId:any=RoleCode
  tabbingLinkData!:ITabbingLink
  uniqueKUID:any

  constructor(private _storageService:StorageService) { }

  ngOnInit(): void {    
    this.userDetails=this._storageService.getUserDetails()
  }

  changeDiscipline(event:any){
     this.discipline_id = event.target.value;
  }

  procurementData(data:any){
     this.uniqueKUID=data.uniqueKUID
  }


  dataoftabClicked(data:ITabbingLink){
    this.tabbingLinkData=data
  }

}

export interface ITabbingLink {
  data:any,
  check:string,
  stateId:string,
  stateName:string
}