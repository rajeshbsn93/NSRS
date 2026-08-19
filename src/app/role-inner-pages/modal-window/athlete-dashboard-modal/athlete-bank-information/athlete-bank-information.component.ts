import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { BankInformationService } from "src/app/_common/services/role-inner-pages-services/athlete-services/bank_information.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { environment } from "src/environments/environment";
import { AthleteAddBankInfoComponent } from "../athlete-add-bank-info/athlete-add-bank-info.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { EncryptionService } from "src/app/_common/services/innerPagesServices/encryption.service";

@Component({
  selector: 'app-athlete-bank-information',
  templateUrl: './athlete-bank-information.component.html',
  styleUrls: ['./athlete-bank-information.component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, LoaderComponent, MatTooltipModule]
})

export class AthleteBankInformationComponent implements OnInit {

  // jsondata = {
  //   "status": "SUCCESS",
  //   "subCode": "200",
  //   "message": "Token generated",
  //   "data": {
  //     "token": "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IkNGNTY5NjAxQ0xFN0xOQTI4SjFJS0FMUU1IVEciLCJhY2NvdW50SWQiOjU5NTI3LCJzaWduYXR1cmVDaGVjayI6ZmFsc2UsImlwIjoiMTY0LjEwMC42OC4xMjEiLCJhZ2VudCI6IlBBWU9VVCIsImNoYW5uZWwiOiIiLCJhZ2VudElkIjo1OTUyNywia2lkIjoiQ0Y1Njk2MDFDTEU3TE5BMjhKMUlLQUxRTUhURyIsImVuYWJsZUFwaSI6ZmFsc2UsImV4cCI6MTczODE0NTc5OSwiaWF0IjoxNzM4MTQ1MTk5LCJzdWIiOiJQQVlPVVRBUElfQVVUSCJ9.mWp5ZGjOHDlw5gp8NOjegHp_AysATLacld6g0tgkTT1o-t0JDUh5q7StNUtMmqhB",
  //     "expiry": 1738145799
  //   }
  // }
  // veri = [
  //   {
  //     "status": "SUCCESS",
  //     "subCode": "200",
  //     "message": "Bank Account details verified successfully.",
  //     "data": {
  //       "nameAtBank": "ROSE MASTICA MERILJETRUT AMALI",
  //       "accountExists": "YES",
  //       "refId": "1281085031"
  //     }
  //   }
  // ]




  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['serial_no', 'ifsc_code', 'bank_name', 'bank_account_no', 'branch_name', 'bank_address', 'cancel_cheque', 'is_verified', 'status'];
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

  AthleteBankinfo: any
  bankForm!: FormGroup;
  userDetails: any;
  userProfileData: any;
  loader: boolean = false
  bankFileUploadRes: any;
  bankFileUploadUrl: any;
  fileBaseUrl = environment.fileUrl;
  popupLoader=false
  @ViewChild('bankAccountInput') bankAccountInput!: ElementRef;

  constructor(public activeModal: NgbActiveModal, private storageService: StorageService,
    private bankInformationService: BankInformationService, private alertService: AlertService,
    private modal: NgbModal,
    private encryptionService:EncryptionService
  ) { }

  ngOnInit(): void {
    this.userDetails = this.storageService.getUserDetails()
    this.userProfileData = this.storageService.getUserProfileDataFromSessionRes();
    this.setFormValues();

  }

  setFormValues() {
    this.loader = true
    this.bankInformationService.athletBankInfo(this.userDetails.user_id, 'M').subscribe({
      next: (response: any) => {

        this.loader = false
        this.AthleteBankinfo = response
        this.dataSource = new MatTableDataSource<any>(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.loader = false
        console.error('Caught in GetAthletePersonalInfo API')
      }
    })

  }
  updateVerifiedDetail() {

    const athlete_BankInfo = this.confirmRowData?.athlete_BankInfo
    const formData = {
      player_id: athlete_BankInfo.player_Detail_id || this.userDetails.user_id,
      bank_name: athlete_BankInfo.bank_name,
      bank_account_number: athlete_BankInfo.bank_account_number ? this.encryptionService.encryptionAES(athlete_BankInfo.bank_account_number) : athlete_BankInfo.bank_account_number,
      ifsc_code: athlete_BankInfo.ifsc_code ? this.encryptionService.encryptionAES(athlete_BankInfo.ifsc_code) : athlete_BankInfo.ifsc_code,
      cancelled_cheque_upload: athlete_BankInfo.cancelled_cheque_upload,
      is_Primary: athlete_BankInfo.is_Primary,
      id: athlete_BankInfo.id,
      acc_Holder_Name: this.verifedRowData?.nameAtBank,
      is_Verified: true
    }

    this.popupLoader = true
    this.bankInformationService.saveAthletBankInfo(formData).subscribe({
      next: (response) => {
        if (response) {
          this.popupLoader = false
          this.alertService.swalPopSuccess('Bank Account Verified Successfully!');
          this.setFormValues();
          this.saveconfirmModalRef.close();
        } else {
          this.popupLoader = false
          this.alertService.swalPopError('Either Duplicate account number or some other issue!');
        }
      },
      error: () => {
        this.popupLoader = false
        console.error('Caught in SaveAthleteBankInfo API')
      }
    })
  }
  updatePrimaryDetail() {
    const athlete_BankInfo = this.primaryAcRowData?.athlete_BankInfo
    const formData = {
      player_id: athlete_BankInfo.player_Detail_id || this.userDetails.user_id,
      bank_name: athlete_BankInfo.bank_name,
      bank_account_number: athlete_BankInfo.bank_account_number ? this.encryptionService.encryptionAES(athlete_BankInfo.bank_account_number) : athlete_BankInfo.bank_account_number,
      ifsc_code: athlete_BankInfo.ifsc_code ? this.encryptionService.encryptionAES(athlete_BankInfo.ifsc_code) : athlete_BankInfo.ifsc_code,
      cancelled_cheque_upload: athlete_BankInfo.cancelled_cheque_upload,
      is_Primary: true,
      id: athlete_BankInfo.id,
      acc_Holder_Name: '',
      is_Verified: athlete_BankInfo.is_Verified
    }

    this.loader = true
    this.bankInformationService.saveAthletBankInfo(formData).subscribe({
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
    this.popupLoader = true
    this.bankInformationService.getTokenForHPAC().subscribe({
      next: (response: any) => {
        if (response) {
          this.verifyAccount(response.data?.token)
          this.popupLoader = false
        } else {
          this.alertService.swalPopError(response.message || 'Something Went Wrong!');
          this.popupLoader = false
        }
      },
      error: (err: any) => {
        this.popupLoader = false
        console.error('Caught in SaveAthleteBankInfo API')
      }
    })


  }

  verifyAccount(token: string) {
    if (this.userProfileData?.profileData?.mobileNo != null) {

      this.popupLoader = true
      this.bankInformationService.verifyBankAccount(this.userProfileData.profileData.mobileNo, this.confirmRowData?.athlete_BankInfo?.bank_account_number, this.confirmRowData?.athlete_BankInfo?.ifsc_code, token).subscribe({
        next: (response) => {
          this.popupLoader = false
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
          this.popupLoader = false
          console.error("API Error:", errorResponse);
          this.alertService.swalPopError("Something went wrong. Please try again.");
        }
      })
    } else {
      this.alertService.swalPopError('Please add mobile no. first!');
    }
  }

  openAddBankInfoModal() {
    const modalRef = this.modal.open(AthleteAddBankInfoComponent, { centered: true, size: 'xl', backdrop: 'static', keyboard: false });
    modalRef.result.then((result) => {
      if (result) this.setFormValues();
    });
  }

  isVerifyButtonDisabled(element: any): boolean {
    const bankInfo = element.athlete_BankInfo;
    if (bankInfo.is_Primary && bankInfo.is_Verified) { return true; }
    if (!bankInfo.is_Primary && !bankInfo.is_Verified) { return true; }
    if (!bankInfo.is_Primary && bankInfo.is_Verified) { return false; }
    return true;
  }


}

