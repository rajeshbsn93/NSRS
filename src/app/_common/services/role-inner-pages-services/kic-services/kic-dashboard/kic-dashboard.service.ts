import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KicDashboardService {

  constructor(private _httpClient: HttpClient) { }

  rcList(payload: any = {}) {
    return this._httpClient.get<any>(`${environment.apiURL}kic_dashboard/mst_rc_list`);
  }
  kicMftCount(payload: any = { regionId: '' }) {
    return this._httpClient.get<any>(`${environment.apiURL}kic_dashboard/mft_count_card_list?role_id=${payload?.roleId}&user_id=${payload?.userId}&region_id=${payload?.regionId}`);
  }

  categorywiseCard(payload: any) {
    return this._httpClient.get<any>(`${environment.apiURL}kic_dashboard/categorywise_count_card_list?role_id=${payload?.roleId}&user_id=${payload?.userId}&category=${payload?.category}&region_id=${payload?.regionId}`);
  }

  stateFundStatusList(payload: any) {
    return this._httpClient.get<any>(`${environment.apiURL}kic_dashboard/fund_detail_list?role_id=${payload?.roleId}&user_id=${payload?.userId}&category=${payload?.category}&region_id=${payload.rcId}`);
  }
  indiaMapJson() {
    return this._httpClient.get<any>(`../../../../../../assets/json/india-map.json`);
  }
  indiaMapList(payload: any) {
    return this._httpClient.get<any>(`${environment.apiURL}kic_dashboard/dashboard_map_list?role_id=${payload?.roleId}&user_id=${payload?.userId}&category=${payload?.category}&region_id=${payload.rcId}`);
  }
  stateMapList(payload: any) {
    return this._httpClient.post<any>(`${environment.apiURL}kic_dashboard/state_wise_district_list`, payload);
  }



  /************************************************************************************************************************
   * KISCSE DASHBOARD API's                                                                                                                 *
   ************************************************************************************************************************/

  kisceMftCount(payload: any = {regionId: ''}) {
    return this._httpClient.get<any>(`${environment.apiURL}kisce_dashboard/kisce_mft_count_card_list?role_id=${payload?.roleId}&user_id=${payload?.userId}&region_id=${payload?.regionId}&Scheme_Roll_Id=${payload.schemeRoleId}`);
  }

  categorywiseCardForKisce(payload: any) {
    return this._httpClient.get<any>(`${environment.apiURL}kisce_dashboard/kisce_categorywise_count_card_list?role_id=${payload?.roleId}&user_id=${payload?.userId}&category=${payload?.category}&region_id=${payload?.regionId}&Scheme_Roll_Id=${payload.schemeRoleId}`);
  }

  indiaMapListForKisce(payload: any) {
    return this._httpClient.get<any>(`${environment.apiURL}kisce_dashboard/kisce_dashboard_map_list?role_id=${payload?.roleId}&user_id=${payload?.userId}&category=${payload?.category}&region_id=${payload.rcId}&Scheme_Roll_Id=${payload.schemeRoleId}`);
  }
  stateMapListforKisce(payload: any) {
    return this._httpClient.post<any>(`${environment.apiURL}kisce_dashboard/kisce_state_wise_district_list`, payload);
  }
  

}