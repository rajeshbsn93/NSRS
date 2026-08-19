import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class CommonSportsKittingService{
  constructor(private http:HttpClient){}

  shoesSize(){
      return this.http.get<SizeEntity>(`${environment.apiURL}Master/GetShoeList`)
    }
  blazerTshirtSize(){
      return this.http.get<SizeEntity>(`${environment.apiURL}Master/Get_Blazer_Shirt_Size`)
    }
  pantSize(){
    return this.http.get<SizeEntity>(`${environment.apiURL}Master/GetPantSize`)
  }
  getAthleteKittingInfo(player_detail_id:number){
    return this.http.get<AthleteKittingInfoEntity>(`${environment.apiURL}Athlete/GetAthleteKittingInfo?player_id=${player_detail_id}`)
  }
  saveAthleteKittingInfo(formData:any){
    return this.http.post<boolean>(`${environment.apiURL}Athlete/SaveAthleteKittingInfo`,formData)
  }
  
  getOfficialKittingInfo(official_detail_id:number) {
    return this.http.get(`${environment.apiURL}Official/GetOfficialKittingInfo?official_id=${official_detail_id}`);
  }

  saveOfficialKittingInfo(body:any) {
    return this.http.post<boolean>(`${environment.apiURL}Official/SaveOfficialKittingInfo`,body);
  }
}

export interface SizeEntity {
  text: string
  value: string
}
export interface AthleteKittingInfoEntity{
  player_detail_id: number
  shoe_size: null
  blazer_size: null
  tshirt_size: string
  pant_size: null
  kitting_updated_date: null
}


  