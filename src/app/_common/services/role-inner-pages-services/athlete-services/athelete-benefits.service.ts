import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class AthleteBenefitsService{

  constructor(private http:HttpClient){}

  getAthleteSupport(player_Detail_id: string) {
    return this.http.get<Array<AthleteSupportEntity>>(environment.apiURL + 'Athlete/GetAthleteSupport', {params: {player_Detail_id}})
  }
}

export interface AthleteSupportEntity {
  date: string;
  supportProvider: string;
  support: string;
  supportExpensionData: string;
  supportDocument: null,
  supportDescription: string;
}