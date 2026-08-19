import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class CoachAchievementService{
    constructor(private http:HttpClient){}
    coachExpNationalCamp(official_detail_id:number){
        return this.http.get<CoachExpNationalCampEntity>(`${environment.apiURL}Official/GetCoachExpNationalCamp?official_detail_id=${official_detail_id}`)
    }
    SaveCoachExpNationalCamp(id:number,official_detail_id:number,designation:string,category_of_player:string,camp_from:any,
        camp_to:any,uid_training_center:string,name_of_training_center:string){
        return this.http.post<CoachExpNationalCampEntity>(`${environment.apiURL}Official/SaveCoachExpNationalCamp`,{
            id,official_detail_id,designation,category_of_player,camp_from,camp_to,uid_training_center,name_of_training_center
        })
    }
    deleteCoachExpNationalCamp(id:number){
       return this.http.delete(`${environment.apiURL}Official/DeleteCoachExpNationalCamp?id=${id}`) 
    }

    coachForeignExposure(official_detail_id:number){
        return this.http.get<CoachForeignExposureEntity>(`${environment.apiURL}Official/GetCoachForeignExposure?official_detail_id=${official_detail_id}`)
    }
    saveCoachForeignExposure(id:number,official_detail_id:number,designation:string,category_of_player:string,from_date:any,
        to_date:any,exposure:string,country:string){
        return this.http.post<CoachExpNationalCampEntity>(`${environment.apiURL}Official/SaveCoachForeignExposure`,{
            id,official_detail_id,designation,category_of_player,from_date,to_date,exposure,country
        })
    }
    deleteCoachForeignExposure(id:number){
        return this.http.delete(`${environment.apiURL}Official/DeleteCoachForeignExposure?id=${id}`) 
    }

    coachAchievementAsPlayer(official_detail_id:number){
        return this.http.get<CoachAchievementAsPlayerEntity>(`${environment.apiURL}Official/GetCoachAchievementAsPlayer?official_detail_id=${official_detail_id}`)
    }




    saveCoachAchievementAsPlayer(id:number,official_detail_id:number,level:string,tournament_name:string,tournament_year:any,position:string){
        return this.http.post<CoachAchievementAsPlayerEntity>(`${environment.apiURL}Official/SaveCoachAchievementAsPlayer`,{
            id,official_detail_id,level,tournament_name,tournament_year,position
        })
    }

    deleteCoachAchievementAsPlayer(official_detail_id:number){
        return this.http.delete(`${environment.apiURL}Official/DeleteCoachAchievementAsPlayer?id=${official_detail_id}`)
    }


     deleteCoachAchievementRcd(User_Id:number ,official_detail_id:number,RcdId:number){
        return this.http.put(`${environment.apiURL}Official/Delete_CoachAchievement_Rcd?User_Id=${User_Id}&Official_detail_id=${official_detail_id}&RcdId=${RcdId}`,{})
    }


      GetCoachAchieveMent(Official_detail_id:number,roleId:number){
        return this.http.get<CoachAchievementAsPlayerEntity>(`${environment.apiURL}Official/GetCoachAchieveMent?Official_detail_id=${Official_detail_id}&roleId=${roleId}`)
    }


    SaveCoachAchieveMent(id:any,official_detail_id:any,event_id:any,represented:string,position:string,result:string,
  document_path:any,tournament_id:any,category:string,competition_level:string,competition_name:string,fromdate:any,todate:any,
  venue:string){
    return this.http.post(`${environment.apiURL}Official/SaveCoachAchieveMent`,{
      id,official_detail_id,event_id,represented,position,result,document_path,tournament_id,category,competition_level,
      competition_name,fromdate,todate,venue
    });
  }


    
}

export interface CoachExpNationalCampEntity {
    id: number,
    official_detail_id?: number
    designation: string
    category_of_player: string
    uid_training_center: string
    name_of_training_center: string
    camp_from: string
    camp_to: string
  }
  export interface CoachForeignExposureEntity{
    id: number
    official_detail_id?: number
    designation: string
    category_of_player: string
    from_date: string
    to_date: string
    exposure: string
    country: string
  }

  export interface CoachAchievementAsPlayerEntity{
    id: number
    official_detail_id?: number
    level: string
    tournament_name: string
    tournament_year: number
    position: string  
  }



    export interface CoachAchievementPlayer{
   official_detail_id: number,
    category: string,
    competition_level: string,
   tournament_name: string,
   from_date: string,
   to_date: string,
   venue: string,
   represented:string,
    event_list: string,
   position: string,
   created_date: string,
   document_path: string,
   coach_achievement_detail_id: number,
    nationalSelected: boolean,
   internationalSelected: boolean,
    othersSelected: boolean,
   stateDistrictSelected: boolean,
   otherCompetitionSelected: boolean,
   srno: number,
   competition_name_other: string,
  isEditable: boolean,
   createBy: string,
   verifyStatus: string,
   sport_display_name:string,
   sport_detail_id: number
  }