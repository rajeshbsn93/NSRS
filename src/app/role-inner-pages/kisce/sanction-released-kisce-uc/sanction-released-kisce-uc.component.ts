import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KicProposalService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-proposal.service';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { environment } from 'src/environments/environment';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { KicSanctionService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-sanction.service';
import Swal from 'sweetalert2';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
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
  selector: 'app-sanction-released-kisce-uc',
  templateUrl: './sanction-released-kisce-uc.component.html',
  styleUrls: ['./sanction-released-kisce-uc.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class SanctionReleasedKisceUcComponent implements OnInit {
  @Input() popupShow: any = false;
  @Output() showHideControl: any = new EventEmitter();
  @Output() popupControl_ConfirmBtn: any = new EventEmitter();
  @Input() sanction_Id!: number;
  @Input() sanction_No!: number;
  @Input() released_Amount!: number;
  @Input() sanction_Date!: number;
  @Input() kiC_id!: string;
  @Input() kiC_Name!: string;
  @Input() kiC_Type!: string;
  @Input() state_name!: string;
  @Input() enableEdit!: boolean;
  addSanctionReleased: any = [];
  fileUrl: string = environment.fileUrl;
  selectedFile!: File;
  mainLoader: Boolean = false;
  moduleType: string = '';
  getFilePath: string = '';
  formSubmitted: boolean = false;
  roleId: string = '';
  userRoleId: any;
  addressDetails: any[] = [];
  setUserRole: string = '';
  onAdd = new EventEmitter();
  isLoading: boolean = false;
  showDocument: boolean = false;
  sanctionReleaseForm!: FormGroup;
  userkicAndKisceRole: any = RoleCode

  constructor(
    private _fb: FormBuilder,
    private kicSanctionService: KicSanctionService,
    public activeModal: NgbActiveModal,
    private _proposalService: KicProposalService,
    private _alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.formInitialization();
    this.getSanctionReleaseUCDetails();
  }

  formInitialization() {
    this.sanctionReleaseForm = this._fb.group({
      uC_Amount: ['', [Validators.required]],
      date_Submission: ['', [Validators.required]],
      uC_Document: ['', [Validators.required]],
      e_File_No: ['', [Validators.required]],
      sanction_Id: this.sanction_Id,
    });
    this.sanctionReleaseForm.get('uC_Amount')?.valueChanges.subscribe(value => {
      this.validateMaxAmount(this.sanctionReleaseForm.get('uC_Amount'));
    });
  }

  validateMaxAmount(control: AbstractControl | null): void {
    if (control) {
      const value = parseFloat(control.value);
      if (!isNaN(value) && value > this.released_Amount) {
        control.setErrors({ maxAmountExceeded: true });
      } else {
        if (control.hasError('maxAmountExceeded')) {
          control.setErrors(null);
          control.updateValueAndValidity();
        }
      }
    }
  }

  preventCharacters(event: KeyboardEvent): void {
    const char = String.fromCharCode(event.which);
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
    }
  }

  calculateTotalUCAmount(): number {
    return this.addSanctionReleased.reduce((sum: any, item: any) => sum + Number(item.uC_Amount), 0) +
      Number(this.sanctionReleaseForm.value.uC_Amount || 0);
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.sanctionReleaseForm.valid && this.calculateTotalUCAmount() <= this.released_Amount) {
      let payload = {
        uC_Amount: this.sanctionReleaseForm.value.uC_Amount,
        date_Submission: this.sanctionReleaseForm.value.date_Submission,
        uC_document: this.sanctionReleaseForm.value.uC_Document,
        e_File_No: this.sanctionReleaseForm.value.e_File_No,
        sanction_Id: this.sanction_Id,
        scheme_Role_Id: this.userkicAndKisceRole.kisceAdmin
      }
      this.kicSanctionService.addSanctionReleaseUC(payload).subscribe({
        next: (res: any) => {
          if (res?.status === 1) {
            this.sanctionReleaseForm.reset();
            this.getSanctionReleaseUCDetails();
            this.formSubmitted = false;
            this.showDocument = false;

          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              text: 'Failed!',
              showConfirmButton: true,
              timer: 3000,
            });
          }
        },

        complete: () => { },
        error: (errors: any) => {
          this.formSubmitted = false;
          this._alertService?.swalPopErrorTimer(errors?.error?.message);
          this.modalClose();
        },
      });
    }

  }

  getSanctionReleaseUCDetails() {
    this.mainLoader = true;
    this.kicSanctionService.getUcSanctionReleased(this.sanction_Id).subscribe({
      next: (res: any) => {
        this.addSanctionReleased = res.data;
        this.mainLoader = false;
      },
      complete: () => { },
      error: (errors: any) => {
        this.formSubmitted = false;
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
      },
    });
  }

  modalClose(closeType = 'cancel') {
    this.activeModal.close(closeType);
    this.onAdd.emit();
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  verifyFileSize(files: any) {
    var fileSize = files[0].size;
    return fileSize;
  }

  uploadFile(files: any, formcontrolname: any) {
    if (files.length === 0) {
      return;
    } else {
      let extFile = this.getFileExtension(files[0]);
      let fileSize = this.verifyFileSize(files);
      if (extFile == 'pdf') {
        if (fileSize < 10485770) {
          const formData = new FormData();
          formData.append('file', files[0], files[0].name);
          formData.append('path', `data/${this.moduleType}`);
          formData.append('uploadType', '4');
          // Uploading file - calling service
          this.mainLoader = true;
          this._proposalService?.uploadFile(formData).subscribe({
            next: (res: any) => {
              this.mainLoader = false;
              if (res?.isUploaded == true) {
                this.sanctionReleaseForm.get(`${formcontrolname}`)?.setValue(res?.filedataList[0].filePath);
                this._alertService.swalPopSuccess('File Uploaded');
                this.showDocument = true;
              } else {
                this._alertService.swalPopError(res?.errorMsg || 'Upload Failed! Please Try Again.');
              }
            },
            error: () => {
              this.mainLoader = false;
              // Handle error
            },
          });
        } else {
          this._alertService.swalPopWarning('File Size must be less than 10Mb.');
        }
      } else {
        this._alertService.swalPopError('Only PDF files are allowed.');
      }
    }
  }
}
