import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface ProjectRoleMappingEntity  {
  appId: number;
  appName: string;
  roleId: number;
  role_name: string;
}

export interface EditProjectRoleMapping {
  appID: number;
  roleID: string;
}

export interface AppEntity {
  appId: number;
  projectName: string;
  created_date: string;
  modified_date: string;
  is_active: boolean;
  is_delete: boolean;
}

export interface RoleEntity {
  dashboard_name: string;
  role_id: number;
  role_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ManageProjectRoleMappingService {
  constructor(private httpClient: HttpClient) {}

  getProjectRoleMapping(AppID: string) {
    return this.httpClient.get<ProjectRoleMappingEntity[]>(environment.apiURL + 'SuperAdmin/GetProjectRoleMapping', {params: {AppID}});
  }

  createProjectRoleMapping(body: EditProjectRoleMapping) {
    return this.httpClient.post<boolean>(environment.apiURL + 'SuperAdmin/CreateProjectRoleMapping', body);
  }

  getAppIdList() {
    return this.httpClient.get<AppEntity[]>(environment.apiURL + 'Master/ProjectMaster');
  }

  getRole(appID: string) {
    return this.httpClient.get<RoleEntity[]>(environment.apiURL + 'SuperAdmin/GetRole', {params: {appID}});
  }
}
