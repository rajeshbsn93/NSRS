import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CoachEntity {
  official_detail_id: number;
  nsrsId: string;
  name: string;
  date_of_joining: string;
}

export interface CoachDelegate {
  official_detail_id: number;
  coachName: string;
  nsrsId: string;
  sports: string;
  isMapped: boolean;
}

export interface AthleteDelegate {
  player_detail_id: number;
  athleteName: string;
  nsrsId: string;
  sports: string;
  isMapped: boolean;
}

export interface DelegateMappingEntity {
  coach_delegate_mapping: CoachDelegate[];
  athlete_delegate_mapping: AthleteDelegate[];
}

export interface AcademyOfficialAthleteMappingEntity {
  athleteid: number;
  fromdate: string;
  todate: string | null;
  pa_permission: string;
  trainingLevel_id:number;
}

@Injectable({providedIn: 'root'})
export class DelegateMappingService {
  constructor(private httpClient: HttpClient) {}

  getCoachList(academy_detail_id: number, role_id: number, disciplineId: number): Observable<CoachEntity[]> {
    return this.httpClient.get<CoachEntity[]>(
      environment.apiURL + 'Academy/Get_Academy_Mapped_Officials',
      {
        params: {
          academy_detail_id,
          role_id,
          disciplineId
        },
      }
    );
  }

  getDataForDelegateMapping(academy_id: number, delegateCoachId: number) {
    return this.httpClient.get<DelegateMappingEntity>(
      environment.apiURL + 'Academy/GetDataForDelegationMapping',
      { params: { academy_id, delegateCoachId } }
    );
  }

  saveDelegationMappingData(delegateId: number, academyId: number, coaches: string, athletes: string ) {
    return this.httpClient.post(environment.apiURL + 'Academy/SaveDelegationMapping', {
        delegateId, academyId, coaches, athletes
    });
  }

  saveAcademyOfficialAthleteMapping(
    dataToSend: AcademyOfficialAthleteMappingEntity[],
    academy_detail_id: number,
    official_detail_id: number,
    mappedBy_roleId: number
  ) {
    return this.httpClient.post(environment.apiURL + 'Academy/Academy_Official_Athlete_Mapping', dataToSend, {
      params: {
        academy_detail_id,
        official_detail_id,
        mappedBy_roleId
      }
    })
  }
}
