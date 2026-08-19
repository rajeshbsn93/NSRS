import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { FinancialYearMaster, KicSanctionService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-sanction.service';
import { Router } from '@angular/router';
import { KicDashboardService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-dashboard/kic-dashboard.service';
import { KicSanctionListComponent } from '../../kic-sanction-modal-view/kic-sanction-list/kic-sanction-list.component';

@Component({
  selector: 'app-add-proposal',
  templateUrl: './add-proposal.component.html',
  styleUrls: ['./add-proposal.component.css'],
})
export class AddProposalComponent implements OnInit {
  @Input() popupShow: any = false;
  @Output() showHideControl: any = new EventEmitter();
  @Output() popupControl_ConfirmBtn: any = new EventEmitter();
  onAdd = new EventEmitter();
  stateListData: any = [];
  addSanctionForm!: FormGroup;
  userDetails: any;
  moment = moment;
  formSubmitted: boolean = false;
  districtListData: any;
  kicName: string = '';
  kicType: string = '';
  nsrs_id: string = '';
  mainLoader: Boolean = false;
  isLoading: boolean = false;
  moduleType: string = '';

  rcList: any = [];
  financialYearMaster: FinancialYearMaster = [];
  statelist: any = [];
  kisListData: any = [];

  constructor(
    private _fb: FormBuilder,
    private kicSanctionService: KicSanctionService,
    private _storageService: StorageService,
    private _alertService: AlertService,
    private _router: Router,
    public activeModal: NgbActiveModal,
    private _kicDashboardService: KicDashboardService,
    private modalService: NgbModal
  ) {
    this.userDetails = this._storageService.getUserDetails();
  }

  ngOnInit(): void {
    if (this._router.url == '/kisce') {
      this.moduleType = 'kisce';
    } else {
      this.moduleType = 'kic';
    }
    this.formInitialization();
    this.masterRcList();
    this.financialYearMasterList();
  }

  popupControl_hide() {
    this.popupShow = false;
    this.showHideControl.emit(false);
  }
  popupControl_show() {
    this.popupShow = true;
    this.showHideControl.emit(true);
  }
  ClickedOut(event: any) {
    if (event.target.className === 'modal fade show') {
      // this.popupShow = false;
      // this.showHideControl.emit(false);
    }
  }
  popupControl_Confirm() {
    this.popupShow = false;
    this.popupControl_ConfirmBtn.emit(true);
  }

  formInitialization() {
    this.addSanctionForm = this._fb.group({
      stateId: ['', Validators.required],
      sanction_No: ['', [Validators.required]],
      e_File_No: ['', [Validators.required]],
      FinancialYear: ['', [Validators.required]],
      user_Id: [this.userDetails.user_id || '', [Validators.required]],
      rcId: ['', [Validators.required]],
      scheme_Roll_Id: [82, [Validators.required]],
    });
  }

  addSanction() {
    this.formSubmitted = true;
    if (this.addSanctionForm.valid) {
      this.addSanctionForm.patchValue({
        rcId: Number(this.addSanctionForm?.get('rcId')?.value),
        stateId: Number(this.addSanctionForm?.get('stateId')?.value)
      });
      this.isLoading = true;
      this.kicSanctionService.addSanction(this.addSanctionForm.value).subscribe({
        next: (res: any) => {
          if (res?.status === 1) {
            this.formSubmitted = false;
            this.modalClose();
            this.onAdd.emit();
            Swal.fire({
              position: 'center',
              icon: 'success',
              text: 'Record Added Successfully!',
              showConfirmButton: true,
              timer: 3000,
            });
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              text: 'Failed!',
              showConfirmButton: true,
              timer: 3000,
            });
          }

          this.popupControl_hide();
          this.isLoading = false;
        },
        complete: () => { },
        error: (errors: any) => {
          this.formSubmitted = false;
          this._alertService?.swalPopErrorTimer(errors?.error?.message);
          this.popupControl_hide();
          this.isLoading = false;
        },
      });
    } else {
      this.isLoading = false;
      this.addSanctionForm.markAllAsTouched();
      this._alertService?.swalPopErrorTimer('Please fill the required fields');
      //TODO : Handle error
    }
  }

  onInput(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const trimmedValue = inputElement.value.replace(/^\s+/, '');
    this.addSanctionForm.controls[controlName].setValue(trimmedValue, { emitEvent: false });
  }

  getResultsByNsrsId(nsrsId: string) {
    this.nsrs_id = nsrsId;
    if (nsrsId == '') {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        text: 'Please Enter NSRS ID',
        showConfirmButton: true,
        timer: 3000,
      });
      return;
    }
    this.isLoading = true;
    this.kicSanctionService.getDetailsByNsrsID(nsrsId, this.moduleType).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.data.length == 0) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            text: 'No Data Found',
            showConfirmButton: true,
            timer: 3000,
          });
        } else {
          this.kicName = res.data[0].kiC_Name;
          this.kicType = res.data[0].kic_Type;
          this.addSanctionForm.patchValue({
            state: res.data[0].state,
            district: res.data[0].district,
          });
        }
      },
    });
  }

  modalClose(closeType = 'cancel') {
    this.activeModal.close(closeType);
  }

  // ++++++++++++++++ Custom Validation Start +++++++++++++++
  spaceValidator() {
    return (control: any) => {
      if (control.value && control.value?.trim()?.length == 0) {
        return { required: true };
      }
      return null;
    };
  }
  // ++++++++++++++++ Custom Validation End +++++++++++++++

  // ++++++++++++++++++++ State master by rc id ++++++++++++++++

  masterRcList() {
    this._kicDashboardService?.rcList().subscribe({
      next: (res: any) => {
        if (res?.status === 1) {
          const updatedArray = res.data.map((item: any) => {
            if (item.id === 6691 && item.value === "") {
              return { ...item, value: "all" };
            }
            return item;
          });

          this.rcList = updatedArray

        }
      },
      error: (errors: any) => { },

    })
  }

  financialYearMasterList() {
    this.kicSanctionService.getKicFinancialYearMaster?.().subscribe({
      next: (res: any) => {
        if (res.data) {
          this.financialYearMaster = res.data
        }
      },  error: (errors: any) => { },
    })
  }

  onChangeRc(rc_Id: any) {
    this.addSanctionForm.get('stateId')?.setValue('')
    this.kicSanctionService.getSanctionStateListByRC(rc_Id).subscribe({
      next: (res: any) => {
        this.statelist = res.data
      },
      error: (errors: any) => { },

    })
  }

  onChnageState() {
    // this.addCompetitionForm.get('state')?.setValue('')
    // this.kicSanctionService.getSanctionStateListByRC(0).subscribe({
    //   next: (res: any) => {
    //     this.statelist = res.data
    //   },
    //   error: (errors: any) => { },

    // })
  }

  kisList() {
    const stateID = this.addSanctionForm.get('stateId')?.value
    this.kicSanctionService.getKicListbyStateId(stateID, 82).subscribe({
      next: (res: any) => {
        this.kisListData = res.data
        const kicListModalRef = this.modalService.open(KicSanctionListComponent, { size: 'xl', centered: true });
        kicListModalRef.componentInstance.kicSanctionListData = this.kisListData;
      },
      error: (errors: any) => { },

    })


  }
}
