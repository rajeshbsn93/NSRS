import { filter } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Months } from 'src/app/_common/_enums/role-code';
@Injectable({
    providedIn: 'root'
})

export class EquipmentProcurementService {
    monthsDetails: any = Months
    constructor(private _http: HttpClient, private _datePipe: DatePipe) { }
    // add scheme role id for distinguish kic and kisce
    getEquipmentProcurement(user_id: number, role_id: number, scheme_role_Id?: number) {
        const finalSchemeRoleId = (scheme_role_Id === undefined || scheme_role_Id === null) ? 82 : scheme_role_Id;
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/GetEquipmentMonitoringData?user_id=${user_id}&RoleId=${role_id}&Scheme_Roll_Id=${finalSchemeRoleId}`)
    }

    getTrainingDetailsList(user_id: number, role_id: number, scheme_role_Id?: number) {
        const finalSchemeRoleId = (scheme_role_Id === undefined || scheme_role_Id === null) ? 82 : scheme_role_Id;
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/GetTrainingData?user_id=${user_id}&RoleId=${role_id}&Scheme_Roll_Id=${finalSchemeRoleId}`)
    }

    getBranding(user_id: number, role_id: number, scheme_role_Id?: number) {
        const finalSchemeRoleId = (scheme_role_Id === undefined || scheme_role_Id === null) ? 82 : scheme_role_Id;
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/GetBrandingData?user_id=${user_id}&RoleId=${role_id}&Scheme_Roll_Id=${finalSchemeRoleId}`)
    }

    getCctvFeedList(user_id: number, role_id: number, scheme_role_Id?: number) {
        const finalSchemeRoleId = (scheme_role_Id === undefined || scheme_role_Id === null) ? 82 : scheme_role_Id;
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/GetCCTVData?user_id=${user_id}&RoleId=${role_id}&Scheme_Roll_Id=${finalSchemeRoleId}`)
    }

    getScheduleMeeting(user_Id: number, role_Id: number, scheme_role_Id?: number) {
        const finalSchemeRoleId = (scheme_role_Id === undefined || scheme_role_Id === null) ? 82 : scheme_role_Id;
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/GetScheduleData?user_id=${user_Id}&RoleId=${role_Id}&Scheme_Roll_id=${finalSchemeRoleId}`)
    }

    getAchcievementData(user_id: number, role_Id: number, scheme_role_Id?: number) {
        const finalSchemeRoleId = (scheme_role_Id === undefined || scheme_role_Id === null) ? 82 : scheme_role_Id;
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/Get_AchievementData?user_id=${user_id}&RoleId=${role_Id}&Scheme_Roll_id=${finalSchemeRoleId}`)
    }

    getKisceManpowerList(userId: number, roleId: number, schemeRoleId: number) {
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/Get_KISCE_Manpower_List?User_id=${userId}&Roll_id=${roleId}&Scheme_Roll_Id=${schemeRoleId}`);
    }


    getKisceManpowerDetails(userId: number, roleId: number, academyId: number, schemeRoleId: number) {
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/Get_KISCE_Manpower_Detail_List?User_id=${userId}&Roll_id=${roleId}&academy_detail_id=${academyId}&Scheme_Roll_Id=${schemeRoleId}`);
    }


    getMasterDesignationManpower() {
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/Get_StakeHolder_Designation_Master`);
    }


    saveKisceManpowerDetails(formData: any) {
        return this._http.post(`${environment.apiURL}EquipmentMonitoring/Update_KISCE_Manpower_Detail_List`, formData);
    }

    getKisceManpowerStrengthDetails(userId: number, roleId: number, academyId: number, schemeRoleId: number) {
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/Get_KISCE_Manpower_Strength_Detail_List?User_id=${userId}&Roll_id=${roleId}&academy_detail_id=${academyId}&Scheme_Roll_Id=${schemeRoleId}`);
    }

    updateKisceManpowerStrengthDetails(formData: any) {
        return this._http.post(`${environment.apiURL}EquipmentMonitoring/Save_KISCE_Manpower_Strength_Detail_List`, formData);
    }


    getKisceFinancialStatus(userId: number, roleId: number, schemeRoleId: number) {
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/Get_KIC_KISCE_Financial_Status_List?User_Id=${userId}&Roll_id=${roleId}&Scheme_Roll_Id=${schemeRoleId}`);
    }
    updateKisceFinancialStatus(formData: any) {
        return this._http.post(`${environment.apiURL}EquipmentMonitoring/Ki_Update_KISCE_Financial_Status_List`, formData);
    }

 


    getEquipementTypeList() {
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/GetTypeValues`);
    }


    getEquipmentStatus() {
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/GetStatusValues`);
    }

    saveEquipmentForm(body: any) {
        console.log(body)
        for (let i of body) {
            console.log(i)
            i.d_o_p = this._datePipe.transform(i.d_o_p, 'yyyy-MM-dd')
            i.type = i.type.toString()
            i.academy_id = Number(i.academy_id)
            i.year_of_operation = (i.year_of_operation)
        }
        return this._http.post(`${environment.apiURL}EquipmentMonitoring/InsertEquipmentRecord`, body);
    }

    deleteEquipmentDetails(id: number) {
        return this._http.delete(`${environment.apiURL}EquipmentMonitoring/DeleteEquipmentData?id=${id}`)
    }

    savePCAUpdate(body: any) {
        return this._http.post(`${environment.apiURL}EquipmentMonitoring/UpdatePastChampionRecord`, [body])
    }



    saveTrainingDetailsForm(body: any) {
        return this._http.post(`${environment.apiURL}EquipmentMonitoring/InsertTrainingDetailsRecord`, body);
    }

    deleteTrainingDetails(id: number) {
        return this._http.delete(`${environment.apiURL}EquipmentMonitoring/DeleteTrainingData?Trid=${id}`)
    }


    deleteCctvDetails(id: number) {
        return this._http.delete(`${environment.apiURL}EquipmentMonitoring/DeleteCCTVFeedData?cctvid=${id}`)
    }



    saveBranding(formdata: any) {
        return this._http.post(`${environment.apiURL}EquipmentMonitoring/InsertBrandingDetailsRecord`, formdata)
    }

    saveCctvForm(body: any) {
        return this._http.post(`${environment.apiURL}EquipmentMonitoring/InsertCCTV_FeedDetailsRecord`, body);
    }



    getPCAList(user_Id: number, role_Id: number) {
        return this._http.get(`${environment.apiURL}EquipmentMonitoring/GetManpowerData?user_id=${user_Id}&RoleId=${role_Id}`)
    }

    getPCAListForKic(user_Id: number, role_Id: number, scheme_role_Id?: number) {
        const finalSchemeRoleId = (scheme_role_Id === undefined || scheme_role_Id === null) ? 82 : scheme_role_Id;
        if (role_Id == 1005) {
            return this._http.get(`${environment.apiURL}EquipmentMonitoring/GetManpowerData?user_id=${user_Id}&RoleId=${role_Id}`)
        } else {
            return this._http.get(`${environment.apiURL}EquipmentMonitoring/Get_PastChampionData?user_id=${user_Id}&RoleId=${role_Id}&Scheme_Roll_Id=${finalSchemeRoleId}`)
        }

    }


    saveScheduleMeetingForm(body: any) {
        return this._http.post(`${environment.apiURL}EquipmentMonitoring/InsertScheduleMeetingRecord`, body);
    }




    uploadFile(formData: any) {
        return this._http.post(`${environment.apiURL}Upload/UploadFile`, formData);
    }


    getMonthName(monthId: any) {
        console.log('monthId', monthId);
        let monthDetails = this.monthsDetails.filter((data: any, index: any) => {
            if (data.id == monthId) {
                return data;
            }
        })
        return monthDetails.name;
    }


}


export interface IGetTypeStatusList {
    id: number
    value: string
}


export interface IGetBrandingList {
    id: number
    academy_id: number
    role_id: number
    branding_done: number
    upload_image: string
    remarks: string
}

export interface IGetCctvList {
    id: number
    kuid: number
    covered_by_cctv: number
    upload_cctv_link_with_username_password: string
    upload_vedio: string
    user_id: number,
    role_id: number,
    kiC_KUID: string
}




