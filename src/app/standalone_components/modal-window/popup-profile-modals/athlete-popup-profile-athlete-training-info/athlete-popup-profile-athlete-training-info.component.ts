import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MaterialModule } from "src/app/_common/material.module";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AthletePreviousCoachingInfosEntity, AthleteCurrentCoachingInfosEntity, AthleteOfficialInfoService, AthleteTrainingInfoEntity } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-official-info.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import Swal from "sweetalert2";
import { CommonSharableService } from "src/app/_common/services/common-services/commonSharable.service";
import { AlertService } from "src/app/_common/services/common-services/alert.service";

@Component({
    selector:'app-athlete-popup-profile-athlete-training-info',
    templateUrl:'./athlete-popup-profile-athlete-training-info.component.html',
    styleUrls:['./athlete-popup-profile-athlete-training-info.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent],
    providers: [
      {provide: DateAdapter, useClass: MomentDateAdapter},
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
      // DatePipe
    ]
})

export class AthletePopupProfileAthleteTrainingInfoComponent implements OnInit{
    @Input() player_Id:any
    loader:boolean = false;
    @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
    @ViewChildren(MatSort) sort = new QueryList<MatSort>();
    athleteCurrentTableColumns: string[] = ['coach_nsrs_id', 'coach_name', 'period','mappingType','status'];
    athleteCoachingTableColumns: string[] = ['coachName', 'academyName','academyType', 'period','mappingType','status'];
    athleteCoachTrainingTableColumns: string[] = ['academyName', 'period','weedOutDate', 'weedOutRemark'];
    athleteCurrentSportScienceInfosColumns: string[] = ['ss_nsrs_id', 'ss_name', 'period','mappingType','status'];
    athletePreviousSportScienceInfosTableColumns: string[] = ['ssName', 'academyName','academyType', 'period','mappingType','status'];
    academyDetails:any;
    @ViewChild('deleteModal') deleteModal:any;
    deleteModalRef:any;
    deleteRowData:any;
    @ViewChild('deleteSportScienceModal') deleteSportScienceModal:any;
    deleteSportScienceModalRef:any;
    deleteSportScienceRowData:any;
    @ViewChild('verifyModal') verifyModal:any;
    verifyModalRef:any;
    verifyModalRowData:any;
    athleteCurrentCoachingInfoData = new MatTableDataSource<AthleteCurrentCoachingInfosEntity>();
    athleteCoachingInfoData = new MatTableDataSource<AthletePreviousCoachingInfosEntity>();
    athleteTrainingnfoData = new MatTableDataSource<AthleteTrainingInfoEntity>();
    athleteCurrentSportScienceInfosData = new MatTableDataSource<AthleteCurrentCoachingInfosEntity>();
    athletePreviousSportScienceInfosData = new MatTableDataSource<AthletePreviousCoachingInfosEntity>();


    constructor(private storageService: StorageService,private athleteOfficialInfoService:AthleteOfficialInfoService, private modalService:NgbModal,
     private commmonSharableService:CommonSharableService, private alertService:AlertService){}

    ngOnInit(): void {
      this.academyDetails=this.storageService.getAcademyDetails();
      this.getathleteCoachingTrainingInfo();
        
    }
    getathleteCoachingTrainingInfo(){
      this.loader= true;
      this.athleteOfficialInfoService.athleteCoachingInfo(this.player_Id).subscribe({
        next:(response:any)=>{
          this.loader = false;
          // console.log(response)
          this.athleteCurrentCoachingInfoData = new MatTableDataSource<AthleteCurrentCoachingInfosEntity>(response.athleteCurrentCoachingInfos);
          this.athleteCoachingInfoData = new MatTableDataSource<AthletePreviousCoachingInfosEntity>(response.athletePreviousCoachingInfos);          
          setTimeout(() => {
          this.athleteCurrentCoachingInfoData.paginator=this.paginator.toArray()[0];
          this.athleteCoachingInfoData.paginator=this.paginator.toArray()[1];          
          this.athleteCurrentCoachingInfoData.sort = this.sort.toArray()[0];
          this.athleteCoachingInfoData.sort = this.sort.toArray()[1];          
          },200)
        },
        error:(err)=>{
          this.loader = false;
          console.error(err)
        }
      })
    }
    getAthleteTraining(){
      this.loader = true
      this.athleteOfficialInfoService.athleteTrainingInfo(this.player_Id).subscribe({
        next:(response:any)=>{
          this.loader= false;
          this.athleteTrainingnfoData = new MatTableDataSource<AthleteTrainingInfoEntity>(response);
          this.athleteTrainingnfoData.paginator=this.paginator.toArray()[4];
          this.athleteTrainingnfoData.sort = this.sort.toArray()[4];
        },
        error:(err)=>{
          this.loader= false
          console.error(err);
        }
      })
    }
    

getAthleteSportScience(){
  this.loader = true;
  this.athleteOfficialInfoService.athleteSportScience(this.player_Id).subscribe({
    next:(response:any)=>{
      this.loader = false
      // console.log(response)
      // console.log(response?.athleteCurrentSportScienceInfos)
      // console.log(response?.athletePreviousSportScienceInfos);
      this.athleteCurrentSportScienceInfosData = new MatTableDataSource<AthleteCurrentCoachingInfosEntity>(response?.athleteCurrentSportScienceInfos);
      this.athletePreviousSportScienceInfosData = new MatTableDataSource<AthletePreviousCoachingInfosEntity>(response?.athletePreviousSportScienceInfos);
      setTimeout(() => {
        this.athleteCurrentSportScienceInfosData.paginator=this.paginator.toArray()[2];
        this.athletePreviousSportScienceInfosData.paginator=this.paginator.toArray()[3];          
        this.athleteCurrentSportScienceInfosData.sort = this.sort.toArray()[2];
        this.athletePreviousSportScienceInfosData.sort = this.sort.toArray()[3];          
        },200)
    },
    error:(err)=>{
      this.loader = false
      console.error(err)
    }
  })
}
  

  

  
}
