import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Athelete_insuranceService {

constructor(private http:HttpClient) { }

  athleteInsuranceTagging(player_detail_id:any,user_id:any,role_id:any,taggingType:any,weed_out_reason:any){
   return this.http.post(`${environment.apiURL}StakeHolder/Athlete_InsuranceTagging`, 
   {player_detail_id, user_id, role_id , taggingType,weed_out_reason })
  }

  saveAthleteInsuranceDetails(player_insurance_id:any,player_detail_id:any,createdBy:any,createdBy_roleId:any,data:any,filePath:any){
    //console.log(data)
    //console.log(filePath)
    var insurer_id=data.insurer
    var insurer_name=data.insurerName
    var policy_number=data.policynumber
    var insured_period_from=data.insuredFromDate.utc('dd-MM-YYYY')
    var insured_period_to=data.insuredToDate.utc('dd-MM-YYYY')
    var insurance_document=filePath
    var nominee=data.nominee
    var sum_insured=data.sumInsured
    var reason=data.reason1
    var updatedBy=0
    var updatedBy_roleId= 0
    var athleteInsurance_ReimbursementDetails=data.sumReimburesement
    if(athleteInsurance_ReimbursementDetails[0].amount==''){
      athleteInsurance_ReimbursementDetails=[]
    }else{
      for(let i of athleteInsurance_ReimbursementDetails){
        i.date=i.date.utc('dd-MM-YYYY')
        //console.log(i)
        if(i.isReleased=='1'){
          i.isReleased=true
        }else{
          i.isReleased=false
        }
      }
      // athleteInsurance_ReimbursementDetails=data.sumReimburesement
    }
    return this.http.post(`${environment.apiURL}StakeHolder/SaveAthlete_InsuranceDetails`,{player_insurance_id,player_detail_id,
      insurer_id,insurer_name,policy_number,insured_period_from,insured_period_to,insurance_document,nominee,sum_insured,
      reason,createdBy,updatedBy,createdBy_roleId,updatedBy_roleId,athleteInsurance_ReimbursementDetails})
  }

  getAthleteInsuranceDetails(player_detail_id:any,tag_id:any){
    return this.http.get(`${environment.apiURL}StakeHolder/GetAthlete_InsuranceDetails?player_detail_id=${player_detail_id}&tag_id=${tag_id}`, 
    
    )
  }

  saveAthleteSuccessInsuranceDetails(player_insurance_id:any,player_detail_id:any,data:any,updatedBy:any,updatedBy_roleId:any,filePath:any){
    var insurer_id=Number(data.insurer)
   var insurer_name=data.insurerName
   var policy_number=data.policynumber
   var insured_period_from=data.insuredFromDate.utc('dd-MM-YYYY')
   var insured_period_to=data.insuredToDate.utc('dd-MM-YYYY')
   var insurance_document=filePath
   var nominee=data.nominee
   var sum_insured=Number(data.sumInsured)
   var reason=data.reason1
  var createdBy=0
  var createdBy_roleId=0
  var athleteInsurance_ReimbursementDetails
  if(data.sumReimburesement[0].amount==''){
    athleteInsurance_ReimbursementDetails=[]
  }else{
    for(let i of data.sumReimburesement){
      i.date=i.date.utc('dd-MM-YYYY')
      if(i.isReleased=='1'){
        i.isReleased=true
      }else{
        i.isReleased=false
      }
    }
    athleteInsurance_ReimbursementDetails=data.sumReimburesement
  }

    return this.http.post(`${environment.apiURL}StakeHolder/SaveAthlete_InsuranceDetails`,
    {player_insurance_id,player_detail_id,insurer_id,insurer_name,policy_number,insured_period_from,insured_period_to
    ,insurance_document,nominee,sum_insured,reason,createdBy,updatedBy,createdBy_roleId,updatedBy_roleId,athleteInsurance_ReimbursementDetails}, 
   
    )
  }

  getInsuranceHistory(player_detail_id:any){
    return this.http.get(`${environment.apiURL}StakeHolder/GetAthlete_InsuranceHistory?player_detail_id=${player_detail_id}`)
  }
  

}
