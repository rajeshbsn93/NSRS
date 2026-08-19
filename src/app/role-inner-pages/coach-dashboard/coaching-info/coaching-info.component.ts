import { CommonModule } from "@angular/common";
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { CoachCurrentPreviousAthleteComponent } from "../coach-modals/coach-current-previous-athlete/coach-current-previous-athlete.component";
import { CoachTrainingInfoEntity, CoachingInfoService, OfficialCurrentTrainingInfosEntity, OfficialPreviousTrainingInfosEntity } from "src/app/_common/services/role-inner-pages-services/coach-services/coaching-info.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CommonSharableService, Official_Training_InfoEntity } from "src/app/_common/services/common-services/commonSharable.service";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { EditOfficialMappingDateComponent } from "../../modal-window/edit-official-mapping-date/edit-official-mapping-date.component";
import Swal from "sweetalert2";
import { first } from "rxjs";
import { PopupAthleteProfileComponent } from "src/app/standalone_components/modal-window/popup-athlete-profile/popup-athlete-profile.component";
import { CoachInformationActcComponent } from "../coach-information-actc/coach-information-actc.component";

@Component({
  selector: 'app-coaching-info',
  templateUrl: './coaching-info.component.html',
  styleUrls: ['./coaching-info.component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule,LoaderComponent ,CoachInformationActcComponent],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // DatePipe
  ]
})

export class CoachingInfoComponent implements OnInit {
  loader: boolean = false;
  loader2: boolean = false;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  athleteCurrentTableColumns: string[] = ['athlete_nsrs_id', 'athlete_name', 'period','trainingLevel', 'mappingType', 'status', 'action'];
  athleteHistoryTableColumns: string[] = ['athlete_name', 'AcademyName', 'AcademyType', 'period','trainingLevel', 'mappingType', 'status', 'action'];
  athleteAcademyTableColumns: string[] = ['academyName', 'period', 'weedOutDate', 'weedOutRemark'];
  athleteCurrentCoachingInfoData = new MatTableDataSource<OfficialCurrentTrainingInfosEntity>();
  athleteHistoryCoachingInfoData = new MatTableDataSource<OfficialPreviousTrainingInfosEntity>();
  academyData = new MatTableDataSource<Official_Training_InfoEntity>()
  academyDetails: any;
  @ViewChild('deleteModal') deleteModal: any;
  deleteModalRef: any;
  deleteRowData: any;
  @ViewChild('verifyModal') verifyModal: any;
  verifyModalRef: any;
  verifyModalRowData: any;
  userSessionData:any
  actcCheck:boolean = false;
  constructor(private storageService: StorageService, private modalService: NgbModal, private coachingInfoService: CoachingInfoService,
    private commmonSharableService: CommonSharableService, private alertService: AlertService) { }


  ngOnInit(): void {
    this.userSessionData = this.storageService.getUserProfileDataFromSessionRes();
    this.academyDetails = this.storageService.getAcademyDetails();
    this.getCoachTrainingInfo();
    this.getOfficial_Training_Info();

  }
  getCoachTrainingInfo() {
    this.loader = true;
    this.coachingInfoService.CoachTrainingInfo(this.academyDetails.user_id).subscribe({
      next: (response: CoachTrainingInfoEntity) => {
        this.loader = false;
        //console.log(response);
        this.athleteCurrentCoachingInfoData = new MatTableDataSource<OfficialCurrentTrainingInfosEntity>(response.officialCurrentTrainingInfos);
        this.athleteHistoryCoachingInfoData = new MatTableDataSource<OfficialPreviousTrainingInfosEntity>(response.officialPreviousTrainingInfos);
        setTimeout(() => {
          this.athleteCurrentCoachingInfoData.paginator = this.paginator.toArray()[0];
          this.athleteHistoryCoachingInfoData.paginator = this.paginator.toArray()[1];
          this.athleteCurrentCoachingInfoData.sort = this.sort.toArray()[0];
          this.athleteHistoryCoachingInfoData.sort = this.sort.toArray()[1]
        }, 200)
      },
      error: (err) => {
        this.loader = false;
        console.error(err)
      }
    })
  }
  getOfficial_Training_Info() {
    this.loader2 = true;
    this.commmonSharableService.Official_Training_Info_Academy(this.academyDetails.user_id).pipe(first()).subscribe({
      next: (response) => {
        this.loader2 = false;
        this.academyData = new MatTableDataSource<Official_Training_InfoEntity>(response);
        setTimeout(() => {
          this.academyData.paginator = this.paginator.toArray()[2];
          this.academyData.sort = this.sort.toArray()[2]
        }, 200)
      },
      error: (err) => {
        console.error(err);
        this.loader2 = false;
      }
    })
  }

  AddAthlete() {
    const modalRef = this.modalService.open(CoachCurrentPreviousAthleteComponent, { size: 'xl', centered: true })
    modalRef.result.then((thenRes) => {
      if (thenRes) {
        this.getCoachTrainingInfo()
      }
    })
    .catch((res)=>{})
  }
  deleteRow(rowData: any) {
    //console.log(rowData)
    this.deleteRowData = rowData
    this.deleteModalRef = this.modalService.open(this.deleteModal, { size: 'md', centered: true })
  }
  confirmDeleteCoach() {
    this.loader = true;
    this.commmonSharableService.DeleteOfficialOtherCoachingInformation(this.deleteRowData.mapId, this.academyDetails.role_id).subscribe({
      next: (response) => {
        this.loader = false;
        if (response) {
          Swal.fire({
            icon: 'success',
            text: 'Delete Successfully!'
          });
          this.deleteModalRef.close();
          this.getCoachTrainingInfo();
        }
      },
      error: (err) => {
        this.loader = false;
        console.error(err)
      }
    })
  }

  verify(rowData: any) {
    //console.log(rowData)
    this.verifyModalRowData = rowData
    this.verifyModalRef = this.modalService.open(this.verifyModal, { size: 'md', centered: true })
  }
  confirmVerify() {
    this.loader = true;
    const mappingType = 2
    const roleId = this.academyDetails.role_id
    this.commmonSharableService.verifyOtherOfficialMapping(mappingType, roleId, this.verifyModalRowData.mapId).subscribe({
      next: (response) => {
        if (response) {
          this.loader = false;
          this.alertService.swalPopSuccess('Mapping Verified Successfully!');
          this.verifyModalRef.close();
          this.getCoachTrainingInfo();
        }
      },
      error: (err) => {
        this.loader = false;
        console.error(err);
      }
    })
  }

  // checkEditDate(row:any){
  //     // console.log(row)
  //     var checkText=row.period.split('-')[1].trim()
  //     if(checkText.toLowerCase()=='present' && row.status==true  && row.mappingType.trim().toLowerCase()=='manual'){
  //       return `<i class="fas fa-edit"></i>`
  //     }else{
  //       return ''
  //     }
  //   }

  editDate(row: any, checkType: string) {
    row.checkType = checkType
    //console.log(row);
    const modalRef = this.modalService.open(EditOfficialMappingDateComponent, { size: 'lg', centered: true })
    modalRef.componentInstance.rowData = row;
    modalRef.result.then((thenRes) => {
      if (thenRes == 2) {
        this.getCoachTrainingInfo();
      }
    })
  }



  openAthleteProfile(rowData: any) {
    const modalRef = this.modalService.open(PopupAthleteProfileComponent, {
      size: 'xl', centered: true, scrollable: true, modalDialogClass: 'customModalSizeLarge',
      backdrop: 'static', keyboard: false
    })
    modalRef.componentInstance.playerId = rowData.player_detail_id
    modalRef.componentInstance.roleId = this.academyDetails.role_id;
    // modalRef.componentInstance.playerId = '216912'
  }

  clickACTC(){
    this.actcCheck = true
  }
}
