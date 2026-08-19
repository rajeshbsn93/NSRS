import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoachService {

constructor(private http:HttpClient) { }

coachList(user_id:any,nsrs_id:any,name:any,sport_id:any,scheme_id:any,gender:any){
  return this.http.post(`${environment.apiURL}StakeHolder/sdo/CoachList`,{user_id,nsrs_id,name,sport_id,scheme_id,gender})
}

saiCoachList(user_id:any,nsrs_id:any,name:any,sport_id:any,scheme_id:any,gender:any){
  return this.http.post(`${environment.apiURL}StakeHolder/sdo/SAICoachList`,{user_id,nsrs_id,name,sport_id,gender})
}

coachListFilter(user_id:any,data:any){
  var nsrs_id=data.nsrsid
  var name=data.name
  if(data.discipline==''){
    sport_id=0
  }
  var sport_id=data.discipline
  var scheme_id=data.scheme
  if(scheme_id=='')
  {
    scheme_id=0
  }
  var gender=data.gender
  return this.http.post(`${environment.apiURL}StakeHolder/sdo/CoachList`,{user_id,nsrs_id,name,sport_id,scheme_id,gender})
}

getCoachTransferList(roleId:number){
  return this.http.get(`${environment.apiURL}StakeHolder/GetCoachTransferList?roleId=${roleId}`)
}
getTransferPopupDetail(payload:any){
  return this.http.get(`${environment.apiURL}StakeHolder/GetTransferPopupDetail?Id=${payload?.official_detail_id}&RoleId=${payload?.roleId}`)
}

}

export interface CoachTransferListEntity{
  academy_coach_detail_id: number
  official_detail_id: number
  academy_detail_id: number
  kitd_unique_id: string
  full_name: string
  gender: string
  sport_name: string
  designation: string
  previousAcademy: string
  transferDate: string
  currentAcademy: string
  date_of_joining: string | null
  joiningStatus: string
}
