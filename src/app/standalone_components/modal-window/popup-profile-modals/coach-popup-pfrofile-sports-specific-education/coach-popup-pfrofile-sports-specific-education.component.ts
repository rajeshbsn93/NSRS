import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { CommonSportSpecificEducationService, GetSportSpecificEducation } from 'src/app/_common/services/role-inner-pages-services/common-role-services/common-sport-specific-education.service';
import { first } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-coach-popup-pfrofile-sports-specific-education',
  templateUrl: './coach-popup-pfrofile-sports-specific-education.component.html',
  styleUrls: ['./coach-popup-pfrofile-sports-specific-education.component.css'],
  standalone: true,
  imports: [CommonModule, LoaderComponent],
})
export class CoachPopupProfileSportsSpecificEducatioComponent implements OnInit {
  educationDetails: GetSportSpecificEducation[] = [];
  loader: boolean = false;
  readonly fileBaseUrl = environment.fileUrl;
  official_detail_id:any

  constructor(
    public activeModal: NgbActiveModal,
    private storageService: StorageService,
    private commonSportSpecificEducationService: CommonSportSpecificEducationService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    // this.bankDetails = this.storageService.getUserDetails();
    if (this.storageService.getUserDetails()?.user_id) this.getDetails();
  }

  getDetails() {
    this.loader = true;
    this.commonSportSpecificEducationService.getOfficialDisciplineSpecificEducationDetails(
      this.official_detail_id
    ).pipe(first()).subscribe({
      next: (response: GetSportSpecificEducation[]) => {
        this.educationDetails = response;
        this.loader = false;
      },
      error: () => {
        this.loader = false;
        console.error('Error caught in getOfficialDisciplineSpecificEducationDetails API');
        this.alertService.swalPopError('Something went wrong!');
      }
    });
  }

}
