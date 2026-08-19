import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts/highmaps';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicDashboardService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-dashboard/kic-dashboard.service';
import * as state from '../../../../../../assets/json/states/andaman-and-nicobar-islands.json'

@Component({
  selector: 'app-state-map-detail',
  templateUrl: './state-map-detail.component.html',
  styleUrls: ['./state-map-detail.component.css']
})
export class StateMapDetailComponent implements OnInit {


  type: string = 'mapChart';
  getStateMap: any = [];
  highcharts = Highcharts;
  chartOptions: Highcharts.Options = {}
  defaultStateColor: string = '#FFB303';

  @Input() selectedRegion: any = '0'
  @Input() category: any = 'detail_map' // state or discipline or detail_map or density_map
  userDetails: any

  clickedDistrictData: any
  showDistrictFlag: boolean = false;

  isShowMap: boolean = false
  loader: boolean = false;

  @Input() stateDetail: any = '';

  mapData: any = []
  constructor(private _kicDashboardService: KicDashboardService, private httpClient: HttpClient, private _storageService: StorageService, private _alertService: AlertService) {
    this.userDetails = this._storageService.getUserDetails();
  }

  ngOnInit(): void {

    // this.setMap();
    // this.getMapList()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getStateMap = []
    if (this.stateDetail != undefined && this.stateDetail != null) {
      this.stateMapDetail()
      this.setMap();
    }
  }

  setMap() {
    // +++++++++++++++++++++++++++++++++
    let filepath: string = ''
    if (this.stateDetail?.point?.name?.toLowerCase().indexOf(' ') > 0) {
      filepath = "./assets/json/states/" + this.stateDetail?.point?.name?.toLowerCase().replace(/ /g, "-") + ".json"
    }
    else {
      filepath = "./assets/json/states/" + this.stateDetail?.point?.name?.toLowerCase() + ".json"
    }
    this.httpClient.get(filepath).subscribe(async (data: any) => {
      this.getStateMap = await data
      this.isShowMap = true
      this.setMapOptions(this.mapData);
    })
    // +++++++++++++++++++++++++++++++++
  }

  selectDistrict(event: any) {
    this.showDistrictFlag = true;
    this.clickedDistrictData = event;
  }

  setMapOptions(mapData: any = []) {

    // // ++++++++++++ Static purpose Transforming District Data map START +++++++++++++++ 
    // this.getStateMap?.data[0]?.mapData.map((ele: any) => {
    //   ele["kic_name"] = 'Major Dhyanchand Synthetic Hockey Stadium';
    //   ele["kiud"] = 'HOAA002AP22';
    //   ele["pca_name"] = 'Lorem';
    //   ele["no_athlete"] = 10;
    //   ele["status"] = 'Operational';
    //   return ele;
    // })
    // // ++++++++++++ Static purpose Transforming District Data map START +++++++++++++++ 

    this.chartOptions = {
      chart: {
        map: this.getStateMap,
        style: {
          fontFamily: 'Lato'
        }
      },
      title: {
        text: "<b></b>"
      },
      subtitle: {
        text:
          ''
      },
      mapNavigation: {
        enabled: false,
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
        useHTML: true,
        formatter: function () {
          let point: any = this.point; // Current data point
          // Customize the tooltip content as needed
          let tooltipContent = '';
          tooltipContent += `<table>`
          tooltipContent += `<tr>`
          tooltipContent += `<td> District: </td> <td> <b>${point?.name} </b></td>`
          tooltipContent += `</tr>`
          if (point?.districtData?.length > 0) {
            tooltipContent += `<tr>`
            tooltipContent += `<td> KIC Name: </td> <td> <b>${point?.districtData[0]?.academy_name}</b></td>`
            tooltipContent += `</tr>`
            tooltipContent += `<tr>`
            tooltipContent += `<td> NSRS ID: </td> <td> <b>${point?.districtData[0]?.kiud}</b></td>`
            tooltipContent += `</tr>`
            tooltipContent += `<tr>`
            tooltipContent += `<td> PCA Name: </td> <td> <b>${point?.districtData[0]?.pca_name != undefined && point?.districtData[0]?.pca_name != null ? point?.districtData[0]?.pca_name : '-'}</b></td>`
            tooltipContent += `</tr>`
            tooltipContent += `<tr>`
            tooltipContent += `<td> No. Athletes: </td> <td> <b>${point?.districtData[0]?.no_of_athletes} </b></td>`
            tooltipContent += `</tr>`
            tooltipContent += `<tr>`
            tooltipContent += `<td> Operational Status: </td> <td > <b>${point?.districtData[0]?.status == 1 ? `<span style='color:#14A840'>Active</span>` : `<span style='color:#B90E0A'>Inactive</span>`}</b></td>`
            tooltipContent += `</tr>`
          }
          tooltipContent += `</table>`

          if (point?.districtData?.length > 1) {
            tooltipContent += `<div class="text-end fw-bold fs-5" style="color:#480A07">
                                    +${point?.districtData?.length - 1} more
                               </div>`
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
            click: this.selectDistrict.bind(this),
          },
          dataLabels: {
            enabled: true,
            // format: `<div style="font-size:16px font-weight:light">{point.name}</div>`,
            format: `{point.name}`,
          },
          allAreas: false,
          // keys: ['hc-key', 'value', 'color'],
          data: this.getStateMap?.data[0]?.data,
          joinBy: "id",
          // mapData: this.getStateMap?.data[0]?.mapData,  // for static purpose
          mapData: mapData,
        } as any,
      ]
    }
  }

  getMapList() {
    this.loader = true;
    let payload = {
      rcId: (this.userDetails?.role_id !== 1005 && this.userDetails?.role_id !== 46) ? this.selectedRegion : this.userDetails?.user_id,
      category: this.category,
      roleId: this.userDetails?.role_id,
      userId: this.userDetails?.user_id,
    }
    this._kicDashboardService.indiaMapList(payload).subscribe({
      next: (res: any) => {
        if (res?.status === 1) {
          this.mapData = res?.data;
          this.mapData.map((ele: any) => {
            ele["hc-key"] = ele["hc_key"]?.toLowerCase();
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


  showHideDistrictPopup(event: any) {
    this.showDistrictFlag = event;
  }

  stateMapDetail() {
    const payload = {
      address_state_id: this.stateDetail?.point?.state_id
    }
    this._kicDashboardService?.stateMapList(payload).subscribe(
      {
        next: (res: any) => {
          if (res?.status === 1) {
            this.getStateMap?.data[0]?.data.map((ele: any) => {
              ele["color"] = '#BDBDBD';
              return ele;
            });
            // +++++++++++ Tranform Data for district wise kic list Start ++++++++++
            let districtData: any = {};
            res?.data?.forEach((responseEle: any) => {
              if (districtData[responseEle?.address_district?.toLowerCase()]?.length > 0) {
                let objData = districtData[responseEle?.address_district?.toLowerCase()];
                objData.push(responseEle);
                districtData[responseEle?.address_district?.toLowerCase()] = objData;
              } else {
                districtData[responseEle?.address_district?.toLowerCase()] = [responseEle];
              }
            });
            // +++++++++++ Tranform Data for district wise kic list End ++++++++++

            // ++++++++++++ Mapping district Data with state map mapData START +++++++++++++++ 
            this.getStateMap?.data[0]?.mapData.map((ele: any) => {

              if (districtData[ele?.name?.toLowerCase()] != undefined && districtData[ele?.name?.toLowerCase()]?.length > 0) {
                ele.districtData = districtData[ele?.name?.toLowerCase()];
                this.getStateMap?.data[0]?.data.map((e: any) => {
                  if (e.id == ele.id) {
                    e["color"] = '#5BA164';
                  }
                  return ele;
                })
              }
              return ele;
            })
            // ++++++++++++ Mapping distrcit Data with state map mapData END +++++++++++++++ 

            // ++++++++++++ Transforming District Data map STOP +++++++++++++++ 
            this.setMapOptions(this.getStateMap?.data[0]?.mapData);
          } else {
            this._alertService?.swalPopErrorTimer(res?.message);
          }
        },
        error: (error) => {
          this._alertService?.swalPopErrorTimer(error?.error?.message);
        },
        complete: () => { }
      }

    )
  }

}
