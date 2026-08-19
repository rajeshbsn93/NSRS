import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AuthenticationService } from 'src/app/_common/services/innerPagesServices/authentication.service';
import {
  CommonSportSpecificEducationService, GetSportSpecificEducationListsParams, SaveSportSpecificEducation,
} from 'src/app/_common/services/role-inner-pages-services/common-role-services/common-sport-specific-education.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { environment } from 'src/environments/environment';

const FORMAT = {
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
  selector: 'app-coach-add-sports-education',
  templateUrl: './coach-add-sports-education.component.html',
  styleUrls: ['./coach-add-sports-education.component.css'],
  providers: [DatePipe, { provide: MAT_DATE_FORMATS, useValue: FORMAT }],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatCheckboxModule,
    MatFormFieldModule, MatSelectModule, LoaderComponent, MatDatepickerModule
  ],
})
export class CoachAddSportsEducationComponent implements OnInit {
  @ViewChild('docFile') docFile!: ElementRef<any>;
  loader: boolean = false;
  issuedByList: string[] = [];
  educationTypesList: string[] = [];
  coursesList: string[] = [];
  levelsList: string[] = [];
  doc_path: string | null = null;
  readonly fileBaseUrl = environment.fileUrl;
  isSaveClicked: boolean = false;
  minPassingYr = new Date(1960, 0, 1);
  maxPassingYr = new Date(new Date().getFullYear(), 11, 31);
  sportsSpecificEducationControl: FormControl = new FormControl(null);
  has_recieved_discipline_specific_education: boolean | null = null;

  form: FormGroup = this.fb.group({
    issued_by: [null, Validators.required],
    ed_type: [null, Validators.required],
    course_name: [null, Validators.required],
    level: [null, Validators.required],
    passing_yr: [null, Validators.required],
    duration: [null, Validators.required],
    duration_select: [null, Validators.required],
    remarks: null
  });

  constructor(
    public activeModal: NgbActiveModal,
    private storageService: StorageService, private datePipe: DatePipe,
    private commonSportSpecificEducationService: CommonSportSpecificEducationService,
    private fb: FormBuilder, private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    const role_id = this.storageService
      .getUserProfileDataFromSessionRes()
      ?.userData.role_id?.toString();
    const discipline_id =
      this.storageService.getUserProfileDataFromSessionRes().profileData
        .sport_id;
    if (role_id && discipline_id) this.getList(LIST_TYPE.ISSUED_BY);
    this.has_recieved_discipline_specific_education = this.storageService.getUserDetails()?.has_recieved_discipline_specific_education;
      
  }

  getList(listType: LIST_TYPE) {
    this.loader = true;
    let params: GetSportSpecificEducationListsParams = {
      roleId: this.storageService.getUserProfileDataFromSessionRes()?.userData.role_id?.toString(),
      discipline_id: this.storageService.getUserProfileDataFromSessionRes().profileData.sport_id
    };
    if (listType === LIST_TYPE.ED_TYPE) params.issued_By = this.form.value.issued_by;
    else if (listType === LIST_TYPE.COURSE_NAME) {
      params.issued_By = this.form.value.issued_by;
      params.education = this.form.value.ed_type;
    } else if (listType === LIST_TYPE.LEVEL) {
      params.issued_By = this.form.value.issued_by;
      params.education = this.form.value.ed_type;
      params.course_name = this.form.value.course_name;
    }
    this.commonSportSpecificEducationService.getSportSpecificEducationLists(params)
      .pipe(first())
      .subscribe({
        next: (response: Array<string>) => {
        switch(listType) {
          case LIST_TYPE.ISSUED_BY:
            this.issuedByList = response;
            break;

          case LIST_TYPE.ED_TYPE:
            this.educationTypesList = response;
            break;
          
          case LIST_TYPE.COURSE_NAME:
            this.coursesList = response;
            break;
          
          case LIST_TYPE.LEVEL:
            this.levelsList = response;
            break;
          
          default:
            break;
        }
        this.loader = false;
      },
      error: () => {
        this.loader = false;
        console.error('Error caught in get_official_discipline_specific_education API');
        this.alertService.swalPopError('Something went wrong! Please try again.');
      }
    });
  }

  onIssuedByChange() {
    this.form.get('ed_type')?.setValue(null);
    this.form.get('course_name')?.setValue(null);
    this.form.get('level')?.setValue(null);
    this.educationTypesList = [];
    this.coursesList = [];
    this.levelsList = [];
    this.getList(LIST_TYPE.ED_TYPE);
  }

  onEducationTypeChange() {
    this.form.get('course_name')?.setValue(null);
    this.form.get('level')?.setValue(null);
    this.coursesList = [];
    this.levelsList = [];
    this.getList(LIST_TYPE.COURSE_NAME);
  }

  onCourseNameChange() {
    this.form.get('level')?.setValue(null);
    this.levelsList = [];
    this.getList(LIST_TYPE.LEVEL);
  }
  
  onPassingYrSelected(event: any) {
    this.form.get('passing_yr')?.setValue(this.datePipe.transform(event, 'yyyy-MM-dd'));
  }

  fileUpload(event: any) {
    if (this.form.disabled) return;
    const file = event.target.files[0];
    if (!file) return;
    if (parseFloat((file.size / (1024 * 1024)).toFixed(2)) > 5) {
      this.docFile.nativeElement.value = null;
      this.alertService.swalPopWarning('File size should be smaller than 5 MB!');
      return;
    }
    const extFile=this.getFileExtension(file);
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      const formData = new FormData();
      formData.append("file",file, file.name);
      formData.append("path","Coach\\coachDocumentInfo");
      formData.append("uploadType","3");
      this.loader = true;
      this.commonSportSpecificEducationService.uploadFile(formData).subscribe({
        next: (response: any) => {
          this.loader = false;
          if (response.isUploaded==true) {
            this.alertService.swalPopSuccess('Upload Successful!');
            this.doc_path = response.filedataList[0].filePath;
            this.docFile.nativeElement.value = null;
          } else {
            this.alertService.swalPopError(response.errMsg || 'Upload Failed! Please try again.');
          }
        },
        error: () => {
          this.loader=false;
          this.alertService.swalPopError('Upload Failed! Please try again.');
          console.error("error caught in upload file")
        }
      });
    } 
    else {
      this.alertService.swalPopWarning('Only jpg, jpeg, png or pdf file is allowed!');
    }
  }

  getFileExtension(file:any) {
    let fileIndex = file.name.lastIndexOf(".") + 1;
    let extFile = file.name.substr(fileIndex, file.name.length).toLowerCase();
    return extFile;
  }

  onCheckBoxChange() {
    if (this.sportsSpecificEducationControl.value === true) {
      this.form.reset();
      this.form.disable();
      this.doc_path = null;
    } else {
      this.form.enable();
    }
  }

  saveDetails() {
    this.isSaveClicked = true;

    if (
        !this.sportsSpecificEducationControl.value && 
        this.form.invalid
      ) {
      this.form.markAllAsTouched();
      this.alertService.swalPopWarning('Invalid fields found! Please check.');
      return;
    }
    
    if (
        !this.sportsSpecificEducationControl.value &&
        !this.doc_path
      ) {
      this.alertService.swalPopWarning('Please upload document to proceed!');
      return;
    }

    const payload: SaveSportSpecificEducation = {
      official_detail_id: this.storageService.getUserDetails().user_id,
      has_recieved_sports_specific_education: true,
      diploma: this.form.value.ed_type,
      level_name: this.form.value.level,
      year_of_course: new Date(this.form.value.passing_yr).getFullYear(),
      duration: this.form.value.duration,
      issued_by: this.form.value.issued_by,
      remarks: this.form.value.remarks || null,
      degree_duration: this.form.value.duration_select,
      degree_duration_number: this.form.value.duration,
      course_name: this.form.value.course_name,
      document_path: this.doc_path!
    }

    const nullPayload: SaveSportSpecificEducation = {
      official_detail_id: this.storageService.getUserDetails().user_id,
      has_recieved_sports_specific_education: false,
      diploma: '',
      level_name: '',
      year_of_course: 0,
      duration: 0,
      issued_by: '',
      remarks: '',
      degree_duration: '',
      degree_duration_number: 0,
      course_name: '',
      document_path: ''
    }

    this.commonSportSpecificEducationService.saveOfficialDisciplineSpecificEducationDetails(
      this.sportsSpecificEducationControl.value === true 
        ? nullPayload
        : payload
      ).pipe(first()).subscribe({
      next: (response: boolean) => {
        if (this.storageService.getUserDetails()?.has_recieved_discipline_specific_education !== true) {
          localStorage.setItem('loginUserdata', JSON.stringify({
            ...this.storageService.getUserDetails(),
            has_recieved_discipline_specific_education: this.sportsSpecificEducationControl.value === true ? false : true
          }));
        }
        if (response) {
          this.activeModal.close(true);
          this.alertService.swalPopSuccess('Details Inserted Successfully!');
        } else this.alertService.swalPopError('Something went wrong! Please try again.');
      },
      error: () => {
        this.alertService.swalPopError('Something went wrong! Please try again.');
      }
    });
  }

  logout() {
    const setLoader = ((value: boolean): void => {this.loader = value});
    this.authenticationService.logout(setLoader.bind(this));
  }
}

enum LIST_TYPE {
  ISSUED_BY,
  ED_TYPE,
  COURSE_NAME,
  LEVEL
}

