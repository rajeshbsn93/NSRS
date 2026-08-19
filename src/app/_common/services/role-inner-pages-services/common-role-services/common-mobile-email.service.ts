import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonMobileEmailService {

  constructor(private http: HttpClient) {}

  athleteMobileEmail(player_detail_id: number) {
    return this.http.get<MobileEmaiEntity>(
      `${environment.apiURL}Athlete/GetAthlete_MobileEmail_Info?player_detail_id=${player_detail_id}`
    );
  }

  getOfficialContactDetails(offical_detail_id: number) {
    return this.http.get<OfficialContactEntity>(
      `${environment.apiURL}Official/GetOfficial_MobileEmail_Info?official_detail_id=${offical_detail_id}`
    );
  }

  checkMobileEmail(fieldVal: any, type: number, user_id: any, role_id: any) {
    return this.http.get(
      `${environment.apiURL}Registration/IsAlreadyExistCheck?value=${fieldVal}&type=${type}&userId=${user_id}&roleId=${role_id}`
    );
  }
  generateOtp(
    opt_type: number,
    nsrsId: string,
    mobile_number: any,
    email_id: any
  ) {
    return this.http.post(`${environment.apiURL}Athlete/GenerateOtp`, {
      opt_type,
      nsrsId,
      mobile_number,
      email_id,
    });
  }
  ConfirmOtp(formdata: any) {
    return this.http.post(`${environment.apiURL}Athlete/ConfirmOtp`, formdata);
  }

  saveAthleteMobileEmail(data: any) {
    return this.http.post<boolean>(`${environment.apiURL}Athlete/SaveAthlete_MobileEmail_Info`, data);
  }

  saveOfficialContactDetails(data: any) {
    return this.http.post<boolean>(`${environment.apiURL}Official/SaveOfficial_MobileEmail_Info`, data);
  }
}

export interface MobileEmaiEntity {
  player_detail_id: number;
  mobile_number: string;
  alternate_mobile_number: string;
  email_id: string;
  alternate_email_id: string;
}

export interface OfficialContactEntity {
  mobile_number: string;
  alternate_mobile_number: string;
  email_id: string;
  alternate_email_id: string;
}
