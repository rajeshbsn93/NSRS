import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddInsuranceAthleteServiceService {

constructor(private http:HttpClient) { }

getAddInsuranceData(nsrsid:any,userId:any,taggingType:any){
  //console.log('add Data',nsrsid,userId,taggingType);
  return this.http.get(`${environment.apiURL}StakeHolder/AthleteBasicData?nsrsID=${nsrsid}&userId=${userId}&taggingType=${taggingType}`)
}

athleteInsuranceMultitag(userData:any,data:any){
  var userId = userData.userid;
  var roleId = userData.roleid;
  //console.log('userId',userId,'roleId',roleId)
  return this.http.post(`${environment.apiURL}StakeHolder/Athlete_InsuranceMultiTag`,{data}
  )
}

}
