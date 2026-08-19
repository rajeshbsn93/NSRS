import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { ResearchExperienceComponent } from '../../modal-window/sport-science-modals/research-experience/research-experience.component';
import { TeachingExperienceComponent } from '../../modal-window/sport-science-modals/teaching-experience/teaching-experience.component';
import { PublicationComponent } from '../../modal-window/sport-science-modals/publication/publication.component';
import { CoachSportsSpecificEducationModalComponent } from '../../coach-dashboard/coach-modals/coach-sports-specific-education-modal/coach-sports-specific-education-modal.component';
import { TrainingWorkshopComponent } from '../../modal-window/sport-science-modals/training-workshop/training-workshop.component';
import { AwardSportScientistComponent } from '../../modal-window/sport-science-modals/award-sport-scientist/award-sport-scientist.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { MembershipScientificComponent } from '../../modal-window/sport-science-modals/membership-scientific/membership-scientific.component';
import { AthleteDashboardSidebarComponent } from '../../athlete-dashboard/athlete-dashboard-sidebar/athlete-dashboard-sidebar.component';

@Component({
    selector:'app-sports-scientist-achievement',
    templateUrl:'./sports-scientist-achievement.component.html',
    styleUrls:['./sports-scientist-achievement.component.css'],
    standalone:true,
  imports: [CommonModule, AthleteDashboardSidebarComponent,MaterialModule],
})
export class SportsScientistAchievementComponent implements OnInit, OnDestroy {
  userDetails:any;
  
  constructor(private modalService: NgbModal,private storageService:StorageService) {}

  ngOnInit(): void {
    this.userDetails=this.storageService.getUserDetails();
    // console.log(this.userDetails=this.storageService.getUserDetails())
  }

  openSportsSpecificEducationModal() {
    this.openModal(CoachSportsSpecificEducationModalComponent);
  }
  openResearchExperienceModal(){
    this.openModal(ResearchExperienceComponent)    
  }
  openTeachingExperienceModal(){
    this.openModal(TeachingExperienceComponent)
  }
  openPublicationModal(){
    this.openModal(PublicationComponent)
  }
  openTrainingWorkshopModal(){
    this.openModal(TrainingWorkshopComponent)
  }
  openAwardModal(){
    this.openModal(AwardSportScientistComponent)
  }
  openMembershipScientificModal(){
    this.openModal(MembershipScientificComponent)
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
