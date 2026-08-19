import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class AthleteDocumentService{
    constructor(private http:HttpClient){}

    athleteDocumentInfo(player_detail_id :number){
      return  this.http.get<athleteDocumentEntity>(`${environment.apiURL}Athlete/GetAthleteDocumentInfo?player_detail_id=${player_detail_id}`)
    }
    saveAthleteDocumentInfo(formData:any){
      return  this.http.post<athleteDocumentEntity>(`${environment.apiURL}Athlete/SaveAthleteDocumentInfo`,formData)
    }
}

export interface athleteDocumentEntity {
    player_detail_id: number
    player_image_path: null
    aadhar_number: string
    aadhar_image_path: string
    is_aadhar_verified: boolean
    passport_number: string
    passport_image_path: string
    voter_id_number: string
    voter_id_image_path: string
    tenth_pass_year: null
    tenth_certificate_path: string
    pancard_number: string
    pancard_path: null
    birth_certi_issued_year: null
    birth_certificate_path: string
    bonafide_year: null
    passport_expiry_date: null
    ration_card_number: string
    ration_card_path: null
    driving_licence_number: string
    driving_licence_path: null
    other_document_name: null
    other_document_path: null
    bonafide_certificate: null
  }