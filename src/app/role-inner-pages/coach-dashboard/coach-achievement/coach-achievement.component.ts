import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { MatIconModule } from '@angular/material/icon';
import { CoachExperienceNationalCampComponent } from '../coach-modals/coach-experience-national-camp/coach-experience-national-camp.component';
import { CoachForeignExposureComponent } from '../coach-modals/coach-foreign-exposure/coach-foreign-exposure.component';
import { CoachBestAchievementComponent } from '../coach-modals/coach-best-achievement/coach-best-achievement.component';
import { CoachAwardReceivedComponent } from '../coach-modals/coach-award-received/coach-award-received.component';
import { CoachSportsSpecificEducationModalComponent } from '../coach-modals/coach-sports-specific-education-modal/coach-sports-specific-education-modal.component';
import { AthleteDashboardSidebarComponent } from '../../athlete-dashboard/athlete-dashboard-sidebar/athlete-dashboard-sidebar.component';

@Component({
  selector: 'app-coach-achievement',
  templateUrl: './coach-achievement.component.html',
  styleUrls: ['./coach-achievement.component.css'],
  standalone: true,
  imports: [CommonModule, AthleteDashboardSidebarComponent, MatIconModule],
})
export class CoachAchievementComponent implements OnInit, OnDestroy {
  userDetails:any;
  
  constructor(private modalService: NgbModal,private storageService:StorageService) {}

  ngOnInit(): void {
    this.userDetails=this.storageService.getUserDetails();
  }

  openExperienceNationalCampModal() {
    this.openModal(CoachExperienceNationalCampComponent);
  }
  openForeignExposureModal(){
    this.openModal(CoachForeignExposureComponent)
  }
  openBestAchievementModal(){
    this.openModal(CoachBestAchievementComponent)
  }
  openAwardsModal(){
    this.openModal(CoachAwardReceivedComponent)
  }
  openSportsSpecificEducationModal() {
    this.openModal(CoachSportsSpecificEducationModalComponent);
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
