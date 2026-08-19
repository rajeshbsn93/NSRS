import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmedValidator } from 'src/app/outer-pages/forgot-password/confirmedValidator';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { CommonSharableService } from 'src/app/_common/services/common-services/commonSharable.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AuthenticationService, IProject } from 'src/app/_common/services/innerPagesServices/authentication.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Subscription, first } from 'rxjs';
import { EncryptionService } from 'src/app/_common/services/innerPagesServices/encryption.service';

@Component({
  selector: 'app-role-inner-pages-header',
  templateUrl: './role-inner-pages-header.component.html',
  styleUrls: ['./role-inner-pages-header.component.css'],
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, RouterModule, LoaderComponent]
})
export class RoleInnerPagesHeaderComponent implements OnInit, OnDestroy {

  hide: boolean = true
  hide1: boolean = true
  hide2: boolean = true
  userDetails: any
  loader: boolean = false
  //passwordPattern:string='^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$'
  passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  passwordChangePopUp: any
  @ViewChild('resetpasspopup') resetPassword: any
  @ViewChild('exporter') exporter: any;
  subscription: Subscription = new Subscription();
  profilePicUrl: any;
  projectsList: IProject[] = [];
  allowedApps: number[] = [];

  changePasswordForm = new FormGroup({
    oldPass: new FormControl('', [Validators.required]),
    newPass: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
    confirmPass: new FormControl('', [Validators.required]),
  });

  constructor(
    private modalService: NgbModal, private alertservice: AlertService,
    private commonSharable: CommonSharableService, private storageService: StorageService, private authService: AuthenticationService,
    private encryptService: EncryptionService
  ) { }

  ngOnInit() {
    this.userDetails = this.storageService.getAcademyDetails();

    if (this.storageService.getUserDetails()?.allowedApps)
      this.allowedApps = this.storageService.getUserDetails().allowedApps.split(',').map(Number);
    if (this.storageService.getUserProfileDataFromSessionRes()?.profileData?.profile_photo)
      this.profilePicUrl = environment.fileUrl + this.storageService.getUserProfileDataFromSessionRes()?.profileData?.profile_photo;
    this.subscription.add(
      this.commonSharable.onProfilePicChange$.subscribe(() => {
        if (this.storageService.getUserProfileDataFromSessionRes()?.profileData?.profile_photo)
          this.profilePicUrl = environment.fileUrl + this.storageService.getUserProfileDataFromSessionRes()?.profileData?.profile_photo;
      })
    );
    this.authService.getProjectsList().pipe(first()).subscribe({
      next: (response: IProject[]) => {
        this.projectsList = response;
      }
    })
  }

  changePassword() {
    this.passwordChangePopUp = this.modalService.open(this.resetPassword, { size: 'md', centered: true, })
  }

  savePassword() {
    if (this.changePasswordForm.valid) {
      if (this.changePasswordForm.controls['newPass'].value == this.changePasswordForm.controls['confirmPass'].value) {
        this.loader = true
        this.commonSharable.profileChangePassword(this.userDetails.user_id, this.userDetails.role_id, this.encryptService.encryptionAES(this.changePasswordForm.controls['oldPass'].value), this.encryptService.encryptionAES(this.changePasswordForm.controls['newPass'].value))
          .subscribe({
            next: (res) => {
              this.loader = false
              //console.log(res)
              if (res) {
                this.passwordChangePopUp.close()
                // this.alertservice.swalPopSuccess('Password Changed SuccessFully!')
                // this.router.navigate(['/login']);
                Swal.fire({
                  icon: 'success',
                  text: 'Password Updated Successfully!',
                  allowOutsideClick: false,
                  showConfirmButton: true
                }).then((x) => {
                  if (x.isConfirmed) {
                    const setLoaderFn = ((value: boolean): void => { this.loader = value });
                    this.authService.logout(setLoaderFn.bind(this));
                    this.goToSsoLoginPage();
                  }
                })
              } else {
                this.alertservice.swalPopError('Please check your password Again!')
              }
            },
            error: () => {
              this.passwordChangePopUp.close()
              console.error("error caught in changing profile password")
              this.loader = false
            }
          })
      } else {
        this.alertservice.swalPopWarning("New Password and Confirm Password doesn't match!")
      }
    } else {
      this.changePasswordForm.markAllAsTouched()
    } 
  }

  goToSsoLoginPage() {
    window.open(environment.ssoLoginUrl + 'login?appId=' + environment.encrAppId, '_self');
  }

  goToProject(encrAppId: string, appId: number) {
    if (!this.allowedApps.includes(appId)) return;
    window.open(environment.ssoLoginUrl + 'login?appId=' + encrAppId);
  }

  logout() {
    const setLoaderFn = ((value: boolean): void => { this.loader = value });
    this.authService.logout(setLoaderFn.bind(this));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
