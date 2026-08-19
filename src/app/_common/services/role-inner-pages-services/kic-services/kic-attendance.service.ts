import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KicAttendanceService {

  private isListRefresh = new BehaviorSubject<boolean>(false);
  isListRefreshObs$ = this.isListRefresh.asObservable();

  private showAddBtnAthlete = new BehaviorSubject<boolean>(true);
  showAddBtnAthleteObs$ = this.showAddBtnAthlete.asObservable();

 

  constructor(private _http: HttpClient) { }


//   getEquipmentProcurement(user_id: number, role_id: number, scheme_role_Id?: number) {
//     const finalSchemeRoleId = (scheme_role_Id === undefined || scheme_role_Id === null) ? 82 : scheme_role_Id;
//     return this._http.get(`${environment.apiURL}EquipmentMonitoring/GetEquipmentMonitoringData?user_id=${user_id}&RoleId=${role_id}&Scheme_Roll_Id=${finalSchemeRoleId}`)
// }

  getKicAttendance(payload: any , scheme_role_Id?: number) {
    const finalSchemeRoleId = (scheme_role_Id === undefined || scheme_role_Id === null) ? 82 : scheme_role_Id;
    return this._http.get<any>(`${environment.apiURL}Attendance/UserData?UserId=${payload?.userId}&role_id=${payload?.roleId}&Scheme_Roll_Id=${finalSchemeRoleId}`);
  }
  getKicAttendanceState(userId: number, roleId: number , scheme_role_Id?: number) {
    const finalSchemeRoleId = (scheme_role_Id === undefined || scheme_role_Id === null) ? 82 : scheme_role_Id;
    return this._http.get<any>(`${environment.apiURL}Attendance/UserData?UserId=${userId}&role_id=${roleId}&Scheme_Roll_Id=${finalSchemeRoleId}`);
  }
  getKicAttendanceRc(userId: number, roleId: number, scheme_role_Id?: number) {
    const finalSchemeRoleId = (scheme_role_Id === undefined || scheme_role_Id === null) ? 82 : scheme_role_Id;
    return this._http.get<any>(`${environment.apiURL}Attendance/UserData?UserId=${userId}&role_id=${roleId}&Scheme_Roll_Id=${finalSchemeRoleId}`);
  }
  getKicAttendanceHo(userId: number, roleId: number,scheme_role_Id?: number) {
    const finalSchemeRoleId = (scheme_role_Id === undefined || scheme_role_Id === null) ? 82 : scheme_role_Id;
    return this._http.get<any>(`${environment.apiURL}Attendance/UserData?UserId=${userId}&role_id=${roleId}&Scheme_Roll_Id=${finalSchemeRoleId}`);
  }


  // ++++++++++ setIsListRefresh  ++++++++++ 
  setIsListRefresh(value: boolean = false) {
    this.isListRefresh.next(value)
  };

  // ++++++++++ getIsListRefresh  ++++++++++ 
  public getIsListRefresh() {
    return this.isListRefreshObs$
  }
  
  // ++++++++++ setIsListRefresh  ++++++++++ 
  setShowAddBtnAthlete(value: boolean = false) {
    this.showAddBtnAthlete.next(value)
  };

  // ++++++++++ getIsListRefresh  ++++++++++ 
  public getShowAddBtnAthlete() {
    return this.showAddBtnAthleteObs$
  }

  // api calling for getting academy list on tabs for varios stackholder in KIC
  getKicAcademyList(userId: number, schemeId: number) {
    return this._http.get(`${environment.apiURL}StakeHolder/sdo/AcademyList?userid=${userId}&schemeid=${schemeId}`)
  }
  // +++++ getKicAttendanceByKicId+++++
  getKicAttendanceByKicId(payload: any) {
    return this._http.get<any>(`${environment.apiURL}Attendance/GetKICIdDetail?Kiuid=${payload?.kicId}`);
  }

  // +++++ getKicAttendanceByKicRcId+++++
  getKicAttendanceByKicRcId(payload: any,scheme_role_Id?: number) {
     const finalSchemeRoleId = (scheme_role_Id === undefined || scheme_role_Id === null) ? 82 : scheme_role_Id;
    return this._http.get<any>(`${environment.apiURL}Attendance/kicDetailsByRcId?RcId=${payload.kicRcId}&scheme_Roll_Id=${finalSchemeRoleId}`);
  }

}


