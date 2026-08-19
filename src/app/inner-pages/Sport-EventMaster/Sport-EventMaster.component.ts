import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TournamentCreatEventComponent } from 'src/app/_common/modal-window/tournamentCreatEvent/tournamentCreatEvent.component';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { TournamentService } from 'src/app/_common/services/innerPagesServices/tournament.service';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  "event_id": number,
  "event_name": string,
  "sport_id": number,
  "sport": string,
  "gender_category": string,
  "event_type": string,
  "age_category": string
    
  }

@Component({
  selector: 'app-Sport-EventMaster',
  templateUrl: './Sport-EventMaster.component.html',
  styleUrls: ['./Sport-EventMaster.component.css']
})
export class SportEventMasterComponent implements OnInit {
  eventtFilterForm!:FormGroup;
  innerLoader:boolean = false;
  innerLoaderMainData:boolean = false;
  innerLoaderEventList:boolean = false;
  userid:any;
  roleid:any;
  isloading:boolean = true;
  eventListData:any;
  // displayedColumns: string[] = ['event_name', 'sport','gender_category', 'event_type', 'age_category','Actions'];
  displayedColumns: string[] = ['event_name', 'sport','gender_category', 'event_type'];
  dataSource:any;
  deleteInsurancePopup:any
  docType: string = 'Export';
  @ViewChild('exporter') exporter: any
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  @ViewChild('deletetournament') deleteInsurancePop: any;
  sportList:any;
  deleteEventMasterData:any

  searchedeventListData:any = [];

  constructor(private tournamentService:TournamentService,private modalService: NgbModal, private fb:FormBuilder,
   private sharableService:SharableService ) { }

  ngOnInit() {
    var temp: any = localStorage.getItem('loginUserdata');
    var tempData = JSON.parse(temp);
    this.userid = tempData.user_id;
    this.roleid = tempData.role_id;
    // console.log(this.userid);
    this.filterTournamentEvent()
    this.getEventList();
    this.getSportList()
  }


  ngOnDestroy(){
    this.modalService.dismissAll()
  }

  filterTournamentEvent(){
    this.eventtFilterForm = this.fb.group({
      discipline:[''],
      gender_category:[''],
      event_type:[''],
      // age_category:['']
    })
  }

  getEventList(){
    const appId= 1;
    const sport_id=0;
    this.innerLoaderEventList=true
    this.tournamentService.GetEventdetailSportwise(sport_id).subscribe((res:any)=>{
      this.innerLoaderEventList=false
      // console.log(res)
      this.eventListData = res;
      this.searchedeventListData = this.eventListData;
        const ELEMENT_DATA: PeriodicElement[] = this.eventListData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    },(error)=>{
      console.error('error caught in getting event sportwise')
      // this.errorMessage = error;
      this.innerLoaderEventList = false;
    })
  }
  getSportList(){
    this.innerLoader=true
    this.sharableService.sportList().subscribe(res=>{
      // console.log('getSportList',res);
      this.innerLoader=false
      this.sportList = res
    },(error)=>{
      console.error('error caught in sport list')
      // this.errorMessage = error;
      this.innerLoader = false;
    })
  }
  

  filterData(){
    this.searchedeventListData = this.eventListData;
    // console.log(this.eventtFilterForm.value)
    // console.log(this.searchedeventListData)
    if(this.eventtFilterForm.value.discipline != ''){
      this.searchedeventListData = this.searchedeventListData.filter((data:any)=>{
        if(data.sport?.toLowerCase() == this.eventtFilterForm?.value?.discipline?.toLowerCase()){
          // console.log(data.sport_id)
          return data
        }

      })
    }
    if(this.eventtFilterForm.value.gender_category != ''){
      this.searchedeventListData = this.searchedeventListData.filter((data:any)=>{
        if(data.gender_category?.toLowerCase() == this.eventtFilterForm?.value?.gender_category?.toLowerCase()){
          // console.log(data.gender_category.toLowerCase())
          return data;
        }       
      })
      
    }

    if(this.eventtFilterForm.value.event_type != ''){
      this.searchedeventListData = this.searchedeventListData.filter((data:any)=>{
        if(data.event_type?.toLowerCase() == this.eventtFilterForm?.value?.event_type?.toLowerCase()){
          return data
        }

      })
    }

    if(this.eventtFilterForm.value.discipline == '' && this.eventtFilterForm.value.gender_category == '' && this.eventtFilterForm.value.event_type == ''){
      this.searchedeventListData = this.eventListData;  
    }

    this.dataSource = this.searchedeventListData;
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.searchedeventListData);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort=this.sort
  }


  applyFilter(event:any){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectChange(event: any) {
    if (event == 'excel') {
      this.exporter.exportTable('xlsx', { fileName: 'EventMaster', sheet: 'EventMaster', Props: { Author: 'NSRS' } })
    } else if (event == 'pdf') {
      this.getPdf()
    }
  }

  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#eventMasterTable' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { html: '#eventMasterTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 8 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('EventMaster.pdf');
  }

  creatEvent(){
    const modalRefEvent = this.modalService.open(TournamentCreatEventComponent,{ size: 'xl', centered: true, backdrop: 'static', keyboard: false, }); 
    modalRefEvent.result.then(res=>{
      this.getEventList()

    })  
  }
  
  deleteEvent(elementRowData:any){
    // console.log(elementRowData)
    this.deleteEventMasterData=elementRowData
    this.deleteInsurancePopup = this.modalService.open(this.deleteInsurancePop, {
      size: 'md',
      centered: true,
    });
  }
  confirmDelete(){
    this.deleteInsurancePopup.close()
    this.innerLoader=true
    this.tournamentService.deleteEventMaster(this.deleteEventMasterData.event_id,this.userid).subscribe(res=>{
      this.innerLoader=false
      // console.log(res)
      if(res){
        this.getEventList()
        Swal.fire({
          icon:'success',
          position:"center",
          text:'Your record has been deleted!',
          showConfirmButton: true,
      })
      }else{
        Swal.fire({
          icon:'error',
          position:"center",
          text:"You can't delete!",
          showConfirmButton: true,
      })
      }
  },(error)=>{
    console.error('error caught in scheme list')
    // this.errorMessage = error;
    this.innerLoader = false;
  })
}
}
