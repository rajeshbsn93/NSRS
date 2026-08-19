import { Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KIAAProposalService } from 'src/app/_common/services/role-inner-pages-services/kiaaproposalservice/kiaaproposal.service';
import { environment } from 'src/environments/environment';
import { EoiProposalComponent } from '../components/eoiProposal/eoiProposal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-kiaaProposal',
  templateUrl: './kiaaProposal.component.html',
  styleUrls: ['./kiaaProposal.component.css']
})
export class KiaaProposalComponent implements OnInit {

  displayedColumns: string[] = ['proposal_Id', 'proposal_Head','proposal_Document','proposal_Date','pac_Agenda','pac_Minutes','nsrS_ID','state','action'];
  dataSource:any;
  userDetails:any;
  fileBaseUrl=environment.fileUrl;
  mainLoader:Boolean=false;

  @ViewChild('exporter') exporter: any
  
    
  @ViewChild(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = new QueryList<MatSort>();

  constructor(private _storageService:StorageService,private _kiaaService:KIAAProposalService,private _modalService:NgbModal) { }

  ngOnInit() {
    this.userDetails=this._storageService.getUserDetails();
    this.getKIAAProposals();
  }

  getKIAAProposals(){
    this.mainLoader=true;
    this._kiaaService.getKiaaProposalList(this.userDetails.user_id).subscribe({
      next:(res:any)=>{
        this.mainLoader=false;
        if(res.code==200 && res.status=='success'){
          this.dataSource= new MatTableDataSource(res.data);
          this.dataSource.paginator=this.paginator;
        }
      },
      error:(err:any)=>{
        this.mainLoader=false;
      }
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  exportToExcelPdfChange(event: any) {
    // for (var i of this.permissionData) {
      // if (i.action_name == 'Export') {
        // if (i.isactive) {
          if (event == 'excel') {
            this.exporter.exportTable('xlsx', { fileName: 'athlete', sheet: 'sheet_name', Props: { Author: 'NSRS' } })
          } else if (event == 'pdf') {
            this.getPdf()
          }
  }

  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#KIAAProposalsTable' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { html: '#KIAAProposalsTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('athlete.pdf');
  }

  viewKiaaProposalDetails(data:any){
    const modelRefForEquipmentModal = this._modalService.open(EoiProposalComponent,{size:'xl',centered:true, backdrop: 'static'})
    modelRefForEquipmentModal.componentInstance.eoiProposalData=data;

    modelRefForEquipmentModal.result
    .then((res:any) => {
      if(res.result){
        this.getKIAAProposals();
      }
    })
    .catch(() => {});

  }

}
