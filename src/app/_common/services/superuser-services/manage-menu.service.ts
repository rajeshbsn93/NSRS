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

export interface MenuEntity {
  id: number;
  menu_name: string;
  menu_component_name: string;
  menu_class: string;
}

export interface EditMenuEntity {
  id: number;
  menu_name: string;
  menu_component_name: string;
  menu_class: string;
  app_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ManageMenuService {
  constructor(private httpClient: HttpClient) {}

  getAppIdList() {
    return this.httpClient.get<AppEntity[]>(environment.apiURL + 'Master/ProjectMaster');
  }

  getMenuDetails(AppID: string) {
    return this.httpClient.get<MenuEntity[]>(environment.apiURL + 'SuperAdmin/GetMenuMaster', {params: {AppID}});
  }

  manageMenuDetails(body: EditMenuEntity) {
    return this.httpClient.post<boolean>(environment.apiURL + 'SuperAdmin/ManageMenuMaster', body);
  }
}
