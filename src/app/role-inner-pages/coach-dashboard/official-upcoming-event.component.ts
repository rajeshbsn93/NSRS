import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import {
  CoachDashboardService,
  IOfficialDashboardData,
} from 'src/app/_common/services/role-inner-pages-services/coach-services/coach-dashboard.service';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoachAddSportsEducationComponent } from './coach-modals/coach-sports-specific-education-modal/coach-add-sports-education/coach-add-sports-education.component';
import { ViewAadhaarComponent } from 'src/app/standalone_components/modal-window/view-aadhar/view-aadhar.component';

@Component({
  selector: 'app-official-upcoming-event',
  template: `
    <div
      class="row upcoming-event"
      *ngIf="officialDashboardData"
    >
      <div class="col-sm item">
        <div class="card">
          <div
            class="card-body d-flex align-items-center justify-content-between"
          >
            <div>
              <span class="d-block">CURRENT ACADEMY</span>
              <h4>
                {{
                  officialDashboardData.currentAcademy
                    ? officialDashboardData.currentAcademy
                    : 'NA'
                }}
              </h4>
            </div>
            <div class="icon">
              <i class="icon-kiaa"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm item">
        <div class="card">
          <div
            class="card-body d-flex align-items-center justify-content-between"
          >
            <div>
              <span class="d-block">CURRENT TRAINEES</span>
              <h4>
                {{ officialDashboardData.totalCurrentTrainee }}
              </h4>
            </div>
            <div class="icon">
              <!-- <img src="assets/images/Coaches.svg" alt="" /> -->
              <mat-icon class="trainees-icon">groups</mat-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm item">
        <div class="card"  (click)="viewAadhaarModal()" [ngClass]="officialDashboardData.isAadharVerified ? 'active-aadhar' : ''">
          <div
            class="card-body d-flex align-items-center justify-content-between"
          >
            <div>
              <span class="d-block">AADHAAR</span>
              <h4>
                {{
                  officialDashboardData.isAadharVerified
                    ? 'Verified'
                    : 'Not Verified'
                }}
                <img
                  *ngIf="officialDashboardData?.isAadharVerified"
                  src="assets/images/veryfied.svg"
                  alt=""
                />
              </h4>
            </div>
            <div class="icon">
              <img src="assets/images/aadhaar.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ng-template>
      <app-loader *ngIf="loader"></app-loader>
    </ng-template>
  `,
  styles: [
    `
      .upcoming-event .card {
        background-color: #ffb24d;
        border-color: #ffb24d;
        box-shadow: 0 3px 6px #ffaa3a80;
        padding: 15px 0;
        width: 100%;
      }
      .upcoming-event .item {
        margin-top: 10px;
        display: flex;
      }
      .upcoming-event .item:nth-child(2) .card {
        background-color: #8894df;
        border-color: #8894df;
        box-shadow: 0 3px 6px #aeb9ff85;
      }
      .upcoming-event .item:nth-child(3) .card {
        background-color: #dc4e5b;
        border-color: #dc4e5b;
        box-shadow: 0 3px 6px #ff9ca6a3;
      }
      .upcoming-event .card span {
        color: #fff;
        font-size: 10px;
      }
      .upcoming-event .card h4 {
        color: #fff;
        font-weight: bold;
        font-size: 16px;
      }
      .upcoming-event .icon {
        width: 34px;
        min-width: 34px;
        height: 34px;
        display: inline-flex;
        background-color: #ffffff;
        justify-content: center;
        align-items: center;
        border-radius: 3px;
      }
      .upcoming-event .icon i::before {
        color: #ffb24d;
      }
      .trainees-icon {
        color: #8894df;
      }
      .upcoming-event .item:nth-child(3) .card.active-aadhar{background-color: #49a54d;
    border-color: #49a54d;
    box-shadow: 0 3px 6px #49a54da6;
    cursor: pointer;}
    `,
  ],
  standalone: true,
  imports: [CommonModule, LoaderComponent, MatIconModule],
})
export class OfficialUpcommingEventComponent implements OnInit {
  loader: boolean = true;
  officialDashboardData: IOfficialDashboardData | null = null;

  constructor(
    private coachDashboardService: CoachDashboardService,
    private storageService: StorageService,
    private alertService: AlertService,
    private modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.coachDashboardService.getOfficialDashboardData(this.storageService.getUserDetails().user_id)
      .pipe(first())
      .subscribe({
        next: (response: IOfficialDashboardData) => {
          this.officialDashboardData = response;
          const loginData = this.coachDashboardService.getLoginUserData();
          if (loginData) {
            this.coachDashboardService.setLoginUserData({
              ...loginData, has_recieved_discipline_specific_education: response.has_recieved_discipline_specific_education
            });
            if (response.has_recieved_discipline_specific_education === null)
              this.modal.open(CoachAddSportsEducationComponent, {centered: true, size: 'xl', backdrop: 'static', keyboard: false});
          }
          this.loader = false;
        },
        error: () => {
          this.loader = false;
          this.alertService.swalPopError('Something went wrong!');
        }
      })
  }
  viewAadhaarModal(){
    const modalRef = this.modal.open(ViewAadhaarComponent,{size:'lg', centered:true,backdrop:'static'})
 }
}
