import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoachPersonalDetailModalComponent } from '../coach-modals/coach-personal-detail-modal/coach-personal-detail-modal.component';
import { CoachAddressModalComponent } from '../coach-modals/coach-address-modal/coach-address-modal.component';
import { CoachIdProofModalComponent } from '../coach-modals/coach-id-proof-modal/coach-id-proof-modal.component';
import { CoachBankDetailsModalComponent } from '../coach-modals/coach-bank-details-modal/coach-bank-details-modal.component';
import { CoachEducationDetailsModalComponent } from '../coach-modals/coach-education-details-modal/coach-education-details-modal.component';
import { CoachSportsSpecificEducationModalComponent } from '../coach-modals/coach-sports-specific-education-modal/coach-sports-specific-education-modal.component';
import { CommonMobileEmailComponent } from '../../modal-window/common-modals/common-mobile-email/common-mobile-email.component';
import { CommonSportKittingDetailsComponent } from '../../modal-window/common-modals/common-sport-kitting-details/common-sport-kitting-details.component';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AthleteDashboardSidebarComponent } from '../../athlete-dashboard/athlete-dashboard-sidebar/athlete-dashboard-sidebar.component';
import { KheloIndiaGamesViewModalComponent } from 'src/app/standalone_components/modal-window/khelo-india-games-view-modal/khelo-india-games-view-modal.component';
import { RecruitmentUnderSportsQuotaComponent } from '../coach-modals/recruitment-under-sports-quota/recruitment-under-sports-quota.component';

@Component({
  selector: 'app-coach-profile',
  templateUrl: './coach-profile.component.html',
  styleUrls: ['./coach-profile.component.css'],
  standalone: true,
  imports: [CommonModule, AthleteDashboardSidebarComponent],
})
export class CoachProfileComponent implements OnInit, OnDestroy {
  userDetails: any;

  constructor(private modalService: NgbModal, private storageService: StorageService) { }

  ngOnInit(): void {
    this.userDetails = this.storageService.getUserDetails();
  }

  openPersonalInfoModal() {
    this.openModal(CoachPersonalDetailModalComponent);
  }

  openAddressModal() {
    this.openModal(CoachAddressModalComponent);
  }

  openIdProofModal() {
    this.openModal(CoachIdProofModalComponent);
  }

  openBankInfoModal() {
    this.openModal(CoachBankDetailsModalComponent);
  }

  openEducationInfoModal() {
    this.openModal(CoachEducationDetailsModalComponent);
  }

  openSportsSpecificEducationModal() {
    this.openModal(CoachSportsSpecificEducationModalComponent);
  }

  openMobileEmailModal() {
    const modalRef = this.openModal(CommonMobileEmailComponent);
    modalRef.componentInstance.isOfficialModal = true;
  }

  openKittingModal() {
    const modalRef = this.openModal(CommonSportKittingDetailsComponent);
    modalRef.componentInstance.isOfficialModal = true;
  }
  openKIGModal() {
    // this.openModal(KheloIndiaGamesEditModalComponent)
    this.openModal(KheloIndiaGamesViewModalComponent)
  }
  openRecruitmantUnderSportsQuotaModal() {
    this.openModal(RecruitmentUnderSportsQuotaComponent);
  }

  openModal(modal: any) {
    return this.modalService.open(modal, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}
