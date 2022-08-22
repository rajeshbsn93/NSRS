import { HttpClient } from '@angular/common/http';
import { Component, OnInit,TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/authentication.service';
import { EncryptionService } from '../services/encryption.service';
import { GenerateCaptchaService } from '../services/generate-captcha.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  getcaptchaText = '';
  //usernamePattern: RegExp = new RegExp(/^[A-Za-z]+([a-zA-Z .-])*$/);
  passwordPattern:string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$";
  submitted = false;
  modalRef?: BsModalRef;
  @ViewChild('content') modeShow:any

  loginForm = new UntypedFormGroup(
    {
    username: new UntypedFormControl('',[Validators.required]),
    password: new UntypedFormControl('', [Validators.required,Validators.pattern(this.passwordPattern)]),
    logincaptcha: new UntypedFormControl('', Validators.required)    
  },
  );

  loginFormPhone = new UntypedFormGroup({
    mobile: new UntypedFormControl('', Validators.required)
  })

  constructor(private fb:UntypedFormBuilder, private authenticationService:AuthenticationService,
    private encryptionService:EncryptionService, private generateCaptcha:GenerateCaptchaService,
    private router:Router, private modalService:BsModalService
    ) { 
    
  }
  ngOnInit(): void {
  this.getcaptchaText =  this.generateCaptcha.makecaptcha();
  this.modalRef?.hide()
  }
  openModal() {
    this.modalRef = this.modalService.show(this.modeShow);
  }
  refreshcaptha(){
    this.getcaptchaText =  this.generateCaptcha.refreshcaptha()
  }
  get logincontrol():{[key:string]:AbstractControl}{
    return this.loginForm.controls;
  }
  login(){
    this.submitted = true;
    console.log(this.encryptionService.encryptionAES(this.loginForm.get('password')?.value));
    if(this.loginForm.invalid){
      return;
    }
    if((this.loginForm.get('logincaptcha')?.value)==this.generateCaptcha.captchaText){
      this.authenticationService.login(
        this.loginForm.get('username')?.value,this.encryptionService.encryptionAES(this.loginForm.get('password')?.value),'username'
        ).subscribe(data=>{
          console.log(data)
          if(data.length == 1 && data[0].isPasswordValidated == false){
            Swal.fire({
              position: 'center',
              icon: 'error',
              text: 'You have entered wrong Password',
              showConfirmButton: false,
              timer: 1500
            });
          }else if(data.length == 0){
            Swal.fire({
              position: 'center',
              icon: 'error',
              text: 'You have entered wrong Username',
              showConfirmButton: false,
              timer: 1500
            });
          }else if(data.length == 1 && data[0].isPasswordValidated == true){
            sessionStorage.setItem('token', JSON.stringify(data));
            this.router.navigate(['adminUser/sdo/sdo-dashboard'])
            //this.currentUserSubject.next(data);               
          } else if(data.length > 1){
            console.log('Multitle User')
    
          }
        })
    }
    else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        text: 'You have entered wrong captcha',
        showConfirmButton: false,
        timer: 1500
      });
    }
    }


  loginByPhone(){
    this.submitted = true;
    this.authenticationService.login(
      this.loginForm.get('mobile')?.value,this.loginForm.get('mobile')?.value,'otp'
      )
    console.log(this.loginFormPhone.value)
  }

  logout(){
    this.authenticationService.logout()
  }
  
  
}
