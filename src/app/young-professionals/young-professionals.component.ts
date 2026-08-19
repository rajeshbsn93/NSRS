import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService, IProject } from '../_common/services/innerPagesServices/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../_common/services/common-services/alert.service';
import { CommonSharableService } from '../_common/services/common-services/commonSharable.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { StorageService } from '../_common/services/common-services/storage.service';
import { first, Subscription } from 'rxjs';
import { EncryptionService } from '../_common/services/innerPagesServices/encryption.service';
import { MatDrawerMode } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';


@Component({
  selector: 'app-young-professionals',
  templateUrl: './young-professionals.component.html',
  styleUrls: ['./young-professionals.component.css']
})
export class YoungProfessionalsComponent implements OnInit {
  hide: boolean = true
  hide1: boolean = true
  hide2: boolean = true
  loader: boolean = false
  userDetails: any
  passwordPattern: string = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$'
  passwordChangePopUp: any
  @ViewChild('resetpasspopup') resetPassword: any
  subscription: Subscription = new Subscription();
  profilePicUrl: any;
  projectsList: IProject[] = [];
  allowedApps: number[] = [];
  mobileQuery!: MediaQueryList;
  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
  private _mobileQueryListener: () => void;
  opened:boolean | undefined = false;
  windowWidth!:number


  changePasswordForm = new FormGroup({
    oldPass: new FormControl('', [Validators.required]),
    newPass: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
    confirmPass: new FormControl('', [Validators.required]),
  });
  constructor(
    private modalService: NgbModal, private alertservice: AlertService,
    private commonSharable: CommonSharableService, private storageService: StorageService, private authService: AuthenticationService,
    private encryptService: EncryptionService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ) { 
    // this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQuery = media.matchMedia('(max-width: 767.8px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
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

  logout() {
    const setLoaderFn = ((value: boolean): void => { this.loader = value });
    this.authService.logout(setLoaderFn.bind(this));
  }


  savePassword() {
    if (this.changePasswordForm.valid) {
      if (this.changePasswordForm.controls['newPass'].value == this.changePasswordForm.controls['confirmPass'].value) {
        this.loader = true
        this.commonSharable.profileChangePassword(this.userDetails.user_id, this.userDetails.role_id, this.encryptService.encryptionAES(this.changePasswordForm.controls['oldPass'].value) ,this.encryptService.encryptionAES(this.changePasswordForm.controls['newPass'].value)  )
          .subscribe({
            next: (res) => {
              this.loader = false
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
                this.alertservice.swalPopError('Old password is wrong!')
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
  snavToggle(){
    this.opened = !this.opened
  }
   @HostListener('window:resize', ['$event'])
      onResize(event: Event): void {
        this.menuClickOutput(); // Update size on resize
      }
  menuClickOutput(event?:boolean){  
    this.windowWidth = window.innerWidth;
    // console.log(this.windowWidth)
    if(this.windowWidth <= 767.8) this.opened = event
  }
}
