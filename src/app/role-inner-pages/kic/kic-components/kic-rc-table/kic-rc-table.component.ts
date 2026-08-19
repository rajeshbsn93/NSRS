import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicAttendanceService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-attendance.service';
import { environment } from 'src/environments/environment';
import { KicTableComponent } from '../kic-table/kic-table.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonSharableService, IGetStateMasterObject } from 'src/app/_common/services/common-services/commonSharable.service';

@Component({
  selector: 'app-kic-rc-table',
  templateUrl: './kic-rc-table.component.html',
  styleUrls: ['./kic-rc-table.component.css']
})
export class KicRcTableComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'stateName', 'districtName', 'kiud', 'totalAthlete', 'recordFile'];
  dataSource: any
  kicRcList: any = []
  kicRcListFiltered: any = []

  addAttendanceModalRef: any
  userDetails: any
  filePath: any = environment.fileUrl;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  kicTableModalRef: any

  // +++++ Getting Value when poup open start +++++
  isPopupOpen: boolean = false;
  kicRcId: string = ''
  // +++++ Getting Value when poup open end +++++

  rcFilterForm!: FormGroup
  stateMasterList!: Array<IGetStateMasterObject>

  isLoading: boolean = false


  constructor(public activeModal: NgbActiveModal, private _storageService: StorageService,
    private _route: Router, private _activatedRoute: ActivatedRoute,
    private _kicAttendanceService: KicAttendanceService, private _fb: FormBuilder,
    private _commonSharableService: CommonSharableService,
    private _alertService: AlertService, private _modalService: NgbModal) {
    this.userDetails = this._storageService.getUserDetails();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.formInitialization();
    this.getStateMasterList();
    if (this.isPopupOpen == true) {
      // +++++ if popup is open call this +++++
      this.getKicAttendanceByKicRcId(this.kicRcId);
    } else {
      this.getKicAttendanceRcDetails(this.userDetails.user_id, this.userDetails.role_id);
    }

  }

  getKicAttendanceRcDetails(userId: number, roleId: number) {
    this._kicAttendanceService.getKicAttendanceRc(userId, roleId).subscribe(
      {
        next: (res: any) => {
          this.isLoading = false;
          if (res?.status === 'success') {
            // this.dataSource = res?.data;
            this.kicRcList = res?.data?.athlete;
            const ELEMENT_DATA: [] = res?.data?.athlete;
            this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
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

  modalClose(closeType = 'cancel') {
    this.activeModal.close(closeType);
    this.isPopupOpen = false;
  }

  getKicAttendanceByKicRcId(kicRcId: any) {
    const payload = {
      kicRcId: kicRcId
    }

    this._kicAttendanceService.getKicAttendanceByKicRcId(payload).subscribe(
      {
        next: (res: any) => {
          this.isLoading = false;
          if (res?.status === 'success') {
            this.kicRcList = res?.data;
            this.dataSource = res?.data;
            const ELEMENT_DATA: [] = res?.data;
            this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;

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

  // +++++ keyup filter for kic attendance +++++
  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  formInitialization() {
    this.rcFilterForm = this._fb.group({
      stateId: [''],

    });
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

  onClickSearch() {
    this.kicRcListFiltered = this.kicRcList;
    if (this.rcFilterForm?.get('stateId')?.value != '') {
      this.kicRcListFiltered = this.kicRcList.filter((data: any) => {
        if (data?.state_id == this.rcFilterForm?.get('stateId')?.value) {
          return data;
        }
      });
    }

    this.dataSource = new MatTableDataSource(this.kicRcListFiltered);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
