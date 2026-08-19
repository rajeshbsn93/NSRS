import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({ providedIn:'root' })

export class CoachDashboardService{

  constructor(private http:HttpClient){}

  getOfficialDashboardData(official_detail_id:number){
    return  this.http.get<IOfficialDashboardData>(`${environment.apiURL}Official/GetOfficialDashboardData?official_detail_id=${official_detail_id}`);
  }
  
  coachAchievementDetail(coach_detail_id:number){
    return this.http.get<any>(`${environment.apiURL}Coach/GetCoachAchievementDetail?player_Detail_id=${coach_detail_id}`);
  }

  getOfficialPersonalInfo(official_detail_id:number){
    return this.http.get<any>(`${environment.apiURL}Official/GetOfficialPersonalInfo?official_detail_id=${official_detail_id}`);
  }

  saveOfficialPersonalInfo(data:any){
    return this.http.post<any>(`${environment.apiURL}Official/SaveOfficialPersonalInfo`,data);
  }

  changeCoachLoginPass(data:any){
    return this.http.post<any>(`${environment.apiURL}Coach/ChangeCoachLoginPass`,data);
  }

  getOfficialAddressInfo(official_detail_id:number){
    return this.http.get<any>(`${environment.apiURL}Official/GetOfficialAddressInfo?official_detail_id=${official_detail_id}`);
  }

  saveOfficialAddressInfo(body: any){
    return this.http.post<any>(`${environment.apiURL}Official/SaveOfficialAddressInfo`,body);
  }

  getLoginUserData() {
    return localStorage.getItem('loginUserdata') ? JSON.parse(localStorage.getItem('loginUserdata')!) : null;
  }

  setLoginUserData(data: any) {
    if (data) localStorage.setItem('loginUserdata', JSON.stringify(data));
  }
}

export interface IOfficialDashboardData {
  currentAcademy: string
  totalCurrentTrainee: number
  isAadharVerified: boolean
  has_recieved_discipline_specific_education: boolean
}

