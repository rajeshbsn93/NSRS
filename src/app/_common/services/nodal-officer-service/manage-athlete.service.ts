import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageAthleteService {

constructor(
  private _http:HttpClient
) { }

dobVerificationPlayerList(userid:number,roleId:number,status:number){
  return this._http.get(`${environment.apiURL}StakeHolder/Dob_verification_Player_List?userid=${userid}&roleId=${roleId}&Status=${status}`)
}
savePlayerDobverification(data:any){
  return this._http.put(`${environment.apiURL}StakeHolder/SavePlayer_Dobverification`,data)
}

}

export interface DobVerificationPlayerListEntity{
  srno: number
  player_detail_id: number
  full_name: string
  father_full_name: string | null
  mother_full_name: string | null
  nsrs_id: string
  date_of_birth: string
  gender: string
  sport_detail_id: number
  sport_display_name: string
  is_Verified: number
}
