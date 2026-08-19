import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/_common/material.module';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { KisceManpowerAddStrengthDetailsComponent } from '../kisce-manpower-add-strength-details/kisce-manpower-add-strength-details.component';
import { RoleCode } from 'src/app/_common/_enums/role-code';


@Component({
  selector: 'app-kisce-manpower-strength-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './kisce-manpower-strength-details.component.html',
  styleUrls: ['./kisce-manpower-strength-details.component.css']
})
export class KisceManpowerStrengthDetailsComponent implements OnInit {

constructor(public activeModal: NgbActiveModal,
    public _equimentProcurementService: EquipmentProcurementService,
    private _storageService: StorageService,
    private _alertService: AlertService,
    public _modalService: NgbModal
  ) { }

  userDetails!: IUserDetails
  mainLoader: Boolean = false
  originalStatusMap: { [key: number]: string } = {};
  KicUsersRoleId: any = RoleCode

  @ViewChild('strengthDetailPaginator', { read: MatPaginator }) strengthDetailPaginator!: MatPaginator
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['sno', 'designation', 'sanctionStrength', 'currentStrength']
manpowerStrengthModalViewData:any

  ngOnInit(): void {
    this.userDetails = this._storageService.getUserDetails();
    this.getManpowerDetails()

  }

  getManpowerDetails() {
    this.mainLoader = true
    this._equimentProcurementService.getKisceManpowerStrengthDetails(this.userDetails.user_id, this.userDetails.role_id,this.manpowerStrengthModalViewData.academy_id, 80).subscribe({
      next: (res: any) => {
        this.mainLoader = false
        this.dataSource = new MatTableDataSource(res.data);
        setTimeout(() => this.dataSource.paginator = this.strengthDetailPaginator);
      },
      error: () => {
        // this.mainLoader = false;
        // this.dataSource.data = [];
        // this.mainLoader=false
        // this.pcaList=[]
        // this.dataSource = new MatTableDataSource(this.pcaList);
        // this.dataSource.paginator = this.kicWISEPaginator;
        // setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
      }
    })

  }

  // toggleEdit(row: any) {
  //   // Toggle only the current row's editing state
  //   console.log('row----------------',row)
  //   console.log('rowediting----------------',row.editing)

  // }

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

    // Simulate API call
    console.log('Saving row:', row);

    const transformed = {
      user_id: this.userDetails.user_id || 0,
      role_detail_id: row.role_detail_id || 0,
      academy_detail_id: row.academy_detail_id || 0,
      kitd_unique_id: row.kitd_unique_id || '',
      current_Status: row.current_Status || '',
      scheme_Roll_Id: 80
    };

    this._equimentProcurementService.saveKisceManpowerDetails(transformed).subscribe({
      next: (res: any) => {

        this.mainLoader = false
        console.log(res);
        

      },
      error: () => {

      }
    })

    row.editing = false;
  }



  updateKisceStrengthModal(elementData: any) {
    const modelRefForKisceStrengthUpdateModal = this._modalService.open(KisceManpowerAddStrengthDetailsComponent, { size: 'xl', centered: true, backdrop: 'static' })
    modelRefForKisceStrengthUpdateModal.componentInstance.manpowerStrengthUpdateModalViewData = elementData;
    modelRefForKisceStrengthUpdateModal.componentInstance.academyId = this.manpowerStrengthModalViewData.academy_id;
    modelRefForKisceStrengthUpdateModal.result.then((res: any) => {
      this.getManpowerDetails();
    })
      .catch(() => { });
  }


}
