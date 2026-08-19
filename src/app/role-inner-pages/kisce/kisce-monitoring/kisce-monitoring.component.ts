import { Component, OnInit } from '@angular/core';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';

@Component({
  selector: 'app-kisce-monitoring',
  templateUrl: './kisce-monitoring.component.html',
  styleUrls: ['./kisce-monitoring.component.css']
})
export class KisceMonitoringComponent implements OnInit {

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
    console.log('data11111111',data);
    // console.log('datta target ',data);
    
    this.tabbingLinkData=data
  }

}

export interface ITabbingLink {
  data:any,
  check:string,
  stateId:string,
  stateName:string
}


