import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AthleteFormFiveDocumentsComponent } from '../athlete-form-five-documents/athlete-form-five-documents.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { athleteformfiveService } from 'src/app/_common/services/role-inner-pages-services/athlete-services/atheleteformfive.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { environment } from 'src/environments/environment';
import { PersonalDetailComponent } from '../personal-detail/personal-detail.component';
import { AthleteCommunicationAddressComponent } from '../athlete-communication-address/athlete-communication-address.component';

@Component({
  selector: 'app-athlete-form-five',
  templateUrl: './athlete-form-five.component.html',
  styleUrls: ['./athlete-form-five.component.css'],
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, LoaderComponent],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ],
})
export class AthleteFormFiveComponent implements OnInit {

  userDetails: any;
  formfive!: FormGroup;
  formfive5documentForm!: FormGroup;
  formToSave: Boolean = true;
  formsdocumentOpen: Boolean = false;
  competitonList: any = [];
  eventList: any = [];
  athleteMeritDetails: Array<IAthleteForm5MeritDetails> = [];
  loader: Boolean = false;
  formIdFromParent: any;
  filebaseUrl = environment.fileUrl;
  verifyconfirmModalRef: any
  missingFieldsMessage: string = '';
  missingFieledCom: string = '';

  constructor(
    public activeModal: NgbActiveModal, private _fb: FormBuilder, private _sharableService: SharableService, private _alertService: AlertService,
    private modalService: NgbModal, private _storageService: StorageService, private _athleteFromFiveService: athleteformfiveService
  ) { }

  @ViewChild('profileDetailMissingModal') verifyConfirmModal: any;

  ngOnInit() {
    this.userDetails = this._storageService.getUserDetails();
    this.createForm();
    this.getPlayerDetails();
  }

  createForm() {
    this.formfive = this._fb.group({
      nsrsid: [{ value: this.userDetails.nsrs_id, disabled: true }],
      form5Id: [this.formIdFromParent.data, Validators.required],
      fullName: ['', Validators.required],
      fatherFullName: [{ value: '', disabled: true }, Validators.required],
      player_detail_Id: ['', Validators.required],
      school_Uni: ['', Validators.required],
      school_Uni_Name: [''],
      competitionName: ['', Validators.required],
      competitionId: [0],
      represented_School: ['', Validators.required],
      venueName: ['', Validators.required],
      venueId: [0],
      eventName: ['', Validators.required],
      eventId: [0],
      comp_StartDate: ['', Validators.required],
      comp_EndDate: ['', Validators.required],
      position: ['', Validators.required],
      categoryName: ['', Validators.required],
      categoryId: [0],

      // playerDetailId:['',Validators.required],
      resident: [{ value: '', disabled: true }, Validators.required],

    })

    this.formfive5documentForm = this._fb.group({
      playerAadhar: ['', Validators.required],
      highSchoolMarkSheet: ['', Validators.required],
      interMarkSheet: ['', Validators.required],
      schoolCertificate: ['', Validators.required],
      degree: ['', Validators.required],
      positionCertificate: [''],
      kheloIndiaCertificate: ['', Validators.required],
      form5_Status: [0],
      form5Html: [''],
      form5DocPath: [''],
      eSignedBy: ['']
    })
  }

  schoolSelectionChange() {
    if (this.formfive.get('school_Uni')?.value == false) {
      this.formfive.get('school_Uni_Name')?.setValue('');
      this.formfive.get('school_Uni_Name')?.disable()
      this.formfive.get('school_Uni_Name')?.clearValidators();
      this.formfive.get('school_Uni_Name')?.updateValueAndValidity();
    }
    if (this.formfive.get('school_Uni')?.value == true) {
      this.formfive.get('school_Uni_Name')?.enable();
      this.formfive.get('school_Uni_Name')?.setValidators([Validators.required]);
      this.formfive.get('school_Uni_Name')?.updateValueAndValidity();
    }
  }



  getPlayerDetails() {
    this.loader = true;
    this._athleteFromFiveService.getPlayerDetails(this.userDetails.user_id, this.userDetails.role_id, this.formIdFromParent.data).subscribe({
      next: (res: any) => {
        this.loader = false;
        if (res?.length == 0) {
          this.formToSave = false;
        } else {
          this.getAthleteMeritData(res);
          // if(this.formIdFromParent.data==0){  //new form 
          // }else{ //in edit mode

          //   this.setFormcontrolValues(res)
          // }

        }


      },
      error: (err: any) => {
        this.loader = false;
      }
    })



    // https://digilocker.kheloindia.gov.in/api/v1/get/athlete/merit-certificate/info/WEAA061F03
  }

  getAthleteMeritData(respo: any) {
    var comp = new Set();
    this.loader = true;
    this._athleteFromFiveService.getGMSPlayerDetails(this.userDetails.nsrs_id).subscribe({
      next: (res: any) => {
        this.loader = false;
        if (res.status) {
          this.athleteMeritDetails = res.data
          if (this.athleteMeritDetails.length == 0) {
            this.getCompFormMaster(respo);

          } else {
            this.athleteMeritDetails.forEach((data: IAthleteForm5MeritDetails) => {
              comp.add(data.competition)
            })
            this.competitonList = Array.from(comp)
            this.getCompMaster(respo)
            // this.setFormcontrolValues(respo)
          }



        }
      },
      error: (err: any) => {
        this.loader = false;
        this.getCompFormMaster(respo);
      }
    })
  }

  getCompMaster(respo: any) {
    this.loader = true;
    this._athleteFromFiveService.getCompMaster().subscribe({
      next: (compres: any) => {
        this.loader = false;

        this.compMasterList = compres
        var comp = new Set();
        compres.filter((res: any) => {
          // if(res.start_Date.split('T')[0].split('-')[0]<=2020){
          comp.add(res.competition_Name)
          // }
        })
        var tempCompList: any = [] = this.competitonList
        this.competitonList = []
        for (let i of comp) {
          this.competitonList.push(i)
        }
        for (let i of tempCompList) {
          this.competitonList.push(i)
        }
        this.setFormcontrolValues(respo)
      },
      error: () => {
        this.loader = false;
        this._alertService.swalPopError('Competition List Failed.')
      }
    })
  }


  compMasterList: any;
  getCompFormMaster(respo: any) {
    this.loader = true;
    this._athleteFromFiveService.getCompMaster().subscribe({
      next: (compres: any) => {
        this.loader = false;

        this.compMasterList = compres
        var comp = new Set();
        compres.filter((res: any) => {
          comp.add(res.competition_Name)
        })
        this.competitonList = Array.from(comp)
        this.getEventMaster(respo);

      },
      error: () => {
        this.loader = false;
        this._alertService.swalPopError('Competition List Failed.')
      }
    })
  }


  closeModal() {
    this.modalService.dismissAll();
  }
  redirectToAthletProfile(value: string) {
    if (value === 'fatherName') {
      this.modalService.dismissAll();
      this.modalService.open(PersonalDetailComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
    }
    else if (value === 'Resident') {
      this.modalService.dismissAll();
      this.modalService.open(AthleteCommunicationAddressComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
    }

  }

  setFormcontrolValues(res: any) {

    let missingFields: string[] = [];
    this.missingFieledCom = '';

    if (!res[0].fatherFullName || res[0].fatherFullName.trim() === '') {
      missingFields.push('Father Name');
      if (!this.missingFieledCom) {
        this.missingFieledCom = 'fatherName';
      }
    }

    if (!res[0].resident || res[0].resident.trim() === '') {
      missingFields.push('Resident');
      if (!this.missingFieledCom) {
        this.missingFieledCom = 'Resident';
      }
    }



    if (missingFields.length > 0) {
      this.missingFieldsMessage = `Your ${missingFields.join(' and ')} ${missingFields.length === 1 ? 'is' : 'are'} missing. Please update ${missingFields.length === 1 ? 'it' : 'them'} from Athlete Profile!`;

      setTimeout(() => {
        this.verifyconfirmModalRef = this.modalService.open(this.verifyConfirmModal, {
          centered: true,
          size: 'md'
        });
      }, 500);
    }


    if (res[0].playerDetailId == this.userDetails.user_id && this.formIdFromParent.data == 0) {   //case of new form with formId=0
      // res[0].playerDetailId ? this.formfive.get("playerDetailId")?.setValue(res[0].playerDetailId) ? this.formfive.get("playerDetailId")?.setValue(res[0].playerDetailId) : this.formfive.get("playerDetailId")?.disable()  : this.formToSave=false
      res[0].playerDetailId ? this.formfive.get("player_detail_Id")?.setValue(res[0].playerDetailId) ? this.formfive.get("player_detail_Id")?.setValue(res[0].playerDetailId) : this.formfive.get("player_detail_Id")?.disable() : this.formToSave = false
      res[0].fullName ? this.formfive.get("fullName")?.setValue(res[0].fullName) ? this.formfive.get("fullName")?.setValue(res[0].fullName) : this.formfive.get("fullName")?.disable() : this.formToSave = false
      res[0].fatherFullName ? this.formfive.get("fatherFullName")?.setValue(res[0].fatherFullName) ? this.formfive.get("fatherFullName")?.setValue(res[0].fatherFullName) : this.formfive.get("fatherFullName")?.disable() : this.formToSave = false
      res[0].resident ? this.formfive.get("resident")?.setValue(res[0].resident) ? this.formfive.get("resident")?.setValue(res[0].resident) : this.formfive.get("resident")?.disable() : this.formToSave = false

      res[0].playerAadhar ? this.formfive5documentForm.get("playerAadhar")?.setValue(res[0].playerAadhar) ? this.formfive5documentForm.get("playerAadhar")?.setValue(res[0].playerAadhar) : this.formfive5documentForm.get("playerAadhar")?.disable() : this.formToSave = true
      res[0].highSchoolMarkSheet ? this.formfive5documentForm.get("highSchoolMarkSheet")?.setValue(res[0].highSchoolMarkSheet) ? this.formfive5documentForm.get("highSchoolMarkSheet")?.setValue(res[0].highSchoolMarkSheet) : this.formfive5documentForm.get("highSchoolMarkSheet")?.disable() : this.formToSave = true
      res[0].interMarkSheet ? this.formfive5documentForm.get("interMarkSheet")?.setValue(res[0].interMarkSheet) ? this.formfive5documentForm.get("interMarkSheet")?.setValue(res[0].interMarkSheet) : this.formfive5documentForm.get("interMarkSheet")?.disable() : this.formToSave = true
      res[0].schoolCertificate ? this.formfive5documentForm.get("schoolCertificate")?.setValue(res[0].schoolCertificate) ? this.formfive5documentForm.get("schoolCertificate")?.setValue(res[0].schoolCertificate) : this.formfive5documentForm.get("schoolCertificate")?.disable() : this.formToSave = true
      res[0].degree ? this.formfive5documentForm.get("degree")?.setValue(res[0].degree) ? this.formfive5documentForm.get("degree")?.setValue(res[0].degree) : this.formfive5documentForm.get("degree")?.disable() : this.formToSave = true
      res[0].positionCertificate ? this.formfive5documentForm.get("positionCertificate")?.setValue(res[0].positionCertificate) ? this.formfive5documentForm.get("positionCertificate")?.setValue(res[0].positionCertificate) : this.formfive5documentForm.get("positionCertificate")?.disable() : this.formToSave = true
      res[0].kheloIndiaCertificate ? this.formfive5documentForm.get("kheloIndiaCertificate")?.setValue(res[0].kheloIndiaCertificate) ? this.formfive.get("kheloIndiaCertificate")?.setValue(res[0].kheloIndiaCertificate) : this.formfive5documentForm.get("kheloIndiaCertificate")?.disable() : this.formToSave = true
      this.formfive.updateValueAndValidity();
    } else if (res[0].playerDetailId == this.userDetails.user_id && this.formIdFromParent.data > 0) { //case of edit of form
      // this.formToSave=false;

      res[0].playerDetailId ? this.formfive.get("player_detail_Id")?.setValue(res[0].playerDetailId) ? this.formfive.get("player_detail_Id")?.setValue(res[0].playerDetailId) : this.formfive.get("player_detail_Id")?.disable() : this.formToSave = false
      res[0].fullName ? this.formfive.get("fullName")?.setValue(res[0].fullName) ? this.formfive.get("fullName")?.setValue(res[0].fullName) : this.formfive.get("fullName")?.disable() : this.formToSave = false
      res[0].fatherFullName ? this.formfive.get("fatherFullName")?.setValue(res[0].fatherFullName) ? this.formfive.get("fatherFullName")?.setValue(res[0].fatherFullName) : this.formfive.get("fatherFullName")?.disable() : this.formToSave = false
      res[0].resident ? this.formfive.get("resident")?.setValue(res[0].resident) ? this.formfive.get("resident")?.setValue(res[0].resident) : this.formfive.get("resident")?.disable() : this.formToSave = false
      this.formfive.get("school_Uni")?.setValue(res[0].schoolUni)

      this.schoolSelectionChange();
      // by Rajesh res[0].schoolUniName ? this.formfive.get("school_Uni_Name")?.setValue(res[0].schoolUniName) ? this.formfive.get("school_Uni_Name")?.setValue(res[0].schoolUniName) : this.formfive.get("school_Uni_Name")?.disable() : this.formToSave=false
      res[0].schoolUniName ? this.formfive.get("school_Uni_Name")?.setValue(res[0].schoolUniName) ? this.formfive.get("school_Uni_Name")?.setValue(res[0].schoolUniName) : this.formfive.get("school_Uni_Name")?.enable() : this.formToSave = false
      res[0].representedSchool ? this.formfive.get("represented_School")?.setValue(res[0].representedSchool) ? this.formfive.get("represented_School")?.setValue(res[0].representedSchool) : this.formfive.get("represented_School")?.disable() : this.formToSave = false
      res[0].compStartDate ? this.formfive.get("compStartDate")?.setValue(res[0].compStartDate) ? this.formfive.get("compStartDate")?.setValue(res[0].compStartDate) : this.formfive.get("compStartDate")?.disable() : this.formToSave = false
      res[0].compEndDate ? this.formfive.get("compEndDate")?.setValue(res[0].compEndDate) ? this.formfive.get("compEndDate")?.setValue(res[0].compEndDate) : this.formfive.get("compEndDate")?.disable() : this.formToSave = false
      res[0].competitionName ? this.formfive.get("competitionName")?.setValue(res[0].competitionName) ? this.formfive.get("competitionName")?.setValue(res[0].competitionName) : this.formfive.get("competitionName")?.disable() : this.formToSave = false
      this.compChange()
      res[0].venueName ? this.formfive.get("venueName")?.setValue(res[0].venueName) ? this.formfive.get("venueName")?.setValue(res[0].venueName) : this.formfive.get("venueName")?.disable() : this.formToSave = false
      res[0].categoryName ? this.formfive.get("categoryName")?.setValue(res[0].categoryName) ? this.formfive.get("categoryName")?.setValue(res[0].categoryName) : this.formfive.get("categoryName")?.disable() : this.formToSave = false

      res[0].eventName ? this.formfive.get("eventName")?.setValue(res[0].eventName) ? this.formfive.get("eventName")?.setValue(res[0].eventName) : this.formfive.get("eventName")?.disable() : this.formToSave = false
      res[0].position ? this.formfive.get("position")?.setValue(res[0].position) ? this.formfive.get("position")?.setValue(res[0].position) : this.formfive.get("position")?.disable() : this.formToSave = false
      this.eventChange();

      res[0].playerAadhar ? this.formfive5documentForm.get("playerAadhar")?.setValue(res[0].playerAadhar) ? this.formfive5documentForm.get("playerAadhar")?.setValue(res[0].playerAadhar) : this.formfive5documentForm.get("playerAadhar")?.disable() : this.formToSave = false
      res[0].highSchoolMarkSheet ? this.formfive5documentForm.get("highSchoolMarkSheet")?.setValue(res[0].highSchoolMarkSheet) ? this.formfive5documentForm.get("highSchoolMarkSheet")?.setValue(res[0].highSchoolMarkSheet) : this.formfive5documentForm.get("highSchoolMarkSheet")?.disable() : this.formToSave = false
      res[0].interMarkSheet ? this.formfive5documentForm.get("interMarkSheet")?.setValue(res[0].interMarkSheet) ? this.formfive5documentForm.get("interMarkSheet")?.setValue(res[0].interMarkSheet) : this.formfive5documentForm.get("interMarkSheet")?.disable() : this.formToSave = false
      res[0].schoolCertificate ? this.formfive5documentForm.get("schoolCertificate")?.setValue(res[0].schoolCertificate) ? this.formfive5documentForm.get("schoolCertificate")?.setValue(res[0].schoolCertificate) : this.formfive5documentForm.get("schoolCertificate")?.disable() : this.formToSave = false
      res[0].degree ? this.formfive5documentForm.get("degree")?.setValue(res[0].degree) ? this.formfive5documentForm.get("degree")?.setValue(res[0].degree) : this.formfive5documentForm.get("degree")?.disable() : this.formToSave = false
      res[0].positionCertificate ? this.formfive5documentForm.get("positionCertificate")?.setValue(res[0].positionCertificate) ? this.formfive5documentForm.get("positionCertificate")?.setValue(res[0].positionCertificate) : this.formfive5documentForm.get("positionCertificate")?.disable() : this.formToSave = false
      res[0].kheloIndiaCertificate ? this.formfive5documentForm.get("kheloIndiaCertificate")?.setValue(res[0].kheloIndiaCertificate) ? this.formfive.get("kheloIndiaCertificate")?.setValue(res[0].kheloIndiaCertificate) : this.formfive5documentForm.get("kheloIndiaCertificate")?.disable() : this.formToSave = false
      res[0].form5Html ? this.formfive5documentForm.get("form5Html")?.setValue(res[0].form5Html) ? this.formfive5documentForm.get("form5Html")?.setValue(res[0].form5Html) : this.formfive5documentForm.get("form5Html")?.disable() : this.formToSave = false
      res[0].form5DocPath ? this.formfive5documentForm.get("form5DocPath")?.setValue(res[0].form5DocPath) ? this.formfive.get("form5DocPath")?.setValue(res[0].form5DocPath) : this.formfive5documentForm.get("form5DocPath")?.disable() : this.formToSave = false
      res[0].eSignedBy ? this.formfive5documentForm.get("eSignedBy")?.setValue(res[0].eSignedBy) ? this.formfive5documentForm.get("eSignedBy")?.setValue(res[0].eSignedBy) : this.formfive5documentForm.get("eSignedBy")?.disable() : this.formToSave = false

      if (res[0].form5Status == 0) {
        this.formToSave = true;
        // const formFiveControlsToEnable = ['school_Uni', 'school_Uni_Name', 'represented_School','competitionName','categoryName','eventName','position']; by Rajesh
        const formFiveControlsToEnable = ['school_Uni', 'represented_School', 'competitionName', 'categoryName', 'eventName', 'position'];

        formFiveControlsToEnable.forEach(controlName => {
          this.formfive.get(`${controlName}`)?.enable();
        });
        this.formfive.updateValueAndValidity();
      }

    }

  }

  compChange() {
    if (this.athleteMeritDetails.length == 0) {

      this.compMasterList.filter((res: any) => {
        if (res.competition_Name.toLowerCase().trim() == this.formfive.get('competitionName')?.value.toLowerCase().trim()) {

          res.venue_Name ? this.formfive.get('venueName')?.setValue(res.venue_Name) ? this.formfive.get('venueName')?.setValue(res.venue_Name) : this.formfive.get('venueName')?.disable() : '';
          res.start_Date ? this.formfive.get('comp_StartDate')?.setValue(new Date(res.start_Date)) ? this.formfive.get('comp_StartDate')?.setValue(new Date(res.start_Date)) : this.formfive.get('comp_StartDate')?.disable() : '';
          res.end_date ? this.formfive.get('comp_EndDate')?.setValue(new Date(res.end_date)) ? this.formfive.get('comp_EndDate')?.setValue(new Date(res.end_date)) : this.formfive.get('comp_EndDate')?.disable() : '';
        }
      })
    } else {
      var eventName = new Set();
      this.athleteMeritDetails.filter((res: IAthleteForm5MeritDetails) => {
        if (res.competition == this.formfive.get('competitionName')?.value) {
          res.state_name ? this.formfive.get('represented_School')?.setValue(res.state_name) ? this.formfive.get('represented_School')?.setValue(res.state_name) : this.formfive.get('represented_School')?.disable() : '';
          res.venue ? this.formfive.get('venueName')?.setValue(res.venue) ? this.formfive.get('venueName')?.setValue(res.venue) : this.formfive.get('venueName')?.disable() : '';
          res.start_date ? this.formfive.get('comp_StartDate')?.setValue(this.parseDateString(res.start_date)) ? this.formfive.get('comp_StartDate')?.setValue(this.parseDateString(res.start_date)) : this.formfive.get('comp_StartDate')?.disable() : '';
          res.end_date ? this.formfive.get('comp_EndDate')?.setValue(this.parseDateString(res.end_date)) ? this.formfive.get('comp_EndDate')?.setValue(this.parseDateString(res.end_date)) : this.formfive.get('comp_EndDate')?.disable() : '';
          this.formfive.updateValueAndValidity();
          eventName.add(res.event_name)
        }
      })
      this.formfive.get('position')?.setValue('');
      this.eventList = Array.from(eventName)
      //if event doesnot bind from athlete merit data then add event master in event dropdown
      if (this.eventList.length == 0) {
        this.formfive.get('eventName')?.enable();
        this.formfive.get('eventName')?.setValue('');
        this.getEventMaster();
        this.compMasterList.filter((comp: any) => {
          if (comp.competition_Name.toLowerCase().trim() == this.formfive.get('competitionName')?.value.toLowerCase().trim()) {

            // this.formfive.get('represented_School')?.enable();
            // this.formfive.get('represented_School')?.setValue('');
            this.formfive.get('position')?.enable();
            this.formfive.get('position')?.setValue('');
            // res.state_name ? this.formfive.get('represented_School')?.setValue(res.state_name) ? this.formfive.get('represented_School')?.setValue(res.state_name) : this.formfive.get('represented_School')?.disable() : '' ;
            comp.venue_Name ? this.formfive.get('venueName')?.setValue(comp.venue_Name) ? this.formfive.get('venueName')?.setValue(comp.venue_Name) : this.formfive.get('venueName')?.disable() : '';
            comp.start_Date ? this.formfive.get('comp_StartDate')?.setValue(this.parseDateString(this.dateConverter(comp.start_Date.split('T')[0]))) ? this.formfive.get('comp_StartDate')?.setValue(this.parseDateString(this.dateConverter(comp.start_Date.split('T')[0]))) : this.formfive.get('comp_StartDate')?.disable() : '';
            comp.end_date ? this.formfive.get('comp_EndDate')?.setValue(this.parseDateString(this.dateConverter(comp.end_date.split('T')[0]))) ? this.formfive.get('comp_EndDate')?.setValue(this.parseDateString(this.dateConverter(comp.end_date.split('T')[0]))) : this.formfive.get('comp_EndDate')?.disable() : '';
            this.formfive.updateValueAndValidity();
          }
        })
      }
    }
  }

  dateConverter(date: any) {
    return date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0];
  }

  getEventMaster(respo?: any) {
    this.loader = true;
    this._athleteFromFiveService.getEventMaster(this._storageService.getUserProfileDataFromSessionRes().profileData.sport_id).subscribe({
      next: (eventRes: any) => {
        this.loader = false;
        var eventName = new Set();
        if (this._storageService.getUserProfileDataFromSessionRes().profileData.gender.toLowerCase().trim() == 'MALE'.toLowerCase().trim()) {
          eventRes.filter((event: any) => {
            if (event.gender_category.toLowerCase().trim() == 'MALE'.toLowerCase().trim() || event.gender_category.toLowerCase().trim() == 'Mixed'.toLowerCase().trim()) {
              eventName.add(event.event_name)
            }
          })
        } else if (this._storageService.getUserProfileDataFromSessionRes().profileData.gender.toLowerCase().trim() == 'female'.toLowerCase().trim()) {
          eventRes.filter((event: any) => {
            if (event.gender_category.toLowerCase().trim() == 'Female'.toLowerCase().trim() || event.gender_category.toLowerCase().trim() == 'Mixed'.toLowerCase().trim()) {
              eventName.add(event.event_name)
            }
          })
        }

        this.eventList = Array.from(eventName)
        if (respo) {

          this.setFormcontrolValues(respo)

        }
      },
      error: () => {
        this.loader = false
      }
    })
  }

  eventChange() {
    if (this.athleteMeritDetails.length == 0) {

    } else {
      this.athleteMeritDetails.filter((res: IAthleteForm5MeritDetails) => {
        if (res.competition == this.formfive.get('competitionName')?.value && res.event_name == this.formfive.get('eventName')?.value) {
          res.position ? this.formfive.get('position')?.setValue(res.position) ? this.formfive.get('position')?.setValue(res.position) : this.formfive.get('position')?.disable() : '';
        }
      })
    }
  }

  parseDateString(dateString: string): Date | null {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);  // month is 0-indexed in JavaScript
  }

  openFormDocuments() {

    if (this.formfive.valid) {
      // if(this.formfive.get('school_Uni')?.value==true )
      this.formsdocumentOpen = true;
    }

    // this.modalService.open(
    //   AthleteFormFiveDocumentsComponent,
    //   { size:'xl', centered:true, backdrop: 'static', keyboard: false }
    // )
  }

  getPayload() {
    var payload = {
      form5Id: this.formfive.get('form5Id')?.value,
      fullName: this.formfive.get('fullName')?.value,
      fatherFullName: this.formfive.get('fatherFullName')?.value,
      player_detail_Id: this.formfive.get('player_detail_Id')?.value,
      school_Uni: this.formfive.get('school_Uni')?.value,
      school_Uni_Name: this.formfive.get('school_Uni_Name')?.value,
      competitionName: this.formfive.get('competitionName')?.value,
      competitionId: this.formfive.get('competitionId')?.value,
      represented_School: this.formfive.get('represented_School')?.value,
      venueName: this.formfive.get('venueName')?.value,
      venueId: this.formfive.get('venueId')?.value,
      eventName: this.formfive.get('eventName')?.value,
      eventId: this.formfive.get('eventId')?.value,
      comp_StartDate: this.formfive.get('comp_StartDate')?.value,
      comp_EndDate: this.formfive.get('comp_EndDate')?.value,
      position: this.formfive.get('position')?.value,
      categoryName: this.formfive.get('categoryName')?.value,
      categoryId: this.formfive.get('categoryId')?.value,
    }

    return payload;
  }

  saveCompleteForm() {

    this.formfive5documentForm.get('form5_Status')?.setValue(10);

    if (!this.formfive5documentForm.valid) {
      this._alertService.swalPopWarning('All Documents Required');
      return
    }


    if (this.formfive.valid && this.formfive5documentForm.valid) {
      this.loader = true

      var payload = {
        ...this.formfive.getRawValue(),
        ...this.formfive5documentForm.getRawValue()
      };


      var payloadtoSave = {
        ...this.getPayload(),
        ...this.formfive5documentForm.getRawValue()
      }


      // var payload={"nsrsid":null,"playerDetailId":95545,"fullName":"Anbless Godwin Nadarajan ","fatherFullName":"T Nadarajan","resident":"Thachanpokkuvilai, Thozhicode , Thachanpokkuvilai, Thozhicode , 0, 564, 31, 629193","player_detail_Id":95545,"school_Uni":true,"school_Uni_Name":"kjhj","competitionName":"Khelo India Youth Games 2023","competitionId":0,"represented_School":"Tamil Nadu","venueName":"Tamil Nadu","venueId":0,"eventName":"Individual Epee","eventId":0,"categoryName":"Team","categoryId":0,"comp_StartDate":"2024-01-17T18:30:00.000Z","comp_EndDate":"2024-01-30T18:30:00.000Z","position":"FIRST","playerAadhar":"documents/Tempimage\\b842ed29-e07c-410f-9637-69bacef06cd8.png","highSchoolMarkSheet":"documents/Tempimage\\a269c6d4-b6ff-4fc1-b9cb-3de94d78bfb5.png","interMarkSheet":"documents/Tempimage\\b66245a9-06c7-41f9-af8c-5f85d19f2580.png","schoolCertificate":"documents/Tempimage\\6ed43fd3-4888-49df-b08b-76988dce9e49.png","degree":"documents/Tempimage\\4dab90af-83f3-4fec-ab51-b426d6a840f5.png","positionCertificate":"documents/Tempimage\\e69313cd-5ed7-4337-9ecb-65be997d0c0d.png","kheloIndiaCertificate":"documents/Tempimage\\6841dce6-d028-4eea-9ade-de711726c8e7.png","form5_Status":10,"form5Html":"","form5DocPath":"","eSignedBy":""}



      this._athleteFromFiveService.saveForm5Details(payloadtoSave).subscribe({
        next: (res: any) => {
          this.loader = false;
          if (res.status) {
            this._alertService.swalPopSuccess("Saved Succesfully.")
            this.activeModal.close(true)
          } else {
            this._alertService.swalPopError(res.error)
          }
        },
        error: () => {
          this._alertService.swalPopError('Something Went Wrong.Please Try Again!')
          this.loader = false;
        }
      })
    }
  }

  saveAsDraft() {

    this.formfive5documentForm.get('form5_Status')?.setValue(0);
    var payload = {
      ...this.formfive.getRawValue(),
      ...this.formfive5documentForm.getRawValue()
    };


    var payloadtoSave = {
      ...this.getPayload(),
      ...this.formfive5documentForm.getRawValue()
    }
    // School/University is YES then call
    if (this.formfive.get('school_Uni')?.value == true && this.formfive.get('school_Uni_Name')?.getRawValue() != '' && this.formfive.get('competitionName')?.valid) {
      this.commonSaveForm5Details(payloadtoSave)
    }
    // School/University is NO then call
    if (this.formfive.get('school_Uni')?.value == false && this.formfive.get('competitionName')?.valid) {
      this.commonSaveForm5Details(payloadtoSave)
    }

  }

  commonSaveForm5Details(payloadtoSave: any) {
    this.loader = true;
    this._athleteFromFiveService.saveForm5Details(payloadtoSave).subscribe({
      next: (res: any) => {
        this.loader = false;
        if (res.status) {
          this._alertService.swalPopSuccess("Drafted Succesfully.")
          this.activeModal.close(true)
        } else {
          this._alertService.swalPopError(res.error)
        }
      },
      error: (err: any) => {
        this.loader = false;
        this._alertService.swalPopError('Something Went Wrong. Plz Try Again.')
      }
    })
  }


  verifyDocumentFileExtension(files: any) {
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile
  }


  uploadfile(files: any, formControlName: any) {
    if (files.length === 0) {

      return;
    } else {
      var extFile = this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == 'pdf') {
        this.loader = true;
        // if (extFile == "pdf") {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("file", files[i], files[i].name);
          formData.append("path", "documents/Form5")
          formData.append("uploadType", "3")
          // formData.append("academy_detail_id",this.academy_detail_id)
        }
        this._sharableService.uploadFile(formData).subscribe({
          next: (res: any) => {
            this.loader = false;
            if (res.isUploaded == true) {
              this._alertService.swalPopSuccess('File Uploaded.')
              this.formfive5documentForm.get(`${formControlName}`)?.setValue(res.filedataList[0].filePath)
            } else {
              this._alertService.swalPopError('File Uploading Failed!')
            }
          },
          error: () => {
            this.loader = false;

            this._alertService.swalPopError('File Uploading Failed!')
          }
        })
      }
      else {
        this.formfive5documentForm.get(`${formControlName}`)?.setValue('')
        this._alertService.swalPopError('Only jpg, jpeg, pdf, png format allowed.')
      }


    }
  }

}


export interface IAthleteForm5MeritDetails {
  name: string
  mobile: string
  gender: string
  dob: string
  state_name: string
  sport_name: string
  event_name: string
  position: string
  cert_number: string
  competition: string
  start_date: string
  end_date: string
  venue: string
}
