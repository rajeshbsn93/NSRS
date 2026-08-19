import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/_common/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgModel } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-kisce-sanction-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './kisce-sanction-list.component.html',
  styleUrls: ['./kisce-sanction-list.component.css']
})
export class KisceSanctionListComponent implements OnInit {
 displayedColumns: string[] = ['sno', 'KID', 'name', 'discipline'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private activeModal: NgbActiveModal
  ) { }

  kicSanctionListData: any
  dataSource:any
  // KheloIndiaPlayerData = new MatTableDataSource<certificateDetailsEntity>();

  ngOnInit(): void {

   


  }

  ngAfterViewInit() {
    this.kicSanctionListData = this.kicSanctionListData
    this.dataSource = new MatTableDataSource<any>(this.kicSanctionListData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  modalClose(closeType = 'cancel') {
    this.activeModal.close(closeType);
  }


}
