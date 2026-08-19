import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../_common/services/innerPagesServices/authentication.service';
import { EncryptionService } from '../../_common/services/innerPagesServices/encryption.service';
import { GenerateCaptchaService } from '../../_common/services/innerPagesServices/generate-captcha.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY, first, interval, Subject, switchMap, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // unSubscribeSubject:Subject<any> = new Subject();
  // getcaptchaText = '';
  // @ViewChild('phoneOtp') phoneOtpPopup:any
  // mulUserData:any=[];
  // counter:any;
  // interval$:any;
  // resendOtpButton:boolean=false;
  // mulUserFormPopup!:FormGroup;
  // otpVerifyForm!:FormGroup;
  // passwordPattern:string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$";
  // submitted = false;
  // mobileSubmitted = false;
  // mulUserCheck:boolean=false;
  // closeResult!: string;
  // @ViewChild('content') multiUserPopup:any;
  // UserPopup:any;
  // readData:any;
  // loginOtpData:any;
  // mobileOtpLogin:any;
  // otpDataVerify:any
  // forgotuseridModal:any;
  // showeye:boolean=false;
  // password:any;
  // imgCap:any;
  // //phoneval:any;
  // forgotUserIdUserName:any;
  // sessionResponse:any;
  loaderMain: boolean = true;
  sessionId: string | null = null;
  // loginForm = new FormGroup(
  //   {
  //   username: new UntypedFormControl('',[Validators.required]),
  //   password: new UntypedFormControl('', [Validators.required]),
  //   logincaptcha: new UntypedFormControl('', [Validators.required])
  // },
  // );

  // loginFormPhone = new FormGroup({
  //   mobile: new FormControl('',  [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])
  // })

  constructor(
    // private fb:UntypedFormBuilder,
    // private encryptionService:EncryptionService, private generateCaptcha:GenerateCaptchaService,
    // private modalService: NgbModal,
    // private formBuilder:FormBuilder,private alertService:AlertService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.params
      .pipe(first(),
        switchMap((params) => {
          if (params?.['id']) {
            localStorage.clear();
            const obj = {
              sessionId:params?.['id'],
              appId:environment.encrAppId
            }
            // return this.authenticationService.getsession(params?.['id']);
            return this.authenticationService.getsession(obj);
          } else {
            this.router.navigate(['/home']);
            return EMPTY;
          }
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response) {
            localStorage.setItem('token', JSON.stringify(response.jwtToken));
            localStorage.setItem('sessiondata', JSON.stringify(response));
            localStorage.setItem(
              'loginUserdata',
              JSON.stringify(response.userData)
            );
            // this.loaderMain = false;
            if (response.userData?.dashboard)
              this.router.navigate([response.userData.dashboard]);
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.loaderMain = false;
          console.error('Get Session Data Error', errorResponse);
          if (errorResponse.status === 400) {
            Swal.fire({
              title: 'LOGIN ERROR',
              icon: 'error',
              text: 'Something went wrong! Please login again.',
              showCancelButton: true,
              confirmButtonText: 'Try Again',
              cancelButtonText: 'Go to Home Page',
              allowOutsideClick: false,
            })
              .then((result: SweetAlertResult<any>) => {
                if (result.value) {
                  window.open(
                    environment.ssoLoginUrl + 'login?appId=' + environment.encrAppId,
                    '_self'
                  );
                  
                }
                else this.router.navigate(['/home']);
              })
              .catch(() => {});
          }
        },
      });

    // this.password = 'password';
    // this.getcaptchaText =  this.generateCaptcha.refreshcaptha();
    // this.mulUserFormPopup=this.formBuilder.group({
    //   space:[''],
    // })
    // this.otpVerifyForm=this.formBuilder.group({
    //   otp:['']
    // })

    // this.genImgcap();

    // this.forgotUserIdUserName=localStorage.getItem('username');

    // if(this.forgotUserIdUserName !== null){
    //   this.loginForm.patchValue({
    //     username: [this.forgotUserIdUserName]
    //   })
    // }
  }

  // onClick(){
  //   if (this.password === 'password') {
  //     this.password = 'text';
  //     this.showeye = true;
  //   } else {
  //     this.password = 'password';
  //     this.showeye = false;
  //   }
  // }

  // genImgcap(){
  //   let canvas: any = document.getElementById("capCan");
  //  let ctx = canvas.getContext("2d");
  //  ctx.font = "30px Arial";
  //  ctx.clearRect(0, 0, 240, 60);
  //  ctx.textAlign = "center";
  //  ctx.fillText(this.getcaptchaText, 140, 35);
  //  canvas.oncontextmenu = function() {return false};
  // }

  // refreshcaptha(){
  //   this.getcaptchaText =  this.generateCaptcha.refreshcaptha()
  //   this.genImgcap()
  // }

  // get logincontrol():{[key:string]:AbstractControl}{
  //   return this.loginForm.controls;
  // }

  // login(){
  //   this.submitted = true;
  //   if(this.loginForm.invalid){
  //     return;
  //   }
  //   if((this.loginForm.get('logincaptcha')?.value)==this.generateCaptcha.captchaText){
  //     this.loaderMain = true
  //     this.authenticationService.login(
  //       this.loginForm.get('username')?.value,this.encryptionService.encryptionAES(this.loginForm.get('password')?.value),'username'
  //       ).pipe(takeUntil(this.unSubscribeSubject))
  //       .subscribe({
  //         next:data=>{
  //         this.loaderMain = false
  //         if(data.length == 1 && data[0].isPasswordValidated == false){
  //           this.alertService.swalPopErrorTimer("You have entered wrong Password")
  //           this.refreshcaptha()
  //           setInterval(()=>{
  //             window.location.reload();
  //           },1500)
  //         }else if(data.length == 0){
  //           this.alertService.swalPopErrorTimer("You have entered wrong Username")
  //           this.refreshcaptha()
  //           setInterval(()=>{
  //             window.location.reload();
  //           },1500)
  //         }else if(data.length == 1 && data[0].isPasswordValidated == true){
  //           localStorage.clear()
  //           localStorage.setItem('token', JSON.stringify(data[0].token));
  //           localStorage.setItem('loginUserdata', JSON.stringify(data));
  //           this.refreshcaptha();
  //           this.loaderMain = true
  //           this.authenticationService.generateSessionData(data[0].role_id,data[0].user_id).subscribe({
  //             next:(res:any)=>{
  //               this.loaderMain = false;
  //               if (res?.alreadyLoggedIn) {
  //                 this.alertService.swalPopErrorTimer('User already logged in! Please try later.');
  //                 return;
  //               }
  //               localStorage.setItem('sessiondata', JSON.stringify(res));
  //               // this.router.navigate(['/sdo-dashboard'])
  //               this.router.navigate([`/${res.userData.dashboard}`])
  //             },
  //             error:error=>{
  //                 this.loaderMain = false
  //                 console.error('error caught in generateSessionData')
  //               }
  //             })
  //         } else if(data.length > 1){
  //           //multiple user
  //           for(var d of data ){
  //              if(d.isPasswordValidated==1){
  //               this.mulUserData.push(d);
  //              }
  //           }
  //           if(this.mulUserData.length!=0){
  //             this.UserPopup =  this.modalService.open(this.multiUserPopup, { size: 'md' });
  //           }else{
  //             this.alertService.swalPopErrorTimer("You have entered Wrong Credentials")
  //             setInterval(()=>{
  //               window.location.reload();
  //             },1000)
  //           }
  //           this.refreshcaptha();
  //         }
  //       },
  //       error:()=>{
  //         console.error('error caught in Login')
  //         this.loaderMain = false;
  //       }
  //     })
  //   }
  //   else{
  //     this.alertService.swalPopErrorTimer("You have entered wrong captcha")
  //     this.refreshcaptha();
  //     this.loginForm.controls['logincaptcha'].reset()
  //   }
  //   }

  // loginByPhone(){
  //   // console.log(this.loginFormPhone.value)
  //   this.mobileOtpLogin=this.loginFormPhone.value.mobile
  //   this.mobileSubmitted = true;
  //   this.otpVerifyForm.reset()
  //   if(this.loginFormPhone.invalid){
  //     this.loginFormPhone.markAllAsTouched()
  //     return
  //   }
  //   this.loaderMain = true
  //   this.authenticationService.login(
  //     this.loginFormPhone.get('mobile')?.value,this.loginFormPhone.get('mobile')?.value,'otp'
  //     ).pipe(takeUntil(this.unSubscribeSubject)).subscribe({
  //       next:data=>{
  //         this.loaderMain = false
  //         this.loginOtpData=data;
  //         if (data.alreadyLoggedIn) {
  //           this.alertService.swalPopErrorTimer('User already logged in! Please try later.');
  //           return;
  //         }
  //         if(this.loginOtpData.isMultipleExist==true && this.loginOtpData.otpId==-1){
  //           //multiple user
  //          //console.log(this.phoneval)
  //           this.mulUserCheck=true
  //         }else if(this.loginOtpData.isMultipleExist==false && this.loginOtpData.otpId==-1){
  //           //no user
  //           this.mulUserCheck=false;
  //           this.alertService.swalPopError("No User Found!")
  //         }else if(this.loginOtpData.isMultipleExist==false && this.loginOtpData.otpId!=-1){
  //           //Single User
  //           this.mulUserCheck=false;
  //           this.forgotuseridModal =  this.modalService.open(this.phoneOtpPopup, { size: 'md',centered: true ,backdrop: 'static',keyboard: false });
  //           this.startCounter();
  //         }
  //         else{
  //           this.mulUserCheck=false;
  //         }
  //       },
  //       error:(error)=>{
  //         console.error("error caught in login mobile")
  //         this.loaderMain=false
  //       }
  //     })
  // }

  // logout(){
  //   this.authenticationService.logout()
  // }

  // openLg(content:any) {
  //   this.UserPopup =  this.modalService.open(content, { size: 'md' });
  // }

  // submitMulUserPopupForm(){
  //   for(let i of this.mulUserData){
  //     if(i.user_id==this.mulUserFormPopup.value.space){
  //       if(i.isPasswordValidated==true){
  //         // localStorage.setItem('token', JSON.stringify(i.token));
  //           // this.router.navigate(['/sdo-dashboard'])
  //           console.log('password verified but not routed + generate session')

  //       }else{
  //         this.alertService.swalPopErrorTimer("Wrong Crendentials")
  //       }
  //     }
  //   }
  // }

  // otpVerify(){
  //   // console.log(this.otpVerifyForm.value)
  //   // console.log(this.mobileOtpLogin)
  //   if(this.otpVerifyForm.invalid){
  //     this.otpVerifyForm.markAllAsTouched()
  //     return
  //   }
  //   this.loaderMain = true
  //   this.authenticationService.phoneOtpVerify(this.loginOtpData.otpId,this.otpVerifyForm.value.otp,this.mobileOtpLogin)
  //   .pipe(takeUntil(this.unSubscribeSubject))
  //   .subscribe({
  //     next:(res:any)=>{
  //       this.otpDataVerify=res;
  //       this.loaderMain = false
  //       console.log(res)
  //       if(this.otpDataVerify[0].isOtpValidated==true){
  //         localStorage.clear()
  //         localStorage.setItem('loginUserdata', JSON.stringify(this.otpDataVerify));
  //         localStorage.setItem('token',JSON.stringify(this.otpDataVerify[0].token))
  //         this.loaderMain = true
  //         this.authenticationService.generateSessionData(this.otpDataVerify[0].role_id,this.otpDataVerify[0].user_id).subscribe({
  //           next:(res:any)=>{
  //             console.log(res)
  //             this.loaderMain = false
  //             localStorage.setItem('sessiondata', JSON.stringify(res));
  //             this.router.navigate([`/${res.userData.dashboard}`])
  //             // this.router.navigate(['/sdo-dashboard'])
  //           },
  //           error:(error)=>{
  //             console.error("error caught in generate session")
  //             this.loaderMain=false
  //           }
  //         })
  //         this.forgotuseridModal.close();
  //         this.stopCounter()
  //       }else{
  //         this.alertService.swalPopErrorTimer("OTP Not Verified")
  //         this.otpVerifyForm.reset()
  //         this.stopCounter()
  //         this.startCounter()
  //       }
  //     },
  //     error:(error)=>{
  //       console.error("error caught in mobile otp")
  //       this.loaderMain=false
  //     }
  //   })
  // }

  // startCounter(){
  //   this.counter=10
  //   this.resendOtpButton=false;
  //   this.interval$=interval(1000)
  //   .subscribe(val=>{
  //     this.counter--;
  //     if(this.counter==0){
  //       this.resendOtpButton=true;
  //       this.stopCounter();
  //     }
  //   });
  // }

  // stopCounter(){
  //   this.interval$.unsubscribe();
  //   // this.counter=0;
  // }

  // clearusername(){
  //   this.loginForm.reset();
  // }

  // clearmobile(){
  //   this.loginFormPhone.reset();
  // }

  // ngOnDestroy(): void {
  //   this.unSubscribeSubject.unsubscribe();
  // }

  ngOnDestroy(): void {
    Swal.close(); 
  }
}
