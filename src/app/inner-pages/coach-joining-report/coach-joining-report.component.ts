import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {Subscription } from 'rxjs';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { CoachService, CoachTransferListEntity } from 'src/app/_common/services/innerPagesServices/coach.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';


@Component({
  selector: 'app-coach-joining-report',
  templateUrl: './coach-joining-report.component.html',
  styleUrls: ['./coach-joining-report.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ]
})
export class CoachJoiningReportComponent implements OnInit {
  loaderSportList:boolean = false;
  loader:boolean = false;
  userDetails:any
  coachTransferListData: any = [];
  selectedcoachTransferListData: any = [];
  displayedColumns: string[] = ['nsrsId','NAME','Discipline','designation','prev_academy','transfer_date','current_academy','joining_date','status'];
  dataSource: any;
  sportListData: any = [];
  searchFilter!: FormGroup;
  docType: string = 'Export';
  schemeForm!: FormGroup;
  private athleteListSubscription: Subscription | undefined;
  

  @ViewChild('exporter') exporter: any
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') searchField!: ElementRef<HTMLInputElement>;

  constructor(
    private coachService: CoachService, 
    private modal: NgbModal,
    private fb: FormBuilder,
    private _storageService: StorageService,
    private _sharableService: SharableService,
    private swalAlert:AlertService,
    private datePipe:DatePipe
  ) { }

  ngOnInit(): void {
    //Form for the filters 
    this.searchFilter = this.fb.group({
      nsrsid: [''],
      name: [''],
      discipline: [''],
      gender: [''],
      from_date: [null],
      to_date: [null],
    });

    this.schemeForm = this.fb.group({
      selectedScheme: ['']
    })

    this.userDetails=this._storageService.getUserDetails()
    this.sportList();
    //calling the get CoachTransfer List
    this.getCoachTransferList();
  }

  //function to call api for athlete data and mapping to Mat-Table
  getCoachTransferList() {
    this.loader=true
    this.athleteListSubscription=this.coachService.getCoachTransferList(this.userDetails.role_id)
      .subscribe({
        next:(result) => {
          this.loader=false
          this.coachTransferListData = result;
          this.search();
          // this.selectedcoachTransferListData = this.coachTransferListData
          // const ELEMENT_DATA: PeriodicElement[] = this.coachTransferListData;
          // this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        },
        error:()=>{
          console.error('error caught in athlete list')
          this.loader = false;
        }
      });
  }

  ngOnDestroy(){
    this.athleteListSubscription?.unsubscribe()
    this.modal.dismissAll()
  }

  //function for filtering data according to filters
  search() {
    this.selectedcoachTransferListData = this.coachTransferListData
    if (this.searchFilter.value.nsrsid != '') {
      this.selectedcoachTransferListData = this.selectedcoachTransferListData.filter((data: any) => {
        if (data.kitd_unique_id.toLowerCase() == this.searchFilter.value.nsrsid.toLowerCase()) {
          return data;
        }
      });
    }

    if (this.searchFilter.value.name != '') {
      this.selectedcoachTransferListData = this.selectedcoachTransferListData.filter((data: any) => {
        if (data.full_name.toLowerCase().includes(this.searchFilter.value.name.toLowerCase())) {
          return data
        }
      });
    }

    if (this.searchFilter.value.discipline != '') {
      this.selectedcoachTransferListData = this.selectedcoachTransferListData.filter((data: any) => {
        if (data.sport_name.toLowerCase() == this.searchFilter.value.discipline.toLowerCase()) {
          return data;
        }
      });
    }
    if (this.searchFilter.value.gender != '') {
      this.selectedcoachTransferListData = this.selectedcoachTransferListData.filter((data: any) => {
        if (data.gender == this.searchFilter.value.gender) {
          return data;
        }
      });
    }
    if (this.searchFilter.value.from_date != null) {
      this.selectedcoachTransferListData = this.selectedcoachTransferListData.filter((data: any) => {
        if ((new Date(data.date_of_joining)).toDateString() == (new Date(this.searchFilter.value.from_date)).toDateString()) {
          return data;
        }
      });
    }
    if (this.searchFilter.value.to_date != null) {
      this.selectedcoachTransferListData = this.selectedcoachTransferListData.filter((data: any) => {
        if ((new Date(data.transferDate)).toDateString() == (new Date(this.searchFilter.value.to_date)).toDateString()) {
          return data;
        }
      });
    }

    if (this.searchFilter.value.nsrsid == '' && this.searchFilter.value.name == '' && this.searchFilter.value.discipline == '' &&  this.searchFilter.value.gender=='' && this.searchFilter.value.from_date == null && this.searchFilter.value.to_date == null) {
      this.selectedcoachTransferListData = this.coachTransferListData
    }

    this.dataSource = this.selectedcoachTransferListData;
    this.dataSource = new MatTableDataSource<CoachTransferListEntity>(this.selectedcoachTransferListData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.searchField.nativeElement.value) this.applyFilter({target: {value: this.searchField.nativeElement.value}} as unknown as Event);
  }

  //mapping of discipline(sports List) for filters
  sportList() {
    this.loaderSportList=true
    this._sharableService.sportList().subscribe({
      next:(res)=>{
        this.loaderSportList=false
        this.sportListData = res;
      },
      error:()=>{
        console.error('error caught in sport list')
        this.loaderSportList = false;
      }
    })
  }



  menuIdForFinancialModal: any;

  athleteObj: any

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToExcelPdfChange(event: any) {
    // for (var i of this.permissionData) {
      // if (i.action_name == 'Export') {
        // if (i.isactive) {
          if (event == 'excel') {
            this.exporter.exportTable('xlsx', { fileName: 'coach-report', sheet: 'sheet_name', Props: { Author: 'NSRS' } })
          } else if (event == 'pdf') {
            this.getPdf()
          }
  }

  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#coach-report-table' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { html: '#coach-report-table', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('coach-report.pdf');
  }


}
