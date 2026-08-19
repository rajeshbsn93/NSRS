import { Component, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { forkJoin } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicDashboardService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-dashboard/kic-dashboard.service';
import { YoungProfessionalService } from 'src/app/_common/services/young-professional/young-professional.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-yp-dashboard',
  templateUrl: './yp-dashboard.component.html',
  styleUrls: ['./yp-dashboard.component.css'],
})
export class YpDashboardComponent implements OnInit {

 
  userDetails: any
  categorywiseCardList: any = []
  categorywiseLoader: boolean = false;
  chartOptionsFinancialStatus:any;
  rcList: any = []
  selectedRegionId: string = '0'
  selectedCategory: string = 'overview'  //state or discipline or detail_map or density map
  selectedRcText = ''

  showState: boolean = false;
 
  stateEvent: any

  highcharts = Highcharts;
  chartOptionsKicPca: Highcharts.Options = {};
  chartOptionsAthleteCoach: Highcharts.Options = {};
  chartOptionsRatioPcaKicAthleteCoach: Highcharts.Options = {};
  seriesDataObj: any = []
  scholarshipData:Array<any> = [];

 loader: boolean = false;


isLoading: boolean = false;
tileData:any=[]
tileDataChart:any=[]
getApprovedPendingResult:any = []
fileUrl=environment.fileUrl
selectModelGames = '';
selectModelYears = '';
chartGameDropdownList:any = []
chartYearDropdownList:any = []
  constructor(private youngProfessionalService:YoungProfessionalService,
    private swalAlert:AlertService,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.getFormFiveTileData()
    this.getApprovedPendingStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  getFormFiveTileData(){
    this.isLoading=true
    this.youngProfessionalService.getFormFiveTileData().subscribe({
          next: (res:any) => {
            if(res){
              this.isLoading=false;
              this.tileData = res;
              this.tileDataChart = res
              const yearSet:Set<String> = new Set()
              const competetionSet:Set<String> = new Set()
              res.forEach((item:any)=>{
                const [competition, year] = item.comp_ShortCode.split(' ');
                competetionSet.add(competition)
                yearSet.add(year)
              })
              this.chartYearDropdownList = Array.from(yearSet).sort();
              this.chartGameDropdownList = Array.from(competetionSet)
            }
           
          },
          error: (error) => {
            this.isLoading=false
            this.swalAlert.swalPopError('Something Went Wrong. Please Try Again!!')
          },
      });
   }

   navigateTo(competitionName:string,type:string){
   // this.router.navigate(['/yp/pending', competitionName,type]);
    this.router.navigate(['/yp/form5', competitionName,type]);
   }

   getDashboardGridCount(type:string):number{
    let approvedCount = 0
    let pendingCount = 0
    let rejectCount = 0
    for(let i=0; i<this.tileData.length; i++){
      approvedCount+=this.tileData[i].approved
      pendingCount+=this.tileData[i].pending
      rejectCount+=this.tileData[i].rejected
    }
    // console.log(type)
    return type === 'approved' ? approvedCount : type === 'pending' ? pendingCount : rejectCount
   }
   getApprovedPendingStatus(){
    this.loader = true
    forkJoin({
      approved: this.youngProfessionalService.getFormFivePlayerList('','approved'),
      pending: this.youngProfessionalService.getFormFivePlayerList('','pending')
    }).subscribe({
      next:(res:any)=>{
        this.loader = false;
        res.approved.forEach((item:any,index:number)=> item.s_no = index+1)
        res.pending.forEach((item:any,index:number)=> item.s_no = index+1)
        // console.log(res)
        this.getApprovedPendingResult = res;
      },
      error:(err)=>{
        this.loader = false
        console.error(err)
      }
    })
   }
  changeChartSelection(){
    this.tileDataChart = []
    let filterData:any = []
    if(this.selectModelYears && this.selectModelGames === ''){
      filterData = this.tileData.filter((item:any)=>item.comp_ShortCode.includes(this.selectModelYears))
    }
    if(this.selectModelGames && this.selectModelYears === ''){
      filterData = this.tileData.filter((item:any)=>item.comp_ShortCode.includes(this.selectModelGames))
    }
    if(this.selectModelGames && this.selectModelYears){
      filterData = this.tileData.filter((item:any)=>item.comp_ShortCode.includes(this.selectModelGames) && item.comp_ShortCode.includes(this.selectModelYears))
    }
    setTimeout(()=>{
      // this.tileData = filterTiles;
      this.tileDataChart = filterData      
    },0)
  }
  
}
