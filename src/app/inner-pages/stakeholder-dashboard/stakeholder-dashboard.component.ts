import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { SportTrainingService } from 'src/app/_common/services/innerPagesServices/sportTraining.service';
import { StakeholderDashboardService } from 'src/app/_common/services/innerPagesServices/stakeholder-dashboard-service/stakeholder-dashboard.service';
import { KicDashboardService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-dashboard/kic-dashboard.service';

@Component({
  selector: 'app-stakeholder-dashboard',
  templateUrl: './stakeholder-dashboard.component.html',
  styleUrls: ['./stakeholder-dashboard.component.css']
})
export class StakeholderDashboardComponent implements OnInit {
  rcuser_id:number = 0
  scheme_id:number = 0;
  userDetails:any;
  activeIndexTab:number = 0;
  acsatCardData:Array<any> = [];
  opsTilesloader:boolean = false;
  loader:boolean = false;
  schemeLoader:boolean = false;
  rcLoader:boolean = false;
  schemeListData:any = [];
  rcListData:any = [];
  overviewData:any = []
  stateWisecardListData:Array<any> = []
  disciplineWisecardListData:Array<any> = []
  vacancyWiseData:Array<any> = []
  mapAllData:any = []
  insuranceData:Array<any> = [];
  rcWiseData:Array<any> = [];
  userId:number = 2119
  roleId:number = 39

  constructor(
    private _stakeholderDashboardService:StakeholderDashboardService,
    private _storageService:StorageService,
    private _sportTrainingCenterService:SportTrainingService,
    private _kicDashboardService:KicDashboardService
  ) { 
    this.userDetails = this._storageService.getUserDetails();
  }

  ngOnInit() {
    if(this.userDetails.role_id!==39) this.rcuser_id = this.userDetails.user_id
    this.getStakeHolderSchemeList();
    this.getRcList();
    this.getOpsTilesData();
    this.getOverviewData();
     
  }

   // +++++++++++ Selected Tab +++++++++++++++
   selectedTab(event: any) {
    // console.log(event)
    this.activeIndexTab = event.index
    if (this.activeIndexTab == 0) {
       this.getOverviewData() 
    }
    else if (this.activeIndexTab == 1) {
      this.getOpsStateWise() 
    }
    else if (this.activeIndexTab == 2) {
      this.getOpsDisciplineWise();
    }
    else if (this.activeIndexTab == 3) {
      this.getOpsVacancyWiseData();
    }
    else if (this.activeIndexTab == 4) {
      this.getMapData() 
    }
    else if (this.activeIndexTab == 5) {
      this.getOpsInsuranceData();
    }
    else if (this.activeIndexTab == 6) {
      this.getOpsRCWiseData();
    }
    
  }
// +++++++++++ getOpsTiles Data +++++++++++++++
  getOpsTilesData(){
    this.opsTilesloader = true
    this._stakeholderDashboardService.getOpsTilesData(
      this.roleId,
      this.userId,
      this.rcuser_id,
      this.scheme_id
    ).subscribe({
      next:(res:any)=>{
        this.opsTilesloader = false
        this.acsatCardData = res
      },
      error:(err)=>{
        console.error(err)
        this.opsTilesloader = false;
      }
    })
  }
// +++++++++++ Scheme List +++++++++++++++
  getStakeHolderSchemeList(){
    this.schemeLoader = true
    this._sportTrainingCenterService.getStakeHolderSchemeList(
      this.userId,
      this.roleId
    ).subscribe({
      next:(res)=>{
        // console.log(res)
        this.schemeListData = res;
        this.schemeLoader = false;
      },
      error:(err)=>{
        console.error(err);
        this.schemeLoader = false;
      }
    })
  }
  changeScheme(event:any){
    // console.log(event.target.value)
    this.scheme_id = event.target.value
    this.getOpsTilesData();
    if(this.activeIndexTab==0){ 
      this.getOverviewData();
    }
    else if(this.activeIndexTab==1){
      this.getOpsStateWise();
    }
    else if(this.activeIndexTab==2){
      this.getOpsDisciplineWise()
    }
    else if(this.activeIndexTab==3){
      this.getOpsVacancyWiseData()
    }
    else if(this.activeIndexTab==4){
      this.getMapData()
    }
    else if(this.activeIndexTab==5){
      this.getOpsInsuranceData()
    }
    else if(this.activeIndexTab==6){
      this.getOpsRCWiseData()
    }
  }
// +++++++++++ RC List +++++++++++++++
  getRcList(){
    this.rcLoader = true
    this._kicDashboardService.rcList().subscribe({
      next:(res)=>{
        // console.log(res)
        this.rcListData = res.data;
        this.rcLoader = false;
      },
      error:(err)=>{
        console.error(err);
        this.rcLoader = false;
      }
    })
  }
  changeRc(event:any){
    // console.log(event.target.value)
    this.rcuser_id = event.target.value
    this.getOpsTilesData();
    if(this.activeIndexTab==0){ 
      this.getOverviewData();
    }
    else if(this.activeIndexTab==1){
      this.getOpsStateWise();
    }
    else if(this.activeIndexTab==2){
      this.getOpsDisciplineWise();
    }
    else if(this.activeIndexTab==3){
      this.getOpsVacancyWiseData();
    }
    else if(this.activeIndexTab == 4){
      this.getMapData();
    }
    else if(this.activeIndexTab == 5){
      this.getOpsInsuranceData();
    }
    else if(this.activeIndexTab == 6){
      this.getOpsRCWiseData();
    }
  }

  // +++++++++++ card Data +++++++++++++++
  getOverviewData(){
    this.loader = true;
    this.overviewData = []
    this._stakeholderDashboardService.get_Ops_Graph_Data_Coresp(
      this.roleId,
      this.userId,
      this.rcuser_id,
      this.scheme_id
    ).subscribe({
      next:(res:any)=>{
        this.loader = false
        this.overviewData = res
      },
      error:(err)=>{
        console.error(err)
        this.loader = false;
      }
    })
  }
 // +++++++++++ Get_Ops_StateWise Data +++++++++++++++
 getOpsStateWise(){
  this.loader = true;
  this.stateWisecardListData = []
  this._stakeholderDashboardService.get_Ops_StateWise_Data(
    this.roleId,
      this.userId,
      this.rcuser_id,
      this.scheme_id
  ).subscribe({
    next:(res:any)=>{
      this.loader = false
      // console.log(res)
      this.stateWisecardListData = res
    },
    error:(err)=>{
      this.loader = false;
      console.error(err)
    },
  })
 }
 // +++++++++++ Get_Ops_DisciplineWise_Data Data +++++++++++++++
 getOpsDisciplineWise(){
  this.loader = true;
  this.disciplineWisecardListData = []
  this._stakeholderDashboardService.get_Ops_DisciplineWise_Data(
    this.roleId,
      this.userId,
      this.rcuser_id,
      this.scheme_id
  ).subscribe({
    next:(res:any)=>{
      this.loader = false
      // console.log(res)
      this.disciplineWisecardListData = res
    },
    error:(err)=>{
      this.loader = false;
      console.error(err)
    },
  })
 }
  // +++++++++++ Vacancy Data +++++++++++++++

  getOpsVacancyWiseData(){
    this.loader = true;  
    this.vacancyWiseData =[]
    this._stakeholderDashboardService.getOpsVacancyWiseData(
      this.roleId,
      this.userId,
      this.rcuser_id,
      this.scheme_id
    ).subscribe({
      next:(res:any)=>{
        this.loader = false;
        if(res.status){
          // console.log(res)
          this.vacancyWiseData = res.data;
        }
      },
      error:(err)=>{
        this.loader = false;
        console.error(err)
      }
    })
  }

 // +++++++++++ Map Data +++++++++++++++
  getMapData()
  {
    this.loader = true;
    this.mapAllData = []
    this._stakeholderDashboardService.mapData(
      this.roleId,
      this.userId,
      this.rcuser_id,
      this.scheme_id
    ).subscribe({
      next: (res: any) => {
        this.loader = false;
        this.mapAllData = res
      },
      error: errors => { this.loader = false }

    })
    
  }

  // +++++++++++ Insurance Data +++++++++++++++

  getOpsInsuranceData(){
    this.loader = true;
    this.insuranceData = []
    this._stakeholderDashboardService.getOpsInsuranceData(
      this.roleId,
      this.userId,
      this.rcuser_id,
      this.scheme_id
    ).subscribe({
      next:(res:any)=>{
        this.loader = false;
        // console.log(res)
        if (res?.code == 200 && res.status == 1) {
          this.insuranceData = res.data
        }        
      },
      error:(err)=>{
        this.loader = false;
        console.error(err)
      }
    })
  }
  // +++++++++++ rc wise Data +++++++++++++++

  getOpsRCWiseData(){
    this.loader = true;
    this.rcWiseData = []
    this._stakeholderDashboardService.getOpsRCWiseData(
      this.roleId,
      this.userId,
      this.rcuser_id,
      this.scheme_id
    ).subscribe({
      next:(res:any)=>{
        this.loader = false;
        // console.log(res)
        this.rcWiseData = res;  
      },
      error:(err)=>{
        this.loader = false;
        console.error(err)
      }
    })
  }

}
