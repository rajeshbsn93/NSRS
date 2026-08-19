import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Official_Training_InfoEntity, centralAwardsEntity, GetBasicData_AcademyEntity } from '../common-services/commonSharable.service';

export interface PlayerForm5Status {
  form5Id: number
  form5Html: string
  place: string,
  approveDate:Date
  form5_Status: number
  remark:string
  userId:number
  esignedby: number
  form5DocPath: string
}


@Injectable({
  providedIn: 'root'
})
export class YoungProfessionalService {

  constructor(private http:HttpClient) { }

  
  getFormFivePlayerList(competitionName:string,type:string) {
    return this.http.get(`${environment.apiURL}Form5/Get_Form5PlayerList?Competition=${competitionName}&type=${type}`)
  }
  
  
  getFormFiveDocumentsList(form5Id:number){
   return this.http.get(`${environment.apiURL}Form5/Get_Player_Form5Documents?form5Id=${form5Id}`)
  }


  getFormFiveTextDetail(form5Id:number,playerDetailID:number){
    return this.http.get(`${environment.apiURL}Form5/Get_Form5player_TextDetail?form5Id=${form5Id}&player_detail_id=${playerDetailID}`)
   }


   getFormFiveApproverList(form5Id:number){
    return this.http.get(`${environment.apiURL}Form5/KI_Get_Form5ApproverList?form5Id=${form5Id}`)
   }

 
   savePlayerForm5Status(body: PlayerForm5Status) {
    return this.http.post(environment.apiURL+'Form5/Update_PlayerForm5_Status', body);
  }

  getFormFiveTileData(){
    return this.http.get(`${environment.apiURL}Form5/Get_Form5TileData`)
   }


   getFormFiveform5StageDetails(form5Id:number){
    return this.http.get(`${environment.apiURL}Form5/Get_form5Stage_Details?form5Id=${form5Id}`)
   }

   generateEsignPdf(form5Id:number,player_detail_id:number){
    return this.http.get(`${environment.apiURL}Form5/Generate_PlayerForm5_Pdf?player_detail_id=${player_detail_id}&form5Id=${form5Id}`)
   }
  
   downloadEsignPdf(form5Id:number,player_detail_id:number,DocId:string){
    return this.http.get(`${environment.apiURL}Form5/Download_PlayerForm5_Pdf?player_detail_id=${player_detail_id}&form5Id=${form5Id}&DocId=${DocId}`)
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
  }