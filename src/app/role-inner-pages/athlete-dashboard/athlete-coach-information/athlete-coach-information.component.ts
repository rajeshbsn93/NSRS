import { CommonModule } from "@angular/common";
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MaterialModule } from "src/app/_common/material.module";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { AthleteDashboardSidebarComponent } from "../athlete-dashboard-sidebar/athlete-dashboard-sidebar.component";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AthletePreviousCoachingInfosEntity, AthleteCurrentCoachingInfosEntity, AthleteOfficialInfoService, AthleteTrainingInfoEntity } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-official-info.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AthleteCurrentCoachComponent } from "../../modal-window/athlete-dashboard-modal/athlete-current-coach/athlete-current-coach.component";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import Swal from "sweetalert2";
import { AthleteSportsScienceComponent } from "../../modal-window/athlete-dashboard-modal/athlete-sports-science/athlete-sports-science.component";
import { CommonSharableService } from "src/app/_common/services/common-services/commonSharable.service";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { EditOfficialMappingDateComponent } from "../../modal-window/edit-official-mapping-date/edit-official-mapping-date.component";
import { AthleteInformationActcComponent } from "../athlete-information-actc/athlete-information-actc.component";

@Component({
    selector:'app-athlete-coach-information',
    templateUrl:'./athlete-coach-information.component.html',
    styleUrls:['./athlete-coach-information.component.css'],
    standalone:true,
    imports: [CommonModule, MaterialModule, LoaderComponent, AthleteDashboardSidebarComponent, AthleteInformationActcComponent],
    providers: [
      {provide: DateAdapter, useClass: MomentDateAdapter},
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
      // DatePipe
    ]
})

export class AthleteCoachInformationComponent implements OnInit{
    loader:boolean = false;
    @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
    @ViewChildren(MatSort) sort = new QueryList<MatSort>();
    athleteCurrentTableColumns: string[] = ['coach_nsrs_id', 'coach_name', 'period','trainingLevel','mappingType','status','action'];
    athleteCoachingTableColumns: string[] = ['coachName', 'academyName','academyType', 'period','trainingLevel','mappingType','status','action'];
    athleteCoachTrainingTableColumns: string[] = ['academyName', 'period','weedOutDate', 'weedOutRemark'];
    athleteCurrentSportScienceInfosColumns: string[] = ['ss_nsrs_id', 'ss_name', 'period','mappingType','status','action'];
    athletePreviousSportScienceInfosTableColumns: string[] = ['ssName', 'academyName','academyType', 'period','mappingType','status','action'];
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
    actcCheck:boolean = false;
    userSessionData:any

    constructor(private storageService: StorageService,private athleteOfficialInfoService:AthleteOfficialInfoService, private modalService:NgbModal,
     private commmonSharableService:CommonSharableService, private alertService:AlertService){}

    ngOnInit(): void {
      this.userSessionData = this.storageService.getUserProfileDataFromSessionRes();
      this.academyDetails=this.userSessionData.userData
      this.getathleteCoachingTrainingInfo();
        
    }
    getathleteCoachingTrainingInfo(){
      this.loader= true;
      this.athleteOfficialInfoService.athleteCoachingInfo(this.academyDetails.user_id).subscribe({
        next:(response:any)=>{
          this.loader = false;
          //console.log(response)
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
      this.athleteOfficialInfoService.athleteTrainingInfo(this.academyDetails.user_id).subscribe({
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
    
    AddCoach(){
      const modalRef = this.modalService.open(AthleteCurrentCoachComponent,{size:'xl',centered:true});
      modalRef.result.then((thenRes)=>{
        if(thenRes){
          this.getathleteCoachingTrainingInfo()
        }
      })
      .catch(()=>{})
    }

    deleteCoach(rowData:any){
      //console.log(rowData)
      this.deleteRowData = rowData
      this.deleteModalRef = this.modalService.open(this.deleteModal,{size:'md',centered:true})
    }
    confirmDeleteCoach(){
      this.loader = true;
      this.athleteOfficialInfoService.DeleteAthleteOtherCoachingInformation(this.deleteRowData.mapId).subscribe({
        next:(response)=>{
          this.loader = false;
          if(response){
            Swal.fire({
              icon:'success',
              text:'Delete Successfully!'
            });
            this.deleteModalRef.close();
            this.getathleteCoachingTrainingInfo();
          }
        },
        error:(err)=>{
          this.loader = false;
          console.error(err)
        }
      })
    }
getAthleteSportScience(){
  this.loader = true;
  this.athleteOfficialInfoService.athleteSportScience(this.academyDetails.user_id).subscribe({
    next:(response:any)=>{
      this.loader = false
      //console.log(response)
      //console.log(response?.athleteCurrentSportScienceInfos)
      //console.log(response?.athletePreviousSportScienceInfos);
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
  addSportScientist(){
    const modalRef = this.modalService.open(AthleteSportsScienceComponent,{size:'xl',centered:true});
      modalRef.result.then((thenRes)=>{
        if(thenRes){
          this.getAthleteSportScience()
        }
      }).catch(res=>{})
  }

  
  editDate(row:any,checkType:string){
    // console.log(row,checkType)
    row.checkType = checkType
    const modalRef = this.modalService.open(EditOfficialMappingDateComponent,{size:'lg',centered:true})
      modalRef.componentInstance.rowData = row;
      modalRef.result.then((thenRes)=>{
        if(thenRes == 2){
          this.getathleteCoachingTrainingInfo();
        }else if(thenRes == 103){
          this.getAthleteSportScience();
        }
      })
  }

  deleteSportScience(rowData:any){
    //console.log(rowData)
    this.deleteSportScienceRowData = rowData
    this.deleteSportScienceModalRef = this.modalService.open(this.deleteSportScienceModal,{size:'md',centered:true})
  }
  confirmDeleteSportScience(){
    this.loader = true;
    this.athleteOfficialInfoService.deleteAthleteOtherSportScienceInformation(this.deleteSportScienceRowData.mapId).subscribe({
      next:(response)=>{
        this.loader = false;
        if(response){
          Swal.fire({
            icon:'success',
            text:'Delete Successfully!'
          });
          this.deleteSportScienceModalRef.close();
          this.getAthleteSportScience();
        }
      },
      error:(err)=>{
        this.loader = false;
        console.error(err)
      }
    })
  }

  verify(rowData:any,tabCheck:string){
    rowData.tabCheck = tabCheck
    //console.log(rowData)
    this.verifyModalRowData = rowData
    this.verifyModalRef = this.modalService.open(this.verifyModal,{size:'md',centered:true})
  }

  confirmVerify(){
    let mappingType = 0
    const roleId = this.academyDetails.role_id;
    if(this.verifyModalRowData.tabCheck == 'coach'){
      mappingType = 2
    }else if(this.verifyModalRowData.tabCheck == 'sport-scientist'){
      mappingType = 103
    }  

    this.loader = true;        
    this.commmonSharableService.verifyOtherOfficialMapping(mappingType,roleId,this.verifyModalRowData.mapId).subscribe({
        next:(response)=>{
            if(response){
                this.loader = false;
                this.alertService.swalPopSuccess('Mapping Verified Successfully!')  ;
                this.verifyModalRef.close(mappingType);
                this.verifyModalRef.result.then((conVerifyResult:any)=>{
                  if(conVerifyResult == 2){
                    this.getathleteCoachingTrainingInfo()
                  }else if(conVerifyResult == 103){
                    this.getAthleteSportScience()
                  }
                })             
            }
        },
        error:(err)=>{
            this.loader = false;
            console.error(err);
        }
    })
  }

  clickACTC(){
    this.actcCheck = true
  }
  
}
