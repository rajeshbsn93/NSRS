import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AddAttendanceService {

  constructor(private http:HttpClient) { }
  saveAttendance(formdata:any){
    return this.http.post(`${environment.apiURL}Attendance/InsertAttendanceRecord`,formdata)
  }

  getDurationData(){
  return this.http.get(`${environment.apiURL}Attendance/GetDurationData`)
  }

  getGenderCountData(userData:any){
    return this.http.get(`${environment.apiURL}Attendance/TotalGenderCount?UserId=${userData.user_id}&role_id=${userData.role_id}`)
    }


}
