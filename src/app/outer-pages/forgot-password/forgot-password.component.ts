import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { interval, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/_common/services/innerPagesServices/authentication.service';
import { ConfirmedValidator } from './confirmedValidator';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  @ViewChild('content') multiUserPopup:any;
  @ViewChild('contentnewPassword') newPasswordPopup:any;
  UserPopup:any;
  newPassPopup:any;
  mulUserCheck:boolean = false;
  forgotOtpVerify!:FormGroup;
  forgotPassVal:any;
  formForgot!:FormGroup;
  forgotpasswordData:any;
  singleUserPopup1:boolean= true;
  singleUserPopup2:boolean= false;
  otpId:any;
  userId:any;
  userName:any;
  otpCheck:any;
  passwordPattern:string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$";
  mobilepattern:string = "^((\\+91-?)|0)?[0-9]{10}$";
  newPasswordForm!:FormGroup;
  showeye:boolean=false;
  showeyeNew:boolean=false;
  password:any;
  passwordNew:any;
  counter:number=60;
  interval$:any;
  resendOtpButton:boolean=false;
  userMobileNo:any; 
  phoneval:any;
  forgotPasswordEntry:any;
  loaderMain:boolean = false;
  unSubscribeSubject:Subject<any> = new Subject()
  



  constructor(private modalService: NgbModal, private authenticationService:AuthenticationService,
    private fb:FormBuilder,private router:Router) { }

  ngOnInit(): void {
    this.password = 'password';
    this.passwordNew = 'password'
    this.formForgot = this.fb.group({
      forgotPassword:['', [Validators.required]]
    })

    this.forgotOtpVerify=this.fb.group({
      otp:['',[Validators.required]]
    })

    this.newPasswordForm=this.fb.group({
      newpass:['', [Validators.required,Validators.pattern(this.passwordPattern)]],
      confirmpass:['',Validators.required]
    }, { 
      validator: ConfirmedValidator('newpass', 'confirmpass')
    })
  }
  get formForgotControl():{[key:string]:AbstractControl}{
    return this.formForgot.controls;
  }


  get f(){
    return this.newPasswordForm.controls;
  }
  onClick(){
    if (this.password === 'password') {
      this.password = 'text';
      this.showeye = true;
    } else {
      this.password = 'password';
      this.showeye = false;
    }
  }
  onClickNew(){
    if (this.passwordNew === 'password') {
      this.passwordNew = 'text';
      this.showeyeNew = true;
    } else {
      this.passwordNew = 'password';
      this.showeyeNew = false;
    }
  }
  

  forgotpassword(){
    this.forgotPassVal=this.formForgot.value.forgotPassword;
    this.forgotOtpVerify.reset()
    if(this.formForgot.valid){
      this.loaderMain = true
      this.authenticationService.forgotpassword(this.formForgot.value.forgotPassword).pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next:res=>{
          this.loaderMain = false
          this.forgotpasswordData = res;
          if(this.forgotpasswordData.otpGeneratedId!=-1 && this.forgotpasswordData.multipleExist==false){
            //single user
            this.mulUserCheck = false;
            this.userMobileNo=this.forgotpasswordData.mobileNo
            this.otpId=this.forgotpasswordData.otpGeneratedId
            //console.log("otp id",this.otpId)
            this.userId=this.forgotpasswordData.userId
            this.userName=this.forgotpasswordData.username;
            this.startCounter();
            this.UserPopup =  this.modalService.open(this.multiUserPopup, { size: 'md',centered: true, backdrop: 'static',keyboard: false });        
          }else if(this.forgotpasswordData.multipleExist==true){
            //multiple user
            this.mulUserCheck = true;
          }else if(this.forgotpasswordData.otpGeneratedId==-1 && this.forgotpasswordData.multipleExist==false){
            //no user
            Swal.fire({
              position: 'center',
              icon: 'error',
              text: 'No User Found',
              showConfirmButton: false,
              timer: 1500
            });
          }
        },
        error:(error)=>{
          console.error("error caught in forgot password")
          this.loaderMain=false  
        }
      })
    }else{
      this.formForgot.markAllAsTouched()
    }
    
  }

  forOtpVerify(){
    this.newPasswordForm.reset()
    if(this.forgotOtpVerify.valid){
      this.loaderMain = true
      this.authenticationService.forgotPasswordConfirm(this.otpId,this.forgotOtpVerify.value.otp, this.userMobileNo)
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe({
        next:res=>{
          this.loaderMain = false
          this.otpCheck=res;
          if(this.otpCheck){
            // console.log("otp verified")
            this.newPasswordForm.reset()
            this.stopCounter()
            Swal.fire({
              position: 'center',
              icon: 'success',
              text: 'OTP Verified Succesfully!',
              showConfirmButton: false,
              timer: 1500
            });
            this.UserPopup.close();
            this.forgotOtpVerify.reset();
            this.newPassPopup =  this.modalService.open(this.newPasswordPopup, { size: 'md',centered: true });
            
          }else{
            this.formForgot.reset();
            // this.UserPopup.close();
            Swal.fire({
              position: 'center',
              icon: 'error',
              text: 'OTP is Not Valid',
              showConfirmButton: false,
              timer: 1500
            });
            this.forgotOtpVerify.reset();
            // console.log("not verified")
          }
        },
        error:(error)=>{
          console.error("error caught in forgot confirm password")
          this.loaderMain=false  
        }
      }) 
    }else{
      this.forgotOtpVerify.markAllAsTouched()
    }
       
  }

  newPassword(){
    // this.newPasswordForm.reset()
    if(this.newPasswordForm.invalid){
      this.newPasswordForm.markAllAsTouched()
      return
    }
    this.loaderMain = true
    this.authenticationService.forgotResetPass(this.userId,this.userName,this.newPasswordForm.value.confirmpass)
    .pipe(takeUntil(this.unSubscribeSubject))
    .subscribe({
      next:res=>{
        this.loaderMain = false
        // console.log(res)
        if(res){
          this.router.navigate(['login'])
          this.newPassPopup.close();
          this.newPasswordForm.reset()
        }
      },
      error:(error)=>{
        console.error("error caught in forgot reset password")
        this.loaderMain=false  
      }
    })
    
  }

  startCounter(){
    this.counter=10
    this.resendOtpButton=false;
    this.interval$=interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter==0){
        this.resendOtpButton=true;
        this.stopCounter()
      }
    });
  }
  stopCounter(){
    this.interval$.unsubscribe();
    // this.counter=0;
  }

  resendOtp(){
    this.loaderMain = true
    this.authenticationService.resendOtp( this.otpId,this.userMobileNo).pipe(takeUntil(this.unSubscribeSubject))
    .subscribe({
      next:res=>{
        this.loaderMain = false
        //console.log("otp sent succesfully")
        //console.log(res)
      },
      error:(error)=>{
        console.error("error caught in resend otp")
        this.loaderMain=false  
      }
    })
  }

  ngOnDestroy(): void {
    this.unSubscribeSubject.unsubscribe();
  }


}
