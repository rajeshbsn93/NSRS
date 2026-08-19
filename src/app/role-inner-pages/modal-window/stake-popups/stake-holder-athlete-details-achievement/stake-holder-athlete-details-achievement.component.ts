import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import { NgbActiveModal, NgbModal, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { Moment } from "moment";
import { first } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { SharableService } from "src/app/_common/services/innerPagesServices/innerpagesSharable.service";
import { TournamentService } from "src/app/_common/services/innerPagesServices/tournament.service";
import { YearFormatDirective } from "src/app/standalone_components/directives/year-format.directive";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { AthleteEditAchievementComponent } from "../../athlete-dashboard-modal/athlete-edit-achievement/athlete-edit-achievement.component";

@Component({
  selector: 'app-stake-holder-athlete-details-achievement',
  templateUrl: './stake-holder-athlete-details-achievement.component.html',
  styleUrls: ['./stake-holder-athlete-details-achievement.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, LoaderComponent, YearFormatDirective, NgbTooltipModule],
})
export class StakeHolderAthleteDetailsAchievementComponent implements OnInit {
  @ViewChild('document_pathInput') document_pathInput!: ElementRef<any>;
  achievementForm!: FormGroup;
  yearVal: any;
  // maxDate = new Date(2023, 0, 1);
  maxDate = new Date((new Date().getFullYear()), 11, 31);
  showCategory: boolean = true;
  tournamentCategoryListData: any;
  filterTournamentCategoryListData: any;
  loader: boolean = false;
  tournamentListData: any;
  document_pathUrl: string | null = null;
  readonly fileBaseUrl = environment.fileUrl;
  isSaveClicked: boolean = false;
  eventListData: any;
  stateListData: any;
  userSesionData: any;
  @Input() athleteProfileData: any;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private aletService: AlertService,
    private storageService: StorageService, private tournamentService: TournamentService, private sharableService: SharableService,
    private datePipe: DatePipe, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.userSesionData = this.storageService.getUserProfileDataFromSessionRes()
    this.achievementForm = this.fb.group({
      tournamentYear: ['', Validators.required],
      level: ['', Validators.required],
      category: ['', Validators.required],
      tournament: ['', Validators.required],
      position: ['', Validators.required],
      result: ['', Validators.required],
      event_id: ['', Validators.required],
      fromdate: ['', Validators.required],
      todate: ['', Validators.required],
      venue: ['', Validators.required],
      represented: ['', Validators.required],
      age_category: ['', Validators.required],
    });
  }

  swalAlert(iconText: any, TextMsg: string) {
    return Swal.fire({
      icon: iconText,
      text: TextMsg,
      showConfirmButton: true
    })
  }

  handleYearSelected(event: Moment, yearOpen: MatDatepicker<Moment>) {
    this.yearVal = event.toDate().getFullYear();
    this.achievementForm.controls['tournamentYear'].setValue(event);
    this.achievementForm.controls['level'].reset('');
    this.achievementForm.controls['category'].reset('');
    this.achievementForm.controls['tournament'].reset('');
    this.achievementForm.controls['age_category'].reset('');
    this.achievementForm.controls['position'].reset('');
    this.achievementForm.controls['result'].reset('');
    this.achievementForm.controls['event_id'].reset('');
    this.achievementForm.controls['fromdate'].reset('');
    this.achievementForm.controls['todate'].reset('');
    this.achievementForm.controls['venue'].reset('');
    this.achievementForm.controls['represented'].reset('');
    if (yearOpen.opened) {
      yearOpen.close();
    }
  }

  changeLevel(event: any) {
    this.achievementForm.controls['position'].reset('');
    this.achievementForm.controls['result'].reset('');
    this.achievementForm.get('fromdate')?.enable()
    this.achievementForm.get('todate')?.enable()
    this.achievementForm.get('venue')?.enable()
    this.achievementForm.get('age_category')?.enable();
    this.achievementForm.updateValueAndValidity();
    if (event === 'International') {
      this.showCategory = true;
      this.getTournamentCategoryList(event);
      this.eventListData = [];
      this.achievementForm.controls['category']?.reset('');
      this.achievementForm.controls['event_id']?.reset('');
      this.achievementForm.get('tournament')?.reset('')
      this.achievementForm.get('age_category')?.reset('')
      this.achievementForm.get('fromdate')?.reset('')
      this.achievementForm.get('todate')?.reset('')
      this.achievementForm.get('venue')?.reset('');
    } else if (event === 'National') {
      this.showCategory = true;
      this.getTournamentCategoryList(event);
      this.eventListData = [];
      this.achievementForm.controls['event_id']?.reset('');
      this.achievementForm.get('tournament')?.reset('')
      this.achievementForm.get('fromdate')?.reset('')
      this.achievementForm.get('todate')?.reset('')
      this.achievementForm.get('venue')?.reset('')
      this.achievementForm.get('age_category')?.reset('');
      this.getState();
    } else if (event === 'State') {
      this.showCategory = false;
      // this.getEventdetailSportwise(JSON.parse(localStorage.getItem('sessiondata')!)?.profileData?.sport_id)
      this.getEventdetailSportwise(this.athleteProfileData?.personalInfo?.sport_detail_id)
      this.achievementForm.controls['category']?.reset('');
      this.achievementForm.controls['category']?.clearValidators();
      this.achievementForm.controls['category']?.updateValueAndValidity();
      this.achievementForm.controls['tournament']?.reset('');
      this.achievementForm.get('age_category')?.reset('')
      this.achievementForm.get('fromdate')?.reset('')
      this.achievementForm.get('todate')?.reset('')
      this.achievementForm.get('venue')?.reset('')
    } else if (event === 'District') {
      this.showCategory = false;
      // this.getEventdetailSportwise(JSON.parse(localStorage.getItem('sessiondata')!)?.profileData?.sport_id)
      this.getEventdetailSportwise(this.athleteProfileData?.personalInfo?.sport_detail_id)
      this.achievementForm.controls['category']?.reset('');
      this.achievementForm.controls['category']?.clearValidators();
      this.achievementForm.controls['category']?.updateValueAndValidity();
      this.achievementForm.controls['tournament']?.reset('');
      this.achievementForm.get('age_category')?.reset('')
      this.achievementForm.get('fromdate')?.reset('')
      this.achievementForm.get('todate')?.reset('')
      this.achievementForm.get('venue')?.reset('')
    }
  }
  getEventdetailSportwise(sport_id: number) {
    this.loader = true;
    this.eventListData = [];
    this.tournamentService.GetEventdetailSportwise(sport_id).subscribe({
      next: (response: any) => {
        this.loader = false;
        if (response.length > 0) {

          if (this.athleteProfileData?.personalInfo?.gender === 'M') {
            this.athleteProfileData.personalInfo.genderId = 1
          } else {
            this.athleteProfileData.personalInfo.genderId = 2
          }
          const personalInfo = this.athleteProfileData?.personalInfo
          const filterSportData = response.filter((item: any) => {
            if ((item.gender_id === personalInfo?.genderId || item.gender_id === 3)) {
              return item
            }
          })
          this.eventListData = filterSportData;
        } else {
          this.swalAlert('warning', 'Event list not available!');
          this.achievementForm.get('event_id')?.reset('')
        }
      },
      error: (err) => {
        this.loader = false;
        console.error(err)
      }
    })
  }
  checkCategory() {
    if (this.achievementForm.value.level == '') {
      this.swalAlert('warning', 'Please select Level')
    }
  }
  categoryChange(event: any) {
    this.eventListData = []
    this.achievementForm.get('age_category')?.reset('');
    this.achievementForm.controls['position'].reset('');
    this.achievementForm.controls['result'].reset('');
    this.achievementForm.controls['event_id'].reset('');
    this.achievementForm.get('fromdate')?.reset('');
    this.achievementForm.get('todate')?.reset('');
    this.achievementForm.get('venue')?.reset('');
    this.achievementForm.get('represented')?.reset('');
    if (this.achievementForm.value.tournamentYear == ('')) {
      const swalConfirmbtn = this.swalAlert('warning', 'Please select tournament year');
      swalConfirmbtn.then(() => {
        this.achievementForm.controls['category']?.reset('');
      })

    } else {
      const categoryid = this.tournamentCategoryListData.filter((item: any) => item.tournament_calegory_name === event)[0].tournament_category_id;
      this.getMasterTournamentList(this.yearVal, categoryid)

    }
  }

  getMasterTournamentList(tyear: any, categoryId: number) {
    this.tournamentService.masterTournamentList(tyear, categoryId).subscribe({
      next: (response: any) => {
        if (response.length != 0) {
          this.tournamentListData = response;
        } else {
          this.swalAlert('warning', 'Tournament list not available');
          this.achievementForm.get('tournament')?.reset('')
        }
      },
      error: (err) => {

      }
    })
  }

  getTournamentCategoryList(level: any) {
    this.loader = true;
    this.tournamentCategoryListData = []
    this.tournamentService.tournamentCategoryListArgument(level).subscribe({
      next: (response: any) => {
        this.loader = false;
        if (response.length != 0) {
          this.tournamentCategoryListData = response;
          const sportid = Number(JSON.parse(localStorage.getItem('sessiondata')!)?.profileData?.sport_id)
          this.filterTournamentCategoryListData = response.filter((item: any) => item.sport_detail_id == 0 || item.sport_detail_id == sportid);
        } else {
          this.swalAlert('warning', 'Category type not available!')
        }
      },
      error: (err) => {
        this.loader = false;
        console.error(err)
      }
    })
  }
  checkTournament() {
    if (this.achievementForm.value.category == '') {
      this.swalAlert('warning', 'Please select category type')
    }
  }

  changeTournament(event: any) {
    this.achievementForm.controls['position'].reset('');
    this.achievementForm.controls['result'].reset('');
    this.achievementForm.controls['event_id'].reset('');
    this.achievementForm.get('represented')?.reset('');
    let tournamentFilterData = []
    tournamentFilterData = this.tournamentListData.filter((item: any) => item.tournament_detail_id == event.value)
    this.achievementForm.get('fromdate')?.setValue(tournamentFilterData[0]?.from_date)
    this.achievementForm.get('todate')?.setValue(tournamentFilterData[0]?.to_date)
    this.achievementForm.get('venue')?.setValue(tournamentFilterData[0]?.venue)
    this.achievementForm.get('age_category')?.setValue(tournamentFilterData[0]?.age_category);
    this.achievementForm.get('fromdate')?.disable()
    this.achievementForm.get('todate')?.disable()
    this.achievementForm.get('venue')?.disable()
    this.achievementForm.get('age_category')?.disable();
    this.getEventdetailTournamnetwise(tournamentFilterData[0].tournament_detail_id)
  }

  getEventdetailTournamnetwise(tournamentId: number) {
    this.loader = true;
    this.eventListData = []
    this.tournamentService.eventdetailTournamnetwise(tournamentId).subscribe({
      next: (response: any) => {
        this.loader = false;
        const userDiscipline = Number(this.userSesionData?.profileData?.sport_id)
        if (this.athleteProfileData?.personalInfo?.gender === 'M') {
          this.athleteProfileData.personalInfo.genderId = 1
        } else {
          this.athleteProfileData.personalInfo.genderId = 2
        }

        const personalInfo = this.athleteProfileData?.personalInfo
        const filterSportData = response.filter((item: any) => {
          if ((item.sport_id === personalInfo?.sport_detail_id)
            && (item.gender_id === personalInfo?.genderId || item.gender_id === 3)) {
            return item
          }
        })
        if (filterSportData.length > 0) {
          this.eventListData = filterSportData;
        } else {
          this.swalAlert('warning', 'Event list not available!');
          this.achievementForm.get('event_id')?.reset('')
        }
      },
      error: (err) => {
        this.loader = false
        console.error(err)
      }
    })
  }

  getState() {
    const appendData = [
      { state_name: 'India' },
      { state_name: 'CAG' },
      { state_name: 'RSPB' },
      { state_name: 'SSCB' },
      { state_name: 'Sports Authority of India' },
      { state_name: 'SPSPBSCB' },
      { state_name: 'OTHER' },
    ];
    this.loader = true
    this.sharableService.stateList().subscribe({
      next: (response) => {
        this.loader = false;
        this.stateListData = response;
        for (let i of appendData) {
          this.stateListData.push(i)
        }
      },
      error: (err) => {
        this.loader = false
        console.error(err);
      }
    });
  }

  fileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const extFile = this.getFileExtension(file);
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("path", "Athlete\\Achievement");
      formData.append("uploadType", "3")
      this.loader = true;
      this.sharableService.uploadFile(formData).subscribe({
        next: (response: any) => {
          this.loader = false;
          if (response.isUploaded == true) {
            this.swalAlert('success', 'Upload Successful!');
            this.document_pathUrl = response.filedataList[0].filePath;
            this.document_pathInput.nativeElement.value = null;
          } else {
            this.swalAlert('error', response.errMsg || 'Upload Failed! Please try again.');
          }
        },
        error: () => {
          this.loader = false;
          this.swalAlert('error', 'Upload Failed! Please try again.');
          console.error("error caught in upload file")
        }
      });
    }
    else {
      this.swalAlert('warning', 'Only jpg, jpeg, png or pdf file is allowed!');
    }
  }

  getFileExtension(file: any) {
    let fileIndex = file.name.lastIndexOf(".") + 1;
    let extFile = file.name.substr(fileIndex, file.name.length).toLowerCase();
    return extFile;
  }

  validateStartDate(){
    if(this.achievementForm.get('fromdate')?.getRawValue()==''){
      this.aletService.swalPopWarning('Please select start date')
    }        
  }

  save() {
    this.isSaveClicked = true;
    const player_detail_id = this.athleteProfileData?.personalInfo?.player_detail_id;
    let competitionName = '';
    let id = 0;
    if (this.achievementForm.valid && this.document_pathUrl != null) {
      if (this.achievementForm.getRawValue().category != "") {
        competitionName = this.tournamentListData.filter((item: any) => item.tournament_detail_id == this.achievementForm.value.tournament)[0].tournament_name
      } else {
        competitionName = this.achievementForm.value.tournament;
        this.achievementForm.get('category')?.clearValidators();
        this.achievementForm.get('category')?.updateValueAndValidity();
        this.achievementForm.value.tournament = 0;
      }

      this.loader = true
      this.tournamentService.SaveAthleteAchievementDetail(
        id, player_detail_id, this.achievementForm.value.event_id, this.achievementForm.value.represented,
        this.achievementForm.value.position, this.achievementForm.value.result, this.document_pathUrl,
        this.achievementForm.value.tournament, this.achievementForm.getRawValue().age_category, this.achievementForm.value.level,
        competitionName, this.datePipe.transform(this.achievementForm.getRawValue().fromdate, 'yyyy-MM-dd'),
        this.datePipe.transform(this.achievementForm.getRawValue().todate, 'yyyy-MM-dd'), this.achievementForm.getRawValue().venue
      ).subscribe({
        next: (response: any) => {
          this.loader = true;
          if (response) {
            if (response.value == 1) {
              this.swalAlert('success', 'Saved successfully!');
              this.activeModal.close(response);
            } else {
              this.swalAlert('error', response.messaage);
              this.loader = false;
            }
          } else {
            this.aletService.swalPopError('Something went wrong!');
            this.loader = false;
          }
        },
        error: (err) => {
          this.loader = false;
          console.error(err)
        }
      })

    } else {
      this.achievementForm.markAllAsTouched();
    }
  }
}