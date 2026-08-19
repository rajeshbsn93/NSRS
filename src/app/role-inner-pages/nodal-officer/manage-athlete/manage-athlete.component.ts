import { Component, OnInit } from '@angular/core';
import { first, forkJoin } from 'rxjs';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { ManageAthleteService } from 'src/app/_common/services/nodal-officer-service/manage-athlete.service';

@Component({
  selector: 'app-manage-athlete',
  templateUrl: './manage-athlete.component.html',
  styleUrls: ['./manage-athlete.component.css']
})
export class ManageAthleteComponent implements OnInit {
  selectedTabIndex:number =0
  loader:boolean = false;
  userDetail:any;
  constructor() { }

  ngOnInit() {
  }
  selectedIndexChange(event:any){
    this.selectedTabIndex = event
  }
  
  
  
}
