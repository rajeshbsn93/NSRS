import { Component, OnInit } from '@angular/core';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';

@Component({
  selector: 'app-kisce-stakeholder',
  templateUrl: './kisce-stakeholder.component.html',
  styleUrls: ['./kisce-stakeholder.component.css']
})
export class KisceStakeholderComponent implements OnInit {
  userDetails: any
  roleCode: any = RoleCode
  isDash:string|null='false' 

  constructor(private _storageService: StorageService) {
    this.userDetails = this._storageService.getUserDetails();
  }

  ngOnInit(): void {
   this.isDash = localStorage.getItem('isDash') ?  localStorage.getItem('isDash') :'false'
  }

}
