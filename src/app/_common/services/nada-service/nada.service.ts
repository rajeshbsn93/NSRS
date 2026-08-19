import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class NadaService{
    _http = inject(HttpClient)

    get_Nada_AtheleteList(payload:any){
        return this._http.get<GetNadaAtheleteListEntity>(`${environment.apiURL}NADA/Get_Nada_AtheleteList?userId=${payload.userId}&AllAth=${payload.AllAth}&Kitd=${payload.Kitd}&AthName=${payload.AthName}&Gender=${payload.Gender}&Discipline=${payload.Discipline}&Scheme=${payload.Scheme}&Academy_type=${payload.Academy_type}&academy_detail_id=${payload.academy_detail_id}&page_indx=${payload.page_indx}`)
    }
    Save_Nada_Block_Athlete_Detail(payload:any){
      return this._http.post<SaveNadaBlockAthleteEntity>(`${environment.apiURL}NADA/Save_Nada_Block_Athlete_Detail`, payload)
    }
}
export interface GetNadaAtheleteListEntity {
  userId: number
  AllAth: string
  Kitd: string
  AthName: string
  Gender: string
  Discipline: string
  Scheme: number
  Academy_type: number
  academy_detail_id: number
  page_indx: number
}
export interface NadaAtheleteListDataRootEntity {
  status: string
  code: number
  message: string
  data: NadaAtheleteListDataEntity
}

export interface NadaAtheleteListDataEntity {
  dataCount: number
  nada_AtheleteList: NadaAtheleteListEntity[]
}

export interface NadaAtheleteListEntity {
  player_detail_id: number
  nsrsId: string
  ath_Name: string
  gender: string
  sport_detail_id: number
  sport_name: string
  academy_detail_id: number
  academy_Type: number
  trainingCenter: string
  is_kia: number
  is_Tops: boolean
  is_Insured: boolean
  insured_by?: number
  insurance_status: string
  insuranceTagId: number
  scholarship_Id: number
  scholarship_type: string
  is_PDU: boolean
  is_KIAA: number
  date_of_joining?: string
  can_weedOut: boolean
  date_of_birth: string
  academy_scheme_id: number
  is_Blacklisted: number
  srNo: number
}

export interface SaveNadaBlockAthleteEntity {
  nsrsId: string
  blockingAgencyId: number
  from_date: string
  to_date: string
  remark: string
}

