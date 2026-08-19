import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoachInsuranceService {

constructor(private http:HttpClient) { }

coachInsuranceTagging(official_detail_id:any,taggedby:any){
  return this.http.post(`${environment.apiURL}StakeHolder/Official_InsuranceTagging?official_detail_id=${official_detail_id}&taggedby=${taggedby}`,'')
  // return this.http.get(`${environment.apiURL}StakeHolder/sdo/GetFinancialAssistanceHistory?player_detail_id=${player_detail_id}`);
}

coachSaveInsuranceTagging(data:any,tagId:any,user_id:any,filePath:any){
  var insuredby_id=user_id
  var insurer=data.insurer
  var insuredPerson=data.insurerName
  var sumInsured=data.sumInsured
  var policyNo=data.policynumber
  var period_from=data.insuredFromDate.utc('dd-MM-YYYY')
  var period_to=data.insuredToDate.utc('dd-MM-YYYY')
  var nominee=data.nominee
  var filepath=filePath
  var reason1=data.reason1
  var official_InsuranceReimbursementDetails
 if(data.sumReimburesement[0].amount==''){
  official_InsuranceReimbursementDetails=[]
 }else{
  for(let i of data.sumReimburesement){
    i.date=i.date.utc('dd-MM-YYYY')
    if(i.isReleased=='1'){
      i.isReleased=true
    }else{
      i.isReleased=false
    }
  }
  official_InsuranceReimbursementDetails=data.sumReimburesement
 }
  return this.http.post(`${environment.apiURL}StakeHolder/SaveOfficial_Insurance`,{
    tagId,insuredby_id,sumInsured,insurer,insuredPerson,policyNo,period_from,
    period_to,nominee,filepath,official_InsuranceReimbursementDetails})
}

coachGetData(official_detail_id:any,tag_id:any){
  return this.http.get(`${environment.apiURL}StakeHolder/GetOfficialInsuranceHistory?official_detail_id=${official_detail_id}&tagId=${tag_id}`)
  // http://192.168.23.253:8034/api/StakeHolder/GetOfficialInsuranceHistory?official_detail_id=825&tagId=1102
}
coachGetHistoryData(official_detail_id:any){
  
  return this.http.get(`${environment.apiURL}StakeHolder/GetOfficialInsuranceHistory?official_detail_id=${official_detail_id}`)
}

deleteInsurance(insurance_tagId :number,userid:any){
  return this.http.put(`${environment.apiURL}StakeHolder/DeleteOfficialInsurance?tagId=${insurance_tagId}&userId=${userid}`,{})
}



}
