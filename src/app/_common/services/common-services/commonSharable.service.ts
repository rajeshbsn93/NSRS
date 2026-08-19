import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonSharableService {
onProfilePicChange$: Subject<void> = new Subject();

constructor(private http:HttpClient) { }

profileChangePassword(user_id:any,role_id:any,oldPassword:any,newPassword:any){
  return this.http.put(`${environment.apiURL}Common/ChangePassword`,{user_id,role_id,oldPassword,newPassword})
}

getSportMasterList() {
  return this.http.get(`${environment.apiURL}Master/SportList`)
}

stateMasterList(countryId:number){
 return this.http.get(`${environment.apiURL}Master/StateMasterList?countryId=${countryId}`)
}
districtMasterList(state_id:number){
 return this.http.get(`${environment.apiURL}Master/DistrictMasterList?state_id=${state_id}`)
}
cityMasterList(state_id:number){
 return this.http.get(`${environment.apiURL}Master/CityMasterList?state_id=${state_id}`)
}
blockMasterList(districtId:number){
 return this.http.get(`${environment.apiURL}Master/BlockMasterList?districtId=${districtId}`)
}
pincodeMasterList(districtId:number){
 return this.http.get(`${environment.apiURL}Master/PincodeMasterList?districtId=${districtId}`)
}
verifyOtherOfficialMapping(mappingType:number,roleId:number,mapId:number){
  return this.http.put(`${environment.apiURL}Official/VerifyOtherOfficialMapping`,{mappingType,roleId,mapId})
}
weedoutOtherOfficialMapping(mappingType:number,todate:any,mapId:number){
  return this.http.put(`${environment.apiURL}Official/WeedoutOtherOfficialMapping`,{mappingType,todate,mapId})
}
InsertOfficialOtherCoachingInformation(official_id:number,athlete_id:number,fromDate:any,toDate:any,trainingLevel_id:number){
  return this.http.post(`${environment.apiURL}Official/InsertOfficialOtherCoachingInformation`,
    {official_id,athlete_id,fromDate,toDate,trainingLevel_id}
  )
}
DeleteOfficialOtherCoachingInformation(map_id:number,role_id :number){
  return this.http.put(`${environment.apiURL}Official/DeleteOfficialOtherCoachingInformation?map_id=${map_id}&role_id=${role_id}`,{})  
}
UploadProfilePhoto(role_id :number, user_id: number, url: string) {
  return this.http.post(
    `${environment.apiURL}Common/UploadProfilePhoto`, { role_id, user_id, url }
  ); 
}
Official_Training_Info_Academy(official_detail_id :number){
  return this.http.get<Official_Training_InfoEntity[]>(`${environment.apiURL}Official/GetOfficial_Training_Info?official_detail_id=${official_detail_id}`)
}
centralAwards(){
  return this.http.get<centralAwardsEntity>(`${environment.apiURL}Master/GetCentralAwards`)
}

getBasicData_Academy(nsrsId:string){
  return this.http.get<GetBasicData_AcademyEntity>(`${environment.apiURL}Common/GetBasicData_Academy?nsrsId=${nsrsId}`)
}



}

export type IGetStateMasterObjectArray = IGetStateMasterObject[]

export interface IGetStateMasterObject {
  id: number
  state_name: string
  state_code: string
  created_date: string
  created_by: any
  modified_date: string
  modified_by: any
  is_active: boolean
  is_deleted: boolean
  is_national: boolean
  state_guid: string
  is_northeast: number
  apI_State_id: number
  country_Id: number
}


export interface Official_Training_InfoEntity{
  academyName: string
  period: string
  weedOutDate: string
  weedOutRemark: string
}

export interface centralAwardsEntity {
  text: string
  value: string
}

export interface GetBasicData_AcademyEntity {
  academy_detail_id: number
  nsrsId: string
  academy_name: string
  sport_detail_id: number
  sportName: string
  email_id: string
  mobile_number: string
}

