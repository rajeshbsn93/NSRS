import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/_common/services/innerPagesServices/authentication.service';
import { interval, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-forgot-userid',
  templateUrl: './forgot-userid.component.html',
  styleUrls: ['./forgot-userid.component.css']
})
export class ForgotUseridComponent implements OnInit, OnDestroy {
  @ViewChild('content') forgotuserContent:any
  @ViewChild('UserListcontent') forgotUserListcontent:any
  forgotUseridPopup:any;
  forgotuseridListPopup:any;
  forgotUseridForm!:FormGroup;
  forgotUseridOtp!:FormGroup
  forgotUserList!:FormGroup
  mobileOtpId:any;
  Phone:any;
  otpVerifyRes:any;
  username:any;
  counter:any;
  resendOtpButton:boolean=false;
  interval$:any;
  loaderMain:boolean = false;
  unSubscribeSubject:Subject<any> = new Subject();

  constructor(private fb:FormBuilder, private authenticationService:AuthenticationService,
    private modalService: NgbModal,
    private router:Router ) { }

  ngOnInit(): void {
    this.forgotUseridForm = this.fb.group({
      Phone: ['',Validators.required]
    })

    this.forgotUseridOtp=this.fb.group({
      otp:['']
    })

    this.forgotUserList=this.fb.group({
      rad:['']
    })
  }
  forgotuserid(){
    //console.log(this.forgotUseridForm.value);
    this.Phone=this.forgotUseridForm.value.Phone
    this.loaderMain = true
    this.authenticationService.forgotUserId(this.Phone)
    .pipe(takeUntil(this.unSubscribeSubject))
    .subscribe({
      next:res=>{
        this.loaderMain = false
        this.mobileOtpId=res;
        //console.log(res)
        if(this.mobileOtpId!=-1){
          this.forgotUseridPopup=this.modalService.open(this.forgotuserContent, { size: 'md',centered: true, backdrop: 'static',keyboard: false });
          this.startCounter()
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            text: 'Mobile Number Not Registered',
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
      error:(error)=>{
        console.error("error caught in forgot userid")
        this.loaderMain=false  
      }
    })
  }

  UserIdOtp(){
    // console.log("forgot userid")
    // console.log(this.forgotUseridOtp.value)
    this.loaderMain = true
    this.authenticationService.forgotUserIdConfirm(this.forgotUseridOtp.value.otp,this.mobileOtpId,this.Phone)
    .pipe(takeUntil(this.unSubscribeSubject))
    .subscribe({
      next:res=>{
        // console.log(res)
        this.loaderMain = false
        this.stopCounter()
        this.forgotUseridOtp.reset()
        this.otpVerifyRes=res;
        if(this.otpVerifyRes.length==1){
          //single user
          // console.log(this.otpVerifyRes[0].username)
          this.forgotUseridPopup.close();
          this.username=this.otpVerifyRes[0].username
          localStorage.setItem('username',this.username)
          this.router.navigate(['login'])
        }else if(this.otpVerifyRes.length>1){
          this.forgotUseridPopup.close()
          this.forgotuseridListPopup=this.modalService.open(this.forgotUserListcontent, { size: 'lg',centered: true,backdrop: 'static',keyboard: false });
        }
        else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            text: 'OTP is Not Valid',
            showConfirmButton: false,
            timer: 1500
          });
          this.startCounter()
        }
      },
      error:(error)=>{
        console.error("error caught in forgot userid confirm")
        this.loaderMain=false  
      }
    })

  }

  UserIdList(){
    //console.log(this.forgotUserList.value)
    //console.log("user id list")
    this.username=this.forgotUserList.value.rad
    this.forgotuseridListPopup.close();
    //console.log(this.username)
    localStorage.setItem('username',this.username)
    this.router.navigate(['login'])
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
  }
  resetotpcloce(){
    this.forgotUseridOtp.controls['otp'].reset()
  }

  resendOtp(){
    this.loaderMain = true
    this.authenticationService.resendOtp(this.mobileOtpId,this.Phone)
    .pipe(takeUntil(this.unSubscribeSubject))
    .subscribe({
      next:res=>{
        //console.log("otp sent succesfully")
        //console.log(res)
        this.loaderMain = false
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
