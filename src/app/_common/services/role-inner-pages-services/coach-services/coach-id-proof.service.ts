import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoachIdProofService {

constructor(private http: HttpClient) { }

  getOfficialDocumentInfo(official_detail_id:number) {
    return this.http.get<any>(`${environment.apiURL}Official/GetOfficialDocumentInfo?official_detail_id=${official_detail_id}`);
  }
  
  saveOfficialDocumentInfo(body: any) {
    return this.http.post<any>(`${environment.apiURL}Official/SaveOfficialDocumentInfo`, body);
  }
}

export enum DOC_TYPE {
  // AADHAR = 'AADHAR',
  PASSPORT = 'PASSPORT',
  VOTER_ID = 'VOTER ID',
  PAN_CARD = 'PAN CARD',
  DOB = 'DATE OF BIRTH',
  OTHERS = 'OTHERS'
}