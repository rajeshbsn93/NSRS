import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { AuthenticationService, IProject } from 'src/app/_common/services/innerPagesServices/authentication.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { CommonSharableService } from 'src/app/_common/services/common-services/commonSharable.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { EMPTY, first, switchMap } from 'rxjs';
import { EncryptionService } from 'src/app/_common/services/innerPagesServices/encryption.service';

@Component({
  selector: 'app-inner-pages-layout-header',
  templateUrl: './inner-pages-layout-header.component.html',
  styleUrls: ['./inner-pages-layout-header.component.css']
})
export class InnerPagesLayoutHeaderComponent implements OnInit {

  @Output() headerButtonEvent = new EventEmitter();
  userProfileData: any;
  showeye: boolean = false;
  showeye2: boolean = false;
  showeye3: boolean = false;
  modalRefchange: any
  passwordType: string = 'password'
  passwordType2: string = 'password'
  passwordType3: string = 'password'
  changePasswordForm!: FormGroup;
  changePasswordSubmitted: boolean = false;
  innerLoaderMainData: boolean = false;
  profilePicUrl: any;
  projectsList: IProject[] = [];
  allowedApps: number[] = [];
  passwordPattern: string = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$'

  constructor(
    private authenticateService: AuthenticationService, private commonSharable: CommonSharableService,
    private modalService: NgbModal, private fb: FormBuilder, private router: Router,
    private alertService: AlertService, private _storageService: StorageService,
    private commonSharableService: CommonSharableService, private sharableService: SharableService,
    private encryptService: EncryptionService
  ) {

    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required,Validators.pattern(this.passwordPattern)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordsMatchValidator
      }
    )
  }

  ngOnInit() {
    this.userProfileData = this._storageService.getUserProfileDataFromSessionRes();
    if (this._storageService.getUserDetails()?.allowedApps)
      this.allowedApps = this._storageService.getUserDetails().allowedApps.split(',').map(Number);
    if (this.userProfileData?.profileData?.profile_photo)
      this.profilePicUrl = environment.fileUrl + this.userProfileData.profileData.profile_photo;

    this.authenticateService.getProjectsList().pipe(first()).subscribe({
      next: (response: IProject[]) => {
        this.projectsList = response;
      }
    })
  }

  ToggleSideBar(event?: any) {
    this.headerButtonEvent.emit(event)
  }


  open(content: any) {
    this.modalRefchange = this.modalService.open(content, { centered: true });
  }
  showPassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.showeye = true;
    } else {
      this.passwordType = 'password';
      this.showeye = false;
    }
  }
  showPassword2() {
    if (this.passwordType2 === 'password') {
      this.passwordType2 = 'text';
      this.showeye2 = true;
    } else {
      this.passwordType2 = 'password';
      this.showeye2 = false;
    }
  }
  showPassword3() {
    if (this.passwordType3 === 'password') {
      this.passwordType3 = 'text';
      this.showeye3 = true;
    } else {
      this.passwordType3 = 'password';
      this.showeye3 = false;
    }
  }

  get changepControl() {
    return this.changePasswordForm.controls;
  }

  changePassword() {
    this.changePasswordSubmitted = true;
    if (this.changePasswordForm.valid) {
      var user_id = this.userProfileData.userData.user_id;
      var role_id = this.userProfileData.userData.role_id;
      var oldPassword = this.changePasswordForm.get('oldPassword')?.value;
      var newPassword = this.changePasswordForm.get('newPassword')?.value;

      this.innerLoaderMainData = true
      this.commonSharable.profileChangePassword(user_id, role_id, this.encryptService.encryptionAES(oldPassword), this.encryptService.encryptionAES(newPassword)).subscribe({
        next: res => {
          this.innerLoaderMainData = false
          if (res) {
            this.modalRefchange.close();
            this.router.navigate(['/login']);
            this.alertService.swalPopSuccessTimer("Password Change Successfully!")
            this.logout();
          } else {
            this.alertService.swalPopErrorTimer("Old password is wrong!")
          }
        },
        error: () => {
          console.error("error caught in change password")
          this.innerLoaderMainData = false
        }
      })
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  logout() {
    const setLoaderFn = ((value: boolean): void => { this.innerLoaderMainData = value });
    this.authenticateService.logout(setLoaderFn.bind(this));
  }

  forgotPassword() {
    localStorage.clear()
    this.modalRefchange.close();
    window.open(environment.ssoLoginUrl + 'forgot-password?appId=' + environment.encrAppId, '_self');
  }

  uploadImage(fileInput: any) {
    const profilePicInput: any = document.getElementById('fileInputElement');
    if (!fileInput.length) return;
    if (!['jpg', 'jpeg', 'png', 'pdf'].some((item) => item === this.verifyDocumentFileExtension(fileInput[0]))) {
      Swal.fire({
        icon: 'error',
        // title: 'Oops...',
        text: 'Only jpg, jpeg, png, pdf file is allowed!',
      })
      return;
    }

    this.innerLoaderMainData = true;
    const formData = new FormData();
    formData.append("file", fileInput[0], fileInput[0].name);
    formData.append("path", `Profile\\${this.userProfileData.userData.role_name}`);
    formData.append("uploadType", "1");
    let imageUploadUrl: string;
    this.sharableService.uploadFile(formData)
      .pipe(switchMap((response: any) => {
        if (response.isUploaded) {
          imageUploadUrl = response.filedataList[0].filePath;
          return this.commonSharableService.UploadProfilePhoto(this.userProfileData.userData.role_id, this.userProfileData.userData.user_id, imageUploadUrl);
        } else {
          this.alertService.swalPopError(response.errorMsg || 'Upload Failed! Please Try Again.');
          profilePicInput.value = '';
          return EMPTY;
        }
      }))
      .subscribe({
        next: (res: any) => {
          this.innerLoaderMainData = false;
          profilePicInput.value = '';
          if (res) {
            this.alertService.swalPopSuccess('Image Uploaded Successfully!');
            this.profilePicUrl = environment.fileUrl + imageUploadUrl;
            localStorage.setItem("sessiondata", JSON.stringify({
              ...this._storageService.getUserProfileDataFromSessionRes(),
              profileData: {
                ...this._storageService.getUserProfileDataFromSessionRes().profileData,
                profile_photo: imageUploadUrl
              }
            }));
            this.commonSharableService.onProfilePicChange$.next();
          } else {
            this.alertService.swalPopError('Upload Failed! Please Try Again.');
          }
        },
        error: () => {
          this.innerLoaderMainData = false;
          console.error("error caught in upload file");
          this.alertService.swalPopError('Upload Failed! Please Try Again.');
          profilePicInput.value = '';
        }
      })
  }

  verifyDocumentFileExtension(file: any) {
    var fileIndex = file.name.lastIndexOf(".") + 1;
    var fileExtension = file.name.substr(fileIndex, file.name.length).toLowerCase();
    return fileExtension;
  }

  goToProject(encrAppId: string, appId: number) {
    if (!this.allowedApps.includes(appId)) return;
    window.open(environment.ssoLoginUrl + 'login?appId=' + encrAppId);
  }


  passwordsMatchValidator(formGroup: any): { [key: string]: boolean } | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }


}
