import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Highcharts from 'highcharts';
import { StakeholderDashboardInsuranceDisciplineModalComponent } from '../stakeholder-dashboard-modals/stakeholder-dashboard-insurance-discipline-modal/stakeholder-dashboard-insurance-discipline-modal.component';

@Component({
  selector: 'app-stakeholder-dashboard-insurance',
  templateUrl: './stakeholder-dashboard-insurance.component.html',
  styleUrls: ['./stakeholder-dashboard-insurance.component.css']
})
export class StakeholderDashboardInsuranceComponent implements OnInit, OnChanges {
  @Input() insuranceData:any
  @Input() user_id:any;
  @Input() role_id:any;
  @Input() rduserId:any;
  @Input() schemeId:any
highcharts = Highcharts
chartOptionsDisciplineAthlete:Highcharts.Options = {};
chartOptionsDisciplineCoach:Highcharts.Options = {};
chartOptionsCategory:Highcharts.Options = {};
disciplineWiseData:any = []
categoriesWiseData:any = []
  constructor(
    private modalService:NgbModal
  ) { }

  ngOnInit() {
    // this.setCharts();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.transformData(this.insuranceData)
    this.setCharts();
  }
  setCharts(){
    this.chartOptionsDisciplineAthlete = {
      chart: {
        type: 'column',
        backgroundColor: '#fff',
        scrollablePlotArea: {
          // minWidth: 600 // Set the minimum width before scrolling activates
        },
        style: {
          fontFamily: 'Lato',
        }
      },
      title: {
        text: 'DISCIPLINE WISE ATHLETE INSURANCE STATUS'
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
        categories: this.disciplineWiseData?.xAxisCategories,
        // categories: ['Archery','Wrestling','Badminton','Hockey'],
        zoomEnabled: true,
        // labels: {
        //   format:
        //     '<div style="text-align:center;">&nbsp; Athlete&nbsp; Coach<br /><br />{value}</div>',
        //   useHTML: true
        // },
      },
      yAxis: {
        title: {
          // text: 'Number of KIC'
          text: ''
        },
      },
      plotOptions: {
        column: {
          stacking: 'normal',
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
              click: this.selectedColumnModalOpen.bind(this)              
            }
          }
        }
      },
      series: [
        {
          name: "Not Insured",
          data: this.disciplineWiseData?.athNotInsured,
          type: "column",
          stack: "Athlete",
          color: "#ccc"
        },
        {
          name: "Expired",
          data: this.disciplineWiseData?.athExpired,
          type: "column",
          stack: "Athlete",
          color: "#e8463a"
        },
        {
          name: "Pending",
          data: this.disciplineWiseData?.athPending,
          type: "column",
          stack: "Athlete",
          color: "#ffd500"
        },
        {
          name: "Insured",
          data: this.disciplineWiseData?.athInsured,
          type: "column",
          stack: "Athlete",
          color: "#42b808"
        }
      ]
    };
    this.chartOptionsDisciplineCoach = {
      chart: {
        type: 'column',
        backgroundColor: '#fff',
        scrollablePlotArea: {
          // minWidth: 600 // Set the minimum width before scrolling activates
        },
        style: {
          fontFamily: 'Lato',
        }
      },
      title: {
        text: 'DISCIPLINE WISE COACH INSURANCE STATUS'
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
        categories: this.disciplineWiseData?.xAxisCategories,
        // categories: ['Archery','Wrestling','Badminton','Hockey'],
        zoomEnabled: true,
        // labels: {
        //   format:
        //     '<div style="text-align:center;">&nbsp; Athlete&nbsp; Coach<br /><br />{value}</div>',
        //   useHTML: true
        // },
      },
      yAxis: {
        title: {
          // text: 'Number of KIC'
          text: ''
        },
      },
      plotOptions: {
        column: {
          stacking: 'normal',
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
              click:this.selectedColumnModalOpen.bind(this)
            }
          }
        }
      },
      series: [        
        {
          name: "Not Insured",
          data: this.disciplineWiseData?.coachNotInsured,
          type: "column",
          stack: "Coach",
          color: "#ccc"
        },
        {
          name: "Expired",
          data: this.disciplineWiseData?.coachExpired,
          type: "column",
          stack: "Coach",
          color: "#e8463a"
        },
        {
          name: "Pending",
          data: this.disciplineWiseData?.coachPending,
          type: "column",
          stack: "Coach",
          color: "#ffd500"
        },
        {
          name: "Insured",
          data: this.disciplineWiseData?.coachInsured,
          type: "column",
          stack: "Coach",
          color: "#42b808"
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
        text: 'CATEGORY WISE SPORTS SCIENTIST INSURANCE STATUS'
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
        categories: this.categoriesWiseData.xAxisCategories,
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
          stacking: 'normal',
          pointWidth: 20, // Set the width of the columns
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
              click:this.selectedColumnModalOpen.bind(this)
            }
          }
        }
      },
      series: [
        {
          name: 'Not Insured',
          type: 'column',
          stack:'Sport Scientist',
          color: '#ccc',
          data: this.categoriesWiseData.sSNotInsured
          // data: [10,20,30,5]
        },
        {
          name: 'Expired',
          type: 'column',
          stack:'Sport Scientist',
          color: '#e8463a',
          data: this.categoriesWiseData.sSExpired
          // data: [10,20,30,5]
        },
        {
          name: 'Pending',
          type: 'column',
          stack:'Sport Scientist',
          color: '#ffd500',
          data: this.categoriesWiseData.sSPending
          // data: [10,20,30,5]
        },
        {
          name: 'Insured',
          type: 'column',
          stack:'Sport Scientist',
          color: '#42b808',
          data: this.categoriesWiseData.sSInsured
          // data: [10,20,30,5]
        },
      ]
    };
  }
  transformData(data:any){
    let disciplineSeriesObj:any = {
      xAxisCategories:[],
      athNotInsured:[],
      athExpired:[],
      athPending:[],
      athInsured:[],
      coachNotInsured:[],
      coachExpired:[],
      coachPending:[],
      coachInsured:[]
    }
    data?.discipline?.forEach((element:any) => {
      disciplineSeriesObj.xAxisCategories.push(element.sport_display_name)
      disciplineSeriesObj.athNotInsured.push(element.ath_NotInsured);      
      disciplineSeriesObj.athExpired.push(element.ath_Expired);      
      disciplineSeriesObj.athPending.push(element.ath_Pending);      
      disciplineSeriesObj.athInsured.push(element.ath_Insured);      
      disciplineSeriesObj.coachNotInsured.push(element.coach_NotInsured);      
      disciplineSeriesObj.coachExpired.push(element.coach_Expired);      
      disciplineSeriesObj.coachPending.push(element.coach_Pending);      
      disciplineSeriesObj.coachInsured.push(element.coach_Insured);      
    });
    this.disciplineWiseData = disciplineSeriesObj
    let categoriesSeriesObj:any = {
      xAxisCategories:[],
      sSNotInsured:[],
      sSExpired:[],
      sSPending:[],
      sSInsured:[],
    }
    data?.category?.forEach((item:any)=>{
      categoriesSeriesObj.xAxisCategories.push(item.category);
      categoriesSeriesObj.sSNotInsured.push(item.sS_NotInsured);
      categoriesSeriesObj.sSExpired.push(item.sS_Expired);
      categoriesSeriesObj.sSPending.push(item.sS_Pending);
      categoriesSeriesObj.sSInsured.push(item.sS_Insured)
    })
    this.categoriesWiseData = categoriesSeriesObj
    // console.log(this.categoriesWiseData)

  }
  selectedColumnModalOpen(event:any){
    // console.log(event)
    // console.log(event.point.category)
    // console.log(event.point.series.userOptions.name)
    // console.log(event.point.series.userOptions.stack)
    const modalRef = this.modalService.open(StakeholderDashboardInsuranceDisciplineModalComponent,{
      size:'xl',
      centered: true,
      backdrop:'static',
      keyboard:false
    })
    modalRef.componentInstance.insuranceChartType = event.point.series.userOptions.stack;
    modalRef.componentInstance.disciplineName = event.point.category;
    modalRef.componentInstance.userId = this.user_id;
    modalRef.componentInstance.roleId = this.role_id;
    modalRef.componentInstance.rduserId = this.rduserId;
    modalRef.componentInstance.schemeId = this.schemeId;
  }
  
}
