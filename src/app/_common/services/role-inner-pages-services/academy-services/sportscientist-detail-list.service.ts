import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SportscientistDetailListService {

  constructor(private http:HttpClient) { }

  getMasterSportList(){
    return this.http.get(`${environment.apiURL}Master/SportList`)
  }

  sportsScientistList(academyDetialId:any){
    return this.http.get(`${environment.apiURL}Academy/AcademySportScientistList?academy_detail_id=${academyDetialId}`)
  }
  academySportScientistMappingDetail(sportScienceCategory:any,nsrsid:any){
    return this.http.get(`${environment.apiURL}Academy/AcademySportScientistMappingDetail?sportScienceCategory=${sportScienceCategory}&kitd_unique_id=${nsrsid}`)
  }

  saveSportScientistAddMultipleData(academy_detail_id:any,formdata:any){
    return this.http.post(`${environment.apiURL}Academy/AcademySportScientistMapping?academy_detail_id=${academy_detail_id}`,formdata)
  }

  getAcademyMappingDetails(academy_detail_id:any,sport_detail_id:any){
    return this.http.get(`${environment.apiURL}Academy/AcademyEventMapDetails?academy_detail_id=${academy_detail_id}&sport_detail_id=${sport_detail_id}`)
  }

  getEventType(sport_detail_id:any){
    return this.http.get(`${environment.apiURL}Academy/AcademyEventType?sport_detail_id=${sport_detail_id}`)
  }

  getEventName(event_type_id:any){
    return this.http.get(`${environment.apiURL}Academy/AcademyEventName?event_type_id=${event_type_id}`)
  }


  saveAcademyEventMap(
    academy_Detail_id:any,
    sport_detail_id:any,
    event_detail_id:any,
    sanctioned_Strength_Men:any,
    sanctioned_Strength_Women:any
  ){
    return this.http.post(`${environment.apiURL}Academy/AcademySportEventMap`,
    {
      academy_Detail_id,
      sport_detail_id,
      event_detail_id,
      sanctioned_Strength_Men,
      sanctioned_Strength_Women
    });
  }

  deleteSportDisciplineEvent(academy_Detail_id:Number,sport_detail_id:Number,event_detail_id:Number){
    return this.http.post(`${environment.apiURL}Academy/DeleteAcademySportDiscipline?academy_detail_id=${academy_Detail_id}&sport_detail_id=${sport_detail_id}&event_detail_id=${event_detail_id}`,null)
  }

  getAcademySportsScientistHistoryList(academy_detail_id:any){
    return this.http.get(`${environment.apiURL}Academy/Get_Academy_SportsScientist_HistoryList?academy_detail_id=${academy_detail_id}`)
  }

}
