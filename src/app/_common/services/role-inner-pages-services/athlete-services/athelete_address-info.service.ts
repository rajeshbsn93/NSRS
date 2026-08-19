import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})
export class AthleteAddressInfoService{
  
  constructor(private http:HttpClient) {}

  athleteAddressInfo(athlete_detail_id:number){
    return this.http.get<AtheleteAddressInfoEntity>(`${environment.apiURL}Athlete/GetAtheleteAddressInfo?player_detail_id=${athlete_detail_id}`)
  }

  saveAthleteAddressInfo(formData:any){
    return this.http.post<boolean>(`${environment.apiURL}Athlete/SaveAthleteAddressInfo`,formData)
  }
}

export interface AtheleteAddressInfoEntity{
    player_detail_id: number
    communication_address_line_1: string
    communication_address_line_2: string
    communication_address_state_id: number
    communication_address_city: string
    communication_address_pincode: string
    communication_address_tal: string
    communication_address_district: string
    permanent_same_as_communication: boolean
    permanent_address_line_1: string
    permanent_address_line_2: string
    permanent_address_state_id: number
    permanent_address_city: string
    permanent_address_pincode: string
    permanent_address_tal: string
    permanent_address_district: string
  }