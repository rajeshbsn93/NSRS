import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class CampInnerPagesService{
    constructor(private http:HttpClient){}

    getCampSportsDiscipline(playerDetailid:any){
        return this.http.get(`${environment.apiURL}StakeHolder/GetCampwisesportlist?userId=${playerDetailid}`)
    }
    campOfficialDetail(camp_ID:number,role_id:number){
        return this.http.get(`${environment.apiURL}StakeHolder/GetCampOfficialDetail?camp_ID=${camp_ID}&role_id=${role_id}`)
    }
    GetCoachSSDetailforCamp(nsrsId:string,sportId:number,roleId:number){
        return this.http.get(`${environment.apiURL}StakeHolder/GetCoachSSDetailforCamp?NsrsId=${nsrsId}&SportId=${Number(sportId)}&RoleId=${roleId}`)
    }

    saveCampOfficialDetail(user_id:number,formData:any){
        return this.http.post(`${environment.apiURL}StakeHolder/SaveCampOfficialDetail?Camp_Detail_id=${user_id}&User_id=${user_id}`,formData)
    }
    basicCampDetail(camp_ID:number){
        return this.http.get<GetCampDetailEntity>(`${environment.apiURL}StakeHolder/GetCampDetail?camp_ID=${camp_ID}`)
    }
    campGeolocationProfile(camp_ID:number){
        return this.http.get<CampGeolocationEntity>(`${environment.apiURL}StakeHolder/GetCampGeolocation?camp_ID=${camp_ID}`)
    }
}


export interface GetCampDetailEntity {
    camp_detail_id: number
    nsrs_id: string
    camp_name: string
    sport_detail_id: number
    sport_display_name: string
    from_date: string
    to_date: string
    venue: string
    state_id: number
    state_name: string
    district_Name: string
    type: string
    campType: string
    geoLocation: string
  }

  export interface CampGeolocationEntity {
    camp_detail_id: number
    id: number
    latitude: string
    longitude: string
    location_Name: string
    location_id: null | number
    radious: number
    gender: string
    start_Time: string
    end_Time: string
  }