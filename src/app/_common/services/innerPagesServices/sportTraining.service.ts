import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SportTrainingService {

constructor(private http:HttpClient) { }


sportsTrainingList(user_id:any,scheme_id:any){
  return this.http.get(`${environment.apiURL}StakeHolder/sdo/AcademyList?userid=${user_id}&schemeid=${scheme_id}`)
}
academyListFilter(user_id:any,data:any){
  var sport_ids = data.discipline;
  var state_ids = data.stateName;
  var schemeid = data.scheme;
  var nsrsid = data.nsrsid;
  var academyName = data.name;
  
  return this.http.get(`${environment.apiURL}StakeHolder/sdo/AcademyList?userid=${user_id}&schemeid=${schemeid}&sport_ids=${sport_ids}&stateid=${state_ids}&nsrs_id=${nsrsid}&name=${academyName}`)
}

academyDetailList(academyid:number,listType:number){
  return this.http.get(`${environment.apiURL}Common/GetList_Academywise?academyId=${academyid}&listType=${listType}`)
}

getStakeHolderSchemeList(userId:number,roleId:number){
  return this.http.get<StakeHolderSchemeListEntity>(`${environment.apiURL}StakeHolder/GetStakeHolderSchemeList?UserId=${userId}&RoleId=${roleId}`)
}


}

export interface StakeHolderSchemeListEntity{
  scheme_id: number
  scheme_owner_id: number
  scheme_name: string
  full_scheme_name: string
  schemeOwner: string
  short_name: string
}

