import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StakeholderDashboardRcModalComponent } from '../stakeholder-dashboard-modals/stakeholder-dashboard-rc-modals/stakeholder-dashboard-rc-modal/stakeholder-dashboard-rc-modal.component';

@Component({
  selector: 'app-stakeholder-dashboard-rc',
  templateUrl: './stakeholder-dashboard-rc.component.html',
  styleUrls: ['./stakeholder-dashboard-rc.component.scss']
})
export class StakeholderDashboardRcComponent implements OnInit {
  @Input() rcListData: any = [];
  @Input() user_id:any;
  @Input() role_id:any;
  @Input() rduserId:any;
  @Input() schemeId:any;
  constructor(private _modalService:NgbModal) { }

  ngOnInit() {
    // console.log(this.rcListData)
  }

  openCardSummaryModal(data:any,tabIndex:number){
    const modalRef = this._modalService.open(StakeholderDashboardRcModalComponent,{
      size:'xl',
      centered: true,
      backdrop:'static',
      keyboard:false
    })
    modalRef.componentInstance.activeIndexTab = tabIndex
    modalRef.componentInstance.cardData = data
    modalRef.componentInstance.userId = this.user_id
    modalRef.componentInstance.roleId = this.role_id
    modalRef.componentInstance.rduserId = this.rduserId
    modalRef.componentInstance.schemeId = this.schemeId
  }

}
