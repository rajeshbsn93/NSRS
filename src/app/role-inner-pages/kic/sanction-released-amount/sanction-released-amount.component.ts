import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KicSanctionService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-sanction.service';

@Component({
  selector: 'app-sanction-released-amount',
  templateUrl: './sanction-released-amount.component.html',
  styleUrls: ['./sanction-released-amount.component.css'],
})
export class SanctionReleasedAmountComponent implements OnInit {
  @Input() popupShow: any = false;
  @Output() showHideControl: any = new EventEmitter();
  @Output() popupControl_ConfirmBtn: any = new EventEmitter();
  @Input() kiC_id!: number;
  @Input() sanction_Id!: number;
  @Input() sanction_No!: number;
  state_Name:any
  onAdd = new EventEmitter();
  addCommentHistory: any = [];
  getAmountDetails: any[] = [];
  getReleaseAmountList: any[] = [];
  fileUrl: string = environment.fileUrl;
  selectedFile!: File;
  mainLoader: Boolean = false;
  isLoading: Boolean = false;
  moduleType: string = '';
  getFilePath: string = '';
  enableEdit: boolean = true;
  totalAmount: any;
  submitted = false;
  isReadonly = true;
  fileUploaded = false; 
  constructor(
    private fb: FormBuilder,
    private kicSanctionService: KicSanctionService,
    public activeModal: NgbActiveModal,
    private _alertService: AlertService,
  ) {}

  sanctionReleasedForm: FormGroup = this.fb.group({
    tableData: this.fb.array([]),
  });

  ngOnInit() {
    this.isLoading = true;
    this.getReleasedAmountDetails();
  }

  get tableDataFormArr(): FormArray {
    return this.sanctionReleasedForm.get('tableData') as FormArray;
  }

  createRow(data?: any) {
    return this.fb.group({
      sanction_Id: [this.sanction_Id],
      amount_Head_Name: [data?.amount_Head_Name || '', Validators.required],
      frequency_Type: [data?.frequency_Type || '', Validators.required],
      amount_Type: [data?.amount_Type || '', Validators.required],
      amount: [data?.amount || ''],
      date_Of_Release: [data?.date_Of_Release ? new Date(data.date_Of_Release) : ''],
      upload_Document: [data?.upload_Document || ''],
    });
  }

  getReleasedAmountDetails() {
    this.kicSanctionService.getReleasedAmountHeads().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.getAmountDetails = res.data;
        this.getReleasedAmountList();
      },
      complete: () => {},
      error: (errors: any) => {
        // this.formSubmitted = false;
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
        // this.popupControl_hide();
      },
    });
  }

  getReleasedAmountList() {
    this.kicSanctionService.getReleaseAmountList(this.sanction_Id).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.getReleaseAmountList = res.data;
        this.getReleaseAmountList?.forEach((ele: any, index: number) => {
          this.tableDataFormArr.push(this.createRow(ele));
        });
      },
      complete: () => {},
      error: (errors: any) => {
        // this.formSubmitted = false;
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
        // this.popupControl_hide();
      },
    });
  }

  getFileExtension(file: any) {
    let fileIndex = file.name.lastIndexOf('.') + 1;
    let extFile = file.name.substr(fileIndex, file.name.length).toLowerCase();
    return extFile;
  }

  openFile(filePath: string) {
    if (filePath) {
      const fileUrl = this.fileUrl + filePath;
      window.open(fileUrl, '_blank');
    } else {
      this._alertService.swalPopError('File path is not available.');
    }
  }

  modalClose(closeType = 'cancel') {
    this.activeModal.close(closeType);
  }

  ClickedOut(event: any) {
    if (event.target.className === 'modal fade show') {
      // this.popupShow = false;
      // this.showHideControl.emit(false);
    }
  }
}
