import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { CoachPopupProfileExperienceNationalCampComponent } from '../coach-popup-pfrofile-experience-national-camp/coach-popup-pfrofile-experience-national-camp.component';
import { CoachPopupProfileForeignExposureComponent } from '../coach-popup-pfrofile-foreign-exposure/coach-popup-pfrofile-foreign-exposure.component';
import { CoachPopupProfileBestAchievementComponent } from '../coach-popup-pfrofile-best-achievement/coach-popup-pfrofile-best-achievement.component';
import { CoachPopupProfileAwardReceivedComponent } from '../coach-popup-pfrofile-award-received/coach-popup-pfrofile-award-received.component';
import { CoachPopupProfileSportsSpecificEducatioComponent } from '../coach-popup-pfrofile-sports-specific-education/coach-popup-pfrofile-sports-specific-education.component';

@Component({
  selector: 'app-coach-popup-achievement',
  templateUrl: './coach-popup-achievement.component.html',
  styleUrls: ['./coach-popup-achievement.component.css'],
  standalone: true,
  imports: [CommonModule,  MatIconModule],
})
export class CoachPopupAchievementComponent implements OnInit, OnDestroy {
  userDetails:any;
  @Input() officialId:any
  
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    // console.log(this.officialId)
  }

  openExperienceNationalCampModal() {
    this.openModal(CoachPopupProfileExperienceNationalCampComponent);
  }
  openForeignExposureModal(){
    this.openModal(CoachPopupProfileForeignExposureComponent)
  }
  openBestAchievementModal(){
    this.openModal(CoachPopupProfileBestAchievementComponent)
  }
  openAwardsModal(){
    this.openModal(CoachPopupProfileAwardReceivedComponent)
  }
  openSportsSpecificEducationModal() {
    this.openModal(CoachPopupProfileSportsSpecificEducatioComponent);
  }

  openModal(modal: any) {
    const modalRef= this.modalService.open(modal, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.official_detail_id = this.officialId
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}
