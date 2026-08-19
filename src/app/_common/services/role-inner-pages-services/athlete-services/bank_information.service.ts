import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class BankInformationService {

    constructor(private http: HttpClient) { }

    athletBankInfo(player_detail_id: number, Single_Multiple: string) {
        return this.http.get<athletBankInfoEntity>(`${environment.apiURL}Athlete/GetAthleteBankDetail?player_detail_id=${player_detail_id}&Single_Multiple=${Single_Multiple}`)
    }
    saveAthletBankInfo(formData: any) {
        return this.http.post<athletBankInfoEntity>(`${environment.apiURL}Athlete/SaveAthleteBankInfo`, formData)
    }
    bankDetail(ifsc_code: any) {
        return this.http.get<athletBankDetailEntity>(`${environment.apiURL}Master/BankDetail/${ifsc_code}`)
    }
    deleteBankAthleteInfo(player_detail_id: number, Id: number, type: string) {
        return this.http.put<athletBankInfoEntity>(`${environment.apiURL}Athlete/DeleteAthleteBankInfo?PlayerId=${player_detail_id}&Id=${Id}&Type=${type}`, {})
    }
    getTokenForHPAC() {
        return this.http.post(`${environment.apiURL}Registration/GetApiToken`, '')
       
    }
    
    verifyBankAccount(phone: number, bankAccount: string, ifsc: string, token: string) {
        return this.http.get<verifyBankAccount[]>(`${environment.apiURL}Registration/Validate_bank_details?Phone=${phone}&BankAccount=${bankAccount}&Ifsc=${ifsc}&token=${token}`, {})

    }



}

export interface verifyBankAccount {
    status: string
    subCode: string
    message: string
    data: any
}

export interface athletBankInfoEntity {
    player_Detail_id: number
    bank_name: string
    bank_account_number: string
    ifsc_code: string
    cancelled_cheque_upload: null
    is_Primary: boolean
}

export interface athletBankDetailEntity {
    bank_name: string
    bank_ifsc: string
    bank_branch: string
    bank_address: string
    bank_city: string
    bank_district: string
    bank_state: string
}