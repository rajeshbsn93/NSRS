import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class AthleteLanguageModalService{

  constructor(private http:HttpClient){}

  getLanguageList(): Observable<LanguageEntity[]> {
    return this.http.get<LanguageEntity[]>(environment.apiURL + 'Master/GetLangList');
  }

  getPlayerLanguageInfo(player_detail_id: string) {
    return this.http.get<AthleteLanguageEntity>(environment.apiURL + 'Athlete/Getplayerlanguageinfo', {params: {player_detail_id}});
  }

  savePlayerLanguageInfo(body: any) {
    return this.http.post<boolean>(environment.apiURL + 'Athlete/Save_Player_language_info', body);
  }
}

export interface LanguageEntity {
  text: string;
  value: string;
}

export interface AthleteLanguageEntity {
  primary_communication_language: string;
  is_primary_read: boolean;
  is_primary_write: boolean;
  secondary_communication_language: string;
  is_secondary_read: boolean;
  is_secondary_write: boolean;
}