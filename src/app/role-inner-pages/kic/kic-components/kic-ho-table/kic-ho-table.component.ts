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
import { KicRcTableComponent } from '../kic-rc-table/kic-rc-table.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonSharableService } from 'src/app/_common/services/common-services/commonSharable.service';

@Component({
  selector: 'app-kic-ho-table',
  templateUrl: './kic-ho-table.component.html',
  styleUrls: ['./kic-ho-table.component.css']
})
export class KicHoTableComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'rcName', 'stateName', 'totalDistrict', 'totalAthlete'];
  dataSource: any

  addAttendanceModalRef: any
  userDetails: any
  filePath: any = environment.fileUrl;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  kicRcTableModalRef: any;

  hoFilterForm!: FormGroup;
  kicHoList: any = [];
  kicHoListFiltered: any = [];
  stateMasterList: any = [];

  isLoading: boolean = false;



  constructor(private _storageService: StorageService, private _route: Router,
    private _activatedRoute: ActivatedRoute, private _kicAttendanceService: KicAttendanceService,
    private _alertService: AlertService, private _modalService: NgbModal, private _fb: FormBuilder,
    private _commonSharableService: CommonSharableService,) {
    this.userDetails = this._storageService.getUserDetails();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.formInitialization();
    this.getStateMasterList();
    this.getKicAttendanceHoDetails(this.userDetails.user_id, this.userDetails.role_id);
  }

  getKicAttendanceHoDetails(userId: number, roleId: number) {
    this._kicAttendanceService.getKicAttendanceHo(userId, roleId).subscribe(
      {
        next: (res: any) => {
          this.isLoading = false;
          if (res?.status === 'success') {
            this.kicHoList = res?.data?.athlete;
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

  openKicRcDetailsPopup(item: any) {
    this.kicRcTableModalRef = this._modalService.open(KicRcTableComponent, { size: 'xl', centered: true, backdrop: 'static' });
    this.kicRcTableModalRef.componentInstance.kicRcId = item?.rC_Id
    this.kicRcTableModalRef.componentInstance.isPopupOpen = true
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

  formInitialization() {
    this.hoFilterForm = this._fb.group({
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
    this.kicHoListFiltered = this.kicHoList;
    if (this.hoFilterForm?.get('stateId')?.value != '') {
      this.kicHoListFiltered = this.kicHoList.filter((data: any) => {
        if (data?.stateId == this.hoFilterForm?.get('stateId')?.value) {
          return data;
        }
      });
    }

    this.dataSource = new MatTableDataSource(this.kicHoListFiltered);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
