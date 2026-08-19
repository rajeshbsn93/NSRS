import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Highcharts from 'highcharts';
import { StakeholderDashboardOverviewCommonModalsComponent } from '../stakeholder-dashboard-modals/stakeholder-dashboard-overview-common-modals/stakeholder-dashboard-overview-common-modals.component';
import { StakeholderDashboardService } from 'src/app/_common/services/innerPagesServices/stakeholder-dashboard-service/stakeholder-dashboard.service';

@Component({
  selector: 'app-stakeholder-dashboard-overview',
  templateUrl: './stakeholder-dashboard-overview.component.html',
  styleUrls: ['./stakeholder-dashboard-overview.component.css']
})
export class StakeholderDashboardOverviewComponent implements OnInit, OnChanges {
@Input() user_id:any;
@Input() role_id:any;
@Input() rduserId:any;
@Input() schemeId:any
@Input() chartsData:any = []
highcharts = Highcharts;
chartOptionsScheme:Highcharts.Options = {}
chartOptionsDiscipline:Highcharts.Options = {}
chartOptionsCategory:Highcharts.Options = {}
schemeSeriesDataObj:any = []
disciplineSeriesDataObj:any = []
CategorySeriesDataObj:any = [];
opsGraphDetailData:any = []
loader:boolean = false;

  constructor(
    private _modalService:NgbModal,
    private _stakeholderDashboardService:StakeholderDashboardService,
  ) { }

  ngOnInit() { 
    this.getOpsGraphDetailData();  
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.transformData(this.chartsData)
    this.setCharts()
  }

  setCharts(){
    this.chartOptionsScheme = {
      chart: {
        type: 'column',
        backgroundColor: '#fff',
        scrollablePlotArea: {
          // minWidth: 600 // Set the minimum width before scrolling activates
        },
        style: {
          fontFamily: 'Lato'
        }
      },
      title: {
        text: 'SCHEME WISE DISTRIBUTION'
      },
      legend: {
        enabled: true
      },
      credits: {
        enabled: false,
      },
      colorAxis: {
        min: 0
      },
      xAxis: {
        categories: this.schemeSeriesDataObj?.xAxisCategories,
        // categories: ['NCOE','SATC','ABSC','NCOE'],
        zoomEnabled: true
      },
      yAxis: {
        title: {
          // text: 'Number of KIC'
          text: ''
        },
      },
      plotOptions: {
        column: {
          pointWidth: 15, // Set the width of the columns
          // pointPadding: 0.9, // Adjust the space between columns within a group
          // groupPadding: 0.1, // Adjust the space between groups of columns
          dataLabels: {
            enabled: true,
            format: '{point.y}' // Display the count on each column
          }
        },
        series:{
          cursor:'pointer',
          point:{
            events:{
              // click:this.selectedColumnModalOpen.bind(this,1)
              click: ($event:any)=> this.selectedColumnModalOpen($event,1)
            }
          }
        }
      },
      series: [
        {
          name: 'Athlete',
          type: 'column',
          color: '#FF7572',
          data: this.schemeSeriesDataObj?.athleteData
        },
        {
          name: 'Coach',
          type: 'column',
          color: '#17bf5e',
          data: this.schemeSeriesDataObj?.coachData
        },
        {
          name: 'Sport Scientist',
          type: 'column',
          color: '#2021b1',
          data: this.schemeSeriesDataObj?.sportScientistData
        }
      ]
    };
    this.chartOptionsDiscipline = {
      chart: {
        type: 'column',
        backgroundColor: '#fff',
        scrollablePlotArea: {
          // minWidth: 600 // Set the minimum width before scrolling activates
        },
        style: {
          fontFamily: 'Lato'
        }
      },
      title: {
        text: 'DISCIPLINE WISE DISTRIBUTION'
      },
      legend: {
        enabled: true
      },
      credits: {
        enabled: false,
      },
      colorAxis: {
        min: 0
      },
      xAxis: {
        categories: this.disciplineSeriesDataObj?.xAxisCategories,
        // categories: ['NCOE','SATC','ABSC','NCOE'],
        zoomEnabled: true
      },
      yAxis: {
        title: {
          // text: 'Number of KIC'
          text: ''
        },
      },
      plotOptions: {
        column: {
          pointWidth: 10, // Set the width of the columns
          // pointPadding: 0.9, // Adjust the space between columns within a group
          // groupPadding: 0.1, // Adjust the space between groups of columns
          dataLabels: {
            enabled: true,
            format: '{point.y}' // Display the count on each column
          }
        },
        series: {
          cursor:'pointer',
          point: {
            events: {
              // click: this.selectedColumnModalOpen.bind(this)
              click: ($event:any)=> this.selectedColumnModalOpen($event,2)
            }
          }
        }
      },
      series: [
        {
          name: 'Athlete',
          type: 'column',
          color: '#0E335D',
          data: this.disciplineSeriesDataObj?.athleteData
        },
        {
          name: 'Coach',
          type: 'column',
          color: '#73b4ff',
          data: this.disciplineSeriesDataObj?.coachData
        },
      ]
    };
    this.chartOptionsCategory = {
      chart: {
        type: 'column',
        backgroundColor: '#fff',
        scrollablePlotArea: {
          // minWidth: 600 // Set the minimum width before scrolling activates
        },
        style: {
          fontFamily: 'Lato'
        }
      },
      title: {
        text: 'CATEGORY WISE DISTRIBUTION'
      },
      legend: {
        enabled: true
      },
      credits: {
        enabled: false,
      },
      colorAxis: {
        min: 0
      },
      xAxis: {
        categories: this.CategorySeriesDataObj?.xAxisCategories,
        // categories: ['NCOE','SATC','ABSC','NCOE'],
        zoomEnabled: true,
      },
      yAxis: {
        title: {
          // text: 'Number of KIC'
          text: ''
        },
      },
      plotOptions: {
        column: {
          pointWidth: 20, // Set the width of the columns
          // pointPadding: 0.9, // Adjust the space between columns within a group
          // groupPadding: 0.1, // Adjust the space between groups of columns
          dataLabels: {
            enabled: true,
            format: '{point.y}' // Display the count on each column
          }
        },
        series: {
          cursor:'pointer',
          point: {
            events: {
              // click: this.selectedColumnModalOpen.bind(this)
              click: ($event:any) => this.selectedColumnModalOpen($event,3)
            }
          }
        }
      },
      series: [
        {
          name: 'Count',
          type: 'column',
          color: '#4D924D',
          data: this.CategorySeriesDataObj?.categoryData
        },
      ]
    };
  }
  transformData(data:any){
    // console.log('data',data)
    let schemSeriesData: any = {
      xAxisCategories: [],
      athleteData: [],
      coachData: [],
      sportScientistData: []
    };
    data?.scheme.forEach((item:any)=>{
      schemSeriesData.xAxisCategories.push(item.shortName)
      schemSeriesData.athleteData.push(item.total_No_of_Athletes)
      schemSeriesData.coachData.push(item.total_No_of_Coaches)
      schemSeriesData.sportScientistData.push(item.total_No_of_Sports_Scientists)
    })
    this.schemeSeriesDataObj = schemSeriesData
    // console.log('schemeSeriesDataObj',this.schemeSeriesDataObj)
    let disciplineSeriesData: any = {
      xAxisCategories: [],
      athleteData: [],
      coachData: [],
    };
    data?.discipline.forEach((item:any)=>{
      disciplineSeriesData.xAxisCategories.push(item.sport_display_name)
      disciplineSeriesData.athleteData.push(item.athlete_count)
      disciplineSeriesData.coachData.push(item.coach_count)
    })
    this.disciplineSeriesDataObj = disciplineSeriesData
    // console.log('disciplineSeriesDataObj',this.disciplineSeriesDataObj)
    let categorySeriesData: any = {
      xAxisCategories: [],
      categoryData: [],
    };
    data?.category.forEach((item:any)=>{
      categorySeriesData.xAxisCategories.push(item.name)
      categorySeriesData.categoryData.push(item.sports_Scientist_Count)
    })
    this.CategorySeriesDataObj = categorySeriesData
    // console.log('CategorySeriesDataObj',this.CategorySeriesDataObj)
  }

  getOpsGraphDetailData(){
    this.loader = true
    this.opsGraphDetailData = []
    this._stakeholderDashboardService.getOpsGraphDetailData(
      this.role_id,
      this.user_id,
      this.rduserId,
      this.schemeId
    ).subscribe({
      next:(res)=>{
        this.loader = false
        // console.log(res)
        this.opsGraphDetailData = res;
      },
      error:(err)=>{
        console.error(err)
        this.loader = false
      }
    })
  }


  selectedColumnModalOpen(event:any,chartClickType?:any){
    // console.log(event)
    const filterData = this.opsGraphDetailData
    .filter((item:any)=>item.keyValue.trim().toLowerCase() === event.point.category.trim().toLowerCase())
    const modalRef = this._modalService.open(StakeholderDashboardOverviewCommonModalsComponent,{
      size:'xl',
      centered: true,
      backdrop:'static',
      keyboard:false
    })
    modalRef.componentInstance.disciplineName = event.point.category;
    modalRef.componentInstance.chartClickType = chartClickType;
    modalRef.componentInstance.overViewTableData = filterData
  }


}
