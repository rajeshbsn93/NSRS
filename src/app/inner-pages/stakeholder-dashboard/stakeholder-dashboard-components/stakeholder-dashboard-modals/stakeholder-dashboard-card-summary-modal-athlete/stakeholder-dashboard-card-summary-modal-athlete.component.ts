import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpsStateWiseDetailDataEntity } from 'src/app/_common/services/innerPagesServices/stakeholder-dashboard-service/stakeholder-dashboard.service';

@Component({
  selector: 'app-stakeholder-dashboard-card-summary-modal-athlete',
  templateUrl: './stakeholder-dashboard-card-summary-modal-athlete.component.html',
  styleUrls: ['./stakeholder-dashboard-card-summary-modal-athlete.component.css']
})
export class StakeholderDashboardCardSummaryModalAthleteComponent implements OnInit {

  tableColumns:String[] =['academy_Name','nsrs_Id','name']
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  @Input() tabType:any;
  @Input() athleteData:any
  dataSource = new MatTableDataSource<OpsStateWiseDetailDataEntity>();
  constructor() { }

  ngOnInit() {
    // console.log('athlete', this.athleteData,this.tabType)
    this.dataSource = new MatTableDataSource<OpsStateWiseDetailDataEntity>(this.athleteData)
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
  }

}
