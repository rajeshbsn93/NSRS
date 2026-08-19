import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})
export class AthleteOfficialInfoService{
    constructor(private http:HttpClient){}

    athleteCoachingInfo(player_detail_id :number){
        return this.http.get<AthleteCoachingInfoEntity>(`${environment.apiURL}Athlete/GetAthlete_Coaching_Info?player_detail_id=${player_detail_id}`)
    }
    getCoachDetailsforOtherCoachingMapping(player_detail_id:number,coach_nsrsId:any){
        return this.http.get<CoachDetailsforOtherCoachingMappingEntity>(`${environment.apiURL}Athlete/GetCoachDetailsforOtherCoachingMapping?player_detail_id=${player_detail_id}&coach_nsrsId=${coach_nsrsId}`)
    }
    insertAthleteOtherCoachingInformation(athlete_id:number,coach_id:number,coachName:string,fromDate:any,toDate:any,trainingLevel_id:number){
        return this.http.post<insertAthleteOtherCoachingInformationEntity>(`${environment.apiURL}Athlete/InsertAthleteOtherCoachingInformation`,{athlete_id,coach_id,coachName,fromDate,toDate,trainingLevel_id})
    }

    DeleteAthleteOtherCoachingInformation(map_id:number){
        return this.http.put(`${environment.apiURL}Athlete/DeleteAthleteOtherCoachingInformation?map_id=${map_id}`,{})
    }
    athleteTrainingInfo(player_detail_id :number){
      return this.http.get<AthleteTrainingInfoEntity>(`${environment.apiURL}Athlete/GetAthlete_Training_Info?player_detail_id=${player_detail_id}`)
    }
    athleteSportScience(player_detail_id:number){
      return this.http.get<AthleteSportScienceInfoEntity>(`${environment.apiURL}Athlete/GetAthlete_SportScience_Info?player_detail_id=${player_detail_id}`)
    }
    getSportScientistDetailsforOtherCoachingMapping(player_detail_id:number,sport_science_nsrsId:any){
      return this.http.get(`${environment.apiURL}Athlete/GetSportScientistDetailsforOtherCoachingMapping?player_detail_id=${player_detail_id}&ss_nsrsId=${sport_science_nsrsId}`)
    }

    insertAthleteOtherSportScienceInformation(athlete_id:number,ss_id:number,ssName:string,fromDate:any,toDate:any){
     return this.http.post<InsertAthleteOtherSportScienceInformationEntity>(`${environment.apiURL}Athlete/InsertAthleteOtherSportScienceInformation`,
     {athlete_id,ss_id,ssName,fromDate,toDate}
     )
    }
    deleteAthleteOtherSportScienceInformation(map_id:number){
      return this.http.put(`${environment.apiURL}Athlete/DeleteAthleteOtherSportScienceInformation?map_id=${map_id}`,{})
    }
    getTrainingLevelMaster(roleId:number){
      return this.http.get(`${environment.apiURL}StakeHolder/Get_Training_Level_Master?roleId=${roleId}`)
    }
}


export interface AthleteCoachingInfoEntity{
    athleteCurrentCoachingInfos: AthleteCurrentCoachingInfosEntity[]
    athletePreviousCoachingInfos: AthletePreviousCoachingInfosEntity[]
  }
  export interface AthleteCurrentCoachingInfosEntity{
    mapId: number
    coach_nsrs_id: string | null
    coach_name: string
    period: string
    mappingType: string
    status: boolean
  }
  export interface AthletePreviousCoachingInfosEntity{
    mapId: number
    coachName: string
    academyName: string
    academyType: string
    period: string
    mappingType: string
    status: boolean
  }
  export interface insertAthleteOtherCoachingInformationEntity {
    athlete_id: number
    coach_id: number
    coachName: string
    mappingRequestById: number
    fromDate: string
    toDate: string
  }

export interface  CoachDetailsforOtherCoachingMappingEntity{
    coach_id: number
    name: string
    reason: string
  }

export interface AthleteTrainingInfoEntity
{
    AcademyName:string
    Period:string
    WeedOutDate:string
    WeedOutRemark:string
}

export interface AthleteSportScienceInfoEntity{
  athleteCurrentSportScienceInfos: AthleteCurrentSportScienceInfosEntity[]
  athletePreviousSportScienceInfos: AthletePreviousSportScienceInfos[]
}

export interface AthleteCurrentSportScienceInfosEntity{
  mapId: number
  ss_nsrs_id: string
  ss_name: string
  period: string
  mappingType: string
  status: boolean
}
export interface AthletePreviousSportScienceInfos{
  mapId :number
  SSName :string
  AcademyName :string
  AcademyType :string
  period :string
  mappingType:string
  status:boolean 
}

export interface InsertAthleteOtherSportScienceInformationEntity{
  athlete_id: number
  ss_id: number
  ssName: string
  mappingRequestById: number
  fromDate: string
  toDate: string
}