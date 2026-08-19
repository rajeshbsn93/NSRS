import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KicProposalService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-proposal.service';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { environment } from 'src/environments/environment';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { KicSanctionService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-sanction.service';
import Swal from 'sweetalert2';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';

@Component({
  selector: 'app-comment-history',
  templateUrl: './comment-history.component.html',
  styleUrls: ['./comment-history.component.css'],
})
export class CommentHistoryComponent implements OnInit {
  @Input() popupShow: any = false;
  @Output() showHideControl: any = new EventEmitter();
  @Output() popupControl_ConfirmBtn: any = new EventEmitter();
  @Input() sanction_Id!: number;
  @Input() state_id!: string;
  @Input() enableEdit!: boolean;
  addCommentHistory: any = [];
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
  showDocument: boolean = true;
  commentHistoryForm!: FormGroup;
  userDetails: any;

  constructor(
    private _fb: FormBuilder,
    private kicSanctionService: KicSanctionService,
    public activeModal: NgbActiveModal,
    private _proposalService: KicProposalService,
    private _alertService: AlertService,
    private datePipe: DatePipe,
    private _storageService: StorageService,
  ) { 
    //  this.userDetails = this._storageService.getUserDetails();
  }

  ngOnInit(): void {
    console.log('stateid------', this.state_id);
    
    this.formInitialization();
    this.getUserAddressDetails();
    this.getCommentHistoryDetails();
    this.userDetails = this._storageService.getUserDetails();

  }

  formInitialization() {
    this.commentHistoryForm = this._fb.group({
      comment_To: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
      supporting_Document: [''],
      commented_Date: this.getCurrentDate(),
      sanction_Id: this.sanction_Id,
      comment_From: this.manageUserRoleId(),
    });
    this.manageUserRoleId();
  }

  manageUserRoleId() {
    var userdetails: any = localStorage.getItem('loginUserdata');
    var userData = JSON.parse(userdetails);
    if (userData && userData.role_id) {
      // Convert role_id to number if it's not already
      this.userRoleId = Number(userData.role_id);
      // Compare role_id and set user role
      if (this.userRoleId === 68) {
        this.setUserRole = 'HO';
      } else if (this.userRoleId === 46) {
        this.setUserRole = 'RC';
      } else {
        this.setUserRole = 'SA';
      }
    } else {
      this.setUserRole = 'SA'; // Default role
    }

    return this.setUserRole;
  }

  getUserAddressDetails() {
    this.isLoading = true;
    
    this.kicSanctionService.getAddressToDetails(this.state_id, 'KISCE').subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.addressDetails = res.data;
      },
      complete: () => { },
      error: (errors: any) => {
        this.formSubmitted = false;
        this.isLoading = false;
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
      },
    });
  }

  CommentHistory() {
    this.formSubmitted = true;
    if (this.commentHistoryForm.valid) {
      this.addCommentHistory.push(this.commentHistoryForm.value);
      this.showDocument = true;
      // Store the default value
      const defaultDate = this.getCurrentDate();
      const defaultCommentFrom = this.manageUserRoleId();
      // Reset the form
      this.commentHistoryForm.reset();
      // Reinitialize the form controls with the default values
      this.commentHistoryForm.patchValue({
        commented_Date: defaultDate,
        comment_From: defaultCommentFrom,
        sanction_Id: this.sanction_Id,
      });
      this.formSubmitted = false;
    }
  }

  onSubmit() {
    if (this.addCommentHistory.length != 0) {
      const payload = {
        add_Comment_History: this.addCommentHistory,
      };
      this.isLoading = true;
      this.kicSanctionService.addCommentHistoryDetails(payload).subscribe({
        next: (res: any) => {
          if (res?.status === 1) {
            this.modalClose();
            this.onAdd.emit();
            this.isLoading = false;
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
          this.modalClose();
          this.isLoading = false;
        },
        complete: () => { },
        error: (errors: any) => {
          this.isLoading = false;
          this.formSubmitted = false;
          this._alertService?.swalPopErrorTimer(errors?.error?.message);
          this.modalClose();

        },
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        text: 'Please Add Fields!',
        showConfirmButton: true,
        timer: 3000,
      });
      this.isLoading = false;
    }
  }

  getCurrentDate(): string {
    const date = new Date();
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  getCommentHistoryDetails() {
    this.kicSanctionService.getCommentHistoryDetails(this.sanction_Id, 'KISCE').subscribe({
      next: (res: any) => {
        this.addCommentHistory = res.data;
      },
      complete: () => { },
      error: (errors: any) => {
        this.formSubmitted = false;
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
        // this.popupControl_hide();
      },
    });
  }

  modalClose(closeType = 'cancel') {
    this.activeModal.close(closeType);
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
                this.commentHistoryForm.get(`${formcontrolname}`)?.setValue(res?.filedataList[0].filePath);
                this._alertService.swalPopSuccess('File Uploaded');
                this.showDocument = false;
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
