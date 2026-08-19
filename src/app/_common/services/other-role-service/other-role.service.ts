import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class OtherRoleService{
    constructor(private http:HttpClient){}

    getOtherOfficial_ContactInfo(official_detail_id:number){
        return this.http.get(`${environment.apiURL}Official/GetOtherOfficial_ContactInfo?official_detail_id=${official_detail_id}`)
    }
    getOtherOfficial_PersonalDetail(official_detail_id:number){
        return this.http.get(`${environment.apiURL}Official/GetOtherOfficial_PersonalDetail?official_detail_id=${official_detail_id}`)
    }
    getOtherOfficial_AdditionalInfo(official_detail_id:number){
        return this.http.get(`${environment.apiURL}Official/GetOtherOfficial_AdditionalInfo?official_detail_id=${official_detail_id}`)
    }
    getOtherOfficial_KitInfo(official_detail_id:number){
        return this.http.get(`${environment.apiURL}Official/GetOtherOfficial_KitInfo?official_detail_id=${official_detail_id}`)
    }
    getOtherOfficial_NSFInfo(official_detail_id:number){
        return this.http.get(`${environment.apiURL}Official/GetOtherOfficial_NSFInfo?official_detail_id=${official_detail_id}`)
    }
    get_Tectical_Officer_Detail_By_Id(sport_id:number,official_detail_id:number){
        return this.http.get(`${environment.apiURL}Registration/Get_Tectical_Officer_Detail_By_Id?sport_id=${sport_id}&role_id=${official_detail_id}`)
    }


    save_Otherofficial_Personal_detail(payload:any){
        return this.http.post(`${environment.apiURL}Official/Save_Otherofficial_Personal_detail`,payload)
    }
    saveOtherOfficialContactInfo(payload:any){
        return this.http.post(`${environment.apiURL}Official/SaveOtherOfficialContactInfo`,payload)
    }
    saveOtherOfficialkitInfo(payload:any){
        return this.http.post(`${environment.apiURL}Official/SaveOtherOfficialkitInfo`,payload)
    }
    saveOtherOfficialNSFInfo(payload:any){
        return this.http.post(`${environment.apiURL}Official/SaveOtherOfficialNSFInfo`,payload)
    }
    saveOtherOfficialAddinationalInfo(payload:any){
        return this.http.post(`${environment.apiURL}Official/SaveOtherOfficialAddinationalInfo`,payload)
    }
      
}