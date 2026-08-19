import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DisciplineWiseAthleteVacancyEntity, StakeholderDashboardService } from 'src/app/_common/services/innerPagesServices/stakeholder-dashboard-service/stakeholder-dashboard.service';

@Component({
  selector: 'app-stakeholder-dashboard-vacancy-modal',
  templateUrl: './stakeholder-dashboard-vacancy-modal.component.html',
  styleUrls: ['./stakeholder-dashboard-vacancy-modal.component.css']
})
export class StakeholderDashboardVacancyModalComponent implements OnInit {
  vacancyType:any;
  userId:any;
  roleId:any;
  rduserId:any;
  schemeId:any
  sportName!:string;
  vacancyTableColumns:String[] =['academy_Name','type','no_athlete','vacancy']
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  dataSource = new MatTableDataSource<DisciplineWiseAthleteVacancyEntity>();
  loader:boolean = false

  constructor(
    public activeModal:NgbActiveModal,
    private _stakeholderDashboardService:StakeholderDashboardService,
  ) { }

  ngOnInit() {
    // console.log(this.sportName)
    this.getDisciplineWiseAthleteVacancy();
  }

  getDisciplineWiseAthleteVacancy(){
    this.loader = true
    this._stakeholderDashboardService.getDisciplineWiseAthleteVacancy(
      this.roleId,
      this.userId,
      this.rduserId,
      this.schemeId,
      this.sportName
    ).subscribe({
      next:(res:any)=>{
        this.loader = false;
        // console.log(res)
        this.dataSource = new MatTableDataSource<DisciplineWiseAthleteVacancyEntity>(res);
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
