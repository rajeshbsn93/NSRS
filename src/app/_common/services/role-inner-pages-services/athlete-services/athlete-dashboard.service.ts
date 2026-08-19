import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {AthleteAchievementOjectItem, AthleteDashboardIRootObject } from "src/app/_common/models/athlete-dashboard";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class AthleteDashboardService{

  constructor(private http:HttpClient){}
  GetAthleteDashboardData(athlete_detail_id:number){
    return  this.http.get<AthleteDashboardIRootObject>(`${environment.apiURL}Athlete/GetAthleteDashboardData?id=${athlete_detail_id}`)
  }
  
  athleteAchievementDetail(athlete_detail_id:number){
    return this.http.get<AthleteAchievementOjectItem>(`${environment.apiURL}Athlete/GetAthleteAchievementDetail?player_Detail_id=${athlete_detail_id}`)
  }
  getAthletePersonalInfo(athlete_detail_id:number){
    return this.http.get<AthleteAchievementOjectItem>(`${environment.apiURL}Athlete/GetAthletePersonalInfo?player_Detail_id=${athlete_detail_id}`)
  }
  updateAthletePersonalInfo(data:any){
    return this.http.post(`${environment.apiURL}Athlete/EditAthletePersonalInfo`,data)
  }

  changeAthleteLoginPass(data:any){
    return this.http.post(`${environment.apiURL}Athlete/ChangeAthleteLoginPass`,data)
  }
  
  getUserAbletoAddAchievement(){
    return this.http.get(`${environment.apiURL}StakeHolder/Get_userAbletoAddAchievement`)
  }

  verifyPlayerAchievement(achievementId:number,status:number){
    return this.http.get<AthleteAchievementOjectItem>(`${environment.apiURL}StakeHolder/VerifyPlayerAchievement?achievementId=${achievementId}&status=${status}`)
  }
  getCertificateForParticipant(cert_no:string,is_merit:any){
    return this.http.get('https://digilocker.kheloindia.gov.in/api/v1/get/achievements/certificate?cert_no='+cert_no+'&is_merit='+is_merit)
  }
}

