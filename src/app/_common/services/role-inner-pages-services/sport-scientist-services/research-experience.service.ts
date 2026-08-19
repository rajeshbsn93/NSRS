import { HttpClient } from '@angular/common/http'
import {Injectable} from '@angular/core'
import { environment } from 'src/environments/environment'
@Injectable({
    providedIn:'root'
})

export  class researchExperienceService{
    constructor(private http:HttpClient){}
    resarch_Experience(official_detail_id:number){
        return this.http.get<resarch_ExperienceEntity>(`${environment.apiURL}Official/Get_Resarch_Experience?official_detail_id=${official_detail_id}`)
    }

    SaveResarchExperience(
        research_experience_details_id:number,official_detail_id:number,year_of_experience:number,
        institute_of_research:string, remark:string
        ){
            return this.http.post<resarch_ExperienceEntity>(`${environment.apiURL}Official/SaveResarchExperience`, {
                research_experience_details_id,official_detail_id,year_of_experience,institute_of_research,remark
            })
        }

    DeleteResarchExperience(research_experience_details_id:number){
        return this.http.post(`${environment.apiURL}Official/DeleteResarchExperience?research_experience_details_id=${research_experience_details_id}`, {})
    }

    teaching_Experience(official_detail_id:number){
        return this.http.get<teaching_ExperienceEntity>(`${environment.apiURL}Official/Get_Teaching_Experience?official_detail_id=${official_detail_id}`)
    }
    SaveTeachingExperience(
        teaching_experience_details_id:number,official_detail_id:number,year_of_experience:number,
        institute_of_teaching:string, remark:string
        ){
            return this.http.post<resarch_ExperienceEntity>(`${environment.apiURL}Official/SaveTeachingExperience`, {
                teaching_experience_details_id,official_detail_id,year_of_experience,institute_of_teaching,remark
            })
        }

    DeleteTeachingExperience(research_experience_details_id:number){
        return this.http.post(`${environment.apiURL}Official/Delete_Teaching_Experience?teaching_experience_details_id=${research_experience_details_id}`, {})
    }

    publication_details(official_detail_id:number){
        return this.http.get<PublicationEntity>(`${environment.apiURL}Official/Get_publication_details?official_detail_id=${official_detail_id}`)
    }

    SavePublicationDetail(publication_detail_id:number,official_detail_id:number,type:string,name:string,date_of_publication:any){
        return this.http.post<resarch_ExperienceEntity>(`${environment.apiURL}Official/SavePublicationDetail`, {
            publication_detail_id,official_detail_id,type,name,date_of_publication
        })
    }

    DeletePublicationDetails(publication_detail_id:number){
        return this.http.post(`${environment.apiURL}Official/Delete_publication_details?publication_detail_id=${publication_detail_id}`, {})
    }
    training_workshop_conference_details(official_detail_id:number){
        return this.http.get<PublicationEntity>(`${environment.apiURL}Official/Get_training_workshop_conference_details?official_detail_id=${official_detail_id}`)
    }
    DeleteTrainingWorkshopConferenceDetails(training_workshop_conference_detail_id:number){
        return this.http.delete(`${environment.apiURL}Official/Delete_training_workshop_conference_details?training_workshop_conference_detail_id=${training_workshop_conference_detail_id}`, {})
    }
    saveTrainingWorkshopConferenceDetails(id:number,official_detail_id:number,workshop_type:string,workshop_level:string,workshop_name:string,workshop_date:any){
        return this.http.post(`${environment.apiURL}Official/Save_training_workshop_conference_details`, {
            id,official_detail_id,workshop_type,workshop_level,workshop_name,workshop_date
        })
    }
    officials_award_list(official_detail_id:number){
        return this.http.get<OfficialsAwardListEntity>(`${environment.apiURL}Official/Get_officials_award_list?official_detail_id=${official_detail_id}`)
    }
    saveOfficialAwardDetails(id:number,official_detail_id:number,award_year:any,award_received_from:string,award_name:string){
        return this.http.post<OfficialsAwardListEntity>(`${environment.apiURL}Official/Save_official_award_details`,{
            id,official_detail_id,award_year,award_received_from,award_name
        })
    }
    deleteOfficialAwardDetails(id:number){
        return this.http.delete(`${environment.apiURL}Official/Delete_officials_award_details?id=${id}`, {})
    }
    
    member_scientific_bodies_details(official_detail_id:number){
        return this.http.get<MemberScientificBodiesDetailsEntity>(`${environment.apiURL}Official/Get_member_scientific_bodies_details?official_detail_id=${official_detail_id}`)
    }
    saveMemberScientificBodiesDetails(id:number,official_detail_id:number,body_year:any,body_type:string,body_name:string,remark:string){
        return this.http.post<MemberScientificBodiesDetailsEntity>(`${environment.apiURL}Official/Save_member_scientific_bodies_details`,
        {
            id,official_detail_id,body_year,body_type,body_name,remark
        })
    }
    deleteMemberScientificBodiesDetails(id:number){
        return this.http.delete(`${environment.apiURL}Official/Delete_member_scientific_bodies_details?id=${id}`, {})
    }
    
}

export interface resarch_ExperienceEntity {
    research_experience_details_id: number
    official_detail_id: number
    year_of_experience: number
    institute_of_research: string
    remark: string
}

export interface teaching_ExperienceEntity {
    teaching_experience_details_id: number
    year_of_experience: number
    institute_of_teaching: null
    remark: null
  }

  export interface PublicationEntity {
    publication_detail_id: number
    type: string
    name: string
    date_of_publication: string
  }

  export interface OfficialsAwardListEntity{
    id: number
    official_detail_id: number
    award_year: number
    award_received_from: string
    award_name: string
  }

  export interface MemberScientificBodiesDetailsEntity{
    id: number
    official_detail_id: number
    body_year: number
    body_type: string
    body_name: string
    remark: string
  }