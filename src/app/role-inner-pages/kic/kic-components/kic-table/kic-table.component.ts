import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { CommonSharableService, IGetStateMasterObject } from 'src/app/_common/services/common-services/commonSharable.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicAttendanceService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-attendance.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-kic-table',
  templateUrl: './kic-table.component.html',
  styleUrls: ['./kic-table.component.css']
})
export class KicTableComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'duration', 'male_count', 'female_count', 'total_count', 'upload_date', 'from_date', 'to_date', 'recordFile'];
  dataSource: any

  displayedColumnsPca: string[] = ['sno', 'attendanceDuration', 'uploadDate', 'fromDate', 'toDate', 'recordFile'];
  dataSourcePca: any

  addAttendanceModalRef: any
  userDetails: any
  filePath: any = environment.fileUrl;

  @ViewChild('matSortAthlete') matSortAthlete!: MatSort;
  @ViewChild('tablePaginatorAthlete') tablePaginatorAthlete!: MatPaginator;

  @ViewChild('matSortPca') matSortPca!: MatSort;
  @ViewChild('tablePaginatorPca') tablePaginatorPca!: MatPaginator;

  // +++++ Getting Value when poup open start +++++
  isPopupOpen: boolean = false;
  kicId: string = ''
  // +++++ Getting Value when poup open end +++++

  stateMasterList!: Array<IGetStateMasterObject>
  kicAttendanceFilter!: FormGroup

  isLoading: boolean = false

  showPcaTable: boolean = false


  constructor(public activeModal: NgbActiveModal, private _kicAttendanceService: KicAttendanceService, private _storageService: StorageService,
    private _alertService: AlertService, private _route: Router, private _commonSharableService: CommonSharableService) {
    this.userDetails = this._storageService.getUserDetails();
  }

  ngOnInit(): void {
    this.isLoading = true
    this.getStateMasterList()
    if (this.isPopupOpen == true) {
      // +++++ if popup is open call this +++++
      this.getKicAttendanceByKicId(this.kicId);
    } else {
      this.getAttendance();
    }
    this._kicAttendanceService.getIsListRefresh().subscribe((res: any) => {
      if (res === true) {
        this.getAttendance()
        this._kicAttendanceService.setIsListRefresh(false);
      }
    }
    )
  }

  getAttendance() {
    let payload = {
      userId: this.userDetails.user_id,
      roleId: this.userDetails.role_id
    }
    this._kicAttendanceService.getKicAttendance(payload).subscribe(
      {
        next: (res: any) => {
          this.isLoading = false;
          if (res?.status === 'success') {
            const ELEMENT_DATA: [] = res?.data?.athlete;
            this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
            this.dataSource.sort = this.matSortAthlete;
            this.dataSource.paginator = this.tablePaginatorAthlete;
            const ELEMENT_DATA2: [] = res?.data?.pca;
            this.dataSourcePca = new MatTableDataSource<any>(ELEMENT_DATA2);
            this.dataSourcePca.sort = this.matSortPca;
            this.dataSourcePca.paginator = this.tablePaginatorPca;
          } else {
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

  getKicAttendanceByKicId(kicId: any) {
    const payload = {
      kicId: kicId
    }

    this._kicAttendanceService.getKicAttendanceByKicId(payload).subscribe(
      {
        next: (res: any) => {
          this.isLoading = false;
          if (res?.status === 'success') {
            this.dataSource = res?.data?.athlete;
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

  modalClose(closeType = 'cancel') {
    this.activeModal.close(closeType);
    this.isPopupOpen = false;
  }

  // +++++ state master list +++++
  getStateMasterList() {
    this._commonSharableService.stateMasterList(1).subscribe(
      {
        next: (res: any) => {
          this.stateMasterList = res
          // if (res?.status === 'success') {

          // } else {
          //   // Here if anything wrong happened
          //   this._alertService?.swalPopErrorTimer(res?.message);
          // }
        },
        error: (errors: any) => {
          this._alertService?.swalPopErrorTimer(errors?.error?.message);
        },
        complete: (() => {
        })
      }
    )
  }

  // +++++ keyup filter for kic attendance +++++
  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // +++++ keyup filter for kic attendance +++++
  searchFilterPca(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePca.filter = filterValue.trim().toLowerCase();
  }

  showAthleteBtnAddFun(boolFlag: boolean) {
    this.showPcaTable = !boolFlag
    this._kicAttendanceService.setShowAddBtnAthlete(boolFlag);
  }

}
