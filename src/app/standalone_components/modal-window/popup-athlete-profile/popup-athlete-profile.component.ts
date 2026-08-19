import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { AthletePopupProfileBankInfoComponent } from '../popup-profile-modals/athlete-popup-profile-bank-info/athlete-popup-profile-bank-info.component';
import { PopupProfileService } from 'src/app/_common/services/common-services/popup-profile.service';
import { LoaderComponent } from '../../loader/loader.component';
import { AthletePopupProfilePersonalDetailsComponent } from '../popup-profile-modals/athlete-popup-profile-personal-details/athlete-popup-profile-personal-details.component';
import { AthletePopupProfileMobileEmailComponent } from '../popup-profile-modals/athlete-popup-profile-mobile-email/athlete-popup-profile-mobile-email.component';
import { AthletePopupProfileAddressInfoComponent } from '../popup-profile-modals/athlete-popup-profile-address-info/athlete-popup-profile-address-info.component';
import { AthletePopupProfileSportsKnittingInfoComponent } from '../popup-profile-modals/athlete-popup-profile-sports-knittingInfo/athlete-popup-profile-sports-knittingInfo.component';
import { AthletePopupProfileEducationInfoComponent } from '../popup-profile-modals/athlete-popup-profile-education-info/athlete-popup-profile-education-info.component';
import { AthletePopupProfileDocumentInfoComponent } from '../popup-profile-modals/athlete-popup-profile-document-info/athlete-popup-profile-document-info.component';
import { environment } from 'src/environments/environment';
import { AthletePopupProfileSuccessStoryComponent } from '../popup-profile-modals/athlete-popup-profile-success-story/athlete-popup-profile-success-story.component';
import { AthletePopupProfileLanguageInfoComponent } from '../popup-profile-modals/athlete-popup-profile-language-info/athlete-popup-profile-language-info.component';
import { AthleteDashboardService } from 'src/app/_common/services/role-inner-pages-services/athlete-services/athlete-dashboard.service';
import { first } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AthletePopupProfileAthleteTrainingInfoComponent } from '../popup-profile-modals/athlete-popup-profile-athlete-training-info/athlete-popup-profile-athlete-training-info.component';
import { AthletePopupProfileAthleteSupportComponent } from '../popup-profile-modals/athlete-popup-profile-athlete-support/athlete-popup-profile-athlete-support.component';
import { AthleteDetailsAchievementComponent } from 'src/app/role-inner-pages/modal-window/athlete-dashboard-modal/athlete-details-achievement/athlete-details-achievement.component';
import { StakeHolderAthleteDetailsAchievementComponent } from 'src/app/role-inner-pages/modal-window/stake-popups/stake-holder-athlete-details-achievement/stake-holder-athlete-details-achievement.component';
import { AthleteEditAchievementComponent } from 'src/app/role-inner-pages/modal-window/athlete-dashboard-modal/athlete-edit-achievement/athlete-edit-achievement.component';
import { TournamentService } from 'src/app/_common/services/innerPagesServices/tournament.service';
import { VerifyAchievementPopupComponent } from '../verify-achievement-popup/verify-achievement-popup.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { RoleCode } from 'src/app/_common/_enums/role-code';
@Component({
  selector: 'app-popup-athlete-profile',
  templateUrl: './popup-athlete-profile.component.html',
  styleUrls: ['./popup-athlete-profile.component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule, LoaderComponent, AthletePopupProfileAthleteTrainingInfoComponent, AthletePopupProfileAthleteSupportComponent, MatDialogModule]
})
export class PopupAthleteProfileComponent implements OnInit {
  dialog = inject(MatDialog);
  playerId: any;
  roleId!: number;
  achievementLoader: boolean = false;
  loader: boolean = false;
  athleteProfilePopupDetailsData: any;
  baseUrl = environment.fileUrl;
  displayedColumns: string[] = ['category', 'represented', 'tournament', 'event', 'position', 'document', 'createdBy', 'status'];
  dataSource!: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('deleteModal') deleteModal: any;
  deleteModalRef: any;
  deleteRowData: any
  addBtnAuth: number = 0;
  fileBaseUrlActc = environment.fileUrlACTC
  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal,
    private popuProfileService: PopupProfileService,
    private athleteDashboardService: AthleteDashboardService,
    private tournamentService: TournamentService,
    private _alertService: AlertService
  ) {

  }

  ngOnInit(): void {
    this.getUserAbletoAddAchievement()
    this.getAthleteProfilePopupDetails();
    this.getAthleteAchievement();
  }

  getAthleteAchievement() {
    this.achievementLoader = true
    this.athleteDashboardService.athleteAchievementDetail(this.playerId).pipe(first()).subscribe({
      next: (response: any) => {
        this.achievementLoader = false
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      },
      error: () => {
        this.achievementLoader = false
        console.error('caugth in athlet achievement API')
      }
    })
  }
  getAthleteProfilePopupDetails() {
    this.loader = true
    this.popuProfileService.athleteProfilePopupDetails(this.playerId, 'homeprofile').subscribe({
      next: (response) => {
        this.loader = false
        this.athleteProfilePopupDetailsData = response
      },
      error: (err) => {
        this.loader = false;
        console.error(err)
      }
    })
  }
  personalDetail() {
    this.openModal(AthletePopupProfilePersonalDetailsComponent, this.athleteProfilePopupDetailsData?.personalInfo);
  }
  communicationAddress() {
    this.openModal(AthletePopupProfileAddressInfoComponent, this.athleteProfilePopupDetailsData?.addressInfo)
  }
  mobileEmail() {
    this.openModal(AthletePopupProfileMobileEmailComponent, this.athleteProfilePopupDetailsData?.mobileEmailInfo);
  }
  sportKittingDetails() {
    this.openModal(AthletePopupProfileSportsKnittingInfoComponent, this.athleteProfilePopupDetailsData?.knittingInfo)
  }
  bankInformation() {
    this.openModal(AthletePopupProfileBankInfoComponent, this.athleteProfilePopupDetailsData?.bankdetail);
  }
  openEducationInfoPopup() {
    this.openModal(AthletePopupProfileEducationInfoComponent, this.athleteProfilePopupDetailsData?.educationInfo)
  }
  athleteDocuments() {
    this.openModal(AthletePopupProfileDocumentInfoComponent, this.athleteProfilePopupDetailsData?.documentInfo)
  }
  openSuccessStory() {
    this.openModal(AthletePopupProfileSuccessStoryComponent, this.athleteProfilePopupDetailsData?.mediaInfo)
  }
  openLanguageModal() {
    this.openModal(AthletePopupProfileLanguageInfoComponent, this.athleteProfilePopupDetailsData?.languageInfo)
  }
  openModal(componentName: any, popupData: any) {
    const modalRef = this.modalService.open(componentName, { size: 'xl', centered: true, keyboard: false, backdrop: 'static' })
    modalRef.componentInstance.popupDataReceived = popupData
  }

  addAchievement() {
    const modalRef = this.modalService.open(StakeHolderAthleteDetailsAchievementComponent, {
      size: 'xl', centered: true, backdrop: 'static', keyboard: false
    });
    modalRef.componentInstance.athleteProfileData = this.athleteProfilePopupDetailsData;
    modalRef.result.then((thenRes) => {
      if (thenRes) {
        this.getAthleteAchievement();
      }
    }).catch(() => { })
  }



  editAchievement(rowData: any) {
    const modalRef = this.modalService.open(AthleteEditAchievementComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.editRowData = rowData;
    modalRef.result.then((thenRes) => {
      if (thenRes) {
        this.getAthleteAchievement();
      }
    }).catch(() => { })

  }
  deleteAchievement(rowData: any) {
    this.deleteRowData = rowData;
    this.deleteModalRef = this.modalService.open(this.deleteModal, { centered: true, size: 'md' })
  }



  confirmDelete() {
    this.loader = true
    this.tournamentService.deleteAthleteAchievementDetail(this.deleteRowData.player_achievement_detail_id).subscribe({
      next: (response) => {
        this.loader = true;
        if (response) {
          this.deleteModalRef.close();
          this.loader = false
          this.getAthleteAchievement();
        }
      },
      error: (err) => {
        this.loader = false;
        console.error(err)
      }
    })
  }

  getUserAbletoAddAchievement() {
    this.loader = true
    this.athleteDashboardService.getUserAbletoAddAchievement().subscribe({
      next: (response: any) => {
        this.loader = false
        if (response) {
          this.addBtnAuth = response
          if (this.addBtnAuth === 1) {
            this.displayedColumns.push('action')
          }
        }
      },
      error: () => {
        this.loader = false
        console.error('SOMETHING WENT WRONG!! PLEASE TRY AGAIN')
      }
    })
  }


  openDialog(row: any) {
    if (this.isCoachAndSSNotLogin()) {
      const dialogRef = this.dialog.open(VerifyAchievementPopupComponent, {
        panelClass: 'custom-dialog-panel-modal',
        data: {
          message: 'Do you want to verify the achievement?',
          tournamentName: row?.tournament_name,
          buttonText: {
            ok: 'Approve',
            cancel: 'Reject'
          }
        }
      });
      dialogRef.afterClosed().subscribe((confirmData: any) => {
        if (confirmData?.isVerify) {
          this.verifyPlayerAchievement(row?.player_achievement_detail_id, confirmData?.status)
        }
      });
    }
  }

  verifyPlayerAchievement(achievementId: number, status: number) {
    this.loader = true
    this.athleteDashboardService.verifyPlayerAchievement(achievementId, status).subscribe({
      next: (response: any) => {
        this.loader = true;
        if (response) {
          this.getAthleteAchievement()
          this.loader = false
          this._alertService.swalPopSuccess(response?.messaage)
        }
      },
      error: (err) => {
        this.loader = false;
        this._alertService.swalPopSuccess('SOMETHING WENT WRONG!! PLEASE TRY AGAIN')
      }
    });
  }

  isCoachAndSSNotLogin() {
    if (this.roleId !== RoleCode.coach && this.roleId !== RoleCode.sprotScientist && this.addBtnAuth === 1) return true;
    return false;
  }
}