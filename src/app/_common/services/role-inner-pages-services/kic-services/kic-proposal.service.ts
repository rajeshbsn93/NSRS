import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KicProposalService {
  private tabIndex = new BehaviorSubject<number>(0);
  currentTabIndex = this.tabIndex.asObservable();
  //For open model 
  private popupVisibility = new BehaviorSubject<boolean>(false);
  currentPopupVisibility = this.popupVisibility.asObservable();

  changeTab(index: number) {
    this.tabIndex.next(index);
  }

 

  showPopup(show: boolean) {
    this.popupVisibility.next(show);
  }
  constructor(private _httpClient: HttpClient) { }



addProposal(payload:any,moduleType?:any) {
console.log("Payload:", payload); 
return this._httpClient.post(`${environment.apiURL}EquipmentMonitoring/Add_KIC_Proposal_Details?Proposal_Id=0&Proposal_Head=${payload?.Proposal_Head}&Kic_Type=${payload?.Kic_Type}&Proposa_Date=${payload?.Proposa_Date}&User_Id=${payload?.User_Id}&Proposal_Type=${moduleType}&sessionId=${payload?.sessionId}&NSRS_Id=${payload?.NSRS_Id}&approval_date=${payload?.approval_date}`, {});
}

  updateProposal(payload: any) {
    return this._httpClient.post(`${environment.apiURL}EquipmentMonitoring/Update_KIC_Proposal_Details`,payload)
  }

  getKicSanctionList(sessionId: string,moduleType:any) {
    // return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_Kic_Proposal_Details?sessionId=${sessionId}`)
    return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_KIC_Sanction_List?Module_Type=${moduleType}`)
  }
  getProposalList(sessionId: string,moduleType:any) {
    // return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_Kic_Proposal_Details?sessionId=${sessionId}`)
    return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_Kic_Proposal_Details?Module_Type=${moduleType}`)
  }
 
  uploadFile(formData:FormData) {
    return this._httpClient.post<any>(`${environment.apiURL}Upload/UploadFile`, formData);
  }

  getacadmeyproposalmasterlist(Discipline_Id:any,State_Id:any,Reginal_ID:any,Module_Type:any){
    return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_KISCE_Proposal_List?Discipline_Id=${Discipline_Id}&State_Id=${State_Id}&Reginal_ID=${Reginal_ID}&Module_Type=${Module_Type}`)
  }

  kiscetypelist(moduleType:any){
    // return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_KISCE_Type_List`)
    return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_KISCE_Type_List?Module_Type=${moduleType}`)
  }
}
