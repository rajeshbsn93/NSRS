import { Component, OnInit } from '@angular/core';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicProposalService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-proposal.service';

@Component({
  selector: 'app-kisce-table-view',
  templateUrl: './kisce-table-view.component.html',
  styleUrls: ['./kisce-table-view.component.css']
})
export class KisceTableViewComponent implements OnInit {

 
  discipline_id!: number;
  userDetails!: IUserDetails;
  KicUsersRoleId: any = RoleCode;
  uniqueKUID: any;
  selectedIndex: number = 0;
  popupShow: boolean = false;

  


  constructor(private _storageService:StorageService,private _proposalService: KicProposalService) { }

  ngOnInit(): void {    
    this.userDetails=this._storageService.getUserDetails();
    this.userDetails = this._storageService.getUserDetails();
    this._proposalService.currentTabIndex.subscribe(index => this.selectedIndex = index);
  }

  changeDiscipline(event: any) {
    this.discipline_id = event.target.value;
  }

  procurementData(data: any) {
    this.uniqueKUID = data.uniqueKUID;
  }

  academyMaster(data:any){
    this.selectedIndex=data.selectedTabindex
  }

}