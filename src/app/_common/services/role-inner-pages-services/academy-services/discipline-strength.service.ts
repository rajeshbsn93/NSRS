import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class DisciplineStrengthService{
    constructor(private http:HttpClient){}
    academySanctionedStrength(academy_detail_id :number,role_id:number){
        return this.http.get(`${environment.apiURL}Academy/AcademySanctionedStrength?academy_detail_id=${academy_detail_id}&role_id=${role_id}`)
    }
    saveAcademySanctionedStrength(id:number,academy_detail_id :number,role_id:number, discipline_id:number,
        type:string,sanction_strength_men:number,sanction_strength_women:number){
        return this.http.post(`${environment.apiURL}Academy/SaveAcademySanctionedStrength`,{
            id,academy_detail_id,role_id,discipline_id,type,sanction_strength_men,sanction_strength_women
        })
    }

    updateAcademyDisciplines(academy_detail_id:number,sport_id:number){
        return this.http.post(`${environment.apiURL}Academy/UpdateAcademyDisciplines?academy_detail_id=${academy_detail_id}&sport_id=${sport_id}`,{})
    }
}