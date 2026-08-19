import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoachEducationInfoService {
  constructor(private http: HttpClient) {}

  getUniversityList() {
    return this.http.get<UniversityEntity[]>(`${environment.apiURL}Master/UniversityList`);
  }

  getBoardList() {
    return this.http.get<BoardEntity[]>(`${environment.apiURL}Master/BoardList`);
  }

  getMediumList() {
    return this.http.get<MediumEntity[]>(`${environment.apiURL}Master/MediumList`);
  }
  
  getEducationInfo(player_detail_id: string) {
    return this.http.get<OfficialEducationEntity[]>(`${environment.apiURL}Official/GetOfficial_Education_Info?official_detail_id=${player_detail_id}`);
  }

  saveEducationInfo(body: any) {
    return this.http.post<boolean>(`${environment.apiURL}Official/SaveOfficial_Education_Info`, body);
  }

  editEducationInfo(body: EditOfficialEducationEntity) {
    return this.http.post<boolean>(`${environment.apiURL}Official/EditOfficial_Education_Detail`, body);
  }
  deleteEducation(official_education_id : number) {
    return this.http.put(`${environment.apiURL}Official/DeleteOfficial_Education_Info?official_education_id=${official_education_id}`,{});
  }
}

export enum EDUCATION {
  DOCTORATE = 'Doctorate',
  POST_GRADUATION = 'Post Graduation',
  INTEGRATED = 'Integrated',
  GRADUATION = 'Graduation',
  DIPLOMA = 'Diploma',
  INTERMEDIATE = 'Intermediate',
  HIGH_SCHOOL = 'High School',
  PVT_COURSE = 'Pvt. Course'
}

export enum INSTT_TYPE {
  SCHOOL = 'School',
  UNIVERSITY = 'University',
  PVT_INSTITUTION = 'Pvt. Institution'
}

export enum PASSING_STATUS {
  ONGOING = 'Ongoing',
  PASSED = 'Passed',
  DROPPED_OUT = 'Dropped Out',
  FAILED = 'Failed'
}

export interface UniversityEntity {
  university_detail_id: number;
  university_name: string;
  is_active: number;
  is_deleted: number;
  created_date: string;
  university_unique_id: number;
  university_name_old: string;
}

export interface BoardEntity {
  board_id: number;
  board_name: string;
  created_date: string;
  is_active: number;
  is_deleted: number;
}

export interface MediumEntity {
  medium_id: number;
  medium_language: string;
  created_date: string;
  is_active: number;
  is_deleted: number;
}

export interface OfficialEducationEntity {
  official_education_id: number;
  education_type: string;
  education_name: string;
  name_of_institution: string;
  institution_type: string;
  institute_registration_no: string;
  board_name: string | null;
  medium_language: string | null;
  result: number | null;
  result_out_of: number | null;
  passing_status: string;
  year_of_passing: number | null;
}

export interface EditOfficialEducationEntity {
  official_education_id: number;
  result: number | null;
  result_out_of: number | null;
  passing_status: string;
  year_of_passing: number | null;
}
