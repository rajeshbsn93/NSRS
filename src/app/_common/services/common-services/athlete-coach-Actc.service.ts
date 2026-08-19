import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})
export class AthleteCoachACTCService{

    constructor(
        private _http:HttpClient
    ){}

    getPlayerACTCProposalList(Player_Detail_id:number,ProposalHead:string){
        return this._http.get<PlayerACTCProposalListEntity>(`${environment.apiURL}Athlete/GetPlayerACTCProposalList?Player_Detail_id=${Player_Detail_id}&ProposalHead=${ProposalHead}`)
    }
    getCashAwardTrainingDetails(Player_Detail_id:number,ProposalId:number,EventId:number){
        return this._http.get<CashAwardTrainingDetailsEntity>(`${environment.apiURL}Athlete/GetCashAwardTrainingDetails?Player_Detail_id=${Player_Detail_id}&ProposalId=${ProposalId}&EventId=${EventId}`)
    }
    getAtheleteACTCCoachDetail(Player_Detail_id:number,ProposalId:number,EventId:number){
        return this._http.get(`${environment.apiURL}Athlete/GetAtheleteACTC_CoachDetail?Player_Detail_id=${Player_Detail_id}&ProposalId=${ProposalId}&EventId=${EventId}`)
    }
    addCashAwardTrainingDetails(data:any){
        return this._http.post(`${environment.apiURL}Athlete/AddCashAwardTrainingDetails`,data)
    }
    deleteCashAwardTrainingDetails(id:number){
        return this._http.post(`${environment.apiURL}Athlete/DeleteCashAwardTrainingDetails?CashAwardId=${id}`,{})
    }
    generateCashAwardAffidavit(Player_Detail_id:number,proposalId:number,place:string,eventId:number){
        return this._http.get(`${environment.apiURL}Athlete/Generate_CashAward_Affidavit?player_detail_id=${Player_Detail_id}&proposalId=${proposalId}&place=${place}&eventId=${eventId}`)
    }
    downloadCashAwardAffidavit(Player_Detail_id:number,proposalId:number,DocId:number,eventId:number){
        return this._http.get(`${environment.apiURL}Athlete/Download_CashAward_Affidavit?player_detail_id=${Player_Detail_id}&proposalId=${proposalId}&DocId=${DocId}&eventId=${eventId}`)
    }
    
} 

export interface PlayerACTCProposalListEntity{
    status: number
    code: number
    message: string
    data: PlayerACTCProposalListDataEntity[]
  }
  export interface PlayerACTCProposalListDataEntity {
    proposal_Id: number
    proposal_No: string
    tournament_detail_id: number
    tournament_name: string
    age_category: string
    fromDate: string
    toDate: string
    event_name: string
    venue_place: string
    position: string
    doc: string
    status:string,
    dbt_status:number,
    dbt_remark:string
  }

  export interface CashAwardTrainingDetailsEntity {
    status: number
    code: number
    message: string
    data: CashAwardTrainingDetailsListEntity[]
  }
  export interface CashAwardTrainingDetailsListEntity {
    srNo: number
    training_Id: number
    athleteId: number
    coachId: number
    training_Detail_id: number
    proposal_Id: number
    coachName: string
    coach_kitd_unique_id: string
    academyId: number
    mappedByType: number
    fromDate: string
    toDate: string
    trainingLevel_id: number
    trainingLevel: string
    is_eSigned: boolean
  }