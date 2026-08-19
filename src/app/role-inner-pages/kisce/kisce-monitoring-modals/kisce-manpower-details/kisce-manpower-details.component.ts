import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/_common/material.module';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { RoleCode } from 'src/app/_common/_enums/role-code';

@Component({
  selector: 'app-kisce-manpower-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './kisce-manpower-details.component.html',
  styleUrls: ['./kisce-manpower-details.component.css']
})
export class KisceManpowerDetailsComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
    public _equimentProcurementService: EquipmentProcurementService,
    private _storageService: StorageService,
    private _alertService: AlertService,
  ) { }

  userDetails!: IUserDetails
  mainLoader: Boolean = false
  originalStatusMap: { [key: number]: string } = {};
  manpowerDetails: any
  designationMaster: any
  manpowerDetailsModalViewData: any

  selectedDesignation: string = '';
  selectedStatus: string = '';
  selectedGender: string = '';

  KicUsersRoleId: any = RoleCode

  pageSize: number = 10;
  currentPage: number = 0;
  paginatedData: any[] = [];
  filteredData: any[] = [];
  Math = Math;
  ngOnInit(): void {
    this.userDetails = this._storageService.getUserDetails();
    this.getMasterDesignation();
    this.getManpowerDetails()
  }

  // get data
  getMasterDesignation() {
    this.mainLoader = true
    this._equimentProcurementService.getMasterDesignationManpower().subscribe({
      next: (res: any) => {
        this.mainLoader = false
        this.designationMaster = Array.isArray(res.data) ? res.data : [];
      },
      error: () => { }
    })
  }

  getManpowerDetails() {
    this.mainLoader = true;
    this._equimentProcurementService.getKisceManpowerDetails(this.userDetails.user_id, this.userDetails.role_id, this.manpowerDetailsModalViewData.academy_id, 80).subscribe({
      next: (res: any) => {
        this.mainLoader = false;
        this.manpowerDetails = res.data
        this.filteredData = this.groupDataByCentreName(res.data);
        this.setPaginatedData();
      },
      error: () => { }
    });
  }

  // edit and update data
  toggleEdit(row: any, index: number) {
    row.editing = true;
    this.originalStatusMap[index] = row.current_Status;
  }

  cancelEdit(row: any, index: number) {
    row.current_Status = this.originalStatusMap[index];
    row.editing = false;
  }

  saveEdit(row: any, index: number) {
    if (!row.current_Status || row.current_Status.trim() === '') {
      this._alertService.swalPopError('Current status can not be empty')
      return;
    }
    const modifiedData = {
      user_id: this.userDetails.user_id || 0,
      role_detail_id: row.role_detail_id || 0,
      academy_detail_id: row.academy_detail_id || 0,
      kitd_unique_id: row.kitd_unique_id || '',
      current_Status: row.current_Status || '',
      scheme_Roll_Id: 80
    };
    this.mainLoader = true
    this._equimentProcurementService.saveKisceManpowerDetails(modifiedData).subscribe({
      next: (res: any) => {
        this.mainLoader = false
        if(res.data === true){
          this.getManpowerDetails();
          this._alertService.swalPopSuccess(res.message)
        }else{
          this._alertService.swalPopError(res.message || 'something went wrong')
        }
      },
      error: (err) => {
        console.log(err);
      }
    })

    row.editing = false;
  }


// set pagination and filter data 
  groupDataByCentreName(data: any) {
    const grouped: { [key: string]: any[] } = {};

    data.forEach((item: any) => {

      if (!grouped[item.designation]) {
        grouped[item.designation] = [];
      }
      grouped[item.designation].push(item);
    });
    const groupedData = Object.keys(grouped).reduce((result: any, key) => {
      const rows = grouped[key];
      rows.forEach((row, index) => {
        if (index === 0) {
          row.rowspan = rows.length; // Only first row gets rowspan
        } else {
          row.rowspan = null; // Other rows do not span
          row.CENTRE_NAME = null; // Hide "Centre Name" for subsequent rows
        }
      });
      result.push(...rows);
      return result;
    }, []);
    // this.manpowerDetails = groupedData;
    return groupedData;
  }

   setPaginatedData() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    const pageData = this.filteredData.slice(start, end);
    this.paginatedData = this.groupDataByCentreName(pageData);
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.filteredData.length) {
      this.currentPage++;
      this.setPaginatedData();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.setPaginatedData();
    }
  }
  get showAction(): boolean {
    return this.userDetails.role_id === this.KicUsersRoleId.rcAdmin || this.userDetails.role_id === this.KicUsersRoleId.stateAdmin;
  }

// apply filter
  onChangeGender(value: string) {
    this.selectedGender = value;
    this.applyFilters();
  }

  onChangeStatus(value: string) {
    this.selectedStatus = value;
    this.applyFilters();
  }

  onchangeDesignation(value: string) {
    this.selectedDesignation = value;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.manpowerDetails;

    if (this.selectedGender) {
      filtered = filtered.filter((item: any) => item.gender === this.selectedGender);
    }

    if (this.selectedStatus) {
      filtered = filtered.filter((item: any) => item.employment_Status === this.selectedStatus);
    }

    if (this.selectedDesignation) {
      filtered = filtered.filter((item: any) => item.designation === this.selectedDesignation);
    }

    this.filteredData = this.groupDataByCentreName(filtered);
    this.currentPage = 0;
    this.setPaginatedData();
  }

  clearFilters() {
    this.selectedGender = '';
    this.selectedStatus = '';
    this.selectedDesignation = '';
    this.filteredData = [...this.manpowerDetails];
    this.currentPage = 0;
    this.setPaginatedData();
  }
  
}
