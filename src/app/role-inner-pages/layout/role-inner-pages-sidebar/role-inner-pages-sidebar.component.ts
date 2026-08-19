import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from 'src/app/_common/services/role-inner-pages-services/academy-services/profile.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AuthenticationService } from 'src/app/_common/services/innerPagesServices/authentication.service';
import { catchError, EMPTY, first, Subscription, switchMap } from 'rxjs';
import { SideBarNavStateService } from 'src/app/_common/sidebar.state';
import { AthleteDashboardIRootObject } from 'src/app/_common/models/athlete-dashboard';
import { AthleteDashboardService } from 'src/app/_common/services/role-inner-pages-services/athlete-services/athlete-dashboard.service';
import Swal from 'sweetalert2';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { environment } from 'src/environments/environment';
import { CommonSharableService } from 'src/app/_common/services/common-services/commonSharable.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-role-inner-pages-sidebar',
  templateUrl: './role-inner-pages-sidebar.component.html',
  styleUrls: ['./role-inner-pages-sidebar.component.css'],
  standalone:true,
  imports:[CommonModule,RouterModule]
})
export class RoleInnerPagesSidebarComponent implements OnInit, OnDestroy {

  // @ViewChild('contentCamera') imageModal:any
  // imageModalRef:any
  @ViewChild('fileInput') profilePicInput!: ElementRef<HTMLInputElement>;
  userDetails:any
  academydetails:any
  sideBarDetails:any
  sideBarDetailsAthleteCount:any
  sideBarDetailsCoachCount:any
  sideBarDetailsSSCount:any
  loader:boolean=false;
  currentFASchemesData:any;
  athleteDashboardData!:AthleteDashboardIRootObject;
  profilePicUrl: any;
  subscription: Subscription = new Subscription();

  constructor(
    private profileService:ProfileService,private storageService:StorageService,
    private authenticationService:AuthenticationService,private _sideBarState:SideBarNavStateService,
    private athleteDashboardService:AthleteDashboardService,
    private sharableService: SharableService, private alertService: AlertService,
    private commonSharableService: CommonSharableService
    ) { }

  ngOnInit() {
    this.userDetails=this.storageService.getUserDetails();
    this.academydetails=this.storageService.getUserProfileDataFromSessionRes();
    this.getSideBarDetails();
    if (this.academydetails?.profileData?.profile_photo)
      this.profilePicUrl = environment.fileUrl + this.academydetails.profileData.profile_photo;

    this.subscription.add(
      this._sideBarState.academySideBar.subscribe({
        next : (response: any) => {
          if (response != null && response !='') {
            if (
              this.userDetails.role_name == 'Athlete' || 
              this.userDetails.role_name?.toLowerCase() == 'coach' ||
              this.userDetails.role_name?.toLowerCase() == 'sportsscientist' ||
              this.userDetails.role_id == 4 ||
              this.userDetails.role_id == 3 ||
              this.userDetails.role_id == 1006 ||
              this.userDetails.role_id == 666 ||
              this.userDetails.role_id == 112
            ){
              this.academydetails.userData.name = response.name;
            }else{
              this.academydetails.userData.name = response.academyName;
            }
          }
        }
      })
    );

    if(this.academydetails.userData?.role_name == 'Athlete'){
      this.getAthleteDashboardData()
    }
    // console.log('academydetails--------------', this.academydetails);
    
  }
  getAthleteDashboardData(){
    this.athleteDashboardService.GetAthleteDashboardData(this.userDetails.user_id).pipe(first()).subscribe({
       next:(response)=>{
           this.athleteDashboardData = response
           this.currentFASchemesData = this.athleteDashboardData?.currentFASchemes.split(",")
       },
       error:()=>{
           console.error('caught in athleteDashboardService API')
       }
   })
   }

  getSideBarDetails(){
    this.authenticationService.getDashboardMenu(this.userDetails.role_id).pipe(
      first(),
      catchError(() => {
        console.error("error caught in getting dashboard menu");
        localStorage.removeItem('userPermissions');
        return EMPTY;
      }),
      switchMap((res: any) => {
        // console.log(res);
        this.sideBarDetails=res;
        localStorage.setItem('userPermissions', JSON.stringify(res.map((item: any) => item.menu_component)));
        return this.profileService.getBasicInfo(this.userDetails.user_id).pipe(first(), catchError(() => {
          console.error('error caught in getting basic details of academy')
          return EMPTY;
        }));
      }))
    .subscribe({
      next:(respo: any)=>{
        if (respo?.[0]?.athlete_Count) this.sideBarDetailsAthleteCount=respo[0].athlete_Count.split('-')[1];
        if (respo?.[0]?.coach_Count) this.sideBarDetailsCoachCount=respo[0].coach_Count.split('-')[1];
        if (respo?.[0]?.sS_Count) this.sideBarDetailsSSCount=respo[0].sS_Count.split('-')[1]
      }
    })
  }

  verifyFileSize(files:any){
    var fileSize = files[0].size
    return fileSize
  }
  
  uploadImage(fileInput:any){
    if (!fileInput.length) return;
    var fileSize=this.verifyFileSize(fileInput)
    if(fileSize<=1000050){

    
      if (!['jpg', 'jpeg', 'png'].some((item) => item === this.verifyDocumentFileExtension(fileInput[0]))) {
        Swal.fire({
          icon: 'error',
          // title: 'Oops...',
          text: 'Only jpg, jpeg, png, file is allowed!',
        })
        return;
      }

      this.loader = true;
      const formData = new FormData();
      formData.append("file", fileInput[0], fileInput[0].name);
      // formData.append("path", `Profile\\${this.userDetails.role_name}`);
      formData.append("path", `Profile\\${this.userDetails.role_id==1 ? 'Players' : this.userDetails.role_name}`);
      formData.append("uploadType","1");
      let imageUploadUrl: string;
      this.sharableService.uploadFile(formData)
      .pipe(switchMap((response: any) => {
        if (response.isUploaded) {
          imageUploadUrl = response.filedataList[0].filePath;
          return this.commonSharableService.UploadProfilePhoto(this.userDetails.role_id, this.userDetails.user_id, imageUploadUrl);
        } else {
          this.alertService.swalPopError(response.errorMsg || 'Upload Failed! Please Try Again.');
          this.profilePicInput.nativeElement.value = '';
          return EMPTY;
        }
      }))
      .subscribe({
        next: (res: any) => {
          this.loader = false;
          this.profilePicInput.nativeElement.value = '';
          if (res) {
            this.alertService.swalPopSuccess('Image Uploaded Successfully!');
            this.profilePicUrl = environment.fileUrl + imageUploadUrl;
            localStorage.setItem("sessiondata", JSON.stringify({
              ...this.storageService.getUserProfileDataFromSessionRes(),
              profileData: {
                ...this.storageService.getUserProfileDataFromSessionRes().profileData,
                profile_photo: imageUploadUrl
              }
            }));
            this.commonSharableService.onProfilePicChange$.next();
          } else {
            this.alertService.swalPopError('Upload Failed! Please Try Again.');
          }
        },
        error:() => {
          this.loader = false;
          console.error("error caught in upload file");
          this.alertService.swalPopError('Upload Failed! Please Try Again.');
          this.profilePicInput.nativeElement.value = '';
        }
      })
    }else{
      this.alertService.swalPopError('File Size must be less than 1MB.')
    }
  }

  // imageUpload(){
  //   this.imageModalRef = this.modalService.open(this.imageModal,{ centered: true, keyboard: false,backdrop: 'static'})
  // }

  verifyDocumentFileExtension(file:any){
    var fileIndex = file.name.lastIndexOf(".") + 1;
    var fileExtension = file.name.substr(fileIndex, file.name.length).toLowerCase();
    return fileExtension;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
