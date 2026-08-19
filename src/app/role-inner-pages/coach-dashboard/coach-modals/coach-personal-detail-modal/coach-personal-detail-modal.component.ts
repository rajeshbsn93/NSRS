import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { CoachDashboardService } from 'src/app/_common/services/role-inner-pages-services/coach-services/coach-dashboard.service';
import { SideBarNavStateService } from 'src/app/_common/sidebar.state';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  selector: 'app-coach-personal-detail-modal',
  templateUrl: './coach-personal-detail-modal.component.html',
  styleUrls: ['./coach-personal-detail-modal.component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, LoaderComponent],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe,
  ],
})
export class CoachPersonalDetailModalComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    name: [null, Validators.required],
    gender: [null],
    dob: [null, Validators.required],
    discipline: [null],
  });
  userDetails: any;
  loader: boolean = false;
  minDate: any;
  maxDate: any;
  isSportScientist: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private coachDashboardService: CoachDashboardService,
    private alertService: AlertService,
    private _sideBarState: SideBarNavStateService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.userDetails = this.storageService.getUserDetails();
    this.isSportScientist = this.userDetails?.role_name === 'SportsScientist';
    this.setFormValues();
  }

  enableForm() {
    this.form.get('name')?.enable();
    this.form.get('dob')?.enable();
  }

  setFormValues() {
    this.loader = true;
    this.form.disable();
    this.coachDashboardService
      .getOfficialPersonalInfo(this.userDetails.user_id)
      .subscribe({
        next: (response: any) => {
          this.loader = false;

          this.form.get('name')?.setValue(response.name);
          this.form.get('gender')?.setValue(response.gender);
          this.form.get('dob')?.setValue(response.date_of_birth);
          this.form.get('discipline')?.setValue(response.discipline);

          if (response.date_of_birth != null) {
            this.minDate = new Date(response.date_of_birth.split('-')[0], 0, 1);
            this.maxDate = new Date(
              response.date_of_birth.split('-')[0], 11, 31);
          }
        },
        error: () => {
          this.loader = false;
          this.alertService.swalPopError('Something went wrong! Please try again.');
          console.error('Caught in GetOfficialPersonalInfo API');
        },
      });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.swalPopWarning('Invalid fields found! Please check.');
      return;
    }
    
    this.form.value.player_detail_id = this.userDetails.user_id;
    this.form.value.dob = this.datePipe.transform(this.form.value.dob, 'yyyy-MM-dd');
    this.coachDashboardService.saveOfficialPersonalInfo({
      official_detail_id: this.userDetails.user_id,
      name: this.form.value.name, 
      date_of_birth: this.form.value.dob
    })
      .subscribe({
        next: (response: boolean) => {
          if (response) {
            this.alertService.swalPopSuccess('Personal Details Updated Successfully!');
            this._sideBarState.SetAcademyDetailData(this.form.value);
            this.activeModal.close();
          } else {
            this.alertService.swalPopError('Something went wrong! Please try again');
          } 
        },
        error: () => {
          this.alertService.swalPopError('Something went wrong! Please try again');
          console.error('Caught in EditCoachPersonalInfo API');
        },
      });
  }
}
