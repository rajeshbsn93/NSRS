import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

@Component({
  selector: 'app-sdo-dashboard',
  templateUrl: './sdo-dashboard.component.html',
  styleUrls: ['./sdo-dashboard.component.css']
})
export class SdoDashboardComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  chartOptions: Highcharts.Options = {
    series: [{
      name: 'Games',
      data: [1, 2, 3],
      type: 'column',
      
    }],
    title: {
      text: 'Participation'
    },
    xAxis: {
      categories: ['Athletes', 'Badminton', 'Archery']
    },
    yAxis: {
      min: 0,
      title: {
        text: null
      }
    },
    credits: {
      enabled: false
    },
  };

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fa-solid fa-angle-left"></i>', '<i class="fa-solid fa-angle-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: true,
    margin: 15
  }
}
