import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class AthleteSuccessStoryService{

    constructor(private http:HttpClient){}

    playermediamanage(player_id:number){
        return this.http.get<PlayerMediaManageEntity>(`${environment.apiURL}Athlete/Getplayermediamanage?player_id=${player_id}`)
    }
    savePlayerMediaInfo(formData:any){
        return this.http.post<PlayerMediaManageEntity>(`${environment.apiURL}Athlete/SavePlayerMediaInfo`,formData)
    }
}

export interface PlayerMediaManageEntity{
    player_media_id: number
    description_detail: string
    photo_link1: string
    photo_link2: string
    photo_link3: string
    photo_link4: string
    video_link1: string
    video_link2: string
    video_link3: string
  }