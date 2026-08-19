import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface RoleEntity {
  dashboard_name: string;
  role_id: number;
  role_name: string;
}

export interface EditRoleEntity {
  roleId: number;
  roleName: string;
}

export interface EditDashboardEntity {
  appId: number;
  roleId: number;
  dashboardName: string;
}

export enum CHECK_TYPE {
  'MOBILE',
  'EMAIL',
  'USERNAME'
}

export interface AppEntity {
  appId: number;
  projectName: string;
  created_date: string;
  modified_date: string;
  is_active: boolean;
  is_delete: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ManageRoleService {
  constructor(private httpClient: HttpClient) {}

  getRole(appID: string) {
    return this.httpClient.get<RoleEntity[]>(environment.apiURL + 'SuperAdmin/GetRole', {params: {appID}});
  }

  getAppIdList() {
    return this.httpClient.get<AppEntity[]>(environment.apiURL + 'Master/ProjectMaster');
  }

  saveRole(body: EditRoleEntity) {
    return this.httpClient.post<boolean>(environment.apiURL + 'SuperAdmin/ManageRoleDetails', body);
  }

  saveDashboard(body: EditDashboardEntity) {
    return this.httpClient.post<boolean>(environment.apiURL + 'SuperAdmin/ManageRoleDashboard', body);
  }
}
