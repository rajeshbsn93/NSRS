import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class CoachingInfoService {
    constructor(private http: HttpClient) { }

    CoachTrainingInfo(official_detail_id: number) {
        return this.http.get<CoachTrainingInfoEntity>(`${environment.apiURL}Official/GetCoach_Training_Info?official_detail_id=${official_detail_id}`)
    }
    athleteDetailsforOtherCoachingMapping(official_detail_id: number, athlete_nsrsId: string) {
        return this.http.get(`${environment.apiURL}Official/GetAthleteDetailsforOtherCoachingMapping?official_detail_id=${official_detail_id}&athlete_nsrsId=${athlete_nsrsId}`)
    }
    deleteOfficialOtherCoachingInformation(map_id: number, role_id: number) {
        return this.http.put(`${environment.apiURL}Official/DeleteOfficialOtherCoachingInformation?map_id=${map_id}&role_id=${role_id}`, {})
    }


    getCoachCashAwardDetails(Coach_Detail_id: number, ProposalHead: string) {
        return this.http.get(`${environment.apiURL}Official/GetCoachCashAwardDetails?Coach_Detail_id=${Coach_Detail_id}&Proposal_head=${ProposalHead}`)
    }

    getAcademyMaster() {
        return this.http.get<any>(`${environment.apiURL}Official/GetAcademyList`)
    }

    getOfficialTrainingInfo(User_id:number,official_detail_id:number,Roll_Id:number) {
        return this.http.get<any>(`${environment.apiURL}Official/GetOfficialTrainingInfo?official_detail_id=${official_detail_id}&User_Id=${User_id}&Roll_Id=${Roll_Id}`)
    }

    saveOfficialTrainingInfo(officialId: number) {
        return this.http.post(`${environment.apiURL}Official/GetOfficialTrainingInfo?official_detail_id=${officialId}`,{})
    }


    
    OfficialTrainingInfoSave(saveOrUpdate:string,User_id:number,official_detail_id:number,Roll_Id:number,payload: any) {
        return this.http.post(`${environment.apiURL}Official/${saveOrUpdate}?User_id=${User_id}&official_detail_id=${official_detail_id}&Roll_Id=${Roll_Id}`,payload)
    }

 deleteOfficialTraining(User_id: number,official_detail_id:number,Coach_training_Id:number,role_id: number) {
        return this.http.put(`${environment.apiURL}Official/Delete_Official_Training?User_id=${User_id}&Coach_training_Id=${Coach_training_Id}&official_detail_id=${official_detail_id}&Roll_Id=5${role_id}`, {})
    }

}
export interface CoachTrainingInfoEntity {
    officialCurrentTrainingInfos: OfficialCurrentTrainingInfosEntity[]
    officialPreviousTrainingInfos: OfficialPreviousTrainingInfosEntity[]
}
export interface OfficialCurrentTrainingInfosEntity {
    mapId: number
    athlete_nsrs_id: string
    athlete_name: string
    period: string
    mappingType: string
    mappedby_role_id: null
    status: boolean
}
export interface OfficialPreviousTrainingInfosEntity {
    mapId: number
    athlete_name: string
    academyName: string
    academyType: string
    period: string
    mappingType: string
    mappedby_role_id: null
    status: boolean
}

export interface IAcademyList {
    academy_detail_id: number
    academy_name: string
    nsrS_Id:string
}

