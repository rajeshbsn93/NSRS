import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonSportSpecificEducationService {
  constructor(private http: HttpClient) {}

  getSportSpecificEducationLists(params: GetSportSpecificEducationListsParams) {
    return this.http.get<Array<string>>(
      `${environment.apiURL}Master/Get_official_discipline_specific_education`, {params: {...params}}
    );
  }

  getOfficialDisciplineSpecificEducationDetails(official_detail_id: string) {
    return this.http.get<GetSportSpecificEducation[]>(
      `${environment.apiURL}Official/GetOfficialDisciplineSpecificEducation?official_detail_id=${official_detail_id}`
    );
  }

  saveOfficialDisciplineSpecificEducationDetails(body: SaveSportSpecificEducation) {
    return this.http.post<boolean>(
      `${environment.apiURL}Official/SaveOfficialDiscipline_SpecificEducation_Info`, {...body}
    );
  }

  deleteOfficialDisciplineSpecificEducation(official_sport_spfic_id : number) {
    return this.http.put(
      `${environment.apiURL}Official/Delete_OfficialDiscipline_SpecificEducation?official_sport_spfic_id=${official_sport_spfic_id}`, {}
    );
  }
  

  uploadFile(formData:FormData) {
    return this.http.post<any>(`${environment.apiURL}Upload/UploadFile`, formData);
  }
}

export interface GetSportSpecificEducationListsParams {
  roleId: string;
  discipline_id: string;
  issued_By?: string;
  education?: string;
  course_name?: string;
}

export interface GetSportSpecificEducation {
  issued_by: string;
  education: string;
  course_name: string;
  level_name: string;
  year_of_course: number;
  degree_Duration: string;
  remarks: string;
  document_path: string;
}

export interface SaveSportSpecificEducation {
  official_detail_id: number;
  has_recieved_sports_specific_education: boolean;
  diploma: string;
  level_name: string;
  year_of_course: number;
  duration: number;
  issued_by: string;
  remarks: string;
  degree_duration: string;
  degree_duration_number: number;
  course_name: string;
  document_path: string;
}