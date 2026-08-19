import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StakeholderDashboardService } from 'src/app/_common/services/innerPagesServices/stakeholder-dashboard-service/stakeholder-dashboard.service';

@Component({
  selector: 'app-stakeholder-dashboard-rc-modal',
  templateUrl: './stakeholder-dashboard-rc-modal.component.html',
  styleUrls: ['./stakeholder-dashboard-rc-modal.component.css']
})
export class StakeholderDashboardRcModalComponent implements OnInit {

  
  activeIndexTab:number = 0;
  cardData:any;
  userId:any;
  roleId:any;
  rduserId:any;
  schemeId:any;
  loader:boolean = false;
  academyTabData:Array<any> = [];
  athleteTabData:Array<any> = [];
  coachTabData:Array<any> = [];
  sportScientistTabData:Array<any> = [];
  constructor(
    public activeModal:NgbActiveModal,
    private _stakeholderDashboardService:StakeholderDashboardService,
  ) {}

  ngOnInit() {
    this.getOpsStateWiseDetailData()
  }
  getOpsStateWiseDetailData(){
    this.loader = true;
    this.academyTabData = [];
    this.athleteTabData = [];
    this.coachTabData = [];
    this.sportScientistTabData = []
    this._stakeholderDashboardService.getOpsRCWiseDetailData(
      this.roleId,
      this.userId,
      this.rduserId,
      this.schemeId,
      this.cardData.name
    ).subscribe({
      next:(res:any)=>{
        this.loader = false
        this.academyTabData = res.filter((item:any)=>item.type.trim()==='Academy')
        this.athleteTabData = res.filter((item:any)=>item.type.trim()==='Ath')
        this.coachTabData = res.filter((item:any)=>item.type.trim()==='Coach')
        this.sportScientistTabData = res.filter((item:any)=>item.type.trim()==='SS')
      },
      error:(err)=>{
        this.loader = false
      }
    })    
  }

}
