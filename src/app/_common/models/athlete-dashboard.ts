export interface AthleteDashboard {
}

export interface AthleteDashboardIRootObject{
    currentAcademy: string
    currentCoach: null
    isAadhaarVerified: boolean
    isInsured: boolean
    currentFASchemes: string
    athleteAchievementDatas: IAthleteAchievementDatasItem[]
  }
  export interface IAthleteAchievementDatasItem{
    player_achievement_detail_id: number
    player_detail_id: number
    category: string
    competition_level: string
    tournament_name: string
    from_date: string
    to_date: string
    venue: string
    represented: string
    represented_Others: string
    result: string
    result1: string
    result2: string
    result3: string
    event_list: string
    position: string
    created_date: string
    document_path: string
    nationalSelected: boolean
    internationalSelected: boolean
    othersSelected: boolean
    stateDistrictSelected: boolean
    otherCompetitionSelected: boolean
    srno: number
    competition_name_other: string
  }

export interface AthleteAchievementOjectItem{
  player_achievement_detail_id: number
  player_detail_id: number
  category: string
  competition_level: string
  tournament_name: string
  from_date: string
  to_date: string
  venue: string
  represented: string
  represented_Others: string
  result: string
  result1: string
  result2: string
  result3: string
  event_list: string
  position: string
  created_date: string
  document_path: string
  nationalSelected: boolean
  internationalSelected: boolean
  othersSelected: boolean
  stateDistrictSelected: boolean
  otherCompetitionSelected: boolean
  srno: number
  competition_name_other: string
}

export interface AthletePersonalInfoObject{
  player_detail_id: number
  kitd_unique_id: string
  full_name: string
  date_of_birth: string
  gender: string
  sport_detail_id: number
  sport_name: string
  mobile_number: string
  alternate_mobile_number: string
  email_id: string
  alternate_email_id: string
  father_full_name: string
  mother_full_name: string
  father_profession: string
  mother_profession: string
  coach_detail_id: null
  coach_name: string
  academy_detail_id: number
  academy_name: string
  role_detail_id: number
  player_guid: string
  is_academy_verified: boolean
}
