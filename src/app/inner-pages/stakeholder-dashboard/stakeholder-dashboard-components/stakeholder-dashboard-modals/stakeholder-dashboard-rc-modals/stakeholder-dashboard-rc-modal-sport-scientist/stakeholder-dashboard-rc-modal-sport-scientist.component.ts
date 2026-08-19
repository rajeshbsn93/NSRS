import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpsRCWiseDetailDataEntity } from 'src/app/_common/services/innerPagesServices/stakeholder-dashboard-service/stakeholder-dashboard.service';

@Component({
  selector: 'app-stakeholder-dashboard-rc-modal-sport-scientist',
  templateUrl: './stakeholder-dashboard-rc-modal-sport-scientist.component.html',
  styleUrls: ['./stakeholder-dashboard-rc-modal-sport-scientist.component.css']
})
export class StakeholderDashboardRcModalSportScientistComponent implements OnInit {

  tableColumns:String[] =['academy_Name','nsrs_Id','name']
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  @Input() sportScientistData:any
  dataSource = new MatTableDataSource<OpsRCWiseDetailDataEntity>();
  constructor() { }

  ngOnInit() {
    // console.log('sportScientistData', this.sportScientistData)
    this.dataSource = new MatTableDataSource<OpsRCWiseDetailDataEntity>(this.sportScientistData)
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
  }

}
