import { Component, OnInit } from '@angular/core';
import { KicProposalService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-proposal.service';
@Component({
  selector: 'app-ticketing-agency-list',
  templateUrl: './ticketing-agency-list.component.html',
  styleUrls: ['./ticketing-agency-list.component.css']
})
export class TicketingAgencyListComponent implements OnInit {
  activeIndexTab:number = 0;
  moduleType:any
  isLoading:boolean = false;
  proposalList:Array<any> = [];
  constructor(
    private _proposalService:KicProposalService
  ) { }

  ngOnInit() {
    this.getProposalList();
  }

  onTabChanged(event:any){
    console.log(event)
    this.getProposalList();
  }
  pendingBookingTab(event:any){
    console.log(event)
    // this.activeIndexTab = event
    this.getProposalList()
  }

  getProposalList() {
    this.moduleType = 'kic'
    let sessionId: string = JSON.parse(localStorage.getItem('sessiondata') || '')?.sessionId;
    this.isLoading = true;
    this._proposalService.getProposalList(sessionId, this.moduleType).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.proposalList = res.data || [];
      },
      error: (errors: any) => {
        this.isLoading = false;
      },
    });
  }

}
