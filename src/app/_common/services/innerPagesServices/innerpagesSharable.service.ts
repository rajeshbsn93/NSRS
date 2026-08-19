import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharableService {

  constructor(private http: HttpClient) { }

  getCounting(){
    return this.http.get(`${environment.apiURL}Home/Get`);
  }

  sportList() {
    return this.http.get(`${environment.apiURL}Master/SportList`)
  }

  stateList() {
    return this.http.get(`${environment.apiURL}Master/StateList`)
  }
  schemeList() {
    return this.http.get(`${environment.apiURL}Master/GetSchemeList`)
  }

  ageCatergoryList(){
    return this.http.get(`${environment.apiURL}Master/AgeCategoryMaster`)
  }

  countryMasterList(){
    return this.http.get(`${environment.apiURL}Master/CountryMasterList`)
  }


  coachSportsscientistTransfer(
    pUserId: any,
    pRoleId: any,
    pStakeHolderUserId: any,
    pStakeHolderRoleId: any,
    pNSRS_Id: any,
    pTo_academyid: any,
    pTransfer_date: any,
    pDate_of_joining: any,
    pStatus: any,
    pJoin_status: any,
    pDoc: any,
    pPeriod_upto: any,
    pRemark: any,
    pDesignation: any
  ) {
    return this.http.post(
      `${environment.apiURL}StakeHolder/Transfer`,
      {
        pUserId,
        pRoleId,
        pStakeHolderUserId,
        pStakeHolderRoleId,
        pNSRS_Id,
        pTo_academyid,
        pTransfer_date,
        pDate_of_joining,
        pStatus,
        pJoin_status,
        pDoc,
        pPeriod_upto,
        pRemark,
        pDesignation
      },

    );
  }

  coachSportsscientistWeedOut(
    pUserId: any,
    pRoleId: any,
    pStakeHolderUserId: any,
    pStakeHolderRoleId: any,
    pWeedOutDate: any,
    pWeedOutRemark: any
  ) {
    return this.http.post(
      `${environment.apiURL}StakeHolder/WeedOut`,
      {
        pUserId,
        pRoleId,
        pStakeHolderUserId,
        pStakeHolderRoleId,
        pWeedOutDate,
        pWeedOutRemark
      },

    );
  }

  getDesignation(value:any){
    return this.http.get(`${environment.apiURL}Master/GetStakeHolderDesignations?type=${value}`);
  };

  getStakeHolderJobType(){
    return this.http.get(`${environment.apiURL}Master/GetStakeHolderJobTypes`);
  }

  getOtherCoachDetail(nsrsid:any){
    return this.http.get(`${environment.apiURL}StakeHolder/Get_other_coach_detail/${nsrsid}`)
  }

  MapOtherCoaches(official_detail_id:number,designation:string,joining_date:any,mapped_user:number,job_type:string){
    return this.http.post(`${environment.apiURL}StakeHolder/MapOtherCoaches`,{
      official_detail_id,
      designation,
      joining_date,
      mapped_user,
      job_type
    })
  }

  //all permission services starts
  getDashbordMenu(roleId:any){
    return this.http.get(`${environment.apiURL}Common/GetDashbordMenu?roleId=${roleId}`);
  }
  getDashbordMenuRoleid(componentName:any){
    return this.http.get(`${environment.apiURL}Common/GetDashbordMenu_RoleId?componentName=${componentName}`);
  }
  getpermission(role_id: any, menu_id: any) {
    return this.http.get(`${environment.apiURL}Common/GetDashbordMenu_ActionPermission?roleid=${role_id}&menuid=${menu_id}`)
  }

  getCoachSportScientistHistory(officialDetailId:number,roleId:number){
    return this.http.get(`${environment.apiURL}StakeHolder/GetOfficialTrainingHistory?officialDetailId=${officialDetailId}&roleId=${roleId}`)
  
  }
  
  //service for upload file 
  uploadFile(formData:any){
    return this.http.post(`${environment.apiURL}Upload/UploadFile`,formData);
  }

  getCoachForeignExposure(official_detail_id:any){
    return this.http.get(`${environment.apiURL}Official/GetCoachForeignExposure?official_detail_id=${official_detail_id}`)
  }
}
