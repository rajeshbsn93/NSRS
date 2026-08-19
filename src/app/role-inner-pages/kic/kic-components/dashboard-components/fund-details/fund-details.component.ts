import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicDashboardService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-dashboard/kic-dashboard.service';

@Component({
  selector: 'app-fund-details',
  templateUrl: './fund-details.component.html',
  styleUrls: ['./fund-details.component.css']
})
export class FundDetailsComponent implements OnInit, OnChanges {

  displayedColumns: string[] = ['stateName', 'tKic', 'tPca', 'tAthlete', 'fReleasedRc', 'fUsedKic'];
  dataSource: any

  @ViewChild('matSortStateFund') matSortStateFund!: MatSort;
  @ViewChild('tablePaginatorStateFund') tablePaginatorStateFund!: MatPaginator;

  userDetails: any
  @Input() rcId: any = '-1';
  @Input() category: any = 'state'; // state or discipline
  @Input() loader: boolean = false;

  constructor(private _kicDashboardService: KicDashboardService, private _alertService: AlertService, private _storageService: StorageService) {
    this.userDetails = this._storageService.getUserDetails();
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.rcId !== '-1' && (this.category === 'state' || this.category === 'discipline')) {
      this.stateFundStatusList();
    }
  }


  stateFundStatusList() {
    this.loader = true;
    let payload = {
      roleId: this.userDetails?.role_id,
      userId: (this.userDetails?.role_id == 68) ? 0 : this.userDetails?.user_id,  //if there is HO which 68 send 0 in other case send role id of that
      category: this.category,
      rcId: (this.userDetails?.role_id !== 1005 && this.userDetails?.role_id !== 46) ? this.rcId : this.userDetails?.user_id
    }
    this._kicDashboardService?.stateFundStatusList(payload).subscribe({
      next: (res: any) => {
        const ELEMENT_DATA: [] = res?.data;
        this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
        this.dataSource.sort = this.matSortStateFund;
        this.dataSource.paginator = this.tablePaginatorStateFund;
        this.loader = false;

      },
      error: (errors: any) => {
        this.loader = false;
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
      },
      complete: () => { }
    })
  }

}
