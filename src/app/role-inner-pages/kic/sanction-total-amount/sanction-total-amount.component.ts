import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KicProposalService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-proposal.service';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { KicSanctionService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-sanction.service';
import Swal from 'sweetalert2';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { RoleCode } from 'src/app/_common/_enums/role-code';

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
  selector: 'app-sanction-total-amount',
  templateUrl: './sanction-total-amount.component.html',
  styleUrls: ['./sanction-total-amount.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class SanctionTotalAmountComponent implements OnInit {
  @Input() popupShow: any = false;
  @Output() showHideControl: any = new EventEmitter();
  @Output() popupControl_ConfirmBtn: any = new EventEmitter();
  @Input() kiC_id!: number;
  @Input() sanction_Id!: number;
  @Input() sanction_No!: number;
  is_kic_kisce: any;
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
  fileUploaded = false; // Track if any file is uploaded in rows other than the first
  savedRowIndexes: number[] = []; // To track saved row indexes;
  fileUploadedInAnyRow = false; // Track if any file is uploaded in any row
  enableSaveButton: boolean = false;
  userDetails: any
  KicUsersRoleId: any = RoleCode



  constructor(
    private fb: FormBuilder,
    private _proposalService: KicProposalService,
    private kicSanctionService: KicSanctionService,
    public activeModal: NgbActiveModal,
    private _alertService: AlertService,
    private _storageService: StorageService,
    private datePipe: DatePipe
  ) { }

  sanctionReleasedForm: FormGroup = this.fb.group({
    tableData: this.fb.array([]),
  });

  ngOnInit() {
    this.userDetails = this._storageService.getUserDetails()
    this.isLoading = true;
    this.getReleasedAmountDetails();
    this.updateSaveButtonState();

  }

  get tableDataFormArr(): FormArray {
    return this.sanctionReleasedForm.get('tableData') as FormArray;
  }

  createRow(data?: any) {
    return this.fb.group({
      sanction_Id: [this.sanction_Id],
      amount_Head_Name: [data?.amount_Head_Name || '', Validators.required],
      frequency_Type: [data?.frequency_Type || '', Validators.required],
      amount: [data?.amount || '', Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]*$')])],
      date_Of_Release: [data?.date_Of_Release ? new Date(data.date_Of_Release) : ''],
      upload_Document: [data?.upload_Document || ''],
      isSaved: [data?.isSaved || false],
    });
    
  }

  addRow() {
    this.tableDataFormArr.push(this.createRow());
    this.updateSaveButtonState();
  }

  preventCharacters(event: KeyboardEvent): void {
    const char = String.fromCharCode(event.which);
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
    }
  }

  getReleasedAmountDetails() {
    this.kicSanctionService.getReleasedAmountHeads().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.getAmountDetails = res.data;
        this.getReleasedAmountList();
      },
      error: (errors: any) => {
        this.isLoading = false;
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
      },
    });
  }

  getReleasedAmountList() {
    this.kicSanctionService.getSanctionTotalAmountList(this.sanction_Id).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.getReleaseAmountList = res.data;

        // Clear the existing rows in the form array
        while (this.tableDataFormArr.length !== 0) {
          this.tableDataFormArr.removeAt(0);
        }

        // Populate the form array with fetched data
        this.savedRowIndexes = this.getReleaseAmountList.map((row: any) => row.index); // Adjust according to your data structure

        this.getReleaseAmountList.forEach((ele: any) => {
          const formGroup = this.createRow(ele);
          if (this.savedRowIndexes.includes(ele.index)) {
            formGroup.get('isSaved')?.setValue(true);
          }
          this.tableDataFormArr.push(formGroup);
        });

        // Disable all rows after fetching data
        this.disableFormFields();
      },
      error: (errors: any) => {
        this.isLoading = false;
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
      },
    });
  }

  private disableFormFields() {
    this.tableDataFormArr.controls.forEach(control => control.disable());
  }

  validateForm(): boolean {
    this.submitted = true;
    let isValid = true;

    this.tableDataFormArr.controls.forEach((item, index) => {
      const fileValue = item.get('upload_Document')?.value;
      // const field1Value = item.get('amount_Head_Name')?.value;
      // const field2Value = item.get('frequency_Type')?.value;
      // const field3Value = item.get('amount')?.value;
      // const field4Value = item.get('date_Of_Release')?.value;
      // if (!field1Value || !field2Value || !field3Value || !field4Value) {
      //   isValid = false;
      // }
      const requiredFields = ['amount_Head_Name', 'frequency_Type', 'amount'];

      requiredFields.forEach(field => {
        const control = item.get(field);
        if (!control?.value || control.invalid) {
          isValid = false;
        }
      });

      if (index === 0 && this.submitted) {
        if (!fileValue) {
          this.fileUploaded = false;
        }
      }

      if (index > 0 && fileValue) {
        this.fileUploaded = true;
      }
    });

    if (!this.fileUploaded && this.submitted) {
      const firstItem = this.tableDataFormArr.controls[0] as FormGroup;
      const fileValue = firstItem.get('upload_Document')?.value;
      if (!fileValue) {
        isValid = false;
      }
    }

    return isValid;
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  verifyFileSize(files: any) {
    var fileSize = files[0].size;
    return fileSize;
  }

  uploadFile(files: any, index: any, formControlName: any) {
    if (files.length === 0) {
      return;
    } else {
      let extFile = this.getFileExtension(files[0]);
      if (extFile === 'pdf') {
        let fileSize = files[0].size;
        if (fileSize < 10485770) {
          const formData = new FormData();
          formData.append('file', files[0], files[0].name);
          formData.append('path', 'data/Tempimage');
          formData.append('uploadType', '4');

          this.mainLoader = true;
          this._proposalService?.uploadFile(formData).subscribe({
            next: (res) => {
              this.mainLoader = false;
              if (res?.isUploaded == true) {
                this._alertService.swalPopSuccess('File Uploaded');
                const control = this.tableDataFormArr.at(index);
                control.get(formControlName)?.patchValue(res?.filedataList[0].filePath);

                if (index > 0) {
                  this.fileUploaded = true;
                }
              } else {
                this._alertService.swalPopError(res?.errorMsg || 'Upload Failed! Please Try Again.');
              }
            },
            error: () => {
              this.mainLoader = false;
              this._alertService.swalPopError('Upload Failed! Please Try Again.');
            },
          });
        } else {
          const control = this.tableDataFormArr.at(index);
          control.get(formControlName)?.patchValue('');
          if (index > 0) {
            this.fileUploaded = true;
          }
          this._alertService.swalPopError('File size must not be more than 10Mb.');
        }
      } else {
        const control = this.tableDataFormArr.at(index);
        control.get(formControlName)?.patchValue('');
        this._alertService.swalPopWarning('Only PDF files are allowed!');
      }
    }
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

  onDateChange(event: any, index: number) {
    const date = event.value;
    if (date) {
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      this.tableDataFormArr.at(index).get('date_Of_Release')?.setValue(formattedDate);
    }
  }

  saveReleaseAmount() {
    this.submitted = true;
    this.isLoading = true;
    const unsavedRows = this.tableDataFormArr.controls
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => !row.get('isSaved')?.value)
      .map(({ row }) => row.value);

    if (this.validateForm()) {
      const payload = {
        add_Released_Head: unsavedRows,
      };
      this.kicSanctionService.addSanctionTotalAmount(payload).subscribe({
        next: (res: any) => {
          if (res?.status === 1 && res?.data === true) {
            this.isLoading = false;
            this.handleSuccess('Record Added Successfully!');
            // Update the state of saved rows
            this.tableDataFormArr.controls.forEach((row, index) => {
              if (!row.get('isSaved')?.value) {
                row.get('isSaved')?.setValue(true);
                this.savedRowIndexes.push(index);
              }
            });
          } else {
            this.showError('Failed!');
            this.isLoading = false;
          }
        },
        error: (errors: any) => {
          this._alertService?.swalPopErrorTimer(errors?.error?.message);
          this.isLoading = false;

        },
      });
    } else {
      this.isLoading = false;
      this.sanctionReleasedForm.markAllAsTouched();
      this._alertService?.swalPopErrorTimer('Invalid fields found! Please check.');
    }
  }

  updateSaveButtonState() {
    // Enable or disable the save button based on whether there are any rows in the FormArray
    const hasRows = this.tableDataFormArr.length > 0;
    const hasUnsavedRows = this.tableDataFormArr.controls.some(row => !row.get('isSaved')?.value);
    this.enableSaveButton = hasRows && hasUnsavedRows;
  }


  private showError(message: string) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      text: message,
      showConfirmButton: true,
      timer: 3000,
    });
  }

  private handleSuccess(message: string) {
    this.modalClose();
    this.onAdd.emit();
    Swal.fire({
      position: 'center',
      icon: 'success',
      text: message,
      showConfirmButton: true,
      timer: 3000,
    });
  }
}
