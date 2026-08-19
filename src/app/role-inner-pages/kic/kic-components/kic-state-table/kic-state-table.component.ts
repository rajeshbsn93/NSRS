import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicAttendanceService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-attendance.service';
import { environment } from 'src/environments/environment';
import { KicTableComponent } from '../kic-table/kic-table.component';
import { KicAddPcaAttendanceComponent } from 'src/app/standalone_components/modal-window/kic-add-pca-attendance/kic-add-pca-attendance.component';

@Component({
  selector: 'app-kic-state-table',
  templateUrl: './kic-state-table.component.html',
  styleUrls: ['./kic-state-table.component.css']
})
export class KicStateTableComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'kiud', 'attendanceRecord', 'maleCount', 'femaleCount', 'total', 'uploadDate', 'fromDate', 'toDate', 'recordFile'];
  dataSource: any
  displayedColumnsPca: string[] = ['sno', 'attendanceDuration', 'kitd_unique_id', 'uploadDate', 'fromDate', 'toDate', 'recordFile'];
  dataSourcePca: any = []

  addAttendancePcaModalRef: any
  userDetails: any
  stateId: any
  filePath: any = environment.fileUrl;

  @ViewChild('matSortAthlete') matSortAthlete!: MatSort;
  @ViewChild('tablePaginatorAthlete') tablePaginatorAthlete!: MatPaginator;

  @ViewChild('matSortPca') matSortPca!: MatSort;
  @ViewChild('tablePaginatorPca') tablePaginatorPca!: MatPaginator;

  kicTableModalRef: any

  isLoading: boolean = false;
  showPcaTable: boolean = false;


  constructor(private _storageService: StorageService, private _route: Router,
    private _activatedRoute: ActivatedRoute, private _kicAttendanceService: KicAttendanceService,
    private _alertService: AlertService, private _modalService: NgbModal) {
    this.userDetails = this._storageService.getUserDetails();
    // _activatedRoute.paramMap.subscribe(params => {
    //   this.stateId = params.get('id');
    // });
  }

  ngOnInit(): void {
    this.isLoading = true
    this.getKicAttendanceStateDetails(this.userDetails.user_id, this.userDetails.role_id);
  }

  getKicAttendanceStateDetails(userId: number, roleId: number) {
    this._kicAttendanceService.getKicAttendanceState(userId, roleId).subscribe(
      {
        next: (res: any) => {
          this.isLoading = false;
          if (res?.status === 'success') {
            // this.dataSource = res?.data;
            const ELEMENT_DATA: [] = res?.data?.athlete;
            this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
            this.dataSource.sort = this.matSortAthlete;
            this.dataSource.paginator = this.tablePaginatorAthlete;
            const ELEMENT_DATA2: [] = res?.data?.pca;
            this.dataSourcePca = new MatTableDataSource<any>(ELEMENT_DATA2);
            this.dataSourcePca.sort = this.matSortPca;
            this.dataSourcePca.paginator = this.tablePaginatorPca;
          } else {
            this.isLoading = false;
            // Here if anything wrong happened
            this._alertService?.swalPopErrorTimer(res?.message);
          }
        },
        error: (errors: any) => {
          this.isLoading = false;
          this._alertService?.swalPopErrorTimer(errors?.error?.message);
        },
        complete: (() => {
        })
      }
    )

  }

  openKicDetailsPopup(item: any) {
    this.kicTableModalRef = this._modalService.open(KicTableComponent, { size: 'xl', centered: true, backdrop: 'static' });
    this.kicTableModalRef.componentInstance.kicId = item?.kitd_unique_id
    this.kicTableModalRef.componentInstance.isPopupOpen = true
    // this.kicTableModalRef.result.then((event: any) => {
    //   if (event === 'save') {
    //     // debugger
    //   }
    // });
  }

  // +++++ keyup filter for kic attendance +++++
  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // +++++ keyup filter for kic attendance Pca +++++
  searchFilterPca(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePca.filter = filterValue.trim().toLowerCase();
  }

  // ################# Add PCA Attendanec Start ######################
  popupOpen() {
    this.addAttendancePcaModalRef = this._modalService.open(KicAddPcaAttendanceComponent, { size: 'xl', centered: true, backdrop: 'static' });
    // this.addAttendanceModalRef.componentInstance.coachData
    this.addAttendancePcaModalRef.result.then((event: any) => {
      if (event === 'save') {
        
        this.getKicAttendanceStateDetails(this.userDetails.user_id, this.userDetails.role_id);
      }
    });
  }
  // ################# Add PCA Attendanec End ######################
}
