import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoachBankInfoService {

constructor(private http: HttpClient) { }

  getOfficialBankInfo(official_detail_id:number, roleId:number,listType:string) {
    return this.http.get<ICoachBankInfo>(`${environment.apiURL}Official/GetOfficialBankDetail?official_detail_id=${official_detail_id}&role_id=${roleId}&Single_Multiple=${listType}`);
  }

  
  // saveOfficialBankInfo(body: ICoachSaveBankInfo) {
  saveOfficialBankInfo(body: any) {
    return this.http.post<boolean>(`${environment.apiURL}Official/SaveOfficialBankInfo`, body);
  }

  getBankDetails(ifsc_code:string){
    return this.http.get<IBankDetails>(`${environment.apiURL}Master/BankDetail/${ifsc_code}`);
  }
}

export interface ICoachBankInfo {
  official_detail_id: number;
  bank_name: string;
  branch_name: string;
  bank_account_number: string;
  ifsc_code: string;
  cancelled_cheque_upload: string | null;
}

export interface ICoachSaveBankInfo {
  official_detail_id: number;
  bank_name: string;
  bank_account_number: string;
  ifsc_code: string;
  cancelled_cheque_upload: string;
}

export interface IBankDetails {
  bank_name: string;
  bank_ifsc: string;
  bank_branch: string;
  bank_address: string;
  bank_city: string;
  bank_district: string;
  bank_state: string;
}