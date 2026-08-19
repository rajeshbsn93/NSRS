import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { CoachesForCashRewardComponent } from '../../modal-window/athlete-dashboard-modal/coaches-for-cash-reward/coaches-for-cash-reward.component';
import { AthleteCoachACTCService, PlayerACTCProposalListDataEntity, PlayerACTCProposalListEntity } from 'src/app/_common/services/common-services/athlete-coach-Actc.service';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-athlete-information-actc',
  templateUrl: './athlete-information-actc.component.html',
  styleUrls: ['./athlete-information-actc.component.css'],
  standalone:true,
  imports:[CommonModule,MaterialModule,LoaderComponent,FormsModule,MatTooltipModule]
})
export class AthleteInformationActcComponent implements OnInit {
@Input() userSessionData:any;
@ViewChild(MatPaginator) paginator!:MatPaginator;
@ViewChild(MatSort) sort!:MatSort
playerACTCProposalListTableColumns: string[] = ['sn', 'tournament_name','category', 'duration','event','venue','position','doc','result','athlete_verification_report','declartion','application_Status', 'fund_status' ,'action'];
playerACTCProposalList = new MatTableDataSource<any>();
loader:boolean = false;
proposalHeadSelectdVal = 'IE'
proposalHead = [
  {name:'Internation Exposure', value:'IE'},
  {name:'National Coaching Camp', value:'NCC'},
]
fileBaseUrlActc = environment.fileUrlACTC
  constructor(
    private modalService:NgbModal,
    private athleteCoachActcService:AthleteCoachACTCService,
    private alertService:AlertService,
  ) { 
  }

  ngOnInit() {
    this.getPlayerACTCProposalList(this.proposalHeadSelectdVal)
  }

  getPlayerACTCProposalList(ProposalHead:string){
    this.loader = true
    this.athleteCoachActcService.getPlayerACTCProposalList(this.userSessionData.userData.user_id,ProposalHead).pipe(map((items:any)=>{
      let itemsData = items.data.map((item:any, index:any) => ({
        ...item,
        sln: index + 1 
      }));
      items.data = itemsData
      return items
    })).subscribe({
      next:(res:PlayerACTCProposalListEntity)=>{
        this.loader = false;
        if(res.status){
          this.playerACTCProposalList = new MatTableDataSource<PlayerACTCProposalListDataEntity>(res.data)
          this.playerACTCProposalList.paginator = this.paginator;
          this.playerACTCProposalList.sort = this.sort
        }else{
          this.alertService.swalPopError(res.message)
        }
      },
      error:(err)=>{
        this.loader = false;
        console.error(err)
      }
    })
  }
  changeProposal(event:any){
    this.proposalHeadSelectdVal = event;
    // if(event=='IE' && !this.playerACTCProposalListTableColumns.includes('action')){
    //   this.playerACTCProposalListTableColumns.push('action')
    // }else if(event!='IE' && this.playerACTCProposalListTableColumns.includes('action')){
    //   this.playerACTCProposalListTableColumns.pop()
    // }
    this.getPlayerACTCProposalList(this.proposalHeadSelectdVal)
  }

  coachCashReward(elementRow:any){
    const modalRef = this.modalService.open(
      CoachesForCashRewardComponent,
      {
      size:'xl',
      centered:true,
      keyboard:false,
      backdrop:'static'
    })
    elementRow.Player_Detail_id = this.userSessionData.userData.user_id
    modalRef.componentInstance.rowData = elementRow
  }

}
