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
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CommonSharableService, Official_Training_InfoEntity } from "src/app/_common/services/common-services/commonSharable.service";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { SSOfficialCurrentTrainingInfosEntity, SSOfficialPreviousTrainingInfosEntity, SSTrainingInfoEntity, SportScientistInfoService } from "src/app/_common/services/role-inner-pages-services/sport-scientist-services/sport-scientist-info.service";
import Swal from "sweetalert2";
import { first } from "rxjs";

@Component({
    selector:'app-sport-scientist-popup-pfrofile-training-info',
    templateUrl:'./sport-scientist-popup-pfrofile-training-info.component.html',
    styleUrls:['./sport-scientist-popup-pfrofile-training-info.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent],
    providers: [
      {provide: DateAdapter, useClass: MomentDateAdapter},
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
      // DatePipe
    ]
})

export class SportScientistPopupProfileTrainingInfoComponent implements OnInit{
    loader:boolean = false;
    loader2:boolean = false;
    @Input() officialId:any
    @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
    @ViewChildren(MatSort) sort = new QueryList<MatSort>();
    athleteCurrentTableColumns: string[] = ['athlete_nsrs_id', 'athlete_name', 'period','mappingType','status'];
    athleteHistoryTableColumns: string[] = ['athlete_name', 'AcademyName','AcademyType', 'period','mappingType','status'];
    athleteAcademyTableColumns: string[] = ['academyName', 'period','weedOutDate', 'weedOutRemark'];
    athleteCurrentSSInfoData = new MatTableDataSource<SSOfficialCurrentTrainingInfosEntity>();
    athleteHistorySSInfoData = new MatTableDataSource<SSOfficialPreviousTrainingInfosEntity>();
    academyData = new MatTableDataSource<Official_Training_InfoEntity>()
    academyDetails:any;

    constructor(private storageService: StorageService,private modalService:NgbModal, private ssInfoService:SportScientistInfoService,
        private commmonSharableService:CommonSharableService,private alertService:AlertService){}
    

    ngOnInit(): void {
        // console.log(this.officialId)
        this.academyDetails=this.storageService.getAcademyDetails();
        this.getSSTrainingInfo();
        this.getOfficial_Training_Info();
        
      }
    getSSTrainingInfo(){
          this.loader = true;
          this.ssInfoService.ssTrainingInfo(this.officialId).subscribe({
              next:(response:SSTrainingInfoEntity)=>{
                  this.loader = false;
                  // console.log(response);
                  this.athleteCurrentSSInfoData = new MatTableDataSource<SSOfficialCurrentTrainingInfosEntity>(response.officialCurrentTrainingInfos);
                  this.athleteHistorySSInfoData = new MatTableDataSource<SSOfficialPreviousTrainingInfosEntity>(response.officialPreviousTrainingInfos);
                  setTimeout(()=>{
                      this.athleteCurrentSSInfoData.paginator = this.paginator.toArray()[0];
                      this.athleteHistorySSInfoData.paginator = this.paginator.toArray()[1];
                      this.athleteCurrentSSInfoData.sort = this.sort.toArray()[0];
                      this.athleteHistorySSInfoData.sort = this.sort.toArray()[1]                    
                  },200)
              },
              error:(err)=>{
                  this.loader = false;
                  console.error(err)
              }
          })
        }
        getOfficial_Training_Info(){
          this.loader2 = true;
          this.commmonSharableService.Official_Training_Info_Academy(this.officialId).pipe(first()).subscribe({
            next:(response)=>{
              this.loader2 = false;
              this.academyData = new MatTableDataSource<Official_Training_InfoEntity>(response);
              setTimeout(()=>{
                this.academyData.paginator = this.paginator.toArray()[2];
                this.academyData.sort = this.sort.toArray()[2]
              },200)
            },
            error:(err)=>{
              console.error(err);
              this.loader2 = false;
            }
          })
        }

    
}
