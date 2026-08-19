import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class recruitmentSportQuotaService {
    constructor(private http: HttpClient) { }

    getRecruitmentSportsQuotaList(userId: number, nsrsId: string, roleId: number) {
        return this.http.get<RecruitmentData[]>(`${environment.apiURL}Common/Get_Recruitment_Under_Sports_Quota?User_Id=${userId}&NSRSId=${nsrsId}&RollId=${roleId}`)
    }

    getMasterGovtType() {
        return this.http.get<typeOfGovtMaster>(`${environment.apiURL}Common/Get_Recruitment_Under_Sports_Quota_Master`)
    }
    
    
    saveRecruitmentSportsQuota(userId: number, nsrsId: string, roleId: number, formData:any) {
        return this.http.post<any>(`${environment.apiURL}Common/Save_Recruitment_Under_Sport_Kota_Data?User_Id=${userId}&NSRSId=${nsrsId}&RollId=${roleId}`,formData)
    }
    
    deleteRecruitmentData(userId:number, nsrsId:string, roleId:number, id:number) {
        return this.http.put(`${environment.apiURL}Common/Delete_Recruitment_Sport_Kota_Rcd?User_Id=${userId}&NSRSId=${nsrsId}&RollId=${roleId}&RcdId=${id}`,{})
    }

    updateRecruitmentparticipate(userId:number, nsrsId:string, roleId:number, flagId:boolean) {
        return this.http.post<any>(`${environment.apiURL}Common/Update_EcoSystem_Flag?User_Id=${userId}&NSRSId=${nsrsId}&RollId=${roleId}&EcoSystemflg=${flagId}`,{})
    }



}
export type typeOfGovtMaster = TypeOfGovt[]
export interface TypeOfGovt {
  mdShortName: string
  mdCode: number
  mdName: string
}

export interface RecruitmentData {
  id: number
  nsrS_Id: string
  name_Of_Employer: string
  type_Of_Goverment: number
  date_Of_Joining: string
  post_Name_At_Time_Of_Entry: string
  grade_level_at_entry: string
  currentPost: string
  current_PayScale_Level: string
  is_building_Sport_EcoSystem_Participate: boolean
  rollId: number
  date_Of_relieving: string
  type_Of_GovermentValues: string
  others: string
}



