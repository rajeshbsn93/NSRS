import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoachDetailListService {

  constructor(private http:HttpClient) { }

  coachDetailList(academyDetailId:any){
    return this.http.get(`${environment.apiURL}Academy/AcademyCoachDetails?academy_detail_id=${academyDetailId}`)
  }

  getCoachDataByNsrsID(academyDetailId:any,nsrs_Id:any){
    return this.http.get(`${environment.apiURL}Academy/AcademyCoachMappingDetail?academy_detail_id=${academyDetailId}&kitd_unique_id=${nsrs_Id}`)
  }

  getCoachDesignationList() {
    return this.http.get<IDesignationList[]>(environment.apiURL + 'Master/GetStakeHolderDesignations?type=coach');
  }
  getAcademyCoachHistoryList(academy_detail_id:number) {
    return this.http.get(`${environment.apiURL}Academy/Get_Academy_Coach_HistoryList?academy_detail_id=${academy_detail_id}`)
  }
}

export interface IDesignationList {
  id: number
  type: string;
  designation: string;
}
