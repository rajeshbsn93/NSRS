import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TournamentService } from '../../services/innerPagesServices/tournament.service';


export interface PeriodicElement {
    event_Name: string,
    category: string,
    gender_category: string,
    event_Type: string,
    sport_Name: string,
    age_Group: string
}

@Component({
  selector: 'app-tournamentEventList',
  templateUrl: './tournamentEventList.component.html',
  styleUrls: ['./tournamentEventList.component.css']
})
export class TournamentEventListComponent implements OnInit {

  elementRowData:any;
  dataSource: any;
  @ViewChild('exporter') exporter:any
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  eventListData:any;
  tournament_Category_Name:any;
  innerLoaderMainData:boolean = false;


  constructor(public activeModal: NgbActiveModal, private tournamentService:TournamentService) { }

  // displayedColumns: string[] = ['event_Name','category','gender_category','event_Type','sport_Name','age_Group',];
  displayedColumns: string[] = ['event_Name','gender_category','event_Type','sport_Name'];

  ngOnInit() {
    //console.log(this.elementRowData)
    this.getEventList();
    this.tournament_Category_Name = this.elementRowData.tournament_Category_Name;
  }

  getEventList(){
    const tournamentId = this.elementRowData.tournament_Detail_Id
    //console.log(tournamentId)
    this.innerLoaderMainData = true;
    this.tournamentService.viewEventList(tournamentId).subscribe(res=>{
      this.innerLoaderMainData = false;
      //console.log('eventlistData',res)
      this.eventListData = res;
      const eventDataList:PeriodicElement[] = this.eventListData;
      this.dataSource = new MatTableDataSource<PeriodicElement>(eventDataList);
      this.dataSource.paginator = this.paginator
    },(error)=>{
      console.error("error caught in event list")
      this.innerLoaderMainData=false
    })
  }

}
