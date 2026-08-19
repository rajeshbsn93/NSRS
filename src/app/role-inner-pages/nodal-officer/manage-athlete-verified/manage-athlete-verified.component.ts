import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { DobVerificationPlayerListEntity, ManageAthleteService } from 'src/app/_common/services/nodal-officer-service/manage-athlete.service';
import { DocumentViewManageAthleteComponent } from '../modal-window/document-view-manage-athlete/document-view-manage-athlete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';

@Component({
  selector: 'app-manage-athlete-verified',
  templateUrl: './manage-athlete-verified.component.html',
  styleUrls: ['./manage-athlete-verified.component.css']
})
export class ManageAthleteVerifiedComponent implements OnInit {

  @Input() selectedTabIndex:any
    displayedColumns: string[] = ['sno', 'athletename', 'nsrsid', 'dob','discipline','gender','action' ];
    dataSource = new MatTableDataSource<DobVerificationPlayerListEntity>();
    @ViewChild(MatPaginator) paginator!:MatPaginator
    @ViewChild(MatSort) sort!:MatSort
    userDetail:any;
    loader:boolean = false;
    constructor(
      private modalService:NgbModal,
      private manageAthleteService:ManageAthleteService,
      private storageService:StorageService
    ) { }
  
    ngOnInit() {
      this.userDetail = this.storageService.getUserDetails();
      this.getDobVerificationPlayerList()    
    }
    ngOnChanges(changes: SimpleChanges): void {
      console.log(changes)
    }
    getDobVerificationPlayerList(){
      this.loader = true
      this.manageAthleteService.dobVerificationPlayerList(this.userDetail.user_id,this.userDetail.role_id,1).pipe(first()).subscribe({
        next:(res:any)=>{
          this.loader = false;
          this.dataSource = new MatTableDataSource<DobVerificationPlayerListEntity>(res)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort
        },
        error:(err)=>{
          this.loader = false,
          console.error(err)
        }
      })
    }
    viewDocument(elementRowData:any){
      const modalRef =  this.modalService.open(DocumentViewManageAthleteComponent,{
        size:'lg', centered:true
      })
      elementRowData.current_tab = this.selectedTabIndex
      modalRef.componentInstance.elementRowData = elementRowData
    }

}
