import { Component, OnInit } from '@angular/core';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';

@Component({
  selector: 'app-kic-stakeholder',
  templateUrl: './kic-stakeholder.component.html',
  styleUrls: ['./kic-stakeholder.component.css']
})
export class KicStakeholderComponent implements OnInit {
  userDetails: any
  roleCode: any = RoleCode

  constructor(private _storageService: StorageService) {
    this.userDetails = this._storageService.getUserDetails();
  }

  ngOnInit(): void {

  }

}
