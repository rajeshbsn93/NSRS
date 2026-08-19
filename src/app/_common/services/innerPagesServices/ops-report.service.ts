import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpsReportService {

  constructor(private http:HttpClient) { }

  getSchemeData(schemeOwner:any,userId:any){
    
    return this.http.get(`${environment.apiURL}Reports/Get_Scheme_List_Data?SchemeOwner=${schemeOwner}&UserId=${userId}`)
  }

  getAcademyListData(selectedScemaIds:any,userId:any){
    
    return this.http.get(`${environment.apiURL}Reports/Get_Academy_List_Data?SchemeId=${selectedScemaIds}&UserId=${userId}`)
  }


  // getDisciplineListData(){
    
  //   return this.http.get(`${environment.apiURL}Reports/Get_Discipline_List_Data`)
  // }

  // getStateListtData(){   
  //   return this.http.get(`${environment.apiURL}Reports/Get_state_Data`)
  // }


  getDisciplineListData(){
    return this.http.get(`${environment.apiURL}Master/SportList`).pipe((map((discipline:any)=>{

      return discipline.map((data:any)=>({
        sport_detail_id: data?.sport_detail_id,
        sport_display_name: data?.sport_display_name
      }))
   
    })))
  }

  getStateListtData(){   
    return this.http.get(`${environment.apiURL}Master/StateList`).pipe((map((state:any)=>{
      return state.map((data:any)=>({
        state_id: data?.state_id,
        state_name: data?.state_name
      }))
   
    })))
  }


  getGenderListData(){
    return this.http.get(`${environment.apiURL}Reports/Get_Gender_Data`)
  }

  getResidentialStatusData(){
    return this.http.get(`${environment.apiURL}Reports/Get_Residential_Status_Data`)
  }


  getOPSSummaryReportData(payload:any,athleteOrCoachUrl:any){
    return this.http.post(`${environment.apiURL}Reports/${athleteOrCoachUrl}`,payload)
  }

  downloadFile(data:any, filename:string ,header:any) {
    let csvData = this.ConvertToCSV(data, header);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}


private ConvertToCSV(data: any[], headers: string[]) {
  let csvContent = headers.join(',') + '\r\n'; // Add the headers first
  csvContent += data.map(row => {
    return headers.map(header => {
      return JSON.stringify(row[header] || '');
    }).join(',');
  }).join('\r\n');
  return csvContent;
}
  
  // coachSportsscientistWeedOut(pUserId: any,pRoleId: any,pStakeHolderUserId: any,pStakeHolderRoleId: any,pWeedOutDate: any,pWeedOutRemark: any) {
  //   return this.http.post(`${environment.apiURL}StakeHolder/WeedOut`,{pUserId,pRoleId,pStakeHolderUserId,pStakeHolderRoleId,pWeedOutDate,pWeedOutRemark},

  //   );
  // }


  getData(): Observable<any> {
    return this.http.get('assets/response.json');  // Adjust the path as needed
  }
  
  }
  
