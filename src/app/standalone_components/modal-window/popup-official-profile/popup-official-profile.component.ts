import { CommonModule } from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { PopupProfileService } from 'src/app/_common/services/common-services/popup-profile.service';
import { LoaderComponent } from '../../loader/loader.component';
import { environment } from 'src/environments/environment';
import { first, forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AthletePopupProfileAthleteTrainingInfoComponent } from '../popup-profile-modals/athlete-popup-profile-athlete-training-info/athlete-popup-profile-athlete-training-info.component';
import { AthletePopupProfileAthleteSupportComponent } from '../popup-profile-modals/athlete-popup-profile-athlete-support/athlete-popup-profile-athlete-support.component';
import { CoachPopupAchievementComponent } from '../popup-profile-modals/coach-popup-achievement/coach-popup-achievement.component';
import { OfficialPopupProfilePersonalDetailsComponent } from '../popup-profile-modals/official-popup-profile-personal-details/official-popup-profile-personal-details.component';
import { OfficialPopupProfileAddressInfoComponent } from '../popup-profile-modals/official-popup-profile-address-info/official-popup-profile-address-info.component';
import { OfficialPopupProfileDocumentInfoComponent } from '../popup-profile-modals/oficial-popup-profile-document-info/oficial-popup-profile-document-info.component';
import { OfficialPopupProfileBankInfoComponent } from '../popup-profile-modals/oficial-popup-profile-bank-info/oficial-popup-profile-bank-info.component';
import { OfficialPopupProfileMobileEmailComponent } from '../popup-profile-modals/official-popup-profile-mobile-email/official-popup-profile-mobile-email.component';
import { OfficialPopupProfileSportsKnittingInfoComponent } from '../popup-profile-modals/official-popup-profile-sports-knittingInfo/official-popup-profile-sports-knittingInfo.component';
import { OfficialPopupProfileEducationInfoComponent } from '../popup-profile-modals/official-popup-profile-education-info/official-popup-profile-education-info.component';
import { OfficialPopupProfileSupportComponent } from '../popup-profile-modals/official-popup-profile-support/official-popup-profile-support.component';
import { CoachPopupProfileTrainingInfoComponent } from '../popup-profile-modals/coach-popup-pfrofile-training-info/coach-popup-pfrofile-training-info.component';
import { SportScientistPopupProfileTrainingInfoComponent } from '../popup-profile-modals/sport-scientist-popup-pfrofile-training-info/sport-scientist-popup-pfrofile-training-info.component';
import { SportScientistPopupProfileAchievementComponent } from '../popup-profile-modals/sport-scientist-popup-pfrofile-achievement/sport-scientist-popup-pfrofile-achievement.component';
import { OfficialPopupProfileIdProofModalComponent } from '../popup-profile-modals/official-popup-profile-id-proof-modal/official-popup-profile-id-proof-modal.component';
import { CoachPopupHomeComponent } from "../popup-profile-modals/coach-popup-home/coach-popup-home.component";
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
@Component({
selector:'app-popup-official-profile',
templateUrl:'./popup-official-profile.component.html',
styleUrls:['./popup-official-profile.component.css'],
standalone:true,
imports: [CommonModule, MaterialModule, LoaderComponent, AthletePopupProfileAthleteTrainingInfoComponent, AthletePopupProfileAthleteSupportComponent,
    CoachPopupAchievementComponent, OfficialPopupProfileSupportComponent, CoachPopupProfileTrainingInfoComponent, SportScientistPopupProfileTrainingInfoComponent,
    SportScientistPopupProfileAchievementComponent, CoachPopupHomeComponent]
})
export class PopupOfficialProfileComponent implements OnInit{
    officialInstanceData:any;
    achievementLoader:boolean = false;
    loader:boolean = false;
    officialProfilePopupDetailsData:any;
    baseUrl = environment.fileUrl;
    displayedColumns: string[] = ['category', 'represented', 'tournament','event', 'position','document','status',];
    dataSource!:any;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    userDetail:any;
    academyCoachDetailPopUpData:any;

    constructor(
        public activeModal:NgbActiveModal, private modalService:NgbModal,
        private popuProfileService:PopupProfileService,
        private storageService:StorageService
    ){}

    ngOnInit(): void {
        this.userDetail = this.storageService.getAcademyDetails();
    //    console.log(this.officialInstanceData) ;
       this.getAthleteProfilePopupDetails();
    }
    getAthleteProfilePopupDetails(){
        const getOfficialProfilePopupDetailsApi = this.popuProfileService.officialProfilePopupDetails(this.officialInstanceData.official_detail_id,'homeprofile',this.officialInstanceData.role_Id);
        const academyCoachDetailPopUpAPI = this.popuProfileService.AcademyCoachDetailPopUp(this.userDetail.user_id,this.officialInstanceData.official_detail_id);
        this.loader = true
        forkJoin([getOfficialProfilePopupDetailsApi,academyCoachDetailPopUpAPI]).subscribe({
            next:(response)=>{
                this.loader = false;
                // console.log(response)
                this.officialProfilePopupDetailsData = response[0]
                this.academyCoachDetailPopUpData = response[1]
            },
            error:(err)=>{
                this.loader = false;
                console.error(err)
            }
        })
    }
    personalDetail(){
        this.openModal(OfficialPopupProfilePersonalDetailsComponent,this.officialProfilePopupDetailsData?.personalInfo);
    }
    communicationAddress(){
        this.openModal(OfficialPopupProfileAddressInfoComponent,this.officialProfilePopupDetailsData?.addressInfo)
    }
    officialDocuments(){
        let docData = this.officialProfilePopupDetailsData?.documentInfo
        docData.role_Id = this.officialInstanceData.role_Id
        // this.openModal(OfficialPopupProfileDocumentInfoComponent,docData)
        this.openModal(OfficialPopupProfileIdProofModalComponent,docData)
    }
    bankInformation(){
        this.openModal(OfficialPopupProfileBankInfoComponent,this.officialProfilePopupDetailsData?.bankdetail);
    }
    openEducationInfoPopup(){
        this.openModal(OfficialPopupProfileEducationInfoComponent,this.officialProfilePopupDetailsData?.educationInfo)
    }
    mobileEmail(){
        this.openModal(OfficialPopupProfileMobileEmailComponent,this.officialProfilePopupDetailsData?.mobileEmailInfo);
    }
    sportKittingDetails(){
        this.openModal(OfficialPopupProfileSportsKnittingInfoComponent,this.officialProfilePopupDetailsData?.knittingInfo)
    }    
    
    openModal(componentName:any,popupData:any){
        const modalRef = this.modalService.open(componentName,{size:'xl',centered:true,keyboard:false,backdrop:'static'})
        modalRef.componentInstance.popupDataReceived = popupData
    }


}