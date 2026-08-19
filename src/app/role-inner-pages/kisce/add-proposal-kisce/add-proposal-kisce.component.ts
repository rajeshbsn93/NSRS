import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { MaterialModule } from 'src/app/_common/material.module';
import { AddProposal } from 'src/app/_common/models/proposal';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicProposalService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-proposal.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-add-proposal-kisce',
  templateUrl: './add-proposal-kisce.component.html',
  styleUrls: ['./add-proposal-kisce.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  providers:[
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class AddProposalKisceComponent implements OnInit {
  @Input() popupShow: any = false;
  @Output() showHideControl: any = new EventEmitter();
  @Output() popupControl_ConfirmBtn: any = new EventEmitter();

  addProposalForm!: FormGroup;
  userDetails: any;
  moment = moment;
  formSubmitted: boolean = false;
  scheduleMeetingModalData: any;
  academymasterlistdata: any;
  kiscetypelist: any = [];
  selectedIndex = 0;
  moduleType: string = '';
  mainLoader: Boolean = false;

  constructor(
    private _fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private _router: Router,
    private _storageService: StorageService,
    private _alertService: AlertService,
    private _proposalService: KicProposalService
  ) {
    this.userDetails = this._storageService.getUserDetails();
  }

  ngOnInit(): void {
    if (this._router.url == '/kisce') {
      this.moduleType = 'kisce';
    } else {
      this.moduleType = 'kic';
    }
    console.log(this.scheduleMeetingModalData);
    this.formInitialization();
    this.kisceList();
    // this.new()
  }

  kisceList() {
    this.mainLoader = true;
    this._proposalService.kiscetypelist(this.moduleType).subscribe({
      next: (res: any) => {
        this.mainLoader = false;
        console.log(res);
        if (res?.status === 'success') {
          this.kiscetypelist = res.data;
          console.log('datadropdown', res);
        }
      },
      error: () => {
        this.mainLoader = false;
      },
    });
  }

  formInitialization() {
    this.addProposalForm = this._fb.group({
      proposal_head: ['', [Validators?.required, this.spaceValidator()]],
      kisce_type: [this.moduleType == 'kic' ? 'New' : 'New', [Validators?.required]],
      proposal_date: ['', [Validators?.required]],
      approval_date: [''],
      NSRS_Id: [this.scheduleMeetingModalData.data.nsrS_Id],
    });
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

  savedata() {
    this.popupControl_hide();
    if (this.addProposalForm?.get('kisce_type')?.value == '0') {
      this._alertService.swalPopWarning('Please Select KISCE Type');
      return;
    }
    if (!this.addProposalForm?.get('proposal_date')?.value) {
      this._alertService.swalPopWarning('Please Select Proposal Date');
      return;
    }
     let payload: AddProposal = {
      Proposal_Id: this.addProposalForm?.get('Proposal_Id')?.value?.trim(),
      Proposal_Head: this.addProposalForm?.get('proposal_head')?.value?.trim(),
      Kic_Type: this.addProposalForm?.get('kisce_type')?.value,
      Proposa_Date: moment(this.addProposalForm?.get('proposal_date')?.value).format('YYYY-MM-DDTHH:mm:ss'),
      User_Id: this.userDetails?.user_id,
      approval_date: '',
      sessionId: JSON.parse(localStorage.getItem('sessiondata') || '')?.sessionId,
      Proposal_Type: this.addProposalForm?.get('Proposal_Type')?.value?.trim(),
      NSRS_Id: this.addProposalForm?.get('NSRS_Id')?.value?.trim(),
    };
    if (this.addProposalForm.valid) {
      this.mainLoader = true;
      this._proposalService?.addProposal(payload, this.moduleType)?.subscribe({
        next: (res: any) => {
          if (res?.status === 1) {
            this.mainLoader = false;
            this.formSubmitted = false;
            this._proposalService.changeTab(1); // Switch to the second tab
            this.popupControl_ConfirmBtn.emit(true);
            this.activeModal.close('save click');
            this._alertService.swalPopSuccess('Data Added Successfully');
          } else {
            this._alertService.swalPopErrorTimer(res?.error?.message || 'error');
          }
          this.mainLoader = false;
        },
        complete: () => {},
        error: (errors) => {
          this.mainLoader = false;
          this.formSubmitted = false;
          this._alertService?.swalPopErrorTimer(errors?.error?.message);
          this.popupControl_hide();
        },
      });
    } else {
    }
  }

  popupControl_hide() {
    this.popupShow = false;
    this.showHideControl.emit(false);
  }
}
