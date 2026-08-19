import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StakeholderDashboardCardSummaryModalComponent } from '../stakeholder-dashboard-modals/stakeholder-dashboard-card-summary-modal/stakeholder-dashboard-card-summary-modal.component';

@Component({
  selector: 'app-stakeholder-dashboard-card-summary',
  templateUrl: './stakeholder-dashboard-card-summary.component.html',
  styleUrls: ['./stakeholder-dashboard-card-summary.component.scss']
})
export class StakeholderDashboardCardSummaryComponent implements OnInit {
@Input() cardList: any = [];
@Input() user_id:any;
@Input() role_id:any;
@Input() rduserId:any;
@Input() schemeId:any;
basePath:string = 'assets/images/'
@Input() type:string =''
  constructor(
    private _modalService:NgbModal
  ) { }

  ngOnInit() {
    // console.log(this.cardList)
  }
  replaceName(name:string){
    return name?.replace('icon-sport-','')
  }
  
  imageName(name:string){
    // .toLowerCase().replace(/ /g, "-") 
    return name
  }
  progressAthlete(no_of_athletes:number,ath_Vacant_strnth:number){
    if(ath_Vacant_strnth<=0){
      return 100
    }else{
      let progressbarStrength = (no_of_athletes*100)/ (no_of_athletes + ath_Vacant_strnth)
      return progressbarStrength
    }

  }
  progressCoach(no_of_Coaches:number,coach_Vacant_strnth:number){
    if(coach_Vacant_strnth<=0){
      return 100
    }else{
      let progressbarStrength = (no_of_Coaches*100)/ (no_of_Coaches + coach_Vacant_strnth)
      return progressbarStrength
    }

  }
  progressSportScientist(no_of_SS:number,sS_Vacant_strnth:number){
    if(sS_Vacant_strnth<=0){
      return 100
    }else{
      let progressbarStrength = (no_of_SS*100)/ (no_of_SS + sS_Vacant_strnth)
      return progressbarStrength
    }

  }
  openCardSummaryModal(data:any, type:any,tabIndex:number){
    // console.log(type)
    // console.log(data)
    const modalRef = this._modalService.open(StakeholderDashboardCardSummaryModalComponent,{
      size:'xl',
      centered: true,
      backdrop:'static',
      keyboard:false
    })
    modalRef.componentInstance.activeIndexTab = tabIndex
    modalRef.componentInstance.tabType = type
    modalRef.componentInstance.cardData = data
    modalRef.componentInstance.userId = this.user_id
    modalRef.componentInstance.roleId = this.role_id
    modalRef.componentInstance.rduserId = this.rduserId
    modalRef.componentInstance.schemeId = this.schemeId
  }
  

}
