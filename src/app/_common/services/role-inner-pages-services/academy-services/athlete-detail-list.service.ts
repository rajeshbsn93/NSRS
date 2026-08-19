import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AthleteDetailListService {

  constructor(private http:HttpClient) { }

  academyAthleteDetailList(academyUserId:any){
    return this.http.get(`${environment.apiURL}Academy/AcademyAthleteList?academy_detail_id=${academyUserId}`)
  }

  academyAthleteGetDateByNSRSId(academy_User_id:any,nsrs_id:any){
    return this.http.get(`${environment.apiURL}Academy/AcademyAteleteMappingDetail?academy_detail_id=${academy_User_id}&kitd_unique_id=${nsrs_id}`)
  }

  saveAcademyAthleteData(academyUserId:any,body:any){
    return this.http.post(`${environment.apiURL}Academy/AcademyAteleteMapping?academy_detail_id=${academyUserId}`,body)
  }

  DeleteAcademyMapping(opt_type:number,academy_detail_id:number,nsrsid:any){
    return this.http.post(`${environment.apiURL}Academy/DeleteAcademyMapping?role_id=${opt_type}&academy_detail_id=${academy_detail_id}&nsrsId=${nsrsid}`,{})
  }

  ResetPassword(nsrs_id:string){
    return this.http.post(`${environment.apiURL}Academy/ResetPassword?nsrs_id=${nsrs_id}`, {})
  }

  WeedOut(formdata:any){
    return this.http.post(`${environment.apiURL}StakeHolder/WeedOut`, formdata)
  }
  getAcademyAthleteHistoryList(academy_detail_id:number){
    return this.http.get(`${environment.apiURL}Academy/Get_Academy_Athlete_HistoryList?academy_detail_id=${academy_detail_id}`)
  }




}
