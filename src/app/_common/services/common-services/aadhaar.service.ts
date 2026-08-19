import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AadhaarService {

constructor(private http:HttpClient) { }
// profileChangePassword(user_id:any,role_id:any,oldPassword:any,newPassword:any){
//   return this.http.put(`${environment.apiURL}Common/ChangePassword`,{user_id,role_id,oldPassword,newPassword})
// }
getAadhaar(userid:number,roleid:number){
  return this.http.get(`${environment.apiURL}DigiLocker/GetAdharValidationDetail?aadharuserId=${userid}&roleId=${roleid}`)
}

}
