import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface RoleEntity {
  role_id: number;
  role_name: string;
}

export interface UpdateUserEM {
  userName: string;
  roleId: number;
  emailId: string;
  mobileNo: string;
}

@Injectable({
  providedIn: 'root',
})
export class CheckCredentialService {
  constructor(private httpClient: HttpClient) {}

  getRolesList() {
    return this.httpClient.get<RoleEntity[]>(environment.apiURL + 'Master/RoleMaster');
  }

  saveUpdateUserEM(data:UpdateUserEM){
    return this.httpClient.post<any>(environment.apiURL + 'SuperAdmin/UpdateUserEM', data);

  }
}
