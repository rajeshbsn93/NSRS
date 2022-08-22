import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserMdl } from '../model/user-mdl';

import Swal from 'sweetalert2'
import { GenerateCaptchaService } from './generate-captcha.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private jwtHelper:JwtHelperService =  new JwtHelperService();
private currentUserSubject: BehaviorSubject<UserMdl>;
public currentUser: Observable<UserMdl>
  constructor(private router:Router, private http:HttpClient,
    private generateCaptcha:GenerateCaptchaService) {
    this.currentUserSubject = new BehaviorSubject<UserMdl>(
      JSON.parse(localStorage.getItem('token') as string)
      );
      this.currentUser = this.currentUserSubject.asObservable();
   }

   public get currentUserValue(){
    return this.currentUserSubject.value;
   }

   login(username:string, password:string, loginType:string){ 
    let payload = {
      username: username,
      password: password,
      logintype:loginType
    };  

    return this.http.post<any>(`${environment.apiURL}Login/Login`,payload)
    .pipe(map((data:any) =>{
      return data     
    }));
   }

   isLoggedIn() {
    return sessionStorage.getItem('token')
  }
  //  loginmobile(mobilenumber:string){
  //   return this.http.post(`${environment.apiURL}users/authenticate`,{mobilenumber, mobilenumber,"otp"})
  //   .pipe(map((data) =>{
  //     if(data){
  //       localStorage.setItem('user', JSON.stringify(data));
  //       this.currentUserSubject.next(data);
  //       return data;       
  //     }
  //   }));
  //  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('token');
    this.generateCaptcha.captchaText = '';
    //this.userSubject.next(null);
    this.router.navigate(['/login']);
}
}
