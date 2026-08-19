import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  // service for ng-bootstrap popup
  // public popup: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) { }

  getFinancialAssitanceHistory(
    player_detail_id: any,
   
  ) {
    return this.http.get(`${environment.apiURL}StakeHolder/sdo/GetFinancialAssistanceHistory?player_detail_id=${player_detail_id}`);
  }

  EditFinancialAssistance(
    player_detail_id: any,
    scholoship_type_id: any,
    start_date: any,
    end_date: any,
    amount: any,
    // fileUrl: any,
    nominated_by_id: any,
    scholorship_givenby: any,
  ) {
    return this.http.post(
      `${environment.apiURL}StakeHolder/sdo/EditFinancialAssistance`,
      {
        player_detail_id,
        scholoship_type_id,
        start_date,
        end_date,
        amount,
        // fileUrl,
        nominated_by_id,
        scholorship_givenby,
      }
    );
  }
  //api call for add, transfer and weed out financial assiastance scholarship types
  addTransferWeedoutFinancialAssistance(
    userid: any,
    opt_Type: any,
    player_detail_id: any,
    scholarship_type_id: any,
    start_date: any,
    end_date: any,
    amount: any,
    fileUrl: any,
    // lookup_value:any,
    nominated_by_id:any,
    weedout_date: any,
    weedout_reason: any,
   
  ) {
    let filepath = fileUrl;
    // console.log(userid,
    //   opt_Type,
    //   player_detail_id,
    //   scholarship_type_id,
    //   start_date,
    //   end_date,
    //   amount,
    //   filepath,
    //   nominated_by_id,
    //   weedout_date,
    //   weedout_reason)
    return this.http.post(
      `${environment.apiURL}StakeHolder/sdo/UpdateFinancialAssistance`,
      {
        userid,
        opt_Type,
        player_detail_id,
        scholarship_type_id,
        start_date,
        end_date,
        amount,
        filepath,
        nominated_by_id,
        weedout_date,
        weedout_reason
      },
    );
  }

  athleteFAMultiTag(user_id:any,data:any){
    var amount:number;
    for(let i of data){
      i.scholarship_type_id = i.scholarship_type_id
      i.nominated_by_id = Number(i.nominated_by_id)
      i.end_date=i.end_date?.utc('dd-MM-YYYY')
      i.start_date=i.start_date?.utc('dd-MM-YYYY')
      // console.log(i.end_date)
      
     // console.log(data.push(saveData))
      
    }
    var athlete_FAMultiTagg_PlayerData= data
    return this.http.post(`${environment.apiURL}StakeHolder/Athlete_FAMultiTag`,{user_id,athlete_FAMultiTagg_PlayerData})
  }


}
