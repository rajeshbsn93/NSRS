import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from '../../../_common/services/innerPagesServices/authentication.service';
import { MatPaginator } from '@angular/material/paginator';
import { SportTrainingService } from '../../../_common/services/innerPagesServices/sportTraining.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LoaderComponent } from '../../loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/_common/material.module';
import { CommonModule } from '@angular/common';

export interface PeriodicElement {
  nsrsid: string;
  name: number;
  discipline: string;
  gender: string;
  mobile: string;
  email: string;
  joiningDate: string;
}

@Component({
  selector: 'app-academy-detailList',
  templateUrl: './academy-detailList.component.html',
  styleUrls: ['./academy-detailList.component.css'],
  standalone:true,
  imports:[LoaderComponent,ReactiveFormsModule,MaterialModule,CommonModule,FormsModule]
})
export class AcademyDetailListComponent implements OnInit{
  data: any;
  academyId!: number;
  listType!: number;
  academyDetailData: any;
  dataSource: any;
  isloading: boolean = true;
  docType:string ='Export';
  M_Count = 0;
  F_Count = 0;
  academyPermisssionData:any;
  viewPermission:any;
  exportPermission:any
@ViewChild('exporter') exporter:any
@ViewChild(MatPaginator) paginator!: MatPaginator;
innerLoaderMainData:boolean = false;
   
  constructor(
    public activeModal: NgbActiveModal,
    private sportTrainingService:SportTrainingService,
    private authenticationService: AuthenticationService
  ) {}

  displayedColumns: string[] = [
    'nsrsid',
    'name',
    'discipline',
    'gender',
    'mobile',
    'email',
    'joiningDate',
  ];
  
  ngOnInit() {
    this.academyId = this.data.rowData.academy_detail_id;
    this.listType = this.data.userId;
    this.getAcademyDetailList();
  }



  getAcademyDetailList() {
    if (this.authenticationService.isLoggedIn()) {
      this.innerLoaderMainData = true
      this.sportTrainingService
        .academyDetailList(this.academyId, this.listType)
        .subscribe((res: any) => {
          this.innerLoaderMainData = false
          this.isloading = false;
          this.academyDetailData = res;
          this.F_Count = this.academyDetailData.filter((data: any) => {
            if (data.gender == 'F') {
              return data;
            }
          }).length;
          this.M_Count = this.academyDetailData.filter((data: any) => {
            if (data.gender == 'M') {
              return data;
            }
          }).length;
          const academyDetailList: PeriodicElement[] = this.academyDetailData;
          this.dataSource = new MatTableDataSource<PeriodicElement>(academyDetailList);
          this.dataSource.paginator = this.paginator;
        },(error)=>{
          //console.log("error caught in academy list")
          this.innerLoaderMainData=false
        });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectChange(event:any){
    if(event == 'excel'){
     this.exporter.exportTable('xlsx', {fileName:'Academy', sheet: 'sheet_name', Props: {Author: 'NSRS'}})
    }else if(event == 'pdf'){
     this.getPdf()
   
    }
   }

   getPdf(){
    const doc = new jsPDF();
    var img= new Image();
      img.src='../assets/images/NSRS.png';
      const temp = new jsPDF() 
      autoTable(temp, { html: '#academyDetailTable'});
     for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
        doc.addImage(img,'png',0,0,200,250);
        doc.addPage();
      }
      doc.setPage(1);
      autoTable(doc, { html: '#academyDetailTable',headStyles:{valign:'middle',fillColor:'#1F60AB',fontSize:8},theme:'grid',bodyStyles:{fontSize:7,fillColor:false,textColor:'#000'}});
      doc.deletePage(temp.getNumberOfPages()+1);
      doc.save('academyDetailTable.pdf');
  }

}
