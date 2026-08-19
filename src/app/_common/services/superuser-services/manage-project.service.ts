import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface AppEntity {
  appId: number;
  projectName: string;
  created_date: string;
  encAppId: string;
  modified_date: string;
  is_active: boolean;
  is_delete: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ManageProjectService {
  constructor(private httpClient: HttpClient) {}

  getProjects() {
    return this.httpClient.get<AppEntity[]>(environment.apiURL + 'Master/ProjectMaster');
  }

  saveProject(data: {appId: string, name: string}) {
    return this.httpClient.put<boolean>(environment.apiURL + 'SuperAdmin/ManageProjectMaster', undefined, {params: data});
  }
}
