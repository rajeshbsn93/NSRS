import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class CampAthleteService{
    constructor(private http:HttpClient){}
    campAtheleteDetail(camp_user_id:number){
      return this.http.get<CampAtheleteDetailEntity>(`${environment.apiURL}StakeHolder/GetCampAtheleteDetail?camp=${camp_user_id}`)
    }
    campAtheleteMappingDetail(nsrsId:string,sportId:number,userId:number){
      return this.http.get(`${environment.apiURL}StakeHolder/GetCampAtheleteMappingDetail?nsrsId=${nsrsId}&sportId=${sportId}&userId=${userId}`)
    }

    saveCampAtheleteMappingDetail(formData:any){
      return this.http.post<SaveCampAtheleteMappingDetailEntity>(`${environment.apiURL}StakeHolder/SaveCampAtheleteMappingDetail`,formData)        
    }
}

export interface CampAtheleteDetailEntity {
  kitd_unique_id: string
  full_name: string
  sport_display_name: string
  gender: string
  mobile_number: string
  state_name: string | null
  event_Category: null | string
  date_of_joining: null | string
  is_insured: string
  is_KIA: boolean
  is_TOPS: null | boolean
}

export interface SaveCampAtheleteMappingDetailEntity {
  camp_detail_id: number
  player_detail_id: number
  category: string
  doj: string
  period_upto: string
  file_path: string
  user_id: number
}