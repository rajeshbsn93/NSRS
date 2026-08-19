import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtherCoachService {

constructor(private http:HttpClient) { }

  getOtherCoachList(user_id:any,role_id:any,status:any){
    //console.log(role_id==46)
    if(role_id==46){
      return this.http.get(`${environment.apiURL}StakeHolder/GetOtherCoachList?user_id=${user_id}&sport_detail_id=0&status=${status}&role_id=${role_id}`)
    }else{
      return this.http.get(`${environment.apiURL}StakeHolder/GetOtherCoachList?user_id=${user_id}&sport_detail_id=0&status=1&role_id=${role_id}`)
    }
    
  }
}
