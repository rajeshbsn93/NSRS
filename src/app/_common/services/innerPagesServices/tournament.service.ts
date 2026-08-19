import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

constructor(private http:HttpClient) { }

tournamentList(userid:number,appId:number){
  return this.http.get(`${environment.apiURL}StakeHolder/GetTournamentList?appId=${appId}&userId=${userid}`);
}
tournamentCategoryList(){
  return this.http.get(`${environment.apiURL}Master/TournamentCategoryList`);
}
eventList(tournamentId:number,sportId?:number){
  //console.log(sportId)
  return this.http.get(`${environment.apiURL}StakeHolder/GetEventList?tournamentId=${tournamentId}&sportId=${sportId}`);
}

viewEventList(tournamentId:number){
  return this.http.get(`${environment.apiURL}StakeHolder/GetEventList?tournamentId=${tournamentId}`);
}
countryMasterList(){
  return this.http.get(`${environment.apiURL}Master/CountryMasterList`);
}
stateMasterList(countryId:number){
  return this.http.get(`${environment.apiURL}Master/StateMasterList?countryId=${countryId}`);
}
cityMasterList(stateid:any){
  return this.http.get(`${environment.apiURL}Master/CityMasterList?state_id=${stateid}`);
}

// saveEditTournament(){}
// saveEditTournament(tournamentId:number,tournamentName:string,tournamentCategoryId:number,tournamentEdition:number,tournamentYear:number,tournamentLevel:string,
//   category:string,disciplines:string,startDate:string,endDate:string,place:string,country:number,state:number,city:number,userid:number,appId:number){

//   return this.http.post(`${environment.apiURL}StakeHolder/SaveTournament`,{
//     tournamentId,tournamentName,tournamentCategoryId,tournamentEdition,tournamentYear,tournamentLevel,category,disciplines,startDate,endDate,place,
//     country,state,city,userid,appId
//   })
// }

saveEditTournament(addTournamentFormData:any){
  var tournamentId=addTournamentFormData.tournamentId
  // var tournamentName=addTournamentFormData.tournament_Name
  var tournamentCategoryId=addTournamentFormData.tournamentCategoryId
  var tournamentEdition=addTournamentFormData.tournamentEdition
  var tournamentYear=addTournamentFormData.yearOfTournament
  // var tournamentLevel=addTournamentFormData.tournamentLevel
  var category=addTournamentFormData.category
  var disciplines=addTournamentFormData.disciplines
  var startDate=addTournamentFormData?.startDate?.utc('dd-MM-YYYY')
  var endDate=addTournamentFormData?.endDate?.utc('dd-MM-YYYY')
  var place=addTournamentFormData.place
  var country=addTournamentFormData.country
  var state=addTournamentFormData.state
  var city=addTournamentFormData.city
  var userid=addTournamentFormData.userid
  var appId=addTournamentFormData.appId
  var tournamentName = addTournamentFormData.tournament_Name
  var cash_Reward = addTournamentFormData.cash_Reward
  var age_group = 0
  // var age_group=addTournamentFormData.ageCategory
  // return this.http.post(`${environment.apiURL}StakeHolder/SaveTournament`,{tournamentId,tournamentName,
  //   tournamentCategoryId,tournamentEdition,tournamentYear,tournamentLevel,category,disciplines,
  //   startDate,endDate,place,country,state,city,userid,age_group,appId
  // })
  return this.http.post(`${environment.apiURL}StakeHolder/SaveTournament`,{tournamentId,
    tournamentCategoryId,tournamentEdition,tournamentYear,category,disciplines,
    startDate,endDate,place,country,state,city,userid,appId,tournamentName,cash_Reward,age_group
  })
}
deleteTournament(tournament_detail_id:number){
  return this.http.put(`${environment.apiURL}StakeHolder/DeleteTournament?tournament_detail_id=${tournament_detail_id}`,{})
}
getManageDiscipline(tournament_detail_id :any){
  return this.http.get(`${environment.apiURL}StakeHolder/GetTournamentSportMapping?tournament_detail_id=${tournament_detail_id}`)
}
GetEventdetailSportwise(sport_id:number){
  return this.http.get(`${environment.apiURL}Master/GetEventdetailSportwise?sport_id=${sport_id}`)
}

saveEvent(tournament_detail_id:number,event_id:any){
  return this.http.post(`${environment.apiURL}StakeHolder/SaveEvent`,{tournament_detail_id,event_id})
}

CreateTournamentEvent(formData:any){
  return this.http.post(`${environment.apiURL}Master/CreateTournamentEvent`,formData)
}

deleteEventMaster(eventId:any,userId:any){
  return this.http.post(`${environment.apiURL}Master/DeleteTournamentEvent?eventId=${eventId}&userId=${userId}`,{})
}

tournamentCategoryListArgument(level:any){
  return this.http.get(`${environment.apiURL}Master/TournamentCategoryList?level=${level}`);
}
masterTournamentList(year:any,categoryid:number){
  return this.http.get(`${environment.apiURL}Master/TournamentList?year=${year}&category=${categoryid}`);
}
eventdetailTournamnetwise(tournamentId: number){
  return this.http.get(`${environment.apiURL}Master/GetEventdetailTournamnetwise?tourId=${tournamentId}`);
}

SaveAthleteAchievementDetail(id:any,player_detail_id:any,event_id:any,represented:string,position:string,result:string,
  document_path:any,tournament_id:any,category:string,competition_level:string,competition_name:string,fromdate:any,todate:any,
  venue:string){
    return this.http.post(`${environment.apiURL}Athlete/SaveAthleteAchievementDetail`,{
      id,player_detail_id,event_id,represented,position,result,document_path,tournament_id,category,competition_level,
      competition_name,fromdate,todate,venue
    });
  }

  deleteAthleteAchievementDetail(id: number){
    return this.http.delete(`${environment.apiURL}Athlete/DeleteAthleteAchievementDetail?AchDetid=${id}`);
  }

  getTournamentAcheivementList(tournamentid:number){
   return this.http.get(`${environment.apiURL}StakeHolder/Get_Tournament_Acheivement_List?Tournamentid=${tournamentid}`)    
  }
  getTournamentPlayerDetail(tournamentid:number,KitdId:string){
   return this.http.get(`${environment.apiURL}StakeHolder/Get_Tournament_Player_Detail?Tournamentid=${tournamentid}&KitdId=${KitdId}`)    
  }

}
