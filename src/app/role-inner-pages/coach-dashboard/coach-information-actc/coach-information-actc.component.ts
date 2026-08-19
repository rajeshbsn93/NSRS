import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/_common/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { PlayerACTCProposalListEntity, PlayerACTCProposalListDataEntity } from 'src/app/_common/services/common-services/athlete-coach-Actc.service';
import { environment } from 'src/environments/environment';
import { LoaderComponent } from "../../../standalone_components/loader/loader.component";
import { CoachingInfoService } from 'src/app/_common/services/role-inner-pages-services/coach-services/coaching-info.service';


@Component({
  selector: 'app-coach-information-actc',
  templateUrl: './coach-information-actc.component.html',
  styleUrls: ['./coach-information-actc.component.css'],
  standalone:true,
  imports: [CommonModule, MaterialModule, FormsModule, LoaderComponent]
})
export class CoachInformationActcComponent implements OnInit {
@Input() userSessionData:any;
@ViewChild(MatPaginator) paginator!:MatPaginator;
@ViewChild(MatSort) sort!:MatSort
coachCashACTCAwardTableColumns: string[] = ['sn','athlete_name','training_level', 'tournament_name','category', 'duration','event','venue','position','doc','status','application_Status','fund_status',];
coachCashCTCAwardList = new MatTableDataSource<any>();
loader:boolean = false;
proposalHeadSelectdVal = 'IE'
proposalHead = [
  {name:'Internation Exposure', value:'IE'},
  {name:'National Coaching Camp', value:'NCC'},
]
fileBaseUrlActc = environment.fileUrlACTC
  constructor(
    private coachingInfoService: CoachingInfoService,
    private alertService:AlertService,
  ) { 
  }

  ngOnInit() {
    this.getCoachCashAwardDetails(this.proposalHeadSelectdVal)
  }

  getCoachCashAwardDetails(ProposalHead:string){
   
    this.loader = true
    this.coachingInfoService.getCoachCashAwardDetails(this.userSessionData.userData.user_id,ProposalHead).pipe(map((items:any)=>{
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
          this.coachCashCTCAwardList = new MatTableDataSource<PlayerACTCProposalListDataEntity>(res.data)
          this.coachCashCTCAwardList.paginator = this.paginator;
          this.coachCashCTCAwardList.sort = this.sort
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
    this.getCoachCashAwardDetails(this.proposalHeadSelectdVal)
  }

}

