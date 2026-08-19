import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcademyService {

constructor(private http:HttpClient) { }


academyDetailList(academyid:number,listType:number){
  return this.http.get(`${environment.apiURL}Common/GetList_Academywise?academyId=${academyid}&listType=${listType}`
  )
}

academyBasicDataKIAA(userid:any,nsrsid:any){
  //console.log(userid,nsrsid)
  return this.http.get(`${environment.apiURL}StakeHolder/AcademyBasicData_forKIAA?nsrsID=${nsrsid}&userId=${userid}`
  )
}

}


