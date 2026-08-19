import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { CoachTrainingInfoEntity, CoachingInfoService, OfficialCurrentTrainingInfosEntity, OfficialPreviousTrainingInfosEntity } from "src/app/_common/services/role-inner-pages-services/coach-services/coaching-info.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CommonSharableService, Official_Training_InfoEntity } from "src/app/_common/services/common-services/commonSharable.service";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { first } from "rxjs";
import { CoachPopupProfileTrainingInfoAcademyTabComponent } from "../coach-popup-profile-training-info-academy-tab/coach-popup-profile-training-info-academy-tab.component";

@Component({
  selector: 'app-coach-popup-pfrofile-training-info',
  templateUrl: './coach-popup-pfrofile-training-info.component.html',
  styleUrls: ['./coach-popup-pfrofile-training-info.component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule, LoaderComponent],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // DatePipe
  ]
})

export class CoachPopupProfileTrainingInfoComponent implements OnInit {
  loader: boolean = false;
  loader2: boolean = false;
  @Input() officialId: any
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChild('deleteExperience') deleteExperience:any;
  athleteCurrentTableColumns: string[] = ['athlete_nsrs_id', 'athlete_name', 'period', 'mappingType', 'status'];
  athleteHistoryTableColumns: string[] = ['athlete_name', 'AcademyName', 'AcademyType', 'period', 'mappingType', 'status'];
  athleteAcademyTableColumns: string[] = ['academyName', 'period', 'weedOutDate', 'weedOutRemark','action'];
  athleteCurrentCoachingInfoData = new MatTableDataSource<OfficialCurrentTrainingInfosEntity>();
  athleteHistoryCoachingInfoData = new MatTableDataSource<OfficialPreviousTrainingInfosEntity>();
  academyData = new MatTableDataSource<Official_Training_InfoEntity>()
  deleteExperienceModalRef:any
 deleteRowData:any;
  userDetails: any;
  addEditDelPermission:any
  constructor(private coachingInfoService: CoachingInfoService,private alertService: AlertService,
  private storageService: StorageService,
    private modalService: NgbModal) { }


  ngOnInit(): void {
       this.userDetails = this.storageService.getUserDetails();
    this.getCoachTrainingInfo();
    this.getOfficial_Training_Info();

  }
  getCoachTrainingInfo() {
    this.loader = true;
    this.coachingInfoService.CoachTrainingInfo(this.officialId).subscribe({
      next: (response: CoachTrainingInfoEntity) => {
        this.loader = false;
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
    this.coachingInfoService.getOfficialTrainingInfo(this.userDetails?.user_id,this.officialId,this.userDetails.role_id).subscribe({
      next: (response) => {
        this.loader2 = false;
        this.addEditDelPermission=response?.officialTrainingMaping[0]
        this.academyData = new MatTableDataSource<Official_Training_InfoEntity>(response?.officialTraininginfo);
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


  addEdit(data: any) {
    const modalRef = this.modalService.open(CoachPopupProfileTrainingInfoAcademyTabComponent, { centered: true, size: 'xl', backdrop: 'static', keyboard: false });
     modalRef.componentInstance.editData = data;
     modalRef.componentInstance.coachTrainingId = data ? data.coach_training_Id :0
      modalRef.componentInstance.officialId = this.officialId;
    modalRef.result.then((thenRes) => {
      if (thenRes) {
        this.getOfficial_Training_Info()
      }
    }).catch(() => { })
  }




   deleteRow(rowData:any){
        this.deleteRowData = rowData;
        this.deleteExperienceModalRef = this.modalService.open(this.deleteExperience, {centered:true})

    }	

     confirmDelete(){
        this.loader = true;
        this.coachingInfoService.deleteOfficialTraining(this.userDetails?.user_id,this.officialId,this.deleteRowData?.coach_training_Id,this.userDetails.role_id ).subscribe({
            next:(response)=>{
                this.loader = false;
                if(response){
                    this.getOfficial_Training_Info();
                    this.deleteExperienceModalRef.close();
                    this.alertService.swalPopSuccess('Deleted Successfully!');
                }
            },
            error:(err)=>{
                this.loader = false;
                console.error(err)
            }
        })
    }

}
