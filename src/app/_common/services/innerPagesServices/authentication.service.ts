import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import {  catchError, first, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

import { GenerateCaptchaService } from './generate-captcha.service';
import { AlertService } from '../common-services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  dashboardData: any;
  private jwtHelper:JwtHelperService =  new JwtHelperService();

  constructor(private router:Router, private http:HttpClient, private modal: NgbModal,
    private generateCaptcha:GenerateCaptchaService, private alertService: AlertService) { }

   login(username:any, password:any, loginType:any){
    let payload = {
      username: username,
      password: password,
      logintype:loginType,
      appID:1
    };

    return this.http.post<any>(`${environment.apiURL}Login/Login`,payload)
    .pipe(map((data:any) =>{
      return data
    }));
   }

   isLoggedIn() {
    //checking
    return localStorage.getItem('token')
  }

  getToken(){
    return localStorage.getItem('token')
  }

  getSessionId(){
    return localStorage.getItem('sessiondata') ? JSON.parse(localStorage.getItem('sessiondata')!)?.['sessionId'] : 'null';
  }
  getLoggedInUser(){
    return localStorage.getItem('sessiondata') ? JSON.parse(localStorage.getItem('sessiondata')!)?.['userData'] : 'null';
  }

  logout(setLoader = (value: boolean): void => {}) {
    setLoader(true);
    if (this.getSessionId()) this.http.post<boolean>(environment.apiURL + 'Login/Logout', {sessionId: this.getSessionId()})
      .pipe(first()).subscribe({
        next: () => {
          localStorage.clear();
          this.generateCaptcha.captchaText = '';
          this.router.navigate(['/home']);
          this.modal.dismissAll();
          setLoader(false);
          this.alertService.swalPopSuccessTimer('Logout Successful!');
        },
        error: () => {
          setLoader(false);
          this.alertService.swalPopError('Something went wrong! Please try again.')
        }
      });
  }

  forgotpassword(userId:string){
  return this.http.get(`${environment.apiURL}Login/ForgotPassword?userId=${userId}`)
  }

  forgotPasswordConfirm(otpId:any,otp:any,mobileNo:any){
    return this.http.get(`${environment.apiURL}Login/ForgotPassword/Confirm?otp=${otp}&otpId=${otpId}&mobileNo=${mobileNo}`)
  }

  forgotUserId(mobile:string){
    return this.http.get(`${environment.apiURL}Login/ForgotUserID?mobileNo=${mobile}`)
  }

  forgotUserIdConfirm(otp:any,otpId:any,mobile:any){
    var appId=1;
    return this.http.get(`${environment.apiURL}Login/ForgotUserID/Confirm?otp=${otp}&otpId=${otpId}&mobileNo=${mobile}&appId=${appId}`)
  }

  forgotResetPass(userId:any,username:any,password:any){
    return this.http.post(`${environment.apiURL}Login/ForgotPassword/ResetPassword`,{userId,username,password})
  }

  phoneOtpVerify(otpid:any,otp:any,mobile:any){
    var appID=1
    return this.http.get(`${environment.apiURL}Login/Login_Otp/ConfirmOtp?otpId=${otpid}&otp=${otp}&mobile=${mobile}&appID=${appID}`)
  }

  resendOtp(otpId:any,mobile:any){
    return this.http.get(`${environment.apiURL}Login/ResendOtp?oldOtpId=${otpId}&mobile=${mobile}`)
  }

  generateSessionData(roleId:any,userId:any){
    return this.http.get(`${environment.apiURL}Login/GenerateSession?roleId=${roleId}&userId=${userId}`,
    )
  }

  getDashboardMenu(roleid:any){
    return this.http.get(`${environment.apiURL}Common/GetDashbordMenu?roleId=${roleid}`).pipe(tap((res: any) => {
      this.dashboardData = res;
      localStorage.setItem('userPermissions', JSON.stringify(res.map((item: any) => item.menu_component)));
    }),
    catchError(() => {
      console.error('Error caught in menu list');
      localStorage.removeItem('userPermissions');
      return throwError(() => new Error('Error caught in menu list'));
    })
    )
  }

  getsession(data: any){
  // getsession(sessionId: string){
    // return this.http.get(`${environment.apiURL}Login/GetSessionData`, {params: {sessionId, appId: environment.encrAppId}});
    return this.http.post(`${environment.apiURL}Login/GetSessionData`, data);
  }

  getProjectsList() {
    return this.http.get<IProject[]>(`${environment.apiURL}Master/ProjectMaster`);
  }
}

export interface IProject {
  appId: number;
  projectName: string;
  encAppId: string;
  app_icon: string;
  display_name: string;
  created_date: string;
  modified_date: string;
  is_active: boolean;
  is_delete: boolean;
}
