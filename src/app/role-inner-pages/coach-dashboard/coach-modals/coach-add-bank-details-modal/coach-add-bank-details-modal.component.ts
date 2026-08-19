import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { EncryptionService } from 'src/app/_common/services/innerPagesServices/encryption.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { BankInformationService } from 'src/app/_common/services/role-inner-pages-services/athlete-services/bank_information.service';
import { CoachBankInfoService } from 'src/app/_common/services/role-inner-pages-services/coach-services/coach-bank-info.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coach-add-bank-details-modal',
  templateUrl: './coach-add-bank-details-modal.component.html',
  styleUrls: ['./coach-add-bank-details-modal.component.css'],
  standalone:true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, LoaderComponent],
})
export class CoachAddBankDetailsModalComponent implements OnInit {

  coachBankForm!: FormGroup;
    userDetails: any;
    loader: boolean = false
    bankFileUploadRes: any;
    bankFileUploadUrl: any;
    fileBaseUrl = environment.fileUrl;
    @ViewChild('bankAccountInput') bankAccountInput!: ElementRef;
    checkprimary: boolean = false
    officialData:any
  
  
    constructor(public activeModal: NgbActiveModal, 
      private storageService: StorageService, private bankInformationService: BankInformationService, private alertService: AlertService,
      private sharableService: SharableService,
      private modal: NgbModal,
      private formBuilder:FormBuilder,
      private coachBankInfoService: CoachBankInfoService,
      private encryptionService: EncryptionService
    ) { }

  ngOnInit() {
    this.userDetails = this.storageService.getUserDetails()
    this.basicDetailsReactiveForm();
    // console.log('officialData',this.officialData)
    this.setCoachBankForm()
    
  }
  basicDetailsReactiveForm() {
      this.coachBankForm = this.formBuilder.group({
        id: [0],
        official_detail_id: [this.userDetails.user_id || 0],
        roll_Id:this.userDetails.role_id,
        bank_name: ['', Validators.required],
        bank_account_number: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[0-9]*$')]],
        ifsc_code: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        cancelled_cheque_upload: ['', Validators.required],
        bank_branch: ['', Validators.required],
        bank_address: [''],
        is_Primary: [false],
        acc_Holder_Name: [''],
        is_Verified: [false] 
  
      })
    }

    setCoachBankForm(){
      if(this.officialData.length==0) this.checkprimary = true
        this.coachBankForm.controls['bank_branch'].disable()
        this.coachBankForm.controls['bank_address'].disable();
        this.coachBankForm.controls['bank_name'].disable();
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
          formData.cancelled_cheque_upload = this.bankFileUploadUrl
          delete formData.bank_branch;
          delete formData.bank_address;
          formData.bank_account_number = formData.bank_account_number ? this.encryptionService.encryptionAES(formData.bank_account_number) : formData.bank_account_number;
          formData.ifsc_code = formData.ifsc_code ? this.encryptionService.encryptionAES(formData.ifsc_code) : formData.ifsc_code;
          // console.log(formData);
          this.loader = true
          this.coachBankInfoService.saveOfficialBankInfo(formData).subscribe({
            next: (response: any) => {
              if (response) {
                this.loader = false
                this.alertService.swalPopSuccess('Bank Details Updated Successfully!');
                this.activeModal.close(true);
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

}
