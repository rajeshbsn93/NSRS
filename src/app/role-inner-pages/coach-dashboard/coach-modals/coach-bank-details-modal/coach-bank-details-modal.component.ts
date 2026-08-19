import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { SharableService } from "src/app/_common/services/innerPagesServices/innerpagesSharable.service";
import { BankInformationService } from "src/app/_common/services/role-inner-pages-services/athlete-services/bank_information.service";
import { CoachBankInfoService } from "src/app/_common/services/role-inner-pages-services/coach-services/coach-bank-info.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { CoachAddBankDetailsModalComponent } from "../coach-add-bank-details-modal/coach-add-bank-details-modal.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { EncryptionService } from "src/app/_common/services/innerPagesServices/encryption.service";

@Component({
  selector: 'app-coach-bank-details-modal',
  templateUrl: './coach-bank-details-modal.component.html',
  styleUrls: ['./coach-bank-details-modal.component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, LoaderComponent,MatTooltipModule],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ]
})
export class CoachBankDetailsModalComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['serial_no', 'ifsc_code', 'bank_name', 'bank_account_no', 'branch_name', 'bank_address','cancelled_cheque_upload', 'is_Verified', 'status'];
  dataSource: any

  @ViewChild('verifyconfirmationModal') verifyConfirmModal: any;
  @ViewChild('confirmationSaveModal') confirmSaveModal: any;
  @ViewChild('primaryconfirmationModal') confirmPrimaryModal: any;
  verifyconfirmModalRef: any;
  saveconfirmModalRef: any;
  primaryConfirmModalRef: any;
  confirmRowData: any
  verifedRowData: any
  primaryAcRowData: any

  checkprimary: boolean = false
  showAddButton: boolean = true;
  showEditButton: boolean = false;
  showSaveButton: boolean = false;
  supportStaffcheck: boolean = false;


  coachBankForm!: FormGroup;
  userDetails: any;
  userProfileData:any;
  loader: boolean = false
  bankFileUploadRes: any;
  bankFileUploadUrl: any;
  fileBaseUrl = environment.fileUrl;
  @ViewChild('bankAccountInput') bankAccountInput!: ElementRef;


  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder,
    private storageService: StorageService, private bankInformationService: BankInformationService, private alertService: AlertService,
    private sharableService: SharableService,
    private modal: NgbModal,
    private coachBankInfoService: CoachBankInfoService,
    private encryptionService:EncryptionService
  ) { }

  ngOnInit(): void {
    this.userDetails = this.storageService.getUserDetails()
    this.userProfileData = this.storageService.getUserProfileDataFromSessionRes();
    if (this.userDetails.role_id == 103) this.supportStaffcheck = true;
    this.basicDetailsReactiveForm();
    this.setFormValues();
  }

  basicDetailsReactiveForm() {
    this.coachBankForm = this.formBuilder.group({
      id: [0],
      official_detail_id: [this.userDetails.user_id || 0],
      roll_Id:this.userDetails.role_id,
      bank_name: ['', Validators.required],
      bank_account_number: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[0-9]*$')]],
      ifsc_code: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      cancelled_cheque_upload: [''],
      bank_branch: ['', Validators.required],
      bank_address: [''],
      is_Primary: [false],
      acc_Holder_Name: [''],
      is_Verified: [false]

    })
  }


  setFormValues() {
   let listGetType = this.userDetails.role_id == 103 ? '' :'M'
    this.loader = true
    this.coachBankInfoService.getOfficialBankInfo(this.userDetails.user_id, this.userDetails.role_id,listGetType).subscribe({
      next: (response: any) => {
        console.log('data1', response);

        if (response.length === 0) {
          this.checkprimary = true
          this.showAddButton = true;
          this.showEditButton = false;
          this.showSaveButton = true;
        } else {
          this.showAddButton = true;
          this.showEditButton = true;
          this.showSaveButton = true;
        }
        // const primaryRecord = response.find(
        //   (record: { official_BankInfo: { is_Primary: boolean; }; }) => record.official_BankInfo.is_Primary === true
        // );
        const primaryRecord = response[0];
        this.dataSource = new MatTableDataSource<any>(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.loader = false
        this.coachBankForm.controls['bank_name'].setValue(primaryRecord?.official_BankInfo?.bank_name)
        this.coachBankForm.controls['bank_account_number'].setValue(primaryRecord?.official_BankInfo?.bank_account_number)
        this.coachBankForm.controls['ifsc_code'].setValue(primaryRecord?.official_BankInfo?.ifsc_code);
        this.coachBankForm.controls['is_Primary'].setValue(primaryRecord?.official_BankInfo?.is_Primary);
        this.coachBankForm.controls['id'].setValue(primaryRecord?.official_BankInfo?.id || 0);
        this.bankFileUploadUrl = primaryRecord?.official_BankInfo?.cancelled_cheque_upload;

        if (!this.isNullOrEmpty(this.coachBankForm.get('ifsc_code')?.value)) {
          this.onBankIfscChange(this.coachBankForm.get('ifsc_code')?.value);
        }
        if (this.isNullOrEmpty(primaryRecord?.official_BankInfo?.cancelled_cheque_upload)) {
          this.coachBankForm.get('cancelled_cheque_upload')?.addValidators(Validators.required);
        }
        this.coachBankForm.controls['bank_branch'].disable()
        this.coachBankForm.controls['bank_address'].disable();
        this.coachBankForm.controls['bank_name'].disable();
        this.coachBankForm.disable();
      },
      error: () => {
        this.loader = false
        console.error('Caught in GetAthletePersonalInfo API')
      }
    })

  }

  // common empyty Or Null check function
  isNullOrEmpty(value: any): boolean {
    return value === null || value === '' || value === undefined;
  }

  editButton(data?: any) {
    this.coachBankForm.get('ifsc_code')?.enable();
    this.coachBankForm.get('bank_account_number')?.enable();
    this.coachBankForm.get('cancelled_cheque_upload')?.enable()
    this.coachBankForm.get('is_Primary')?.enable()

    if (data != undefined) {
      this.coachBankForm.controls['bank_name'].setValue(data.master_BankDetail.bank_name);
      this.coachBankForm.controls['bank_branch'].setValue(data.master_BankDetail.bank_branch)
      this.coachBankForm.controls['bank_address'].setValue(data.master_BankDetail.bank_address)

      this.coachBankForm.controls['bank_account_number'].setValue(data?.official_BankInfo?.bank_account_number)
      this.coachBankForm.controls['ifsc_code'].setValue(data?.official_BankInfo?.ifsc_code);
      this.coachBankForm.controls['is_Primary'].setValue(data?.official_BankInfo?.is_Primary);
      this.coachBankForm.controls['id'].setValue(data?.official_BankInfo?.id);
      this.bankFileUploadUrl = data?.official_BankInfo?.cancelled_cheque_upload;
      if (data?.official_BankInfo.is_Primary == true) {
        this.checkprimary = true
      } else {
        this.checkprimary = false
      }
    } else {
      this.checkprimary = true
    }
    this.showAddButton = false;
    this.showEditButton = false;
    this.showSaveButton = false;

  }
  addButton() {
    // this.coachBankForm.controls['ifsc_code'].reset();
    // this.coachBankForm.controls['bank_name'].reset();
    // this.coachBankForm.controls['bank_branch'].reset();
    // this.coachBankForm.controls['bank_address'].reset();
    // this.coachBankForm.controls['bank_account_number'].reset();
    // this.coachBankForm.controls['cancelled_cheque_upload'].reset();
    // this.coachBankForm.controls['is_Primary'].reset();
    // this.coachBankForm.controls['id'].setValue(0);

    // this.coachBankForm.get('ifsc_code')?.enable();
    // this.coachBankForm.get('bank_account_number')?.enable();
    // this.coachBankForm.get('cancelled_cheque_upload')?.enable()
    // this.coachBankForm.get('is_Primary')?.enable()
    // this.coachBankForm.get('cancelled_cheque_upload')?.setValidators([Validators.required]);
    // this.coachBankForm.get('cancelled_cheque_upload')?.updateValueAndValidity();

    // this.bankFileUploadUrl = '';
    // this.showAddButton = false;
    // this.showEditButton = false;
    // this.showSaveButton = false;
    const modalRef = this.modal.open(
      CoachAddBankDetailsModalComponent,
      {
        size:'xl',
        centered:true,
        backdrop:false,
        keyboard:false,
      }
    )
    modalRef.componentInstance.officialData = this.dataSource.data
    modalRef.result.then((res)=>{
      if(res)this.setFormValues();
    })
    .catch((err)=>{console.error(err)})

  }

  verifyDocumentFileExtension(files: any) {
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile
  }

  bankFileUpload(files: any) {
    console.log(files)

    if (files.length === 0) {
      return;
    } else {
      var extFile = this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
        // if (extFile == "pdf") {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("file", files[i], files[i].name);
          formData.append("path", "documents\\canceledCheck")
          var d = 3
          formData.append("uploadType", "3")
          // formData.append("academy_detail_id",this.academy_detail_id)
        }
        //serivce calling
        this.loader = true;

        this.sharableService.uploadFile(formData).subscribe(res => {
          this.loader = false;
          console.log(res)

          this.bankFileUploadRes = res;
          if (this.bankFileUploadRes.isUploaded == true) {
            this.swalFileUploadSuccess()
            this.bankFileUploadUrl = this.bankFileUploadRes.filedataList[0].filePath;
            //console.log(this.bankFileUploadUrl)
          } else {
            var errMsg
            if (this.bankFileUploadRes.errorMsg) {
              errMsg = this.bankFileUploadRes.errorMsg
            } else {
              errMsg = 'Failed Please Try Again!'
            }
            this.swalFileUploadError(errMsg)
          }
        }, (error) => {
          console.error("error caught in upload file")
          this.loader = false
        })
      }
      else {
        Swal.fire({
          icon: 'error',
          // title: 'Oops...',
          text: 'Only jpg, jpeg, png, pdf file is allowed!',
        })
      }
    }
  }

  swalFileUploadSuccess() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      text: `File Uploaded`,
      showConfirmButton: false,
      timer: 1500
    });
  }

  swalFileUploadError(errMsg: any) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      text: errMsg,
      showConfirmButton: false,
      timer: 1500
    });
  }

  onBankIfscChange(event: any) {
    if (event != '') {
      this.loader = true;
      this.coachBankInfoService.getBankDetails(event).subscribe({
        next: (response: any) => {
          this.loader = false;
          console.log(response)
          if (response != null) {
            
            this.coachBankForm.controls['bank_name'].setValue(response.bank_name);
            this.coachBankForm.controls['bank_branch'].setValue(response.bank_branch)
            this.coachBankForm.controls['bank_address'].setValue(response.bank_address)
            this.coachBankForm.controls['bank_branch'].disable()
            this.coachBankForm.controls['bank_address'].disable();
            this.coachBankForm.controls['bank_name'].disable();
          } else {
            this.alertService.swalPopWarning('Branch information not available!')
            this.coachBankForm.controls['ifsc_code'].reset();
            this.coachBankForm.controls['bank_name'].reset();
            this.coachBankForm.controls['bank_branch'].reset();
            this.coachBankForm.controls['bank_address'].reset();
            this.coachBankForm.controls['bank_account_number'].reset();
          }
        },
        error: (err: any) => {
          this.loader = false;
          this.alertService.swalPopWarning('Branch information not available!')
          this.coachBankForm.controls['ifsc_code'].reset();
          this.coachBankForm.controls['bank_name'].reset();
          this.coachBankForm.controls['bank_branch'].reset();
          this.coachBankForm.controls['bank_address'].reset();
          this.coachBankForm.controls['bank_account_number'].reset();
          console.error(err)
        }
      })
    } else {
      this.coachBankForm.controls['bank_name'].reset();
      this.coachBankForm.controls['bank_branch'].reset();
      this.coachBankForm.controls['bank_address'].reset();
      this.coachBankForm.controls['bank_account_number'].reset();
    }
  }

  save() {
    if (this.coachBankForm.valid) {
      this.coachBankForm.value.player_id = this.userDetails.user_id
      if (this.coachBankForm.value.bank_account_number != null) {
        this.coachBankForm.value.bank_account_number = this.bankAccountInput.nativeElement.value
      } else {
        this.coachBankForm.value.bank_account_number = ''
      }
      if (this.bankFileUploadRes != undefined) {
        this.coachBankForm.value.cancelled_cheque_upload = this.bankFileUploadRes.filedataList[0].filePath;
      } else {
        if (this.bankFileUploadUrl != null) {
          this.coachBankForm.value.cancelled_cheque_upload = this.bankFileUploadUrl
        }
      }
      const formData = this.coachBankForm.getRawValue()
      formData.bank_account_number = formData.bank_account_number?.toString()
      formData.cancelled_cheque_upload = this.bankFileUploadUrl;
      formData.is_Primary = false;
      delete formData.bank_branch;
      delete formData.bank_address;
      formData.bank_account_number = formData.bank_account_number ? this.encryptionService.encryptionAES(formData.bank_account_number) : formData.bank_account_number
      formData.ifsc_code = formData.ifsc_code ? this.encryptionService.encryptionAES(formData.ifsc_code) : formData.ifsc_code
      // console.log(formData);
      this.loader = true
      this.coachBankInfoService.saveOfficialBankInfo(formData).subscribe({
        next: (response: any) => {
          if (response) {
            this.loader = false
            this.alertService.swalPopSuccess('Bank Details Updated Successfully!');
            this.activeModal.close();
          } else {
            this.loader = false
            this.alertService.swalPopError('Either Duplicate account number or some other issue!');
          }
        },
        error: () => {
          this.loader = false
          console.error('Caught in SaveAthleteBankInfo API')
        }
      })
    } else {
      this.coachBankForm.markAllAsTouched();
    }
  }

  
  // Added By Rajesh
  updateVerifiedDetail() {

    const official_BankInfo = this.confirmRowData?.official_BankInfo
    const formData = {
      official_detail_id: official_BankInfo.player_Detail_id || this.userDetails.user_id,
      roll_Id:this.userDetails.role_id,
      bank_name: official_BankInfo.bank_name,
      bank_account_number: official_BankInfo.bank_account_number ? this.encryptionService.encryptionAES(official_BankInfo.bank_account_number) : official_BankInfo.bank_account_number,
      ifsc_code: official_BankInfo.ifsc_code ? this.encryptionService.encryptionAES(official_BankInfo.ifsc_code) : official_BankInfo.ifsc_code,
      cancelled_cheque_upload: official_BankInfo.cancelled_cheque_upload,
      is_Primary: official_BankInfo.is_Primary,
      id: official_BankInfo.id,
      acc_Holder_Name: this.verifedRowData?.nameAtBank,
      is_Verified: true
    }

    this.loader = true
    this.coachBankInfoService.saveOfficialBankInfo(formData).subscribe({
      next: (response) => {
        if (response) {
          this.loader = false
          this.alertService.swalPopSuccess('Bank Account Verified Successfully!');
          this.setFormValues();
          this.saveconfirmModalRef.close();
        } else {
          this.loader = false
          this.alertService.swalPopError('Either Duplicate account number or some other issue!');
        }
      },
      error: () => {
        this.loader = false
        console.error('Caught in SaveAthleteBankInfo API')
      }
    })
  }
  updatePrimaryDetail() {
    const official_BankInfo = this.primaryAcRowData?.official_BankInfo
    const formData = {
      official_detail_id: official_BankInfo.player_Detail_id || this.userDetails.user_id,
      roll_Id:this.userDetails.role_id,
      bank_name: official_BankInfo.bank_name,
      bank_account_number: official_BankInfo.bank_account_number ? this.encryptionService.encryptionAES(official_BankInfo.bank_account_number) : official_BankInfo.bank_account_number,
      ifsc_code: official_BankInfo.ifsc_code ? this.encryptionService.encryptionAES(official_BankInfo.ifsc_code) : official_BankInfo.ifsc_code,
      cancelled_cheque_upload: official_BankInfo.cancelled_cheque_upload,
      is_Primary: true,
      id: official_BankInfo.id,
      acc_Holder_Name: '',
      is_Verified: official_BankInfo.is_Verified
    }
    // console.log(formData)

    this.loader = true
    this.coachBankInfoService.saveOfficialBankInfo(formData).subscribe({
      next: (response) => {
        if (response) {
          this.loader = false
          this.alertService.swalPopSuccess('Bank Account Verified Successfully!');
          this.setFormValues();
          this.primaryConfirmModalRef.close();
        } else {
          this.loader = false
          this.alertService.swalPopError('Either Duplicate account number or some other issue!');
        }
      },
      error: () => {
        this.loader = false
        console.error('Caught in SaveAthleteBankInfo API')
      }
    })
  }
  verifiyAccount(record: any) {
    this.confirmRowData = record;
    this.verifyconfirmModalRef = this.modal.open(this.verifyConfirmModal, { centered: true, size: 'md' })
  }
  confirmBankInfoSave(record: any) {
    this.verifedRowData = record;
    this.saveconfirmModalRef = this.modal.open(this.confirmSaveModal, { centered: true, size: 'md' })
  }
  makePrimaryAccount(primaryRecord: any) {
    this.primaryAcRowData = primaryRecord;
    this.primaryConfirmModalRef = this.modal.open(this.confirmPrimaryModal, { centered: true, size: 'md' })
  }

  verifyAcAndGetToken() {
    this.loader = true
    this.bankInformationService.getTokenForHPAC().subscribe({
      next: (response: any) => {
        if (response) {
          console.log('token response ---------------', response);
          // this.verifyAccount(this.jsondata?.data?.token)
          this.verifyAccount(response.data?.token)
          this.loader = false
        } else {
          this.alertService.swalPopError(response.message || 'Something Went Wrong!');

          this.loader = false
        }
      },
      error: (err: any) => {
        this.loader = false
        console.error('Caught in SaveAthleteBankInfo API')
      }
    })
  }

  verifyAccount(token: string) {
    console.log('rowData', this.confirmRowData);
    if (this.userProfileData?.profileData?.mobileNo != null) {

      this.loader = true
      this.bankInformationService.verifyBankAccount( this.userProfileData.profileData.mobileNo, this.confirmRowData?.official_BankInfo?.bank_account_number, this.confirmRowData?.official_BankInfo?.ifsc_code, token).subscribe({
        next: (response) => {
          console.log("response verify----------", response);
          this.loader = false
          if (response[0]?.data) {
            if (response[0]?.data.accountExists == "NO") {
              this.alertService.swalPopError("Account does not exist. Please check the account number and IFSC.");
            } else {
              this.confirmBankInfoSave(response[0]?.data);
              this.verifyconfirmModalRef.close();
            }
          } else {
            this.alertService.swalPopError(response[0].message || 'An Error Occurred');
          }
        },
        error: (errorResponse: any) => {
          this.loader = false
          console.error("API Error:", errorResponse);
          this.alertService.swalPopError("Something went wrong. Please try again.");
        }
      })
    } else {
      this.alertService.swalPopError('Please add mobile no. first!');
    }
  }
  isVerifyButtonDisabled(element: any): boolean {
    const bankInfo = element.official_BankInfo;
    if (bankInfo.is_Primary && bankInfo.is_Verified) { return true; }
    if (!bankInfo.is_Primary && !bankInfo.is_Verified) { return true; }
    if (!bankInfo.is_Primary && bankInfo.is_Verified) { return false; }
    return true;
  }
}