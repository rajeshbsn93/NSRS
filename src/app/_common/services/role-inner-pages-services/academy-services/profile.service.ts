import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private tabIndex = new BehaviorSubject<number>(0);
  currentTabIndex = this.tabIndex.asObservable();

  changeTab(index: number) {
    this.tabIndex.next(index);
  }

  constructor(private http:HttpClient) { }

  getBasicInfo(academyDetailId:any){
    return this.http.get(`${environment.apiURL}Academy/AcademyBasicDetailList?academy_detail_id=${academyDetailId}`)
  }

  saveBasicInfo(academy_detail_id:any,academy_name:any,kitd_unique_id:any,academy_registration_number:any,
    legal_entity_name:any,status:any,year_of_operation:any){
      //console.log(year_of_operation)
      // year_of_operation=year_of_operation.toString()
    return this.http.post(`${environment.apiURL}Academy/UpdateAcademyBasicInformation`,
    {academy_detail_id,academy_name,kitd_unique_id,academy_registration_number,legal_entity_name,status,year_of_operation})
  }

  getAcademySportList(academyDetailid:any){
    return this.http.get(`${environment.apiURL}Academy/AcademySportList?academy_detail_id=${academyDetailid}`)
  }
  getAcademyAddress(academyDetailid:any){
    return this.http.get(`${environment.apiURL}Academy/Get_AcademyAddress?academy_detail_id=${academyDetailid}`)
  }
  StateMasterList(){
    const countryId = 1
    return this.http.get(`${environment.apiURL}Master/StateMasterList?countryId=${countryId}`)
  }
  DistrictMasterList(state_id:any){
    return this.http.get(`${environment.apiURL}Master/DistrictMasterList?state_id=${state_id}`)
  }
  BlockMasterList(districtId:any){
    return this.http.get(`${environment.apiURL}Master/BlockMasterList?districtId=${districtId}`)
  }
  PincodeMasterList(districtId:any){
    return this.http.get(`${environment.apiURL}Master/PincodeMasterList?districtId=${districtId}`)
  }

  UpdateAcademyAddress(formData:any){
    return this.http.post(`${environment.apiURL}Academy/UpdateAcademyAddress`,formData)
  }

  academySportDecipline(academy_detail_id:number){
    return this.http.get(`${environment.apiURL}Academy/AcademySportDecipline?academy_detail_id=${academy_detail_id}`)
  }
  

}
