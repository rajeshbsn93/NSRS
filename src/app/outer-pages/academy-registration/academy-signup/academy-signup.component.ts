import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { EncryptionService } from 'src/app/_common/services/innerPagesServices/encryption.service';
import { RegistrationService } from 'src/app/_common/services/innerPagesServices/registration.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-academy-signup',
  templateUrl: './academy-signup.component.html',
  styleUrls: ['./academy-signup.component.css']
})
export class AcademySignupComponent implements OnInit {

  @ViewChild('otpContent') otpPopup:any;
  otpPopupModalRef:any;
  counter:number=60;
  interval$:any;
  academySignUpMobileForm!:FormGroup
  academySignUpOtpVerifyForm!:FormGroup
  resendOtpButton:boolean=false
  academySignUpMobileNO:any
  mainLoader:boolean=false;
  OtpIdResponse:any;
  fieldType:any

  constructor(private modalService:NgbModal,private formBuilder:FormBuilder,private alertService:AlertService,
    private router:Router,private registrationService:RegistrationService,private encriptionService:EncryptionService) { }

  ngOnInit() {
    this.academySignUpMobileForm=this.formBuilder.group({
      academyEmail:['',[Validators.required,Validators.email]],
      academyMobile:['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),Validators.maxLength(10)]],
    })

    this.academySignUpOtpVerifyForm=this.formBuilder.group({
      academySignUpOtp:['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")]]
    })
  }

  get academyMobile() {
    return this.academySignUpMobileForm.get('academyMobile');
  }

  academySignUpMobile(){
    let oldOtpId =0
    console.log(this.academySignUpMobileForm.value)
    console.log(this.academySignUpMobileForm.controls["academyEmail"].valid)
    console.log(this.academySignUpMobileForm.controls["academyEmail"])
    console.log(this.academySignUpMobileForm.value.academyEmail)
    if(this.academySignUpMobileForm.value.academyEmail!=null && this.academySignUpMobileForm.controls["academyEmail"].valid){
      console.log("api hit for email")
      // this.mainLoader=true
      this.academySignUpMobileNO=this.academySignUpMobileForm.value.academyEmail
      this.fieldType = 2
      this.signupAcademy(oldOtpId,this.academySignUpMobileForm.value.academyEmail,this.fieldType)
      
    }else if(this.academySignUpMobileForm.value.academyMobile!=null && this.academySignUpMobileForm.controls["academyMobile"].valid){
      console.log("api hit for mobile")
      this.academySignUpMobileForm.controls["academyEmail"].clearValidators()
      this.academySignUpMobileNO=this.academySignUpMobileForm.value.academyMobile;
      this.fieldType = 1
      this.signupAcademy(oldOtpId,this.academySignUpMobileForm.value.academyMobile,this.fieldType)

    }else if(this.academySignUpMobileForm.value.academyEmail==null || (this.academySignUpMobileForm.controls['academyEmail'].invalid && this.academySignUpMobileForm.controls['academyEmail'].touched)){
      console.log("academyEmail touched")
      this.academySignUpMobileForm.controls['academyEmail'].markAsTouched()
    }else if(this.academySignUpMobileForm.value.academyMobile==null || (this.academySignUpMobileForm.controls['academyMobile'].invalid && this.academySignUpMobileForm.controls['academyMobile'].touched)){
      console.log("academyMobile touched")
      this.academySignUpMobileForm.controls['academyMobile'].markAsTouched()
    }
  }

  signupAcademy(oldOtpId:number,field:any,fieldType:any){
    this.mainLoader = true
    this.registrationService.SignUp(oldOtpId,field,fieldType).subscribe({
      next:(res)=>{
        //console.log(res)
        this.OtpIdResponse = res
        this.mainLoader = false;
        if(res>0){
          this.sendOtpPopUp()
        }else{
          this.alertService.swalPopErrorTimer('Already registered!')
        }
      },
      error:()=>{
        this.mainLoader = false;
        console.error("error caught in registration")
      }
    })  
  }

  sendOtpPopUp(){
    this.otpPopupModalRef =  this.modalService.open(this.otpPopup, { size: 'md',centered: true, backdrop: 'static',keyboard: false });  
    this.startCounter();  
    this.otpPopupModalRef.result.then((x:any)=>{
      this.academySignUpOtpVerifyForm.controls['academySignUpOtp'].reset();
    }).catch((y:any)=>{
      this.academySignUpOtpVerifyForm.controls['academySignUpOtp'].reset();
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
        this.stopCounter();
      }
    });
  }

  stopCounter(){
    this.interval$.unsubscribe();
    // this.counter=0;
  }

  academyOtpVerifyFormSubmit(){
    console.log(this.academySignUpOtpVerifyForm.value)
    if(this.academySignUpOtpVerifyForm.valid){
      this.mainLoader = true;
      this.registrationService.ConfirmRegisterationOtp(this.OtpIdResponse,this.academySignUpOtpVerifyForm.value.academySignUpOtp).subscribe({
        next:(res)=>{
          this.mainLoader = false;
          console.log(res)
          if(res){
            this.otpPopupModalRef.close()    
            //'otp verified successFully'
            this.alertService.swalPopSuccessTimer('OTP verified successFully')
            this.router.navigate(['/academy-signin',{fieldVal:this.encriptionService.encryptionAES(this.academySignUpMobileNO),Type:this.encriptionService.encryptionAES(this.fieldType)}])
          }else{
            Swal.fire({
              text: "OTP not valid ",
              icon: 'warning',
            }).then((result) => {
              if (result.isConfirmed) {
                this.academySignUpOtpVerifyForm.controls['academySignUpOtp'].reset()
              }
            })
          }
        },
        error:()=>{
          this.mainLoader = false;
          console.error('error caught in ConfirmRegisterationOtp')
        }
      })     

    }else{
      this.academySignUpOtpVerifyForm.markAllAsTouched()
    }
  }

}
