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
import { KisceManpowerDetailsComponent } from '../../kisce-monitoring-modals/kisce-manpower-details/kisce-manpower-details.component';
import { KisceManpowerStrengthDetailsComponent } from '../../kisce-monitoring-modals/kisce-manpower-strength-details/kisce-manpower-strength-details.component';

@Component({
  selector: 'app-past-champion-athletes',
  templateUrl: './past-champion-athletes.component.html',
  styleUrls: ['./past-champion-athletes.component.css']
})
export class PastChampionAthletesComponent implements OnInit {

  @ViewChild('statePaginator', { read: MatPaginator }) statePaginator!: MatPaginator
  @ViewChild('kicWISEPaginator', { read: MatPaginator }) kicWISEPaginator!: MatPaginator
  @ViewChild('rcWISEPaginator', { read: MatPaginator }) rcWISEPaginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('content') contentDialog: any

  userDetails!: IUserDetails
  pcaList: any
  mainLoader: Boolean = false
  KicUsersRoleId: any = RoleCode
  multiEquipmentTagForm!: FormGroup
  stateWiseData: any
  kicWiseData: any
  rdListshow: Boolean = false;

  @Input() uniqueKUID: any
  @Input() tabbingLinkData!: ITabbingLink

  @Output() dataOfTabClicked: EventEmitter<any> = new EventEmitter<any>();

  displayedColumnsKIC: string[] = ['sno', 'kiud', 'name', 'discipline', 'aadhar_validation', 'joining_date', 'elgibility_criteria', 'reason_for_delay', 'action'];
  displayedColumnsState: string[] = ['sno', 'kicName', 'kid', 'district', 'kiud', 'name', 'discipline', 'aadhar_validation', 'joining_date', 'reason_for_delay'];
  displayedColumnsKICWiseRC: string[] = ['sno', 'stateName', 'kicName', 'kid', 'district', 'kiud', 'name', 'discipline', 'aadhar_validation', 'joining_date', 'reason_for_delay'];
  displayedColumnsStateWiseRC: string[] = ['sno', 'stateName', 'totalManpoweHire', 'district', 'nameOfCentre', 'discipline', 'traineesMale', 'traineesFemale']
  displayedColumnsForRCList: string[] = ['sno', 'rdName', 'totalKic', 'stateName']

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
        this.getManpowerKisceList()
      } else {
        this.getManpowerKisceList()
      }
    } else {
      this.getManpowerKisceList()
    }

  }


  getManpowerKisceList() {
    this.mainLoader = true
    this._equipmentProcurementService.getKisceManpowerList(this.userDetails.user_id, this.userDetails.role_id, 80).subscribe({
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
    this._equipmentProcurementService.getKisceManpowerList(elementData.user_id, elementData.role_id, 80).subscribe({
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

  openKisceDetailsModal(elementData: any) {
    const modelRefForEquipmentModal = this._modalService.open(KisceManpowerDetailsComponent, { size: 'xl', centered: true, backdrop: 'static' })
    modelRefForEquipmentModal.componentInstance.manpowerDetailsModalViewData = elementData;
    modelRefForEquipmentModal.result.then((res: any) => {})
      .catch(() => { });
  }

  openKisceStrengthModal(elementData: any) {
    const modelRefForEquipmentModal = this._modalService.open(KisceManpowerStrengthDetailsComponent, { size: 'xl', centered: true, backdrop: 'static' })
    modelRefForEquipmentModal.componentInstance.manpowerStrengthModalViewData = elementData;
    modelRefForEquipmentModal.result.then((res: any) => {})
      .catch(() => { });
  }
}
