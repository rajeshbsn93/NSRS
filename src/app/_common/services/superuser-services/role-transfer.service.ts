import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleTransferService {

constructor(private _http:HttpClient) { }

  getRolesMaster(IsTransferable:number | string = '') {
    return this._http.get<RoleEntity[]>(environment.apiURL + 'Master/RoleMaster?IsTransferable='+IsTransferable);
  }
  getuserRoleDetail(roleId:number, nsrdId:string){
    return this._http.get<GetUserRoleDetailEntity[]>(environment.apiURL + 'SuperAdmin/GetuserRoleDetail?roleId=' +roleId + '&userName='+nsrdId)
  }
  getUserSportsDetail(roleId:number,masterId:number,toRoleId:any){
    return this._http.get<GetUserSportsDetailEntity[]>(environment.apiURL + 'SuperAdmin/GetUserSportsDetail?roleId=' + roleId + '&masterId=' + masterId + '&toRoleId='+ toRoleId)
  }
  saveRoleTransferDetail(payload:any){
    return this._http.post(environment.apiURL + 'SuperAdmin/SaveRoleTransferDetail',payload)
  }

}

export interface RoleEntity {
  role_id: number
  role_name: string
}
export interface GetUserRoleDetailEntity {
  master_id: number
  role_id: number
  nsrs_id: string
  role_name: string
  user_name: string
  user_display_name: string
}
export interface GetUserSportsDetailEntity {
  sport_detail_id: number
  sport_display_name: string
}
