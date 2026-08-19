import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OpsGraphDetailDataEntity } from 'src/app/_common/services/innerPagesServices/stakeholder-dashboard-service/stakeholder-dashboard.service';

@Component({
  selector: 'app-stakeholder-dashboard-overview-common-modals',
  templateUrl: './stakeholder-dashboard-overview-common-modals.component.html',
  styleUrls: ['./stakeholder-dashboard-overview-common-modals.component.css']
})
export class StakeholderDashboardOverviewCommonModalsComponent implements OnInit, AfterViewInit {
  overViewTableData:any;
  disciplineName:any;
  userDetails:any;
  chartClickType:any
  overViewTableColumnsChart1:String[] =['academy_name','athletes','coaches','sportsScientists']
  overViewTableColumnsChart2:String[] =['academy_name','athletes','coaches']
  overViewTableColumnsChart3:String[] =['academy_name','sportsScientists']
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  dataSource = new MatTableDataSource<OpsGraphDetailDataEntity>();
  loader:boolean = false
  constructor(
    public activeModal:NgbActiveModal
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<OpsGraphDetailDataEntity>(this.overViewTableData);        
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
  }

}
