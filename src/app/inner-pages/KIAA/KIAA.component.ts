import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import autoTable from 'jspdf-autotable';
import { AcademyKiaaComponent } from 'src/app/standalone_components/modal-window/academy-kiaa/academy-kiaa.component';
import { AcademyService } from 'src/app/_common/services/innerPagesServices/academy.service';
import { KIAAService } from 'src/app/_common/services/innerPagesServices/KIAA.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';

export interface PeriodicElement {
  nsrsID: string
  academy_name: string
  requestId: any
  sport: string
  residential_type: string
  academy_type: string
  ncoE_type: string
  is_tops: boolean
  from_date: string
  accrediation_status: string
  accreditation_form: string
  accreditation_request_type: string
  audited_balanced_sheet: any
  certification_technical_qualification: any
  kiaaId: number
  notification_document: string
  participation_certificate_national_international: any
  prescribed_performa_requisite_fee: any
  registration_certificate: any
  remark: any
  to_date: string
  score_matrix_document: string
  sport_detail_id: number
  trainees_detail_achievement: any
}




@Component({
  selector: 'app-KIAA',
  templateUrl: './KIAA.component.html',
  styleUrls: ['./KIAA.component.css']
})
export class KIAAComponent implements OnInit {
  innerLoader:boolean = false;
  innerLoaderMainData:boolean = false;
  dataSource: any;
  sscElementNsRsId: any
  kiaaWeedOutRes:any;
  user_id:any
  kiaaList: any
  searchedKiaaList:any
  nsrs_id: string=''
  weedOutpopupData:any;
  kiaaSearchFilter!: FormGroup;
  docType: string = 'Export';
  deleteKiaaData:any
  deleteInsuranceModal:any
  academy_detail_id:any

  @ViewChild('delete') deleteInsurancePop: any;
  @ViewChild('exporter') exporter: any
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // displayedColumns: string[] = ['action', 'nsrsID', 'academy_name', 'requestId', 'sport', 'residential_type', 'academy_type', 'ncoE_type', 'is_tops', 'accreditation_request_type', 'accrediation_status'];
  displayedColumns: string[] = ['nsrsID', 'academy_name', 'requestId', 'sport', 'residential_type', 'academy_type', 'accreditation_request_type', 'accrediation_status'];

  constructor(
    private modalService: NgbModal,
    private _kiaaService: KIAAService,
    private _route: ActivatedRoute,
    private fb:FormBuilder,
    private alertService:AlertService,
    private storageService:StorageService
    
  ) { }

  ngOnInit() {
    this.user_id=this.storageService.getUserDetails().user_id
    
    this.kiaaSearchFilter = this.fb.group({
      necoType: [''],
      isTops: [''],
      status: [''],
      requestType: [''],
    });

    this.routeCheckQueryParamsData()
  }

  routeCheckQueryParamsData(){
    this._route.queryParams.subscribe({
      next:(res)=>{
        if(Object.keys(res).length){
          this.sscElementNsRsId = JSON.parse(atob(res['nsrs_id']));
          let buttonType = atob(res['buttonType'])
          this.academy_detail_id=JSON.parse(atob(res['academy_detail_id']))
          if (buttonType == "YES" || buttonType == "NO") {
            this.getKiaaListData(this.user_id,0,0,this.sscElementNsRsId,'')
          };
          if (buttonType == "KIAA+") {
            this.getKiaaListData(this.user_id,0,0,'','')
          };
        }else{
          this.getKiaaListData(this.user_id,0,0,'','')
        }
      }
    })
  }

  ngOnDestroy(){
    this.modalService.dismissAll()
  }

  getKiaaListData(user_id:Number,kiaa_id:Number,sport_detail_id:Number,nsrs_id:String,approval_status:any){
    this.innerLoaderMainData=true
    this._kiaaService.getKiaaList(
      user_id,kiaa_id,sport_detail_id,nsrs_id,approval_status)
      .subscribe({
        next:(res)=>{
          this.innerLoaderMainData=false
          this.kiaaList = res;
          // console.log(this.kiaaList);
          const ELEMENT_DATA: PeriodicElement[] = this.kiaaList;
          this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error:()=>{
          console.error('error caught in getKiaa list')
          // this.errorMessage = error;
          this.innerLoaderMainData = false;
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  filterSearch(){
    this.searchedKiaaList = this.kiaaList
    if (this.kiaaSearchFilter.value.necoType!= '') {
      this.searchedKiaaList = this.searchedKiaaList.filter((data: any) => {
        if (data.ncoE_type.toLowerCase() == this.kiaaSearchFilter.value.necoType.toLowerCase()) {
          return data;
        }
      });
    }

    if (this.kiaaSearchFilter.value.isTops != '') {
      this.searchedKiaaList = this.searchedKiaaList.filter((data: any) => {
        if (data.is_tops.toString().includes(this.kiaaSearchFilter.value.isTops.toLowerCase())) {
          return data
        }
      });
    }
    if (this.kiaaSearchFilter.value.status != '') {
      this.searchedKiaaList = this.searchedKiaaList.filter((data: any) => {
        if (data.accrediation_status.toLowerCase() == this.kiaaSearchFilter.value.status.toLowerCase()) {
          return data;
        }
      });
    }

    if (this.kiaaSearchFilter.value.requestType != '') {
      this.searchedKiaaList = this.searchedKiaaList.filter((data: any) => {
        if (data.accreditation_request_type == this.kiaaSearchFilter.value.requestType) {
          return data;
        }
      });
    }

    if (this.kiaaSearchFilter.value.necoType == ''  && this.kiaaSearchFilter.value.isTops == '' && this.kiaaSearchFilter.value.status == '' && this.kiaaSearchFilter.value.requestType == '') {
      this.searchedKiaaList = this.kiaaList
    }
    this.dataSource = this.searchedKiaaList;
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.searchedKiaaList);
    this.dataSource.paginator = this.paginator; 
    this.dataSource.sort=this.sort 
  }

  openkKiaaModal(element: any) {
    const kiaaModalRef = this.modalService.open(AcademyKiaaComponent, { size: 'xl', centered: true });
    kiaaModalRef.componentInstance.kiaaElementData = element;
    kiaaModalRef.componentInstance.academy_detail_id= this.academy_detail_id;
    kiaaModalRef.result.then((event) => {
      this.routeCheckQueryParamsData();
    }).catch(()=> {});
  }

  selectChange(event: any) {
    if (event == 'excel') {
      this.exporter.exportTable('xlsx', { fileName: 'KIAA', sheet: 'sheet_name', Props: { Author: 'NSRS' } })
    } else if (event == 'pdf') {
      this.getPdf()
    }
  }

  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#kiaaTable' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { html: '#kiaaTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('KIAA.pdf');
  }

  deleteKiaa(elementData:any){
    this.deleteKiaaData=elementData
    this.deleteInsuranceModal = this.modalService.open(this.deleteInsurancePop, {
      size: 'md',
      centered: true,
    });

  }

  confirmDelete(){
    this.innerLoader=true
    this._kiaaService.deleteacAdemyKiaa(this.deleteKiaaData.kiaaId,this.deleteKiaaData.academy_id,this.user_id).subscribe(res=>{
      var deleteRes:any = res
      this.innerLoader=false
      if(deleteRes.value === 1){
        this.alertService.swalPopSuccess("Kiaa deleted successfully!")
        this.routeCheckQueryParamsData();
      }else{
        this.alertService.swalPopError("Kiaa can't delete!")
      }
    },
    ()=>{
      console.error('error caught in delete kiaa ')
      this.innerLoader = false;
    })
    this.deleteInsuranceModal.close()
    
  }
}
