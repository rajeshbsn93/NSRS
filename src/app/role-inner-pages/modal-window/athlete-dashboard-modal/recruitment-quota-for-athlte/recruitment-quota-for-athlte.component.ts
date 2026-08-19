import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CoachAchievementService, CoachExpNationalCampEntity } from "src/app/_common/services/role-inner-pages-services/coach-services/coach-achievement.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { AddEditRecruitmentQuotaForAthlteComponent } from "../add-edit-recruitment-quota-for-athlte/add-edit-recruitment-quota-for-athlte.component";
import { recruitmentSportQuotaService } from "src/app/_common/services/common-services/recruitmentSportQuota.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-recruitment-quota-for-athlte',
  templateUrl: './recruitment-quota-for-athlte.component.html',
  styleUrls: ['./recruitment-quota-for-athlte.component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule, LoaderComponent, ReactiveFormsModule, FormsModule],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ]
})
export class RecruitmentQuotaForAthlteComponent implements OnInit {

  loader: boolean = false;
  userDetails: any;
  @ViewChild('deleteExperience') deleteExperience: any;
  @ViewChild('participateModal') participateModal: any;
  deleteExperienceModalRef: any
  participateModalRef: any
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  recruitmentSportsQuotaData = new MatTableDataSource<CoachExpNationalCampEntity>();
  experienceTableColumns: string[] = ['sl', 'employeName', 'typeOfGoverment', 'dateOfJoining', 'dateOfRelieving', 'postTimeService', 'gradePay', 'currentPost', 'currentGrade', 'action'];

  deleteRowData: any;
  participateValue: any;

  selectedValue: boolean | null = null;
  pendingValue: boolean | null = null;
  radioDisabled = false;
  dbName = 'MyNativeDB';
  dbVersion = 1;
  db!: IDBDatabase;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder,
    private recruitmentQuotaService: recruitmentSportQuotaService, private storageService: StorageService,
    private alertService: AlertService,
    private _routs: Router,
    private modalService: NgbModal) {
   
     }

  ngOnInit(): void {
    this.userDetails = this.storageService.getUserDetails();
    this.getRecruitmentDataList()
  }

  

  getRecruitmentDataList() {
    this.loader = true;
    this.recruitmentQuotaService.getRecruitmentSportsQuotaList(this.userDetails.user_id, this.userDetails.nsrs_id, this.userDetails.role_id).subscribe({
      next: (response: any) => {


        if (response.length == 0) {
          this.radioDisabled = true;
        } else if (response.length > 0) {
          this.radioDisabled = false
          if (response[0].is_building_Sport_EcoSystem_Participate != null) {
            this.selectedValue = response[0].is_building_Sport_EcoSystem_Participate
            this.radioDisabled = true;
          }
        }

        this.loader = false;
        this.recruitmentSportsQuotaData = new MatTableDataSource<CoachExpNationalCampEntity>(response);
        this.recruitmentSportsQuotaData.paginator = this.paginator
        this.recruitmentSportsQuotaData.sort = this.sort
      },
      error: (err) => {
        this.loader = false
        console.error(err)
      }
    })
  }


  deleteRow(rowData: any) {
    this.deleteRowData = rowData;
    this.deleteExperienceModalRef = this.modalService.open(this.deleteExperience, { centered: true })
  }

  confirmDelete() {
    this.loader = true;
    this.recruitmentQuotaService.deleteRecruitmentData(this.userDetails.user_id, this.userDetails.nsrs_id, this.userDetails.role_id, this.deleteRowData.id).subscribe({
      next: (response) => {
        this.loader = false;
        if (response) {
          this.getRecruitmentDataList();
          this.deleteExperienceModalRef.close();
          this.alertService.swalPopSuccess('Deleted Successfully!');
        }
      },
      error: (err) => {
        this.loader = false;
        console.error(err)
      }
    })
  }

  onRadioChange(value: boolean): void {


    this.pendingValue = value;
    this.selectedValue = value;
    setTimeout(() => {
      this.participateModalRef = this.modalService.open(this.participateModal, { centered: true })
    },);

  }

  confirmParticipate(): void {




    // this.selectedValue = false;
    this.loader = true;
    this.recruitmentQuotaService.updateRecruitmentparticipate(this.userDetails.user_id, this.userDetails.nsrs_id, this.userDetails.role_id, Boolean(this.pendingValue)).subscribe({
      next: (response) => {
        this.loader = false;
        if (response) {
          this.radioDisabled = true;
          this.participateModalRef.close();
          this.alertService.swalPopSuccess('Updated Successfully!');
        }
      },
      error: (err) => {
        this.loader = false;
        console.error(err);
      },
    });
  }

  addEdit(data: any) {
    const modalRef = this.modalService.open(AddEditRecruitmentQuotaForAthlteComponent, { centered: true, size: 'xl', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.editData = data;
    modalRef.result.then((thenRes) => {
      if (thenRes) {
        this.getRecruitmentDataList();
      }
    }).catch(() => { })
  }

  navigateToAchievement() {
    this._routs.navigate(['athlete-achievement']);
  }

  cancelParticipate(): void {
    this.pendingValue = null;
    this.selectedValue = null;
    this.participateModalRef.close();
  }

}
