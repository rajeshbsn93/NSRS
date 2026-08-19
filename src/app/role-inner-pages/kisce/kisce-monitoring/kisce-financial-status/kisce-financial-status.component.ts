import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { ITabbingLink } from '../kisce-monitoring.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../kisce-propsals/kisce-propsals.component';
import * as moment from 'moment';
import { FinancialStatusUcDetailsComponent } from '../../kisce-monitoring-modals/financial-status-uc-details/financial-status-uc-details.component';


@Component({
  selector: 'app-kisce-financial-status',
  templateUrl: './kisce-financial-status.component.html',
  styleUrls: ['./kisce-financial-status.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class KisceFinancialStatusComponent implements OnInit {
  @ViewChild('rcWISEPaginator', { read: MatPaginator }) rcWISEPaginator!: MatPaginator
  @ViewChild('statePaginator', { read: MatPaginator }) statePaginator!: MatPaginator
  @ViewChild('kicWISEPaginator', { read: MatPaginator }) kicWISEPaginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;
  @Input() uniqueKUID: any
  @Input() tabbingLinkData!: ITabbingLink
  @Output() dataOfTabClicked: EventEmitter<any> = new EventEmitter<any>();


  userDetails!: IUserDetails
  pcaList: any
  mainLoader: Boolean = false
  KicUsersRoleId: any = RoleCode
  multiEquipmentTagForm!: FormGroup
  stateWiseData: any
  kicWiseData: any
  rdListshow: Boolean = false;


  displayedColumnsForRCList: string[] = ['sno', 'rdName', 'totalKic', 'stateName']
  displayedColumnsStateWiseRC: string[] = ['sno', 'stateName', 'fundReleased', 'sanctionOrderNo', 'dateOfSanctionOrder', 'releasedHeadToRc', 'releaseRcToState', 'head', 'ucStatus', 'ucUpload', 'financialYear', 'action']
  displayedColumnsStateWiseRCNotAction: string[] = ['sno', 'stateName', 'fundReleased', 'sanctionOrderNo', 'dateOfSanctionOrder', 'releasedHeadToRc', 'releaseRcToState', 'head', 'ucStatus', 'ucUpload', 'financialYear']
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  dataSourceForState: any
  dataSourceForRC: any
  stateName: string = '';

  constructor(public _modalService: NgbModal, private _storageService: StorageService, private _alertService: AlertService,
    private _equipmentProcurementService: EquipmentProcurementService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.userDetails = this._storageService.getUserDetails();
    if (this.userDetails.role_id == this.KicUsersRoleId.hoAdmin) {
      if (this.tabbingLinkData != undefined) {
        this.rdChange(this.tabbingLinkData.data)
      }
      if (this.tabbingLinkData?.stateName != undefined) {
        this.getPCAList(2)
      } else {
        this.getPCAList();
      }
    } else if (this.userDetails.role_id == this.KicUsersRoleId.rcAdmin) {
      if (this.tabbingLinkData?.stateName != undefined) {
        this.getKisceFinancialStatusList()
      } else {
        this.getKisceFinancialStatusList()
      }
    } else {
      this.getKisceFinancialStatusList()
    }

  }


  getKisceFinancialStatusList() {
    this.mainLoader = true
    this._equipmentProcurementService.getKisceFinancialStatus(this.userDetails.user_id, this.userDetails.role_id, 80).subscribe({
      next: (res: any) => {
        this.mainLoader = false;
        this.rdListshow = true;
        this.dataSourceForState = new MatTableDataSource(res.data);
        setTimeout(() => this.dataSourceForState.paginator = this.statePaginator);
      },
      error: () => {
        this.rdListshow = false
        this.mainLoader = false
      }
    })
  }

  getPCAList(check?: any) {
    this.mainLoader = true
    this._equipmentProcurementService.getPCAListForKic(this.userDetails.user_id, this.userDetails.role_id, 80).subscribe({
      next: (res: any) => {
        this.mainLoader = false
        if (this.userDetails.role_id == this.KicUsersRoleId.kicAdmin) {
          this.rdListshow = true
          this.pcaList = res.data
          this.dataSource = new MatTableDataSource(this.pcaList);
          setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
        }
        if (this.userDetails.role_id == this.KicUsersRoleId.stateAdmin) {
          this.rdListshow = true
          this.pcaList = res.data
          this.dataSource = new MatTableDataSource(this.pcaList);
          setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
        }
        if (this.userDetails.role_id == this.KicUsersRoleId.rcAdmin) {
          this.rdListshow = true;
          this.kicWiseData = res.kicWise
          var state_Name = res.statewise[0].state
          this.stateName = state_Name
          var kicData = res.kicWise.filter((data: any) => {
            if (data.state_name.toLowerCase().trim() == state_Name.toLowerCase().trim()) {
              return data
            }
          })
          this.dataSource = new MatTableDataSource(kicData);
          setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);

          this.dataSourceForState = new MatTableDataSource(res.statewise);
          this.dataSourceForState.paginator = this.statePaginator;
          setTimeout(() => this.dataSourceForState.paginator = this.statePaginator);
          if (check == 2) {
            this.stateChange(this.tabbingLinkData.stateId, this.tabbingLinkData.stateName)
          }
        }
        // for ho role
        if (this.userDetails.role_id == this.KicUsersRoleId.hoAdmin) {
          if (this.tabbingLinkData == undefined || check == 1 || check == 2) {

            if (check == 2) {
              this.rdListshow = true;
            } else {
              this.rdListshow = false;
            }

            this.kicWiseData = res.kicWise
            this.stateWiseData = res.statewise
            this.dataSourceForRC = new MatTableDataSource(res.rcData)
            setTimeout(() => this.dataSourceForRC.paginator = this.rcWISEPaginator);

            if (check == 2) {
              this.stateChange(this.tabbingLinkData.stateId, this.tabbingLinkData.stateName)
            }
          }

        }
      },
      error: () => {
        this.mainLoader = false
        this.pcaList = []
        this.dataSource = new MatTableDataSource(this.pcaList);
        setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
      }
    })
  }

  rdChange(elementData: any) {
    this.dataOfTabClicked.emit({
      data: elementData,
      check: 'rc',
      stateId: this.tabbingLinkData?.stateId,
      stateName: this.tabbingLinkData?.stateName
    })
    this.mainLoader = true
    this._equipmentProcurementService.getKisceFinancialStatus(elementData.user_id, elementData.role_id, 80).subscribe({
      next: (res: any) => {


        this.mainLoader = false;
        this.rdListshow = true;
        this.dataSourceForState = new MatTableDataSource(res.data);
        setTimeout(() => this.dataSourceForState.paginator = this.statePaginator);
      },
      error: () => {
        this.rdListshow = false
        this.mainLoader = false
      }
    })

  }

  backToRD() {
    this.rdListshow = false
    this.getPCAList(1);
    this.tabbingLinkData == undefined
    this.dataOfTabClicked.emit(undefined)
  }

  stateChange(address_state_id: any, state_Name: string) {
    this.dataOfTabClicked.emit({
      data: this.tabbingLinkData?.data,
      check: this.tabbingLinkData?.check,
      stateId: address_state_id,
      stateName: state_Name
    })
    if (this.userDetails.role_id == this.KicUsersRoleId.rcAdmin) {
      this.stateName = address_state_id;
      var stateIdData = this.kicWiseData.filter((kic: any) => {
        if (kic.state_name == address_state_id) {
          return kic
        }
      })
    }
    if (this.userDetails.role_id == this.KicUsersRoleId.hoAdmin) {
      this.stateName = state_Name;
      var stateIdData = this.kicWiseData.filter((kic: any) => {
        if (kic.state_name.toLowerCase().trim() == state_Name.toLowerCase().trim()) {

          return kic
        }
      })
    }
    this.dataSource = new MatTableDataSource<any>(stateIdData);
    this.dataSource.paginator = this.kicWISEPaginator;
  }



  viewUcUploads(elementData: any) {
    const modelRefForEquipmentModal = this._modalService.open(FinancialStatusUcDetailsComponent, { size: 'xl', centered: true, backdrop: 'static' })
    modelRefForEquipmentModal.componentInstance.financialStatusData = elementData;
    modelRefForEquipmentModal.result.then((res: any) => { })
      .catch(() => { });
  }


  editRowIndex: number | null = null;
  originalRowData: any = {};

  enableEdit(index: number, row: any) {
    this.editRowIndex = index;
    this.originalRowData = { ...row };
  }

  disableEdit() {
    this.editRowIndex = null;
    this.originalRowData = {};
  }

  cancelEdit(row: any) {
    Object.assign(row, this.originalRowData);
    this.disableEdit();
  }

  saveEdit(valuess: any) {
    if (!valuess.date_Of_Release_HO_TO_RC || valuess.date_Of_Release_HO_TO_RC == '') {
      this._alertService.swalPopError('Date of release head office to RC can not be empty')
      return;
    }

    if (this.userDetails.role_id === this.KicUsersRoleId.rcAdmin &&
      (!valuess.date_Of_Release_RC_TO_State || valuess.date_Of_Release_RC_TO_State === '' || !valuess.uC_Status || valuess.uC_Status === '')) {
      this._alertService.swalPopError('Date of release RC to State and UC Status can not be empty');
      return;
    }

    const modifiedData = {
      user_id: this.userDetails.user_id || 0,
      roll_id: this.userDetails.role_id || 0,
      scheme_Roll_Id: 80,
      hO_TO_RC_RDATE: moment(valuess.date_Of_Release_HO_TO_RC)?.format('YYYY-MM-DD') || null,
      rC_TO_State_RDATE: valuess.date_Of_Release_RC_TO_State ? (moment(valuess.date_Of_Release_RC_TO_State)?.format('YYYY-MM-DD')) : null,
      uC_Status: valuess.uC_Status || '',
      sanction_Id: valuess.sanction_Id || '',
    };
    this.mainLoader = true
    this._equipmentProcurementService.updateKisceFinancialStatus(modifiedData).subscribe({
      next: (res: any) => {
        this.mainLoader = false
        if (res.data === true) {
          this.getKisceFinancialStatusList()
          this.disableEdit();
          this._alertService.swalPopSuccess(res.message || 'Data updated successfully!')
        } else {
          this._alertService.swalPopError(res.message || 'something went wrong')
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }


}
