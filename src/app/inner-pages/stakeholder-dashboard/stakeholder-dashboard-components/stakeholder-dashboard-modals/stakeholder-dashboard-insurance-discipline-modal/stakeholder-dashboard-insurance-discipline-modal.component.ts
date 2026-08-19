import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { OpsInsuranceDetailDataEntity, StakeholderDashboardService } from 'src/app/_common/services/innerPagesServices/stakeholder-dashboard-service/stakeholder-dashboard.service';

@Component({
  selector: 'app-stakeholder-dashboard-insurance-discipline-modal',
  templateUrl: './stakeholder-dashboard-insurance-discipline-modal.component.html',
  styleUrls: ['./stakeholder-dashboard-insurance-discipline-modal.component.css']
})
export class StakeholderDashboardInsuranceDisciplineModalComponent implements OnInit {

  insuranceChartType:any;
  userId:any;
  roleId:any;
  rduserId:any;
  schemeId:any
  disciplineName!:string;
  insuranceTableColumns:String[] =['academy_Name','insured','pending','expired','not_insured']
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  dataSource = new MatTableDataSource<OpsInsuranceDetailDataEntity>();
  loader:boolean = false;
  dataRoleId!:number;

  constructor(
    public activeModal:NgbActiveModal,
    private _stakeholderDashboardService:StakeholderDashboardService,
  ) { }

  ngOnInit() {
    this.dataRoleId  = this.insuranceChartType.trim() === 'Athlete' ? 1 : this.insuranceChartType.trim() === 'Coach' ? 2 : 3
    // console.log(this.disciplineName)
    this.getDisciplineWiseAthleteVacancy();
  }

  getDisciplineWiseAthleteVacancy(){
    this.loader = true
    this._stakeholderDashboardService.getOpsInsuranceDetailData(
      this.roleId,
      this.userId,
      this.rduserId,
      this.schemeId,
      this.dataRoleId,
      this.disciplineName
    ).subscribe({
      next:(res:any)=>{
        this.loader = false;
        // console.log(res)
        this.dataSource = new MatTableDataSource<OpsInsuranceDetailDataEntity>(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      },
      error:(err)=>{
        this.loader = false
        console.error(err)
      }
    })
  }

}
