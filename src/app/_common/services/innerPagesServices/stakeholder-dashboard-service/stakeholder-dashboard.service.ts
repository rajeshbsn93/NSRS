import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StakeholderDashboardService {

constructor(private _http:HttpClient) { }

getOpsTilesData(role_id:number,user_id:number,rduser_id:number,scheme_id:number){
  return this._http.get(`${environment.apiURL}StakeHolder/Get_Ops_Tiles_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}`)
}
get_Ops_Graph_Data_Coresp(role_id:number,user_id:number,rduser_id:number,scheme_id:number){
  return this._http.get(`${environment.apiURL}StakeHolder/Get_Ops_Graph_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}`)
}
get_Ops_StateWise_Data(role_id:number,user_id:number,rduser_id:number,scheme_id:number){
  return this._http.get(`${environment.apiURL}StakeHolder/Get_Ops_StateWise_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}`)
}
get_Ops_DisciplineWise_Data(role_id:number,user_id:number,rduser_id:number,scheme_id:number){
  return this._http.get(`${environment.apiURL}StakeHolder/Get_Ops_DisciplineWise_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}`)
}
getOpsVacancyWiseData(role_id:number,user_id:number,rduser_id:number,scheme_id:number){
  return  this._http.get(`${environment.apiURL}StakeHolder/Get_Ops_VacancyWise_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}`)
}
mapData(role_id:number,user_id:number,rduser_id:number,scheme_id:number){
  return  this._http.get(`${environment.apiURL}StakeHolder/Get_Ops_Map_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}`)
}
getOpsInsuranceData(role_id:number,user_id:number,rduser_id:number,scheme_id:number){
  return  this._http.get(`${environment.apiURL}StakeHolder/Get_Ops_Insurance_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}`)
}
getDisciplineWiseAthleteVacancy(
  role_id:number,
  user_id :number,
  rduser_id:number,
  scheme_id:number,
  Sport_name:string
){
  return this._http.get<DisciplineWiseAthleteVacancyEntity>(`${environment.apiURL}StakeHolder/Get_Ops_AcademyDisciplineWise_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}&Sport_name=${Sport_name}`)
}

getOpsInsuranceDetailData(
  role_id:number,
  user_id :number,
  rduser_id:number,
  scheme_id:number,
  dataRoleId:number,
  Sport_name:string  
){
  return this._http.get(`${environment.apiURL}StakeHolder/Get_Ops_Insurance_Detail_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}&DataRoleId=${dataRoleId}&sportsName=${Sport_name}`)
}

getOpsGraphDetailData(
  role_id:number,
  user_id :number,
  rduser_id:number,
  scheme_id:number,
){
  return this._http.get(`${environment.apiURL}StakeHolder/Get_Ops_Graph_Detail_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}`)
}
getOpsStateWiseDetailData(
  role_id:number,
  user_id :number,
  rduser_id:number,
  scheme_id:number,
  stateName:string
){
  return this._http.get(`${environment.apiURL}StakeHolder/Get_Ops_StateWise_Detail_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}&StateName=${stateName}`)
}
getOpsDisciplineWiseWiseDetailData(
  role_id:number,
  user_id :number,
  rduser_id:number,
  scheme_id:number,
  stateName:string
){
  return this._http.get(`${environment.apiURL}StakeHolder/Get_Ops_DisciplineWise_Detail_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}&Discipline=${stateName}`)
}
getOpsRCWiseData(
  role_id:number,
  user_id :number,
  rduser_id:number,
  scheme_id:number
){
  return this._http.get(`${environment.apiURL}StakeHolder/Get_Ops_RCWise_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}`)
}
getOpsRCWiseDetailData(
  role_id:number,
  user_id :number,
  rduser_id:number,
  scheme_id:number,
  RCName:string
){
  return this._http.get(`${environment.apiURL}StakeHolder/Get_Ops_RCWise_Detail_Data?role_id=${role_id}&user_id=${user_id}&rduser_id=${rduser_id}&scheme_id=${scheme_id}&RCName=${RCName}`)
}

}




export interface DisciplineWiseAthleteVacancyEntity{
  academy_name: string
  academy_detail_id: number
  no_of_athlete: number
  type: string
  ath_Vacant_strnth: number
}

export interface OpsInsuranceDetailDataEntity {
  sport_detail_id: number
  expired: number
  insured: number
  notInsured: number
  pending: number
  sport_display_name: string
  academy_name: string
}

export interface OpsGraphDetailDataEntity{
  keyValue: string
  academy_name: string
  athletes: number
  coaches: number
  sportsScientists: number
  dataType: string
}

export interface OpsStateWiseDetailDataEntity {
  academy_Name: string
  nsrs_Id: string
  no_of_athletes: number
  no_of_Coaches: number
  no_of_SS: number
  name: string
  type: string
  keyName: string
}
export interface OpsRCWiseDetailDataEntity {
  academy_Name: string
  nsrs_Id: string
  no_of_athletes: number
  no_of_Coaches: number
  no_of_SS: number
  name: string
  type: string
  keyName: string
}
