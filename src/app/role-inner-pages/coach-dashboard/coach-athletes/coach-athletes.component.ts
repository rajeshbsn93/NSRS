import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AthleteDashboardSidebarComponent } from '../../athlete-dashboard/athlete-dashboard-sidebar/athlete-dashboard-sidebar.component';

@Component({
  selector: 'app-athletes',
  templateUrl: './coach-athletes.component.html',
  styleUrls: ['./coach-athletes.component.css'],
  standalone: true,
  imports: [CommonModule, AthleteDashboardSidebarComponent],
})
export class CoachAthletesComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  // openPersonalInfoModal() {
  //   this.openModal(CoachPersonalDetailModalComponent);
  // }

  openModal(modal: any) {
    const modalRef = this.modalService.open(modal, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }
}
