import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoachDetailsModalComponent } from '../coach-modals/coach-details-modal/coach-details-modal.component';
import { CoachNationalCampExperienceModalComponent } from '../coach-modals/coach-national-camp-experience-modal/coach-national-camp-experience-modal.component';
import { AthleteDashboardSidebarComponent } from '../../athlete-dashboard/athlete-dashboard-sidebar/athlete-dashboard-sidebar.component';

@Component({
  selector: 'app-details',
  templateUrl: './coach-details.component.html',
  styleUrls: ['./coach-details.component.css'],
  standalone: true,
  imports: [CommonModule, AthleteDashboardSidebarComponent],
})
export class CoachDetailsComponent implements OnInit, OnDestroy {
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  openCoachDetailsModal() {
    this.openModal(CoachDetailsModalComponent);
  }

  openNationalCampExperienceModal() {
    this.openModal(CoachNationalCampExperienceModalComponent);
  }

  openModal(modal: any) {
    const modalRef = this.modalService.open(modal, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}
