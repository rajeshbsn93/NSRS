import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpsStateWiseDetailDataEntity } from 'src/app/_common/services/innerPagesServices/stakeholder-dashboard-service/stakeholder-dashboard.service';

@Component({
  selector: 'app-stakeholder-dashboard-card-summary-modal-coach',
  templateUrl: './stakeholder-dashboard-card-summary-modal-coach.component.html',
  styleUrls: ['./stakeholder-dashboard-card-summary-modal-coach.component.css']
})
export class StakeholderDashboardCardSummaryModalCoachComponent implements OnInit {

  tableColumns:String[] =['academy_Name','nsrs_Id','name']
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  @Input() tabType:any;
  @Input() coachData:any
  dataSource = new MatTableDataSource<OpsStateWiseDetailDataEntity>();
  constructor() { }

  ngOnInit() {
    // console.log('coach', this.coachData)
    this.dataSource = new MatTableDataSource<OpsStateWiseDetailDataEntity>(this.coachData)
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
  }

}
