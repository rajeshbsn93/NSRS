import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { AthleteDashboardSidebarComponent } from "../athlete-dashboard-sidebar/athlete-dashboard-sidebar.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PersonalDetailComponent } from "../../modal-window/athlete-dashboard-modal/personal-detail/personal-detail.component";
import { AthleteCommunicationAddressComponent } from "../../modal-window/athlete-dashboard-modal/athlete-communication-address/athlete-communication-address.component";
import { CommonMobileEmailComponent } from "../../modal-window/common-modals/common-mobile-email/common-mobile-email.component";
import { CommonSportKittingDetailsComponent } from "../../modal-window/common-modals/common-sport-kitting-details/common-sport-kitting-details.component";
import { AthleteBankInformationComponent } from "../../modal-window/athlete-dashboard-modal/athlete-bank-information/athlete-bank-information.component";
import { AthleteDocumentsComponent } from "../../modal-window/athlete-dashboard-modal/athlete-documents/athlete-documents.component";
import { AthleteEducationComponent } from "../../modal-window/athlete-dashboard-modal/athlete-education/athlete-education.component";
import { AthleteHistorySportComponent } from "../../modal-window/athlete-dashboard-modal/athlete-history-sport/athlete-history-sport.component";
import { AthleteRankingComponent } from "../../modal-window/athlete-dashboard-modal/athlete-ranking/athlete-ranking.component";
import { AthleteSuccessStoryComponent } from "../../modal-window/athlete-dashboard-modal/athlete-success-story/athlete-success-story.component";
import { AthleteLanguageModalComponent } from "../../modal-window/athlete-dashboard-modal/athlete-language-modal/athlete-language-modal.component";
import { KheloIndiaGamesViewModalComponent } from "src/app/standalone_components/modal-window/khelo-india-games-view-modal/khelo-india-games-view-modal.component";
import { AthleteFormFiveComponent } from "../../modal-window/athlete-dashboard-modal/athlete-form-five/athlete-form-five.component";
import { RouterModule } from "@angular/router";
import { RecruitmentQuotaForAthlteComponent } from "../../modal-window/athlete-dashboard-modal/recruitment-quota-for-athlte/recruitment-quota-for-athlte.component";

@Component({
  selector: 'app-profile',
  templateUrl: './athlete-profile.component.html',
  styleUrls: ['./athlete-profile.component.css'],
  standalone: true,
  imports: [CommonModule, AthleteDashboardSidebarComponent, RouterModule]
})

export class AthleteProfileComponent implements OnInit, OnDestroy {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {

  }
  personalDetail() {
    this.openModal(PersonalDetailComponent);
  }
  communicationAddress() {
    this.openModal(AthleteCommunicationAddressComponent);
  }
  mobileEmail() {
    this.openModal(CommonMobileEmailComponent);
  }
  sportKittingDetails() {
    this.openModal(CommonSportKittingDetailsComponent);
  }
  bankInformation() {
    this.openModal(AthleteBankInformationComponent);
  }
  athleteDocuments() {
    this.openModal(AthleteDocumentsComponent);
  }
  openEducationInfoPopup() {
    this.openModal(AthleteEducationComponent);
  }
  openHistorySport() {
    this.openModal(AthleteHistorySportComponent);
  }
  openAthleteRanking() {
    this.openModal(AthleteRankingComponent);
  }
  openSuccessStory() {
    this.openModal(AthleteSuccessStoryComponent);
  }
  openLanguageModal() {
    this.openModal(AthleteLanguageModalComponent);
  }
  openKIGModal() {
    // this.openModal(KheloIndiaGamesEditModalComponent)
    this.openModal(KheloIndiaGamesViewModalComponent)
  }
  openRecruitmantQuotaModal() {
    this.openModal(RecruitmentQuotaForAthlteComponent);
  }

  openModal(modalComponent: any) {
    this.modalService.open(modalComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}