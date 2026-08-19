import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcademySharableService {

  constructor(private http:HttpClient) { }

  getAcademySportsDiscipline(academyDetailid:any){
    return this.http.get(`${environment.apiURL}Academy/AcademySportDecipline?academy_detail_id=${academyDetailid}`)
  }
  
  ssCatList(){
    return this.http.get(`${environment.apiURL}Master/SportScienceList`)
  }

  saveCoachData(academy_detail_id:any,data:any){
    for(let i of data){
      // console.log(i)
      i.is_pca=Number(i.is_pca)
    }
    return this.http.post(`${environment.apiURL}Academy/AcademyCoachMapping?academy_detail_id=${academy_detail_id}`,data)
  }

  weedOut(data:any){
    data.pWeedOutDate=data.pWeedOutDate.utc('dd-MM-YYYY')
    return this.http.post(`${environment.apiURL}StakeHolder/WeedOut`,data)
  }

  get_Academy_Mapped_Athletes(academy_detail_id: number, official_detail_id: number, sportId: number) {
    return this.http.get<AcademyMappedAthletesEntity[]>(`${environment.apiURL}Academy/Get_Academy_Mapped_Athletes?academy_detail_id=${academy_detail_id}&official_detail_id=${official_detail_id}&sportId=${sportId}`);
  }

  UpdateAcademy_Official_Mapping(id:number,todate:any,roleId:number){
    return this.http.post<UpdateAcademyOfficialMappingEntity>(`${environment.apiURL}Academy/UpdateAcademy_Official_Mapping`,{id,todate,roleId})
  }
  getAcademyDashboard(academyId:number){
    return this.http.get(`${environment.apiURL}kic_dashboard/AcademyDashboard?academyId=${academyId}`)
  }

}

export interface AcademyMappedAthletesEntity {
  player_detail_id: number;
  nsrsId: string;
  name: string;
  academy_date_of_joining: string;
  coach_fromDate: null;
  coach_toDate: null;
  isMapped: false;
  trainingLevel:string;
  trainingLevel_id:number
}

export interface  UpdateAcademyOfficialMappingEntity{
  id: number
  todate: string
  roleId: number
}
