import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class athleteformfiveService{

    constructor(private _http:HttpClient){}

    getPlayerDetails(playerDetailId:any,roleDetailId:any,form5id:any){
        return this._http.get(`${environment.apiURL}Form5/GetAthlete_Form5Detail?player_detail_id=${playerDetailId}&role_detail_id=${roleDetailId}&form5Id=${form5id}`);
    }

    getGMSPlayerDetails(nsrsId:any){
        return this._http.get(`${environment.gmsApiUrl}v1/get/athlete/merit-certificate/info/${nsrsId}`)
    }

    saveForm5Details(payload:any){
        // return this._http.post(`${environment.apiURL}Form5/SaveUpsertAthlete_Detail_Form5`,payload)
        return this._http.post(`${environment.apiURL}Form5/SaveAthlete_Form5Detail`,payload)
    }

    getPlayerForms(){
        return this._http.get(`${environment.apiURL}Form5/Get_Form5PlayerList`)
    }

    getCompMaster(){
        return this._http.get(`${environment.apiURL}Master/Get_KheloIndiaCompetition_core`)
    }

    getEventMaster(sportId:any){
        return this._http.get(`${environment.apiURL}Master/GetEventdetailSportwise?sport_id=${sportId}`)
    }

    getDocuments(formID:any){
        return this._http.get(`${environment.apiURL}Form5/Get_Player_Form5Documents?form5Id=${formID}`)
    }

    getTilesData(){
        return this._http.get(`${environment.apiURL}Form5/Get_Form5TileData`)
    }

}