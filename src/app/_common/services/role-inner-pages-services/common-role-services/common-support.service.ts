import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class CommonSupportService{

  constructor(private http:HttpClient){}

  getOfficialSupport(official_detail_id: string) {
    return this.http.get<Array<OfficialSupportEntity>>(`${environment.apiURL}Official/GetOfficialSupport?official_detail_id=${official_detail_id}`);
  }
}

export interface OfficialSupportEntity {
  date: string;
  supportProvider: string;
  support: string;
  supportExpensionData: string;
  supportDocument: null,
  supportDescription: string;
}