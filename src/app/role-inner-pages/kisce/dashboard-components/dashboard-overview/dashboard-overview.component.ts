import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css']
})
export class DashboardOverviewComponent implements OnInit, OnChanges {

  highcharts = Highcharts;
  chartOptionsKicPca: Highcharts.Options = {};
  chartOptionsAthleteCoach: Highcharts.Options = {};
  chartOptionsRatioPcaKicAthleteCoach: Highcharts.Options = {};
  seriesDataObj: any = []

  @Input() cardList: any = []
  @Input() loader: boolean = false;


  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.transformData(this.cardList);
    this.setChart()
    // console.log(this.cardList);

  }

  setChart() {
    this.chartOptionsKicPca = {
      chart: {
        type: 'column',
        backgroundColor: '#F2F7FF',
        scrollablePlotArea: {
          // minWidth: 600 // Set the minimum width before scrolling activates
        },
        style: {
          fontFamily: 'Lato'
        }
      },
      title: {
        text: 'DISTRIBUTION OF KISCE & COACH'
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
        categories: this.seriesDataObj?.xAxisCategories,
        zoomEnabled: true
      },
      yAxis: {
        title: {
          text: 'Number of KISCE'
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
        }
      },
      series: [
        {
          name: 'No. Of KISCE',
          type: 'column',
          color: '#0E335D',
          data: this.seriesDataObj?.kicData
        },
        {
          name: 'No. Of Coach',
          type: 'column',
          color: '#3B75B7',
          data: this.seriesDataObj?.coachData
        }
      ]
    };

    this.chartOptionsAthleteCoach = {
      ...this.chartOptionsKicPca,
      chart: {
        type: 'column',
        backgroundColor: '#FFF2F2',
        scrollablePlotArea: {
          // minWidth: 600 // Set the minimum width before scrolling activates
        },
        style: {
          fontFamily: 'Lato'
        }
        
      },
      title: {
        text: 'DISTRIBUTION OF ATHLETE & COACHES'
      },
      series: [
        {
          name: 'No. Of Athlete',
          type: 'column',
          color: '#D17171',
          data: this.seriesDataObj?.athleteData
        },
        {
          name: 'No. Of Coach',
          type: 'column',
          color: '#F8A6A6',
          data: this.seriesDataObj?.coachData
        }
      ]

    }
    this.chartOptionsRatioPcaKicAthleteCoach = {
      ...this.chartOptionsKicPca,
      chart: {
        type: 'column',
        backgroundColor: '#F1FFF8',
        scrollablePlotArea: {
          // minWidth: 600 // Set the minimum width before scrolling activates
        },
        style: {
          fontFamily: 'Lato'
        }
      },
      title: {
        text: 'DISTRIBUTION OF KISCE & COACH/ATHLETE'
      },
      plotOptions: {
        column: {
          pointWidth: 10, // Set the width of the columns
          // pointPadding: 0.9, // Adjust the space between columns within a group
          // groupPadding: 0.1, // Adjust the space between groups of columns
          dataLabels: {
            enabled: true,
            format: '{point.y:.2f}' // Display the count on each column
          }
        }
      },
      // tooltip: {
      //   formatter: function () {
      //     let point: any = this.point; // Current data point
      //     // Customize the tooltip content as needed
      //     let tooltipContent = '<b>' + point?.category + '</b><br>';
      //     tooltipContent += `<b>${point?.y.toFixed(2)} </b>`
      //     return tooltipContent;
      //   }
      // },
      series: [
        {
          name: 'Coach/KISCE Ratio',
          type: 'column',
          color: '#297B55',
          data: this.seriesDataObj?.pcaKicData
        },
        {
          name: 'Coach/Athlete Ratio',
          type: 'column',
          color: '#3BB77D',
          data: this.seriesDataObj?.coachAthleteData
        }
      ]

    }

  }

  transformData(data: any) {
    let transData: any = {
      xAxisCategories: [],
      kicData: [],
      pcaData: [],
      athleteData: [],
      coachData: [],
      pcaKicData: [],
      coachAthleteData: [],
    };
    data.forEach((ele: any) => {
      transData.xAxisCategories.push(ele?.name);
      transData.kicData.push(ele?.no_of_kics);
      transData.pcaData.push(ele?.no_of_pca);
      transData.athleteData.push(ele?.no_of_athletes);
      transData.coachData.push(ele?.no_of_coaches);
      transData.pcaKicData.push(ele?.pca_kic_ratio);
      transData.coachAthleteData.push(ele?.coach_athlete_ratio);
    });
    this.seriesDataObj = transData;
  }

}

