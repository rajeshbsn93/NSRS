import { Component, Input, OnInit , OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
export interface SeriesInterface{
      name: string,
      type: 'column',
      data: [],
      stack: string,
      color: string,
      showInLegend: boolean
    }
@Component({
  selector: 'app-dashboard-bar-cart',
  templateUrl: './dashboard-bar-cart.component.html',
  styleUrls: ['./dashboard-bar-cart.component.css'],
})
export class DashboardBarCartComponent implements OnChanges {

  @Input() tileDataChart:any
  @Input() chartType:string=''
  tilesChartData:any = []

  updateFlag: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  stackChartOptions!: Highcharts.Options;
  years:any = []
  competitions:any = []
  
  

  constructor() { }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    if(changes['tileDataChart']){
      this.tilesChartData = changes['tileDataChart'].currentValue
      // stackChartOptions
      const yearSet:Set<String> = new Set()
      const competetionSet:Set<String> = new Set()
      this.tilesChartData.forEach((item:any)=>{
        const [competition, year] = item.comp_ShortCode.split(' ');
        competetionSet.add(competition)
        yearSet.add(year)
      })
      this.years = Array.from(yearSet).sort();
      this.competitions = Array.from(competetionSet)
      this.createStackBarChart();
      this.updateFlag = true;
     }
  }

  createStackBarChart() {
    this.stackChartOptions = {
      chart: { type: 'column', backgroundColor: '#fff', marginTop:100},
      title: { text: 'Year Wise Status', align:'left' },
      xAxis: {
        categories: this.years,
        title: { text: '' },
        labels: { style: { fontWeight: 'bold' } },
      },
      yAxis: {
        min: 0,
        title: { text: '' },
        stackLabels: {
          enabled: true,
          style: { fontWeight: 'bold', color: '#555' },
        },
      },
      legend: { reversed: false },
      tooltip: { shared: false },
      credits: { enabled: false },
      exporting:{
        enabled:false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: { enabled: true, color: '#000' },
        },
      },
      series: this.getSeriesData(),
    };
  }

  
  getDataGameStatusWise(game: string, status: 'rejected' | 'pending' | 'approved') {
    return this.years.map((year:any) => {
      const found = this.tilesChartData.find((d: any) => {
        const [comp, yr] = d.comp_ShortCode.split(' ');
        return comp === game && yr === year;
      });
      return found ? found[status] : 0;
    });
  }

  getSeriesData() {
    const statuses: ('rejected' | 'pending' | 'approved')[] = ['rejected', 'pending', 'approved'];

    return this.competitions.flatMap((comp:any) => {
      return statuses.map(status => ({
        name: `${comp}-${this.capitalize(status)}`,
        type: 'column',
        data: this.getDataGameStatusWise(comp, status),
        stack: comp,
        color: this.getColorCode(comp, status),
        showInLegend: false,
      }));
    });
  }

  getColorCode(competition: string, status: 'rejected' | 'pending' | 'approved') {
    const colors:any = {
      KIYG: { approved: '#B46E27', pending: '#FFD3A7', rejected: '#ECB47B' },
      KIPG: { approved: '#B46E27', pending: '#FFD3A7', rejected: '#ECB47B' },
      KIWG: { approved: '#3F114B', pending: '#A57DAF', rejected: '#72547A' },
      KIUG: { approved: '#3F114B', pending: '#A57DAF', rejected: '#72547A' },
      default: { approved: '#3F114B', pending: '#A57DAF', rejected: '#72547A' },
    };

    return (colors[competition] || colors.default)[status];
  }

  capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }



}
