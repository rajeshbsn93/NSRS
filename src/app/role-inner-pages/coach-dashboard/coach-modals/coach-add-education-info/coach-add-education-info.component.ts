import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Moment } from 'moment';
import { Subscription, first } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { CoachEducationInfoService, BoardEntity, EDUCATION, INSTT_TYPE, MediumEntity, PASSING_STATUS, UniversityEntity, OfficialEducationEntity, EditOfficialEducationEntity } from 'src/app/_common/services/role-inner-pages-services/coach-services/coach-education-info.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

export const FORMAT = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  standalone: true,
  selector: 'app-coach-add-education-info',
  templateUrl: './coach-add-education-info.component.html',
  styleUrls: ['./coach-add-education-info.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,MatInputModule, 
    MatFormFieldModule, MatSelectModule, MatDatepickerModule, LoaderComponent],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: FORMAT }, DatePipe]
})
export class CoachAddEducationInfoComponent implements OnInit, OnDestroy {
  @ViewChild('insttSearch', {static: false}) insttSearch?: ElementRef<HTMLInputElement>;
  loader: boolean = false;
  universityList: UniversityEntity[] = [];
  boardList: BoardEntity[] = [];
  mediumList: MediumEntity[] = [];
  showInsttNameInput: boolean = true;
  educationTypes = Object.values(EDUCATION);
  insttTypes = Object.values(INSTT_TYPE);
  passingStatuses = Object.values(PASSING_STATUS);
  form: FormGroup = this.fb.group({
    ed_type: [null, Validators.required],
    course_name: [null, Validators.required],
    instt_name: [null, Validators.required],
    instt_type: [{value: null, disabled: true}, Validators.required],
    institute_registration_no: null,
    board: [{value: null, disabled: true}, Validators.required],
    medium: [{value: null, disabled: true}, Validators.required],
    passing_status: [null, Validators.required],
    passing_yr: [{value: null, disabled: true}, Validators.required],
    obtained_marks: [{value: null, disabled: true}, Validators.required],
    total_marks: [{value: null, disabled: true}, Validators.required]
  });
  insttNameSearch: FormControl = new FormControl(null);
  filteredUniversities: UniversityEntity[] = [];
  subscription: Subscription = new Subscription();
  editEducation: OfficialEducationEntity | null = null;
  maxPassingYr: Date = new Date(new Date().getFullYear(), 11, 31);

  constructor(
    public activeModal: NgbActiveModal, 
    private coachEducationInfoService: CoachEducationInfoService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.getUniversityList();
    this.getBoardList();
    this.getMediumList();

    this.subscription.add(
      this.insttNameSearch.valueChanges.subscribe((value) => {
        if (value && this.universityList?.length)
          this.filteredUniversities = this.universityList.filter(
            (item) => item.university_name?.toLowerCase()?.trim()?.includes(value?.toLowerCase()?.trim())
          );
        else this.filteredUniversities = this.universityList;
      })
    );

    if (this.editEducation)
      this.passingStatuses = [PASSING_STATUS.PASSED, PASSING_STATUS.DROPPED_OUT, PASSING_STATUS.FAILED];
  }

  get edTypeControl(): FormControl {
    return this.form.get('ed_type') as FormControl;
  }
  
  get insttNameControl(): FormControl {
    return this.form.get('instt_name') as FormControl;
  }

  get insttTypeControl(): FormControl {
    return this.form.get('instt_type') as FormControl;
  }

  get boardControl(): FormControl {
    return this.form.get('board') as FormControl;
  }

  get mediumControl(): FormControl {
    return this.form.get('medium') as FormControl;
  }

  get passingYrControl(): FormControl {
    return this.form.get('passing_yr') as FormControl;
  }
  
  get obtainedMarksControl(): FormControl {
    return this.form.get('obtained_marks') as FormControl;
  }

  get totalMarksControl(): FormControl {
    return this.form.get('total_marks') as FormControl;
  }

  getUniversityList() {
    this.coachEducationInfoService.getUniversityList().subscribe(
      (response: UniversityEntity[]) => this.universityList = this.filteredUniversities = response
    );
  }

  getBoardList() {
    this.coachEducationInfoService.getBoardList().subscribe(
      (response: BoardEntity[]) => this.boardList = response
    );
  }

  getMediumList() {
    this.coachEducationInfoService.getMediumList().subscribe(
      (response: MediumEntity[]) => this.mediumList = response
    );
  }

  onYearSelected(event: Moment) {
    this.passingYrControl.setValue(event);
  }

  onEdTypeChange(event: MatSelectChange) {
    this.insttNameControl.setValue(null);
    this.insttNameSearch.setValue(null);
    this.boardControl.setValue(null);
    this.mediumControl.setValue(null);
    this.showInsttNameInput = 
      [EDUCATION.INTERMEDIATE, EDUCATION.HIGH_SCHOOL, EDUCATION.PVT_COURSE].some((item: string) => item === event.value);
    if ([EDUCATION.INTERMEDIATE, EDUCATION.HIGH_SCHOOL].some((item: string) => item === event.value)) {
      this.boardControl.enable();
      this.mediumControl.enable();
    } else {
      this.boardControl.disable();
      this.mediumControl.disable();
    }

    switch(event.value) {
      case EDUCATION.INTERMEDIATE: case EDUCATION.HIGH_SCHOOL:
        this.insttTypeControl.setValue(INSTT_TYPE.SCHOOL); 
        break;
      case EDUCATION.PVT_COURSE: 
        this.insttTypeControl.setValue(INSTT_TYPE.PVT_INSTITUTION); 
        break;
      default:
        this.insttTypeControl.setValue(INSTT_TYPE.UNIVERSITY); 
        break;
    }
  }

  onPassingStatusChange(event: MatSelectChange) {
    const controls = [this.obtainedMarksControl, this.totalMarksControl, this.passingYrControl];
    controls.forEach((control) => {
      control.setValue(null);
      event.value === PASSING_STATUS.PASSED ? control.enable() : control.disable();
    });
  }

  saveDetails() {
    const formData = this.form.value;
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.totalMarksControl.hasError('min'))
        this.alertService.swalPopWarning('Total Marks should be greater than or equal to Obtained Marks!'); 
      else this.alertService.swalPopWarning('Form is invalid! Please check.');
      return;
    }

    const payload = {
      official_detail_id: this.storageService.getUserDetails()?.user_id,
      education_type: this.edTypeControl.value,
      education_name: formData.course_name || null,
      name_of_institution: this.insttTypeControl.value === INSTT_TYPE.UNIVERSITY
        ? this.universityList.filter((item) => item.university_detail_id === formData.instt_name)[0].university_name 
        : formData.instt_name,
      institution_type: this.insttTypeControl.value,
      institute_registration_no: formData.institute_registration_no || null,
      university_detail_id: this.insttTypeControl.value === INSTT_TYPE.UNIVERSITY ? formData.instt_name : null,
      board_id: this.boardControl.value,
      medium_id: this.mediumControl.value,
      result: this.obtainedMarksControl.value,
      result_out_of: this.totalMarksControl.value,
      passing_status: formData.passing_status,
      year_of_passing: this.passingYrControl.value ? parseInt(this.datePipe.transform(this.passingYrControl.value, 'yyyy')!) : null
    }

    this.coachEducationInfoService.saveEducationInfo(payload).subscribe({
      next: (response: boolean) => {
        if (response) {
          this.alertService.swalPopSuccess('Coach education details inserted successfully!');
          this.activeModal.close(true);
        } else {
          this.alertService.swalPopError('Something went wrong! Please try again');
        }
      },
      error: () => {
        this.alertService.swalPopError('Something went wrong! Please try again');
      }
    })
  }

  updateDetails() {
    if (this.form.get('passing_status')?.errors || 
      this.passingYrControl.errors ||
      this.obtainedMarksControl.errors ||
      this.totalMarksControl.errors
    ) {
      this.form.markAllAsTouched();
      if (this.totalMarksControl.hasError('min')) 
        this.alertService.swalPopWarning('Total Marks should be greater than or equal to Obtained Marks!');
      else
        this.alertService.swalPopWarning('Invalid fields found! Please check.');
      return;
    }

    this.loader = true;

    const payload: EditOfficialEducationEntity = {
      official_education_id: this.editEducation!.official_education_id,
      result: this.obtainedMarksControl.value || null,
      result_out_of: this.totalMarksControl.value || null,
      passing_status: this.form.get('passing_status')?.value,
      year_of_passing: this.passingYrControl.value ? parseInt(this.datePipe.transform(this.passingYrControl.value, 'yyyy')!) : null
    }

    this.coachEducationInfoService.editEducationInfo(payload).pipe(first()).subscribe({
      next: (response: boolean) => {
        this.loader = false;
        if (response) {
          this.activeModal.close(true);
          this.alertService.swalPopSuccess('Education details updated successfully!');
        } else {
          this.alertService.swalPopError('Something went wrong! Please try again');
        }
      },
      error: () => {
        this.loader = false;
        this.alertService.swalPopError('Something went wrong! Please try again');
      }
    })
  }

  onInsttNameSelectOpen() {
    this.insttSearch?.nativeElement.focus();
  }

  onInsttSearchBlur() {
    setTimeout(() => {
      this.insttNameSearch.setValue('');
    }, 400);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
