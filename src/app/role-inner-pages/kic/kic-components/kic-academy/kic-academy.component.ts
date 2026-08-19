import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { CommonSharableService, IGetStateMasterObject, IGetStateMasterObjectArray } from 'src/app/_common/services/common-services/commonSharable.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicAttendanceService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-attendance.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { AcademyDetailListComponent } from 'src/app/standalone_components/modal-window/academy-detailList/academy-detailList.component';

@Component({
  selector: 'app-kic-academy',
  templateUrl: './kic-academy.component.html',
  styleUrls: ['./kic-academy.component.css'],
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent,MatTooltipModule]
})
export class KicAcademyComponent implements OnInit {

  displayedColumns: string[] = ['sno','nsrs_id','academy_name','scheme_name','athleteCount','coachCount','sportScientistCount','sports_name','state_name'];
  dataSource: any;
  mainLoader:Boolean=false
  loader1:Boolean=false
  loader2:Boolean=false
  academyList:any
  filteredAcademyList:any
  sportMasterList!:Array<any>
  stateMasterList!:Array<IGetStateMasterObject>
  proposalList: any[] = [];

  userDetails!:IUserDetails
  academySearchFilter!:FormGroup
  moduleType:any='';
  
  ListTypeUserId: any = {
    athleteUserid: 1,
    coachUserid: 2,
    ssUserid: 103,
  };

  @ViewChild(MatPaginator) paginator!:MatPaginator
  @ViewChild(MatSort) sort!:MatSort

  @ViewChild('exporter') exporter: any

  constructor(private _storageService:StorageService,private _commonSharableService:CommonSharableService,private _router:Router,
    private _kicAttendanceService:KicAttendanceService,private _fb:FormBuilder,private _alertService:AlertService,private modalService:NgbModal) { }

  ngOnInit(): void {
    if(this._router.url=='/kisce'){
      this.moduleType="kisce"
    }else{
      this.moduleType='kic'
    }
    this.userDetails=this._storageService.getUserDetails()
    this.createAcademySearchFilter()
    this.getStateMasterList()
    this.getSportMasterList()
    this.getAcademyList()
  }

  //creating reactive form for filters on the academy list
  createAcademySearchFilter(){
    this.academySearchFilter=this._fb.group({
      nsrsid:[''],
      academyName:[''],
      stateId:[''],
      discipline:[''],
      operationalStatus:['']
    })
  }

  //sport master list to bind on dropdown for filtering data
  getSportMasterList(){
    this.loader2=true
    this._commonSharableService.getSportMasterList().subscribe({
      next:(res:any)=>{
        console.log(res)
        this.loader2=false
        this.sportMasterList=res
      },
      error:()=>{
        this.loader2=false
      }
    })
  }

  //state master list for country INDIA countryId=1 to bind on dropdown for filtering data
  getStateMasterList(){
    this.loader1=true
    this._commonSharableService.stateMasterList(1).subscribe({
      next:(res:any)=>{
        this.loader1=false
        this.stateMasterList=res
        console.log(res)
      },
      error:()=>{
        this.loader1=false
      }
    })
  }

  //api calling for getting academy list with scheme id =82 static for kIC
  getAcademyList(){
    var id=this.moduleType=='kisce' ? 80 : 82
    
    this.mainLoader=true
    this._kicAttendanceService.getKicAcademyList(this.userDetails.user_id,id).subscribe({
      next:(res:any)=>{
        this.mainLoader=false
        // if(res.code==200){
          this.academyList=res
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        // }
      },
      error:(error:any)=>{
        this.mainLoader=false
        this._alertService.swalPopError(error?.error?.message)
        if(error.error?.code==404 && error.error?.data==null && error.error?.status=='error'){
          this.dataSource=new MatTableDataSource([])
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
    })
  }

  //implemented filter to filter the data based on the key pressed by the user to filter from whole data of academy list
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //to filter data based on the selection of the value from the dropdown of filters
  searchFilter(){
    this.filteredAcademyList = this.academyList
    if (this.academySearchFilter.value.stateId != '') {
      this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
        if (data.state_id == this.academySearchFilter.value.stateId) {
          return data;
        }
      });
    }

    if (this.academySearchFilter.value.nsrsid != '') {
      this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
        if (data.nsrs_id.toLowerCase().trim().includes(this.academySearchFilter.value.nsrsid.toLowerCase().trim())) {
          return data;
        }
      });
    }

    if (this.academySearchFilter.value.academyName != '') {
      this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
        if (data.academy_name.toLowerCase().trim().includes(this.academySearchFilter.value.academyName.toLowerCase().trim())) {
          return data;
        }
      });
    }

    if (this.academySearchFilter.value.discipline != '') {
      this.filteredAcademyList = this.filteredAcademyList.filter((data: any) => {
        console.log(data)
        if(data.sports_name==null){

        }else{
          if (data.sports_name.toLowerCase().includes(this.academySearchFilter.value.discipline.toLowerCase())) {
            return data
          }
        }
      });
    }
    

    if (this.academySearchFilter.value.stateId == '' && this.academySearchFilter.value.sport_name == '' ) {
      this.filteredAcademyList = this.academyList
    }

    this.dataSource = new MatTableDataSource(this.filteredAcademyList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  exportToExcelPdfChange(event: any) {
    if (event.target.value == 'excel') {
      this.exporter.exportTable('xlsx', { fileName: 'KICTrainingCenter', sheet: 'trainingCenter', Props: { Author: 'NSRS' } })
    } else if (event.target.value == 'pdf') {
        this.getPdf()
    }
  }

  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#kicAcademyTable' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { html: '#kicAcademyTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('kicTrainingCenter.pdf');
  }

  athleteModal(rowData: any, userId: number) {
    let userData = {
      rowData,
      userId: userId
    }
    const athleteModalRef = this.modalService.open(AcademyDetailListComponent, { size: 'xl', centered: true });
    athleteModalRef.componentInstance.data = userData;
  }

  removeFirstTwoSports(sportList:any){
    // console.log(sportList.split(','))
    // var sportListArray:any=[]
    // for(let i of sportList.split(',')){
    //   // console.log(i)
      
    //   sportListArray.push(i+' ')
    // }
  //   sportList.split(',').forEach((value:any, index:any) => {
  //     // console.log(index); 
  //     // console.log(value);
  //     if(index%3==0 && index!=0){
  //       sportListArray.push(' ')
  //     }else{
  //       sportListArray.push(value)
  //     }
  // });
  // console.log(sportListArray)
    return sportList.split(',').splice(2);
    // return sportListArray
  }
}
