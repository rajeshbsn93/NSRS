import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SportscientistService {

constructor(private http:HttpClient) { }

ssList(user_id:any,nsrs_id:any,name:any,sport_id:any,scheme_id:any,gender:any){
  return this.http.post(`${environment.apiURL}StakeHolder/sdo/SportScientistList`,{user_id,nsrs_id,name,sport_id,scheme_id,gender})
}

ssListFilter(user_id:any,data:any){
  var nsrs_id=data.nsrsid
  var name=data.name
  var sport_id=data.category
  var gender=data.gender
  return this.http.post(`${environment.apiURL}StakeHolder/sdo/SportScientistList`,{user_id,nsrs_id,name,sport_id,gender})
}

ssCatList(){
  return this.http.get(`${environment.apiURL}Master/SportScienceList`)
}

deleteInsurance(tagId:any,userid:number){
  return this.http.put(`${environment.apiURL}StakeHolder/DeleteOfficialInsurance?tagId=${tagId}&userId=${userid}`,{})
}

}
