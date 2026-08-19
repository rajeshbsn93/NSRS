import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { OpsReportService } from 'src/app/_common/services/innerPagesServices/ops-report.service';
import { OpsFilterComponent } from './ops-filter/ops-filter.component';



@Component({
  selector: 'app-ops-report',
  templateUrl: './ops-report.component.html',
  styleUrls: ['./ops-report.component.css']
})
export class OpsReportComponent implements OnInit {
 
  userData:any
  isAthleteOrCoach:string='acss'
  constructor(private fb: FormBuilder,
    private opsReportService:OpsReportService,
    private storageService:StorageService) {

  }

  ngOnInit(): void {
   this.userData = this.storageService.getUserDetails()
  }

  exportToExcelPdfChange(e:any){
           this.isAthleteOrCoach=e.target.value
  }



 
}