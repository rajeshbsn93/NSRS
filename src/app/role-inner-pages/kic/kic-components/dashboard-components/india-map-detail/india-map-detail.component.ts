import { style } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts/highmaps';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicDashboardService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-dashboard/kic-dashboard.service';

@Component({
  selector: 'app-india-map-detail',
  templateUrl: './india-map-detail.component.html',
  styleUrls: ['./india-map-detail.component.css']
})
export class IndiaMapDetailComponent implements OnInit {


  type: string = 'mapChart';
  getNationalMap: any = '';
  highcharts = Highcharts;
  chartOptions: Highcharts.Options = {}
  defaultStateColor: string = '#FFB303';

  @Input() selectedRegion: any = '0'
  @Input() category: any = 'detail_map' //state or discipline or detail_map or density_map
  userDetails: any

  @Output() stateNameClickEvent: any = new EventEmitter();

  isShowMap: boolean = false
  loader: boolean = false;

  colorGrade1: string = '#072F5F'
  colorGrade2: string = '#1261A0'
  colorGrade3: string = '#3895D3'
  colorGrade4: string = '#58CCED'

  // mapData: any = [
  //   { "hc-key": 'madhya pradesh', "value": 0, "color": this.defaultStateColor, athlete: 1, coach: 2, pca: 3, kic: 4, is_show: true, },
  //   { "hc-key": 'uttar pradesh', "value": 0, "color": this.defaultStateColor, athlete: 5, coach: 6, pca: 7, kic: 8, is_show: true },
  //   { "hc-key": 'karnataka', "value": 0, "color": this.defaultStateColor, athlete: 9, coach: 10, pca: 11, kic: 12, is_show: true },
  //   { "hc-key": 'nagaland', "value": 0, "color": this.defaultStateColor, athlete: 13, coach: 14, pca: 15, kic: 16, is_show: true },
  //   { "hc-key": 'bihar', "value": 0, "color": this.defaultStateColor, athlete: 17, coach: 18, pca: 19, kic: 20, is_show: true },
  //   { "hc-key": 'lakshadweep', "value": 0, "color": this.defaultStateColor, athlete: 21, coach: 22, pca: 23, kic: 24, is_show: true },
  //   { "hc-key": 'andaman and nicobar islands', "value": 0, "color": this.defaultStateColor, athlete: 25, coach: 26, pca: 27, kic: 28, is_show: true },
  //   { "hc-key": 'assam', "value": 0, "color": this.defaultStateColor, athlete: 29, coach: 30, pca: 31, kic: 32, is_show: true },
  //   { "hc-key": 'west bengal', "value": 0, "color": this.defaultStateColor, athlete: 33, coach: 34, pca: 35, kic: 36, is_show: true },
  //   { "hc-key": 'puducherry', "value": 0, "color": this.defaultStateColor, athlete: 37, coach: 38, pca: 39, kic: 40, is_show: true },
  //   { "hc-key": 'daman and diu', "value": 0, "color": this.defaultStateColor, athlete: 41, coach: 42, pca: 43, kic: 44, is_show: true },
  //   { "hc-key": 'gujarat', "value": 0, "color": this.defaultStateColor, athlete: 45, coach: 46, pca: 47, kic: 48, is_show: true },
  //   { "hc-key": 'rajasthan', "value": 0, "color": this.defaultStateColor, athlete: 49, coach: 50, pca: 51, kic: 52, is_show: true },
  //   { "hc-key": 'dadra and nagar haveli and daman and diu', "value": 0, "color": this.defaultStateColor, athlete: 51, coach: 52, pca: 53, kic: 54, is_show: true },
  //   { "hc-key": 'chhattisgarh', "value": 0, "color": this.defaultStateColor, athlete: 55, coach: 56, pca: 57, kic: 58, is_show: true },
  //   { "hc-key": 'tamil nadu', "value": 0, "color": this.defaultStateColor, athlete: 59, coach: 60, pca: 61, kic: 62, is_show: true },
  //   { "hc-key": 'chandigarh', "value": 0, "color": this.defaultStateColor, athlete: 63, coach: 64, pca: 65, kic: 66, is_show: true },
  //   { "hc-key": 'punjab', "value": 0, "color": this.defaultStateColor, athlete: 67, coach: 68, pca: 69, kic: 70, is_show: true },
  //   { "hc-key": 'haryana', "value": 0, "color": this.defaultStateColor, athlete: 71, coach: 72, pca: 73, kic: 74, is_show: true },
  //   { "hc-key": 'andhra pradesh', "value": 0, "color": this.defaultStateColor, athlete: 75, coach: 76, pca: 77, kic: 78, is_show: true },
  //   { "hc-key": 'maharashtra', "value": 0, "color": this.defaultStateColor, athlete: 79, coach: 80, pca: 81, kic: 82, is_show: true },
  //   { "hc-key": 'himachal pradesh', "value": 0, "color": this.defaultStateColor, athlete: 83, coach: 84, pca: 85, kic: 86, is_show: true },
  //   { "hc-key": 'meghalaya', "value": 0, "color": this.defaultStateColor, athlete: 87, coach: 88, pca: 89, kic: 90, is_show: true },
  //   { "hc-key": 'kerala', "value": 0, "color": this.defaultStateColor, athlete: 91, coach: 92, pca: 93, kic: 94, is_show: true },
  //   { "hc-key": 'telangana', "value": 0, "color": this.defaultStateColor, athlete: 95, coach: 96, pca: 97, kic: 98, is_show: true },
  //   { "hc-key": 'mizoram', "value": 0, "color": this.defaultStateColor, athlete: 99, coach: 100, pca: 101, kic: 102, is_show: true },
  //   { "hc-key": 'tripura', "value": 0, "color": this.defaultStateColor, athlete: 103, coach: 104, pca: 405, kic: 106, is_show: true },
  //   { "hc-key": 'manipur', "value": 0, "color": this.defaultStateColor, athlete: 107, coach: 108, pca: 109, kic: 110, is_show: true },
  //   { "hc-key": 'arunachal pradesh', "value": 0, "color": this.defaultStateColor, athlete: 111, coach: 112, pca: 113, kic: 114, is_show: true },
  //   { "hc-key": 'jharkhand', "value": 0, "color": this.defaultStateColor, athlete: 115, coach: 116, pca: 117, kic: 118, is_show: true },
  //   { "hc-key": 'goa', "value": 0, "color": this.defaultStateColor, athlete: 119, coach: 120, pca: 121, kic: 122, is_show: true },
  //   { "hc-key": 'delhi', "value": 0, "color": this.defaultStateColor, athlete: 123, coach: 124, pca: 125, kic: 126, is_show: true },
  //   { "hc-key": 'odisha', "value": 0, "color": this.defaultStateColor, athlete: 127, coach: 128, pca: 129, kic: 130, is_show: true },
  //   { "hc-key": 'jammu and kashmir', "value": 0, "color": this.defaultStateColor, athlete: 131, coach: 132, pca: 133, kic: 134, is_show: true },
  //   { "hc-key": 'sikkim', "value": 0, "color": this.defaultStateColor, athlete: 135, coach: 136, pca: 137, kic: 138, is_show: true },
  //   { "hc-key": 'uttarakhand', "value": 0, "color": this.defaultStateColor, athlete: 139, coach: 140, pca: 141, kic: 142, is_show: true },
  //   { "hc-key": 'ladakh', "value": 0, "color": this.defaultStateColor, athlete: 143, coach: 144, pca: 145, kic: 146, is_show: true },
  // ]
  mapData: any = []
  constructor(private _kicDashboardService: KicDashboardService, private httpClient: HttpClient, private _storageService: StorageService, private _alertService: AlertService) {
    this.userDetails = this._storageService.getUserDetails();
  }

  ngOnInit(): void {

    // this.setMap();
    // this.getMapList()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.mapData = [];
    this.getMapList();
    this.setMap();
  }

  setMap() {
    this.httpClient.get('./assets/json/india-map.json').subscribe(async (data) => {
      this.getNationalMap = await data
      this.isShowMap = true
      this.setMapOptions(this.mapData);
    })
  }
  selectState(event: any) {
    this.stateNameClickEvent.emit(event);
  }

  setMapOptions(mapData: any = []) {
    this.chartOptions = {
      chart: {
        map: this.getNationalMap,
        style: {
          fontFamily: 'Lato'
        }
      },
      title: {
        text: "<b>By clicking any State/UT on the map, you can view its information</b>"
      },
      subtitle: {
        text:
          ''
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
      credits: {
        enabled: false,
      },
      colorAxis: {
        min: 0
      },
      tooltip: {
        formatter: function () {
          let point: any = this.point; // Current data point
          // Customize the tooltip content as needed
          let tooltipContent = '<b>' + point.name + '</b><br>';
          if (point?.options?.is_show === 'TRUE') {
            tooltipContent += `KIC: <b>${point?.options?.kic} </b>`
            tooltipContent += `Coaches: <b>${point?.options?.coach} </b> <br>`
            tooltipContent += `Athlete: <b>${point?.options?.athlete} </b>`
            tooltipContent += `PCA: <b>${point?.options?.pca} </b> <br>`
            tooltipContent += `District: <b>${point?.options?.districts} </b>`
          }
          return tooltipContent;
        }
      },
      series: [
        {
          type: "map",
          allowPointSelect: false,
          cursor: 'pointer',
          states: {
            hover: {
              color: '#fd7e14',
              borderColor: '#288d85',
            },
            select: {
              color: '#26c0d8',
              borderColor: '#288d85',
            },
          },
          events: {
            click: this.selectState.bind(this),
          },
          dataLabels: {
            enabled: true,
            format: `{point.name}`,
            style: {
              color: 'white',
            }
          },
          allAreas: false,
          keys: ['hc-key', 'value', 'color'],
          data: mapData,
        } as any,
      ]
    }

  }

  getMapList() {
    this.loader = true;
    let payload = {
      rcId: (this.userDetails?.role_id !== 1005 && this.userDetails?.role_id !== 46) ? this.selectedRegion : this.userDetails?.user_id,
      category: this.category == 'detail_map' ? 'density_map' : this.category,
      roleId: this.userDetails?.role_id,
      userId: this.userDetails?.user_id,
    }
    this._kicDashboardService.indiaMapList(payload).subscribe({
      next: (res: any) => {
        if (res?.status === 1) {
          this.mapData = res?.data;
          this.mapData.map((ele: any) => {
            ele["hc-key"] = ele["state_name"]?.toLowerCase();
            if (((ele?.kic / ele?.districts) < 0.5) || isNaN((ele?.kic / ele?.districts))) {
              ele["color"] = this.colorGrade4;
            }
            if (((ele?.kic / ele?.districts) > 0.5) && !isNaN((ele?.kic / ele?.districts))) {
              ele["color"] = this.colorGrade3;
            }
            if (((ele?.kic / ele?.districts) > 0.8) && !isNaN((ele?.kic / ele?.districts))) {
              ele["color"] = this.colorGrade2;
            }
            if (((ele?.kic / ele?.districts) > 1) && !isNaN((ele?.kic / ele?.districts))) {
              ele["color"] = this.colorGrade1;
            }
            return ele;
          })
          this.mapData.filter((ele: any) => ele?.is_show != false)
          this.setMapOptions(this.mapData);
        } else {
          this._alertService?.swalPopErrorTimer(res?.message);
        }
        this.loader = false;
      },
      error: (errors: any) => {
        this.loader = false;
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
      },
      complete: () => { }
    })
  }


}
