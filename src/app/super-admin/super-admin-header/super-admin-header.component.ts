import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { AuthenticationService } from 'src/app/_common/services/innerPagesServices/authentication.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { CommonSharableService } from 'src/app/_common/services/common-services/commonSharable.service';
import { environment } from 'src/environments/environment';
import { EncryptionService } from 'src/app/_common/services/innerPagesServices/encryption.service';

@Component({
  selector: 'app-super-admin-header',
  templateUrl: './super-admin-header.component.html',
  styleUrls: ['./super-admin-header.component.css']
})
export class SuperAdminHeaderComponent implements OnInit {

  @Output() headerButtonEvent = new EventEmitter()
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
  passwordPattern: string = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$'

  constructor(private authenticateService: AuthenticationService, private commonSharable: CommonSharableService,
    private modalService: NgbModal, private fb: FormBuilder, private router: Router,
    private alertService: AlertService, private _storageService: StorageService,
    private encryptService: EncryptionService) {

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', Validators.required],
    },
      {
        validators: this.passwordsMatchValidator
      })
  }

  ngOnInit() {
    this.userProfileData = this._storageService.getUserProfileDataFromSessionRes()
  }

  ToggleSideBar(event?: any) {
    this.headerButtonEvent.emit(event)
    // console.log("inner pages layout header is called = " + event )
  }


  open(content: any) {
    this.modalRefchange = this.modalService.open(content, { centered: true });
    // console.log('Profile Data emailId',this.userProfileData)
    // console.log('Profile Img',this.userProfileData.profileData.profile_photo)
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
            this.alertService.swalPopSuccessTimer("Password Change Successfully!");
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

  passwordsMatchValidator(formGroup: any): { [key: string]: boolean } | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
