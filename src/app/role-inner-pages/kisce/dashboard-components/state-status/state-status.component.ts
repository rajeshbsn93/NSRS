import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicDashboardService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-dashboard/kic-dashboard.service';

@Component({
  selector: 'app-state-status',
  templateUrl: './state-status.component.html',
  styleUrls: ['./state-status.component.css']
})
export class StateStatusComponent implements OnInit {
  userDetails: any

  constructor(private _kicDashboardService: KicDashboardService, private _storageService: StorageService, private _alertService: AlertService) {
    this.userDetails = this._storageService.getUserDetails();
  }

  rcList: any = []
  selectedRegionId: string = '0'
  selectedCategory: string = 'overview'  //state or discipline or detail_map or density map
  selectedRcText = ''

  @Output() regionIdEvent: any = new EventEmitter();
  @Output() categoryEvent: any = new EventEmitter();

  categorywiseCardList: any = []
  categorywiseLoader: boolean = false;

  showState: boolean = false;

  stateEvent: any

  ngOnInit(): void {
    this.masterRcList();
    this.categorywiseCard();
  }

  // ++++++++++ Master Region List ++++++++++++++
  masterRcList() {
    this._kicDashboardService?.rcList().subscribe({
      next: (res: any) => {
        if (res?.status === 1) {
          this.rcList = res?.data
          this.selectedRcText = this.rcList[0].value
        }
      },
      error: (errors: any) => { },
      complete: () => { }
    })
  }

  // ++++++++++ Categorywise Card List ++++++++++++++
  categorywiseCard() {
    this.categorywiseLoader = true;
    this.categorywiseCardList = [];
    let payload: any = {
      roleId: this.userDetails?.role_id,
      userId: (this.userDetails?.role_id == 68) ? 0 : this.userDetails?.user_id,  //if there is HO which 68 send 0 in other case send role id of that
      category: this.selectedCategory === 'overview' ? 'state' : this.selectedCategory,  //state or discipline and for overview send state
      regionId: (this.userDetails?.role_id !== 1005 && this.userDetails?.role_id !== 46) ? this.selectedRegionId : this.userDetails?.user_id,
      schemeRoleId:80,
    }

    console.log('payload--------------------------',payload);
    
    this._kicDashboardService?.categorywiseCardForKisce(payload).subscribe({
      next: (res: any) => {
        if (res?.status === 1) {
          this.categorywiseCardList = res?.data
        } else {
          this._alertService?.swalPopErrorTimer(res?.message);
        }
        this.categorywiseLoader = false;
      },
      error: (errors: any) => {
        this.categorywiseLoader = false;
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
      },
      complete: () => { }
    })
  }

  // ++++++  Region Change Function  ++++++++++
  regionChange(event: any) {
    // emit the value for region id 
    this.regionIdEvent.emit({ regionId: this.selectedRegionId })
    if (this.selectedCategory === 'state' || this.selectedCategory === 'discipline' || this.selectedCategory === 'overview') {
      //update categorywise list
      this.categorywiseCard();
    }
    // selected rc text
    const selectedIndex = event.target.selectedIndex;
    this.selectedRcText = this.rcList[selectedIndex].value
  }

  // +++++++++++ Selected Tab +++++++++++++++
  selectedTab(event: any) {
    //Set default view to National map 
    this.showState = false;
    // this.selectedRegionId = '0';
    this.selectedCategory = event?.tab?.content?.templateRef?._declarationLView[0]?.id;
    //Emit the values
    // this.regionIdEvent.emit({ regionId: this.selectedRegionId })
    this.categoryEvent.emit({ category: this.selectedCategory });
    if (event?.tab?.content?.templateRef?._declarationLView[0]?.id === 'state' || event?.tab?.content?.templateRef?._declarationLView[0]?.id === 'discipline' || event?.tab?.content?.templateRef?._declarationLView[0]?.id === 'overview') {

      //update categorywise list
      this.categorywiseCard();
    }
  }

  stateMapDetail(event: any) {
    // details of click state
    this.showState = true
    this.stateEvent = event
    console.log(this.stateEvent?.point?.name);
  }

  switchToNational() {
    this.showState = false;
  }


}
