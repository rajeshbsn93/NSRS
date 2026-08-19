import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KIAAService {

  constructor(private http: HttpClient) { }

  getKiaaList(
    user_id: any,
    kiaa_Id: any,
    sport_detail_id: any,
    nsrs_id: any,
    approval_status: any
  ) {
    return this.http.get(`${environment.apiURL}StakeHolder/GetKiaaAcademyData?nsrsID=${nsrs_id}&userId=${user_id}&ApprovalStatus=${approval_status}&KiaaId=${kiaa_Id}&sport_detail_id=${sport_detail_id}`)
  }

  addEditKiaa(
    kiaaId: any,
    kiaaId_update: any,
    academy_id: any,
    sport_detail_id: any,
    residential_type: any,
    from_date: any,
    to_date: any,
    ncoE_type: any,
    academy_type: any,
    is_tops: boolean,
    created_by: any,
    Prescribed_performa_requisite_fee: any,
    registration_certificate: any,
    audited_balanced_sheet: any,
    trainees_detail_achievement: any,
    certification_technical_qualification: any,
    participation_certificate_national_international: any,
    accreditation_form: any,
    accrediation_status: any,
    score_matrix_document: any,
    notification_document: any,
    comments: any,
  ) {
    return this.http.post(`${environment.apiURL}StakeHolder/SaveKiaaAcademy`,
      {
        kiaaId,
        kiaaId_update,
        academy_id,
        sport_detail_id,
        residential_type,
        from_date,
        to_date,
        ncoE_type,
        academy_type,
        is_tops,
        created_by,
        Prescribed_performa_requisite_fee,
        registration_certificate,
        audited_balanced_sheet,
        trainees_detail_achievement,
        certification_technical_qualification,
        participation_certificate_national_international,
        accreditation_form,
        accrediation_status,
        score_matrix_document,
        notification_document,
        comments,
      })
  }

  weedoutKiaa(id:any,academy_id:any,userId:any,weedOutKiaaData:any){
    var weedOutDate=weedOutKiaaData.kiaaWeedoutDate
    var weedOutRemark=weedOutKiaaData.kiaaWeedOutRemark
    var weedOutReason=weedOutKiaaData.kiaaWeedOutReason
    return this.http.put(`${environment.apiURL}StakeHolder/KiaaAcademyWeedout`,{id,academy_id,userId,weedOutDate,weedOutRemark,weedOutReason})
  }
  weedoutReason(){
    return this.http.get(`${environment.apiURL}StakeHolder/GetWeedOutReasons`)
    
  }

  fileUpload(formData:any){ 
    return this.http.post(`${environment.apiURL}Upload/Kiaa_UploadFile`,formData)
  }

  deleteacAdemyKiaa(id:any,academy_id:any,userId:any,){
    var deleteRemark = "testing"
  return  this.http.put(`${environment.apiURL}StakeHolder/KiaaAcademyDelete`,{id,academy_id,userId,deleteRemark})

  }

}
