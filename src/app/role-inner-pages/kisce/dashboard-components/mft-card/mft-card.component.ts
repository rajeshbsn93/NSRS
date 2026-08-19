import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicDashboardService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-dashboard/kic-dashboard.service';

@Component({
  selector: 'app-mft-card',
  templateUrl: './mft-card.component.html',
  styleUrls: ['./mft-card.component.css']
})
export class MftCardComponent implements OnInit, OnChanges {

  cardList: any = [];
  @Input() selectedRegionId: any = '-1';
  userDetails: any
  loader: boolean = false;

  constructor(private _kicDashboardSerevice: KicDashboardService, private _storageService: StorageService, private _alertService: AlertService) {
    this.userDetails = this._storageService.getUserDetails();
  }



  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedRegionId !== '-1')
      this.countTotalCard();
  }

  countTotalCard() {
    this.loader = true;
    let payload = {
      regionId: (this.userDetails?.role_id !== 1005 && this.userDetails?.role_id !== 46) ? this.selectedRegionId : this.userDetails?.user_id,
      roleId: this.userDetails?.role_id,
      userId: this.userDetails?.user_id,
      schemeRoleId:80,

    }

    
    this._kicDashboardSerevice.kisceMftCount(payload).subscribe(
      {
        next: (res: any) => {
          if (res?.status === 1) {
            this.cardList = res.data
          } else {
            this._alertService?.swalPopErrorTimer(res?.message);
          }
          this.loader = false;
        },
        error: (errors: any) => {
          this.loader = false;
          this._alertService?.swalPopErrorTimer(errors?.error?.message);
        },
        complete: () => { }
      }
    )
  }

}
