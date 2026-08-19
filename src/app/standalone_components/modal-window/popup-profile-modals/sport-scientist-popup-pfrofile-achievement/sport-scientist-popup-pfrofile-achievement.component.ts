import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { MaterialModule } from 'src/app/_common/material.module';
import { SportScientistPopupProfileSportsSpecificEducatioComponent } from '../sport-scientist-popup-pfrofile-sports-specific-education/sport-scientist-popup-pfrofile-sports-specific-education.component';
import { SportScientistPopupProfileResearchExperienceComponent } from '../sport-scientist-popup-pfrofile-research-experience/sport-scientist-popup-pfrofile-research-experience.component';
import { SportScientistPopupProfileTeachingExperienceComponent } from '../sport-scientist-popup-pfrofile-teaching-experience/sport-scientist-popup-pfrofile-teaching-experience.component';
import { SportScientistPopupProfilePublicationComponent } from '../sport-scientist-popup-pfrofile-publication/sport-scientist-popup-pfrofile-publication.component';
import { SportScientistPopupProfileTrainingWorkshopComponent } from '../sport-scientist-popup-pfrofile-training-workshop/sport-scientist-popup-pfrofile-training-workshop.component';
import { SportScientistPopupProfileAwardComponent } from '../sport-scientist-popup-pfrofile-award/sport-scientist-popup-pfrofile-award.component';
import { SportScientistPopupProfileMembershipSpecificComponent } from '../sport-scientist-popup-pfrofile-membership-scientific/sport-scientist-popup-pfrofile-membership-scientific.component';

@Component({
    selector:'app-sport-scientist-popup-pfrofile-achievement',
    templateUrl:'./sport-scientist-popup-pfrofile-achievement.component.html',
    styleUrls:['./sport-scientist-popup-pfrofile-achievement.component.css'],
    standalone:true,
  imports: [CommonModule,MaterialModule],
})
export class SportScientistPopupProfileAchievementComponent implements OnInit, OnDestroy {
  userDetails:any;
  @Input() officialId:any;
  
  constructor(private modalService: NgbModal,private storageService:StorageService) {}

  ngOnInit(): void {
    this.userDetails=this.storageService.getUserDetails();
  }

  openSportsSpecificEducationModal() {
    this.openModal(SportScientistPopupProfileSportsSpecificEducatioComponent);
  }
  openResearchExperienceModal(){
    this.openModal(SportScientistPopupProfileResearchExperienceComponent)    
  }
  openTeachingExperienceModal(){
    this.openModal(SportScientistPopupProfileTeachingExperienceComponent)
  }
  openPublicationModal(){
    this.openModal(SportScientistPopupProfilePublicationComponent)
  }
  openTrainingWorkshopModal(){
    this.openModal(SportScientistPopupProfileTrainingWorkshopComponent)
  }
  openAwardModal(){
    this.openModal(SportScientistPopupProfileAwardComponent)
  }
  openMembershipScientificModal(){
    this.openModal(SportScientistPopupProfileMembershipSpecificComponent)
  }

  openModal(modal: any) {
    const ModalRef = this.modalService.open(modal, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
    ModalRef.componentInstance.official_detail_id = this.officialId
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}
