import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn:'root'
})
export class CampAdminService {

constructor(private http:HttpClient) { }

campList(){
  return this.http.get(`${environment.apiURL}StakeHolder/GetCampList`)
}
geoLocationDetail(StateId:number){
  return this.http.get(`${environment.apiURL}StakeHolder/GetLocationDetail?StateId=${StateId}`)
}
venueDetail(LocationId:number){
  return this.http.get(`${environment.apiURL}StakeHolder/GetvenueDetail?LocationId=${LocationId}`)
}

SaveCampDetails(camp_name:string,sport_detail_id:number,from_date:any,to_date:any,venue:string,zone:string,
  state_id:number,district_id:number,mob_no:string,email:string,user_id:number,type:string,campType:string,username:string,password:string){
  return this.http.post(`${environment.apiURL}StakeHolder/SaveCampDetails`,{
    camp_name,sport_detail_id,from_date,to_date,venue,zone,state_id,district_id,mob_no,email,user_id,type,campType,username,
    password
  })
}

SaveCampGeoLocations(camp_id:number,camp_GeoLocations:any){
  return this.http.post(`${environment.apiURL}StakeHolder/SaveCampGeoLocations`,{camp_id,camp_GeoLocations})
}


}

export interface campListEntity {
  camp_detail_id: number
  camp_name: string
  sport_display_name: string
  from_date: string
  to_date: string
  venue: string
  state_name: string
  district_Name: string
  type: string
  campType: string
  geoLocation: null
  campGeoLocations: ICampGeoLocationsItem[]
}
export interface ICampGeoLocationsItem{
  latitude: string
  longitude: string
  location: string
}
