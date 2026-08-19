import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface UserEntity {
  userId: number;
  userName: string;
  userDisplayName: string;
  roleName: string;
  role_id: number;
  state_id: number;
  mobileNo: string;
  phoneNo: string;
  emailId: string;
}

export interface EditUserEntity {
  userId: number;
  userName: string;
  userDisplayName: string;
  roleId: number;
  address: string;
  stateId: number;
  mobileNo: string;
  phoneNo: string;
  emailId: string;
  password: string;
  isStakeHolder: boolean;
}

export enum CHECK_TYPE {
  'MOBILE' = 1,
  'EMAIL' = 2,
  'USERNAME' = 3
}

@Injectable({
  providedIn: 'root',
})
export class ManageUserService {
  constructor(private httpClient: HttpClient) {}

  getUser() {
    return this.httpClient.get<UserEntity[]>(
      environment.apiURL + 'SuperAdmin/Get_User'
    );
  }

  getRole() {
    return this.httpClient.get<UserEntity[]>(
      environment.apiURL + 'SuperAdmin/GetRole'
    );
  }
  
  deleteUser(userId: string, roleId: string) {
    return this.httpClient.put<UserEntity[]>(environment.apiURL + `SuperAdmin/DeleteUserDetails`,undefined,{params: {userId, roleId}});
  }

  saveUser(body: EditUserEntity) {
    return this.httpClient.post<boolean>(
      environment.apiURL + 'SuperAdmin/ManageUserDetails',
      body
    );
  }

  isAlreadyExistCheck(value: string, type: CHECK_TYPE) {
    return this.httpClient.get<boolean>(environment.apiURL + 'Registration/IsAlreadyExistCheck', {params: {value,type}});
  }

}
