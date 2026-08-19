import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AthleteService {
  constructor(private http: HttpClient,private datePipe:DatePipe) { }


  //service for sharing data data from athkete component.ts to financial-modal.components.ts 
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  changeMessage(message: string) {
    this.messageSource.next(message)
  }


  athleteList(
    user_id: any,
    nsrs_id: any,
    name: any,
    sport_id: any,
    scheme_id: any,
    gender: any,
  ) {
    return this.http.post(
      `${environment.apiURL}StakeHolder/sdo/AthleteList`,
      { user_id, nsrs_id, name, sport_id, scheme_id, gender },
      
    );
  }

  // athleteListFilter(user_id: any, data: any) {
  //   var nsrs_id = data.nsrsid
  //   var name = data.name
  //   if (data.discipline == '') {
  //     sport_id = 0
  //   }
  //   var sport_id = data.discipline
  //   var scheme_id = data.scheme
  //   if (scheme_id == '') {
  //     scheme_id = 0
  //   }
  //   var gender = data.gender
  //   return this.http.post(`${environment.apiURL}StakeHolder/sdo/AthleteList`, { user_id, nsrs_id, name, sport_id, scheme_id, gender }, 
    
  //   )
  // }

  sportsTrainingList(user_id: any, scheme_id: any) {
    return this.http.get(`${environment.apiURL}StakeHolder/sdo/AcademyList?userid=${user_id}&schemeid=${scheme_id}`, 
    
    )
  }


  getScheme() {
    return this.http.get(`${environment.apiURL}Master/ScholershipList`)
  }
  getLookUpItems() {
    return this.http.get(`${environment.apiURL}Master/GetLookUpItems`)
  }


  AcademyList(userid: any, roleid: any, sportid: any) {
    // console.log('academy list three arg', userid,roleid,sportid);
    return this.http.post(
      `${environment.apiURL}StakeHolder/Transfer_AcademyList`,
      { userid, roleid, sportid },
  
    );
  }

  weedOutPlayer(pUserId: any, userId: any, RoleId: any, data: any) {
    var pRoleId = 1;
    var pStackHolderUserId = userId;
    var pStackHolderRoleId = RoleId;
    var pWeedOutDate = data.weedOutDate.utc('dd-MM-YYYY');
    var pWeedOutRemark = data.weedOutReason;
    return this.http.post(
      `${environment.apiURL}StakeHolder/WeedOut`,{pUserId,pRoleId,pStackHolderUserId,pStackHolderRoleId,pWeedOutDate,
        pWeedOutRemark});
  }

  transferPlayer(pUserId: any,userId: any,RoleId: any,pNSRS_Id: any,pTo_academyid: number = 0,data: any,selectedFile: any) {
    var pRoleId = 1; 
    var pStakeHolderUserId = userId;
    var pStakeHolderRoleId = RoleId;
    var pPeriod_upto = data.periodUpto
    // var pPeriod_upto = data.periodUpto.utc('dd-MM-YYYY');
    if(pPeriod_upto !=''){
      pPeriod_upto=pPeriod_upto.utc('dd-MM-YYYY');
    }else{
      pPeriod_upto = null
    }
    var pTransfer_date = data.tranferDate.utc('dd-MM-YYYY');
    var pDate_of_joining = data.joiningDate.utc('dd-MM-YYYY');
    var pStatus = data.athleteType;
    var pJoin_status = Number(data.joiningStatus);
    var pDoc = selectedFile;
    var pRemark = '';
    var pDesignation=''

    return this.http.post(`${environment.apiURL}StakeHolder/Transfer`,{pUserId,pRoleId,pStakeHolderUserId,pStakeHolderRoleId,
        pNSRS_Id,pTo_academyid,pTransfer_date,pDate_of_joining,pStatus,pJoin_status,pDoc,
        pPeriod_upto,pRemark,pDesignation});
  }

  insuranceList() {
    return this.http.get(`${environment.apiURL}Master/GetInsurerList`);
  }

  athleteHistory(academy_detail_id:any){
    return this.http.get(`${environment.apiURL}StakeHolder/GetAthleteTrainingHistory?athleteDetailId=${academy_detail_id}`);
    // return this.http.get(`${environment.apiURL}StakeHolder/GetAthleteTrainingHistory?athleteDetailId=137962`);
  }

  getAthleteCurrentAcademy(player_detail_id:any){
    return this.http.get(`${environment.apiURL}StakeHolder/GetAthleteCurrentAcademy?player_detail_id=${player_detail_id}`);
  }

  updateAthleteAcademy(doj:any,validUpto:any,academy_detail_id:any){
    // if(validUpto!=''){
      // }
      // doj=doj.utc('dd-mm-YYYY');
      // if(validUpto!=''){
      //   validUpto=validUpto.utc('dd-mm-YYYY')

      // }
    return this.http.post(`${environment.apiURL}StakeHolder/UpdateAthleteCurrentAcademy?date_of_joining=${this.datePipe.transform(doj,'yyyy-MM-dd')}&valid_upto=${this.datePipe.transform(validUpto,'yyyy-MM-dd')}&academy_athelete_detail_id=${academy_detail_id}`,null)
  }

  deleteAthleteInsurance(player_detail_id:number,userId:number){
    return  this.http.put(`${environment.apiURL}StakeHolder/DeleteAthlete_Insurance?player_detail_id=${player_detail_id}&userid=${userId}`,{})
  }
  getUserAcademyMappingReport(userId:number,roleId:number,schemeId:number){
    return  this.http.get(`${environment.apiURL}StakeHolder/Get_User_Academy_MappingReport?UserId=${userId}&Roll_Id=${roleId}&Scheme_id=${schemeId}`)
  }

  }
