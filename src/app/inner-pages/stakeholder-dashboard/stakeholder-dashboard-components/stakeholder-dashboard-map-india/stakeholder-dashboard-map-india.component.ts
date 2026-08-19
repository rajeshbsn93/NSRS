import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts/highmaps';
import Indiamap from '../../../../../assets/json/india-map.json'

@Component({
  selector: 'app-stakeholder-dashboard-map-india',
  templateUrl: './stakeholder-dashboard-map-india.component.html',
  styleUrls: ['./stakeholder-dashboard-map-india.component.css']
})
export class StakeholderDashboardMapIndiaComponent implements OnInit, OnChanges {
  // type: any = 'mapChart';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartConstructor: any = "mapChart";
  @Input() defaultStateColor: string = '#F37022';
  mapData:any = []
  @Input() mapUpdatedData:Array<any> =[]
  constructor() { }

  ngOnInit() {
    // this.setMap();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.setMap();  
  }
  setMap(){
    this.mapUpdatedData?.length > 0 ?  this.mapUpdatedData.forEach((res:any)=>{
        this.mapData.push({ "hc-key" : res?.state_name.toLowerCase(), "value": 0, "color":this.updateColorItemsOPA(), "additionalData": res})
      }) :""
    this.chartOptions = {
      chart: {
        map: Indiamap,
      },
      colors: [this.defaultStateColor],
      title: {
        text: ""
      },
      subtitle: {
        text: ""
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          alignTo: "spacingBox"
        }
      },
      legend: {
        enabled: false
      },
      colorAxis: {
        min: 0
      },
      tooltip: {
        useHTML: true,
        backgroundColor: "",
        borderWidth: 0,
        shadow: false,
        formatter: function () {
          let point: any = this.point; 
          let tooltipContent = '';
          // tooltipContent += `
          // <div style="display:flex;justify-content:space-between;alingn-items:center;background-color:white;">
          //  <div style="display:flex;justify-content:space-between;alingn-items:center;background-color:white;">
          //   <span style="display:block;padding-top:0;padding-bottom:0;font-weight:600;box-shadow:none;">Academies:</span>
          //   <span style="display:block;padding-top:0;padding-bottom:0;font-weight:600;box-shadow:none;">${point?.options?.additionalData?.no_of_academy}</span>
          //  </div> 
          //  <div style="display:flex;justify-content:space-between;alingn-items:center;background-color:white;">
          //   <span style="display:block;padding-top:0;padding-bottom:0;font-weight:600;">Athletes:</span>
          //   <span style="display:block;padding-top:0;padding-bottom:0;font-weight:600;">${point?.options?.additionalData?.no_of_athletes}</span>
          //  </div>
          // </div>`
          // tooltipContent += `
          // <div style="display:flex;justify-content:space-between;alingn-items:center;background-color:white;">
          //  <div style="display:flex;justify-content:space-between;alingn-items:center;background-color:white;">
          //   <span style="display:block;padding-top:0;padding-bottom:0;font-weight:600;box-shadow:none;">Coaches:</span>
          //   <span style="display:block;padding-top:0;padding-bottom:0;font-weight:600;box-shadow:none;">${point?.options?.additionalData?.no_of_Coaches}</span>
          //  </div> 
          //  <div style="display:flex;justify-content:space-between;alingn-items:center;background-color:white;">
          //   <span style="display:block;padding-top:0;padding-bottom:0;font-weight:600;">Sport Scientist:</span>
          //   <span style="display:block;padding-top:0;padding-bottom:0;font-weight:600;">${point?.options?.additionalData?.no_of_SS}</span>
          //  </div>
          // </div>`
          tooltipContent +='<table class="table table-bordered text-center mb-0" style="font-family:lato">'
          tooltipContent +=`
          <tr style="background-color: #e3ffed;">
              <th>Head</th>
              <th>Number</th>
          </tr>
          `
          tooltipContent +=`
          <tr>
          <td>Academy</td>
          <td>${point?.options?.additionalData?.no_of_academy}</td>
          </tr>
          `
          tooltipContent +=`
          <tr>
          <td>Athlete</td>
          <td>${point?.options?.additionalData?.no_of_athletes}</td>
          </tr>
          `
          tooltipContent +=`
          <tr>
          <td>Coach</td>
          <td>${point?.options?.additionalData?.no_of_Coaches}</td>
          </tr>
          `
          tooltipContent +=`
          <tr>
          <td>Sport Scientist</td>
          <td>${point?.options?.additionalData?.no_of_SS}</td>
          </tr>
          `
          tooltipContent +='</table>'
          return tooltipContent;
        }
      },
   
      series: [
        {
          type: "map",
          name: "Random data",
          borderColor: "#000000",
          allowPointSelect: false,
          cursor: 'pointer',
          states: {
            hover: {
              color: "#BADA55"
            }
          },
          dataLabels: {
            enabled: true,
            format: `{point.name}`
          },
       
          allAreas: false,
          keys: ['hc-key', 'value', 'color', 'hc-a2'],
          data: this.mapData,
          
          // events: {
          //   click: this.selectState.bind(this)
          // },
        } as any
      ]
      
  }
  }
  updateColorItemsOPA(maleValue?:any ,femaleValue?:any):any{

    // let total = parseFloat(maleValue == "-" ? 0 : maleValue) + parseFloat(femaleValue == "-" ? 0 :femaleValue)
    // if(total > 100000000) {    return "#DE3F28"}
    // else if(total > 50000000) {return "#E5832B"}
    // else if(total > 25000000) {return "#EE973A"}
    // else if(total > 10000000) {return "#F5C23C"}
    // else{return "#F5C23C"}
    return "#F5C23C"
  }
  // removeCr(item:any){
  //   if(item.includes('Cr')){return Math.trunc(item != '_' ? item?.replace('Cr', '') :0)}
  //   else{return Math.trunc(item != '_' ? item?.replace('Lac', '') :0 )}
  // }

}
