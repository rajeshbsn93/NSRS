import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})
export class PopupProfileService{
    constructor(private http:HttpClient){}    

    athleteProfilePopupDetails(player_detail_id:number,tabName:string){
        return this.http.get<AthleteProfilePopupDetailsEntity>(`${environment.apiURL}StakeHolder/GetAthleteProfilePopupDetails?player_detail_id=${player_detail_id}&tabName=${tabName}`)
    }
    officialProfilePopupDetails(official_detail_id :number,tabName:string,role_id:number){
        return this.http.get<AthleteProfilePopupDetailsEntity>(`${environment.apiURL}StakeHolder/GetOfficialProfilePopupDetails?official_detail_id=${official_detail_id}&tabName=${tabName}&role_id=${role_id}`)
    }
    AcademyCoachDetailPopUp(academy_detail_id:number,official_detail_id :number){
      return this.http.get(`${environment.apiURL}Academy/AcademyCoachDetailPopUp?academy_detail_id=${academy_detail_id}&official_detail_id=${official_detail_id}`)
    }
}

export interface AthleteProfilePopupDetailsEntity{
    dashboardData: AthleteProfileDashboardDataEntity
    personalInfo: AthleteProfilePersonalInfoEntity
    addressInfo: AthleteProfileAddressInfoEntity
    knittingInfo: null
    documentInfo: AthleteProfileDocumentInfoEntity
    bankInfo: null
    mobileEmailInfo: AthleteProfileMobileEmailInfoEntity
    educationInfo: any[]
    mediaInfo: null
    languageInfo: null
  }
  export interface AthleteProfileDashboardDataEntity{
    currentAcademy: null
    currentCoach: string
    isAadhaarVerified: boolean
    isInsured: boolean
    currentFASchemes: string
    athleteAchievementDatas: null
  }
  export interface AthleteProfilePersonalInfoEntity {
    player_detail_id: number
    kitd_unique_id: string
    full_name: string
    date_of_birth: string
    gender: string
    sport_detail_id: number
    sport_name: string
    mobile_number: string
    alternate_mobile_number: null
    email_id: string
    alternate_email_id: null
    father_full_name: null
    mother_full_name: null
    father_profession: null
    mother_profession: null
    coach_detail_id: null
    coach_name: string
    academy_detail_id: null
    academy_name: null
    role_detail_id: number
    player_guid: string
    is_academy_verified: null
  }
  export interface AthleteProfileAddressInfoEntity {
    player_detail_id: number
    comm_add_line_1: null
    comm_add_line_2: null
    comm_state_id: null
    comm_city_id: null
    comm_pincode: null
    comm_add_block_id: null
    comm_add_district_id: null
    comm_add_landmark: null
    perm_comm_add_same: null
    perm_add_line_1: null
    perm_add_line_2: null
    perm_state_id: null
    perm_city_id: null
    perm_pincode: null
    perm_add_block_id: null
    perm_add_district_id: null
    perm_add_landmark: null
  }
  export interface AthleteProfileDocumentInfoEntity {
    player_detail_id: number
    player_image_path: string
    aadhar_number: string
    aadhar_image_path: string
    is_aadhar_verified: boolean
    passport_number: string
    passport_image_path: string
    passport_last_path: null
    voter_id_number: string
    voter_id_image_path: string
    tenth_pass_year: null
    tenth_certificate_path: string
    pancard_number: string
    pancard_path: string
    birth_certi_issued_year: null
    birth_certificate_path: string
    bonafide_year: null
    passport_expiry_date: null
    ration_card_number: string
    ration_card_path: string
    driving_licence_number: string
    driving_licence_path: string
    other_document_name: string
    other_document_path: string
    bonafide_certificate: string
    dob_path: string
  }
  export interface AthleteProfileMobileEmailInfoEntity {
    mobile_number: string
    alternate_mobile_number: string
    email_id: string
    alternate_email_id: string
  }