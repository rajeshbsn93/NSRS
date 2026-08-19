import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class SportScientistInfoService{
    constructor(private http:HttpClient){}

    ssTrainingInfo(official_detail_id:number){
        return this.http.get<SSTrainingInfoEntity>(`${environment.apiURL}Official/GetSS_Training_Info?official_detail_id=${official_detail_id}`)
    }
    athleteDetailsforOtherCoachingMapping(official_detail_id:number,athlete_nsrsId :string){
        return this.http.get(`${environment.apiURL}Official/GetAthleteDetailsforOtherCoachingMapping?official_detail_id=${official_detail_id}&athlete_nsrsId=${athlete_nsrsId}`)
    }
    deleteOfficialOtherCoachingInformation(map_id:number,role_id :number){
        return  this.http.put(`${environment.apiURL}Official/DeleteOfficialOtherCoachingInformation?map_id=${map_id}&role_id=${role_id}`,{})
    }
}
export interface SSTrainingInfoEntity{
    officialCurrentTrainingInfos: SSOfficialCurrentTrainingInfosEntity[]
    officialPreviousTrainingInfos: SSOfficialPreviousTrainingInfosEntity[]
  }
  export interface SSOfficialCurrentTrainingInfosEntity{
    mapId: number
    athlete_nsrs_id: string
    athlete_name: string
    period: string
    mappingType: string
    mappedby_role_id: null
    status: boolean
  }
  export interface SSOfficialPreviousTrainingInfosEntity{
    mapId: number
    athlete_name: string
    academyName: string
    academyType: string
    period: string
    mappingType: string
    mappedby_role_id: null
    status: boolean
  }