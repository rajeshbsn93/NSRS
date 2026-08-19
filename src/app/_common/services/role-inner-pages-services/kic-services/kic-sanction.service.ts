import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class KicSanctionService {
  constructor(private _httpClient: HttpClient) { }

  private amountData: any;

  setReleaseAmountData(data: any): void {
    this.amountData = data;
  }

  getReleaseAmountData(): any {
    return this.amountData;
  }

  getSanctionList(sessionId: string, moduleType: any) {
    // return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_Kic_Proposal_Details?sessionId=${sessionId}`)
    return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_KIC_Sanction_List?Module_Type=${moduleType}`);
  }

  addSanction(payload: any, moduleType?: any) {
    return this._httpClient.post(`${environment.apiURL}EquipmentMonitoring/Add_KIC_Sanction_Details`, payload);
  }

  updateSanction(payload: any) {
    return this._httpClient.post(`${environment.apiURL}EquipmentMonitoring/Update_KIC_Sanction_Details`, payload);
  }

  getDetailsByNsrsID(NSRS_Id: string, moduleType: string) {
    return this._httpClient.get(
      `${environment.apiURL}EquipmentMonitoring/Get_KIC_Sanction_List_By_NSRS_Id?NSRS_Id=${NSRS_Id}&Module_Type=${moduleType}`
    );
  }

  addCommentHistoryDetails(Payload: any) {
    return this._httpClient.post(`${environment.apiURL}EquipmentMonitoring/Add_Comment_Histrory_Details`, Payload);
  }

  getCommentHistoryDetails(sanction_Id: Number, moduleType: string) {
    return this._httpClient.get(
      `${environment.apiURL}EquipmentMonitoring/Get_Comment_Histrory_Details?Sanction_Id=${sanction_Id}&Module_Type=${moduleType}`
    );
  }

  getAddressToDetails(stateId: string, moduleType: string) {
    return this._httpClient.get(
      `${environment.apiURL}EquipmentMonitoring/Get_Sanction_AddressTo_List?State_id=${stateId}&Module_Type=${moduleType}`
    );
  }

  getReleasedAmountHeads() {
    return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_Released_Amount_Heads`);
  }

  addReleasedAmountHeads(payload: any) {
    return this._httpClient.post(`${environment.apiURL}EquipmentMonitoring/Add_Released_Amount`, payload);
  }

  getReleaseAmountList(Sanction_Id: any) {
    return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_Released_Amount_List?Sanction_Id=${Sanction_Id}`);
  }

  getSanctionUcList(userId:number,roleId:number, moduleType: any) {
    return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/KIC_UC_List?User_Id=${userId}&Roll_id=${roleId}&Module_Type=${moduleType}`);
  }


  updateUcSanction(payload: any) {
    return this._httpClient.post(`${environment.apiURL}EquipmentMonitoring/KIC_UC_Updates_Details`, payload);
  }

  getUcSanctionReleased(sanctionId: number) {
    return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/GET_UC_Popup_Details?Sanction_Id=${sanctionId}`);
  }

  addSanctionReleaseUC(Payload: any) {
    return this._httpClient.post(`${environment.apiURL}EquipmentMonitoring/Add_KIC_UC_Popup`, Payload);
  }

  getSanctionTotalAmountList(sanctionId: number) {
    return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_UC_Released_Amount?Sanction_Id=${sanctionId}`);
  }

  addSanctionTotalAmount(payload: any) {
    return this._httpClient.post(`${environment.apiURL}EquipmentMonitoring/Add_UC_Released_Amount`, payload);
  }

  downloadPdf(url: string): Observable<Blob> {
    return this._httpClient.get(url, { responseType: 'blob' }).pipe(
      map((res: Blob) => {
        return new Blob([res], { type: 'application/pdf' });
      })
    );
  }
  /************************************************************************************************
   * KIC AND KISCE SANCTION UPDATED 02-05-2025
   ************************************************************************************************/

  getSanctionStateListByRC(rc_Id: number) {
    return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_KIC_KISCE_RCWise_State_List?RCId=${rc_Id}`);
  }
  getKicListbyStateId(stateId: number, schemeRoleId: number) {
    return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_KIC_KISCE_State_Mapping_List?StateId=${stateId}&Scheme_Roll_Id=${schemeRoleId}`);
  }

  getKicFinancialYearMaster() {
    return this._httpClient.get<FinancialYearMaster>(`${environment.apiURL}EquipmentMonitoring/Get_KISCE_Financial_Year_Master`);
  }

  getSanctionListNew(userId: number, roleId: number, schemeRoleId: number) {
    // return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_Kic_Proposal_Details?sessionId=${sessionId}`)
    return this._httpClient.get(`${environment.apiURL}EquipmentMonitoring/Get_KIC_Sanction_List?User_Id=${userId}&Roll_id=${roleId}&Scheme_Roll_Id=${schemeRoleId}`);

  }
}


export type FinancialYearMaster = financialYearList[]

export interface financialYearList {
  financialYearMasterID: number
  financialYear: string
}