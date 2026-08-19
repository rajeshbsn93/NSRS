import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface AppEntity {
  appId: number;
  projectName: string;
  created_date: string;
  modified_date: string;
  is_active: boolean;
  is_delete: boolean;
}

export interface RoleEntity {
  role_id: number;
  role_name: string;
}

export interface MenuRoleMappingEntity {
  id: number;
  menu_id: number;
  menu_name: string;
  menu_order: number;
}

export interface EditMenuRoleMappingEntity {
  id: number;
  role_id: number;
  menu_id: number;
  menu_order: number;
  appId: number;
}

export interface MenuListEntity {
  id: number;
  menu_name: string;
  menu_component_name: string;
  menu_class: string;
}

@Injectable({
  providedIn: 'root',
})
export class ManageMenuRoleMappingService {
  constructor(private httpClient: HttpClient) {}

  getRolesList() {
    return this.httpClient.get<RoleEntity[]>(environment.apiURL + 'Master/RoleMaster');
  }

  getAppIdList() {
    return this.httpClient.get<AppEntity[]>(environment.apiURL + 'Master/ProjectMaster');
  }

  getMenuList(AppID: string) {
    return this.httpClient.get<MenuListEntity[]>(environment.apiURL + 'SuperAdmin/GetMenuMaster', {params: {AppID}});
  }

  getMenuRoleMappingDetails(RoleId: string, AppID: string) {
    return this.httpClient.get<MenuRoleMappingEntity[]>(environment.apiURL + 'SuperAdmin/GetMenuRoleMapping', {params: {RoleId, AppID}});
  }

  manageMenuRoleMappingDetails(body: EditMenuRoleMappingEntity) {
    return this.httpClient.post<boolean>(environment.apiURL + 'SuperAdmin/ManageMenuRoleMapping', body);
  }
}
