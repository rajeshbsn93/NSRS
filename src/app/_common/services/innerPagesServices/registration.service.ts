import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

constructor(private http:HttpClient) { }
  
SignUp(oldOtpId:number,field:any,fieldType:any){
  return this.http.post(`${environment.apiURL}Registration/StartRegisteration?oldOtpId=${oldOtpId}`,{field,fieldType})
}
ConfirmRegisterationOtp(OtpId:number,otp:number){
  return this.http.post(`${environment.apiURL}Registration/ConfirmRegisterationOtp?OtpId=${OtpId}&otp=${otp}`,{})
}
AcademyRegisteration(name:any,email:any,mobile:any,stateId:any,yearOfEstablishment:any,password:any,sportId:any){
  return this.http.post(`${environment.apiURL}Registration/AcademyRegisteration`,{name,email,mobile,stateId,yearOfEstablishment,password,sportId})
}
resendOtp(otpId:any){
  return this.http.post(`${environment.apiURL}Registration/ResendOtp?oldOtpId=${otpId}`,null)
}

StateList(){
  return this.http.get(`${environment.apiURL}Master/StateList`)
}

SportList(){
  return this.http.get(`${environment.apiURL}Master/SportList`)
}

}
