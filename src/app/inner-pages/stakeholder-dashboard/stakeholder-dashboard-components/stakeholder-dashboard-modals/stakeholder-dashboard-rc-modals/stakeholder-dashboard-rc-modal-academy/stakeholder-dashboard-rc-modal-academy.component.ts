import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpsRCWiseDetailDataEntity } from 'src/app/_common/services/innerPagesServices/stakeholder-dashboard-service/stakeholder-dashboard.service';

@Component({
  selector: 'app-stakeholder-dashboard-rc-modal-academy',
  templateUrl: './stakeholder-dashboard-rc-modal-academy.component.html',
  styleUrls: ['./stakeholder-dashboard-rc-modal-academy.component.css']
})
export class StakeholderDashboardRcModalAcademyComponent implements OnInit {

  tableColumns:String[] =['nsrs_Id','academy_Name','no_of_athletes','no_of_Coaches','no_of_SS']
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  @Input() academyData:any
  dataSource = new MatTableDataSource<OpsRCWiseDetailDataEntity>();
  constructor() { }

  ngOnInit() {
    // console.log('academyData', this.academyData)
    this.dataSource = new MatTableDataSource<OpsRCWiseDetailDataEntity>(this.academyData)
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
  }

}
