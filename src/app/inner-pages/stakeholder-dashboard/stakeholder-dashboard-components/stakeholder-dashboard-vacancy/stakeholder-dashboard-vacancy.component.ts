import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Highcharts from 'highcharts';
import { StakeholderDashboardVacancyModalComponent } from '../stakeholder-dashboard-modals/stakeholder-dashboard-vacancy-modal/stakeholder-dashboard-vacancy-modal.component';

@Component({
  selector: 'app-stakeholder-dashboard-vacancy',
  templateUrl: './stakeholder-dashboard-vacancy.component.html',
  styleUrls: ['./stakeholder-dashboard-vacancy.component.css']
})
export class StakeholderDashboardVacancyComponent implements OnInit, OnChanges {
  @Input() vacancyData:any = {};
  @Input() user_id:any;
  @Input() role_id:any;
  @Input() rduserId:any;
  @Input() schemeId:any;
  highcharts = Highcharts
  chartOptionsAthleteDiscipline:Highcharts.Options = {}
  chartOptionsCoachDiscipline:Highcharts.Options = {}
  chartOptionsCategory:Highcharts.Options = {}
  disciplineWiseVacancyData:any = []
  categoriesWiseVacancyData:any = [];

  constructor(
    private modalService:NgbModal
  ) { }

  ngOnInit() {
    // this.setCharts()
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.transformData(this.vacancyData)
    this.setCharts()
  }
  setCharts(){
    this.chartOptionsAthleteDiscipline = {
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
        text: 'DISCIPLINE WISE ATHLETE VACANCY'
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
        categories: this.disciplineWiseVacancyData.xAxisCategories,
        // categories: ['Archery','Wrestling','Badminton','Hockey'],
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
          stacking:'normal',
          pointWidth: 10, // Set the width of the columns
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
              click: this.athleteSelectedColumn.bind(this)               
            }
          }
        }
      },
      series: [
        {
          // linkedTo:'Athlete',
          name: 'Athlete Vacancy',
          type: 'column',
          stack:'athlete',
          color: '#ccc',
          data: this.disciplineWiseVacancyData.athleteVacancyData
          // data: [4,10,5,20]
        },
        {
          name: 'Athlete',
          type: 'column',
          stack:'athlete',
          color: '#A5A006',
          data: this.disciplineWiseVacancyData.athleteData
        },
      ]
    };
    this.chartOptionsCoachDiscipline = {
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
        text: 'DISCIPLINE WISE COACH VACANCY'
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
        categories: this.disciplineWiseVacancyData.xAxisCategories,
        // categories: ['Archery','Wrestling','Badminton','Hockey'],
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
          stacking:'normal',
          pointWidth: 10, // Set the width of the columns
          // pointPadding: 0.9, // Adjust the space between columns within a group
          // groupPadding: 0.1, // Adjust the space between groups of columns
          dataLabels: {
            enabled: true,
            format: '{point.y}' // Display the count on each column
          }
        }
      },
      series: [
        {
          // linkedTo:'Coach',
          name: 'Coach Vacancy',
          type: 'column',
          stack:'coach',
          color: '#ccc',
          data: this.disciplineWiseVacancyData.coachVacancyData
          // data: [15,20,5,30]
        },
        {
          name: 'Coach',
          type: 'column',
          stack:'coach',
          color: '#656312',
          data: this.disciplineWiseVacancyData.coachData
          // data: [15,20,5,30]
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
        text: 'CATEGORY WISE SPORTS SCIENTIST VACANCY'
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
        categories: this.categoriesWiseVacancyData.xAxisCategories,
        // categories: ['Anthropometry','Biochemical','Biomechanics','Doctor'],
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
          stacking:'normal',
          pointWidth: 20, // Set the width of the columns
          // pointPadding: 0.9, // Adjust the space between columns within a group
          // groupPadding: 0.1, // Adjust the space between groups of columns
          dataLabels: {
            enabled: true,
            format: '{point.y}' // Display the count on each column
          }
        }
      },
      series: [
        {
          name: 'Sport Scientist Vacancy',
          type: 'column',
          stack:'Sport Scientist',
          color: '#ccc',
          data: this.categoriesWiseVacancyData.sportScientistVacancyData
          // data: [10,20,30,5]
        },
        {
          name: 'Sport Scientist',
          type: 'column',
          stack:'Sport Scientist',
          color: '#4D924D',
          data: this.categoriesWiseVacancyData.sportScientistData
          // data: [10,20,30,5]
        },
      ]
    };
  }
  transformData(data:any){
    // console.log(data)
    /***********DISCIPLINE WISE ATHLETE VACANCY***********/
    let disciplineWiseSeriesObj:any = {
      xAxisCategories:[],
      athleteData:[],
      athleteVacancyData:[],
      coachData:[],
      coachVacancyData:[]
    }
    data?.discipline?.forEach((item:any)=>{
      disciplineWiseSeriesObj.xAxisCategories.push(item.sport_name);
      disciplineWiseSeriesObj.athleteData.push(item.no_of_athletes)
      disciplineWiseSeriesObj.athleteVacancyData.push(item.athsanctioned_strnth - item.no_of_athletes > 0 ? item.athsanctioned_strnth - item.no_of_athletes : 0);
      disciplineWiseSeriesObj.coachVacancyData.push(item.coachsanctioned_strnth - item.no_of_Coaches > 0 ? item.coachsanctioned_strnth - item.no_of_Coaches : 0 )
      disciplineWiseSeriesObj.coachData.push(item.no_of_Coaches)
    })
    this.disciplineWiseVacancyData = disciplineWiseSeriesObj

    let categoriesWiseSeriesObj:any = {
      xAxisCategories:[],
      sportScientistData:[],
      sportScientistVacancyData:[]
    }
    data?.category?.forEach((item:any)=>{
      categoriesWiseSeriesObj.xAxisCategories.push(item.category_name);
      categoriesWiseSeriesObj.sportScientistData.push(item.no_of_SS)
      categoriesWiseSeriesObj.sportScientistVacancyData.push(item.sS_sanctioned_strnth - item.no_of_SS > 0 ? item.sS_sanctioned_strnth - item.no_of_SS : 0)
    })
    this.categoriesWiseVacancyData = categoriesWiseSeriesObj
  }
  athleteSelectedColumn(event:any){
    // console.log(event)
    // console.log(event.point.category)
    // console.log(event.point.series.userOptions.name)
    const disciplineWiseType = event.point.series.userOptions.name
   const modalRef = this.modalService.open(
    StakeholderDashboardVacancyModalComponent,
    {size:'xl', centered:true,backdrop:'static', keyboard:false}    
   )
   modalRef.componentInstance.vacancyType = disciplineWiseType
   modalRef.componentInstance.sportName = event.point.category;
   modalRef.componentInstance.userId = this.user_id;
   modalRef.componentInstance.roleId = this.role_id;
   modalRef.componentInstance.rduserId = this.rduserId;
   modalRef.componentInstance.schemeId = this.schemeId

  }

}
