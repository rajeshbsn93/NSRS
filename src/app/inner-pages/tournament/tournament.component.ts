import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AddTournamentComponent } from 'src/app/standalone_components/modal-window/addTournament/addTournament.component';
import { TournamentEventListComponent } from 'src/app/_common/modal-window/tournamentEventList/tournamentEventList.component';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { TournamentService } from 'src/app/_common/services/innerPagesServices/tournament.service';
import { AthleteAchievementTournamentComponent } from 'src/app/standalone_components/modal-window/athlete-achievement-tournament/athlete-achievement-tournament.component';

export interface PeriodicElement {
  category: string
  from_Date:string
  to_date:string
  tournament_Category_Id: number
  tournament_Category_Name: string
  tournament_Detail_Id: number
  tournament_Edition: number
  tournament_Level: string
  tournament_Name: string
  tournament_Year: number
  venue: string
  venue_city: number
  venue_country: number
  venue_place: string
  venue_state: number
}


@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements OnInit {
  tournamentFilterForm!:FormGroup;
  userDetails:any
  innerLoaderMainData:boolean = true;
  tournamentListData:any;
  displayedColumns: string[] = ['Name', 'tournament_Category_Name','Category', 'Level', 'from_Date','Event','venue','cash_Reward','Actions'];
  dataSource:any;
  docType: string = 'Export';
  @ViewChild('exporter') exporter: any
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('deletetournament') deletetournamentpopup:any;
  deletetournamentModalRef:any
  innerLoader:boolean = false;
  tournamentLevel:any;
  distinctCategory:any;
  distinctYear:any;
  searchedTournamentListData:any = [];
  deleteTournamentRes:any;
  tournamentCategoryList:any;
  deleteTournamentData:any;
  

  constructor(private tournamentService:TournamentService,private modalService: NgbModal, 
    private fb:FormBuilder,private swalAlert:AlertService,private storageService:StorageService
    ) { }

  ngOnInit() {
    this.userDetails=this.storageService.getUserDetails()
    this.filterTournamentFormBuilder()
    this.getTournamentList();
    this.gettournamentCategoryList()    
  }


  ngOnDestroy(){
    this.modalService.dismissAll()
  }

  filterTournamentFormBuilder(){
    this.tournamentFilterForm = this.fb.group({
      tournament_category_id:[''],
      level:[''],
      category:[''],
      year:['']
    })
  }

  getTournamentList(){
    const appId= 0;
    this.innerLoaderMainData=true
    this.tournamentService.tournamentList(this.userDetails.user_id,appId)
    .subscribe({
      next:(res)=>{
        this.innerLoaderMainData=false
        this.tournamentListData = res;
        this.searchedTournamentListData = this.tournamentListData;
        const ELEMENT_DATA: PeriodicElement[] = this.tournamentListData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.distinctYear = this.tournamentListData.filter(
          (thing:any, i:any, arr:any) => arr.findIndex((t:any) => t.tournament_Year === thing.tournament_Year) === i
        ).sort(function(a:any,b:any){
          return a.tournament_Year >= b.tournament_Year ? 1:-1; 
        });
      },
      error:()=>{
        console.error('error caught in tournament list')
          this.innerLoaderMainData = false;
      }
    })
  }

  //to filter data from tournament list(filters up list in UI)
  filterData(){
    this.searchedTournamentListData = this.tournamentListData;
    if(this.tournamentFilterForm.value.tournament_category_id != ''){
      this.searchedTournamentListData = this.searchedTournamentListData.filter((data:any)=>{
        if(Number(data.tournament_Category_Id) == Number(this.tournamentFilterForm.value.tournament_category_id)){
          return data
        }
      })
    }
    if(this.tournamentFilterForm.value.level != ''){
      this.searchedTournamentListData = this.searchedTournamentListData.filter((data:any)=>{
        if(data.tournament_Level.toLowerCase() == this.tournamentFilterForm.value.level.toLowerCase()){
          return data;
        }       
      })
    }
    if(this.tournamentFilterForm.value.category != ''){
      this.searchedTournamentListData = this.searchedTournamentListData.filter((data:any)=>{
        if(data.category.toLowerCase() == this.tournamentFilterForm.value.category.toLowerCase()){
          return data
        }
      })
    }
    if(this.tournamentFilterForm.value.year != ''){
      this.searchedTournamentListData = this.searchedTournamentListData.filter((data:any)=>{
        if(Number(data.tournament_Year) == Number(this.tournamentFilterForm.value.year)){
          return data;
        }
      })
    }
    if(this.tournamentFilterForm.value.tournament_category_id == '' && this.tournamentFilterForm.value.category == '' && this.tournamentFilterForm.value.level == '' &&
    this.tournamentFilterForm.value.year == ''){
      this.searchedTournamentListData = this.tournamentListData;  
    }

    this.dataSource = this.searchedTournamentListData;
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.searchedTournamentListData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort=this.sort
  }

  //api calling for tournament Catergory List dropdown
  gettournamentCategoryList(){
    this.innerLoader=true
    this.tournamentService.tournamentCategoryList().subscribe({
      next:(res)=>{
        this.innerLoader=false
        this.tournamentCategoryList = res;
      },
      error:()=>{
        console.error("error caught in tournament category list")
        this.innerLoader=false
      }
    })
  }

  //matfilter
  applyFilter(event:any){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToExcelPdfChange(event: any) {
    if (event == 'excel') {
      this.exporter.exportTable('xlsx', { fileName: 'tournament', sheet: 'sheet_name', Props: { Author: 'NSRS' } })
    } else if (event == 'pdf') {
      this.getPdf()
    }
  }

  //function to convert data to pdf
  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#tournamentTable' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { html: '#tournamentTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 8 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('tournament.pdf');
  }

  addEditTournament(elementRowData:any){
    //if elementRowData is null then edit tournament else add tournament
    if(elementRowData !=null){
      let currentDate: Date = new Date();
      let tournamentStartDate:Date = new Date(elementRowData.from_Date)
      if(tournamentStartDate > currentDate){
        const modalRef = this.modalService.open(AddTournamentComponent,{ size: 'xl', centered: true, backdrop: 'static', keyboard: false, });
        modalRef.componentInstance.elementRowData = elementRowData
        modalRef.result.then(() => {
          this.getTournamentList();
        },() => {
          this.getTournamentList();
        });
      }else{
      this.swalAlert.swalPopErrorTimer("Tournament already started can't be edit!");      
      }
    }else{
      const modalRef = this.modalService.open(AddTournamentComponent,{ size: 'xl', centered: true, backdrop: 'static', keyboard: false, });
      modalRef.componentInstance.elementRowData = elementRowData
      modalRef.result.then(() => {
      this.getTournamentList();
      },() => {
        this.getTournamentList();
      });
    }
  }

  
  deleteTounament(elementRowData:any){
    this.deleteTournamentData = elementRowData;
    let currentDate: Date = new Date();
    let tournamentStartDate:Date = new Date(elementRowData.from_Date)    
    if(tournamentStartDate > currentDate){
      this.deletetournamentModalRef = this.modalService.open(this.deletetournamentpopup,{size: 'md', centered: true,})
    }else{
      this.swalAlert.swalPopError("Tournament already stared can't be delete!")
    }
  }
 
  confirmDelete(){
    this.innerLoader=true
    this.tournamentService.deleteTournament(this.deleteTournamentData.tournament_Detail_Id)
    .subscribe({
      next:res=>{
        this.innerLoader=false
        this.deleteTournamentRes = res;
        if(this.deleteTournamentRes){
          this.swalAlert.swalPopSuccess("Your record has been deleted!")
          this.getTournamentList()
        }else{
          this.swalAlert.swalPopError("Your record can't be deleted!")
        }
        this.deletetournamentModalRef.close()
      },
      error:()=>{
        console.error('error caught in deleting tournament list')
        this.innerLoader = false;
      }
    })
  }

  viewEvent(elementRowData:any){
    const modalRefEvent = this.modalService.open(TournamentEventListComponent,{ size: 'xl', centered: true, backdrop: 'static', keyboard: false, }); 
    modalRefEvent.componentInstance.elementRowData = elementRowData;
  }
  achievementTournament(elementRowData:any){
    const athleteAchievementModalRef = this.modalService.open(
      AthleteAchievementTournamentComponent,
      {size:'xl',centered:true,backdrop:'static',keyboard:false}
    );
    athleteAchievementModalRef.componentInstance.elementRowData = elementRowData
  }
}