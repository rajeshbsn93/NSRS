import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpsStateWiseDetailDataEntity } from 'src/app/_common/services/innerPagesServices/stakeholder-dashboard-service/stakeholder-dashboard.service';

@Component({
  selector: 'app-stakeholder-dashboard-card-summary-modal-academy',
  templateUrl: './stakeholder-dashboard-card-summary-modal-academy.component.html',
  styleUrls: ['./stakeholder-dashboard-card-summary-modal-academy.component.css']
})
export class StakeholderDashboardCardSummaryModalAcademyComponent implements OnInit, AfterViewInit {
  insuranceTableColumns:String[] =['nsrs_Id','academy_Name',]
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  @Input() academyData:any
  dataSource = new MatTableDataSource<OpsStateWiseDetailDataEntity>();
  constructor() { }

  ngOnInit() {
    // console.log('academyData', this.academyData)
    this.dataSource = new MatTableDataSource<OpsStateWiseDetailDataEntity>(this.academyData)
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
  }

}
