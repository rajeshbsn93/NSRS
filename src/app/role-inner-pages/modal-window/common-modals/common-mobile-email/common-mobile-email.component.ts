import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EMPTY, first, interval, of, switchMap } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { AthletePbifService } from "src/app/_common/services/common-services/athlete-pbif.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { EncryptionService } from "src/app/_common/services/innerPagesServices/encryption.service";
import { CommonMobileEmailService } from "src/app/_common/services/role-inner-pages-services/common-role-services/common-mobile-email.service";
import { MatchedValidatorMobile,MatchedValidatorEmail } from "src/app/outer-pages/forgot-password/confirmedValidator";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import Swal from "sweetalert2";

@Component({
selector:'app-mobile-email',
templateUrl:'./common-mobile-email.component.html',
styleUrls:['./common-mobile-email.component.css'],
standalone:true,
imports:[CommonModule, MaterialModule, ReactiveFormsModule, LoaderComponent]
})

export class CommonMobileEmailComponent implements OnInit {
  @ViewChild('phoneOtp') otpPopup:any;
  readonlyEdit:boolean = true
  mobileEmailForm!:FormGroup;
  otpVerifyForm!:FormGroup;
  userDetails:any;
  loader:boolean = false;
  loaderGenarateotp:boolean = false;
  OtpPopupModalRef:any
  counter:any;
  interval$:any;
  resendOtpButton:boolean=false;
  generateOtpIdRes:any;
  isVerifyModalOpen = false;
  isOfficialModal = false;
  isAtheltePBIF:boolean = false

  constructor(
    public activeModal:NgbActiveModal,private formBuilder:FormBuilder,
    private storageService:StorageService,private mobileEmailService:CommonMobileEmailService,
    private alertService:AlertService, private modalService:NgbModal,
    private encryptionService:EncryptionService,
    private athletepbfiService:AthletePbifService
  ) {}

  ngOnInit(): void {
    this.userDetails=this.storageService.getUserDetails();
    this.basicDetailsReactiveForm();
    this.setFormValues();
    if(this.userDetails.role_id===1) this.getAthletePbif();
  }
  getAthletePbif(){
    this.athletepbfiService.atheltePBIF(this.userDetails.user_id).pipe(first()).subscribe({
      next:(res:any)=>{
        // console.log(res)
        this.isAtheltePBIF = res
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }

  basicDetailsReactiveForm() {
    this.mobileEmailForm=this.formBuilder.group({
      mobile_number:['',[Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      alternate_mobile_number:['',Validators.pattern(/^[0-9]{10}$/)],
      email_id:['',[Validators.email,Validators.required]],
      alternate_email_id:['',[Validators.email]],
    },
    {
      validator:[MatchedValidatorMobile('mobile_number','alternate_mobile_number'),MatchedValidatorEmail('email_id','alternate_email_id')]
    });
    this.otpVerifyForm = this.formBuilder.group({
      otp:['', Validators.required],
    });
  }

  setFormValues(){
    this.loader = true;
    this.mobileEmailService[this.isOfficialModal ? 'getOfficialContactDetails' : 'athleteMobileEmail'](this.userDetails.user_id).subscribe({
      next:(response:any)=>{
        this.loader=false
        this.mobileEmailForm.controls['mobile_number'].setValue(response.mobile_number)
        this.mobileEmailForm.controls['alternate_mobile_number'].setValue(response.alternate_mobile_number)
        this.mobileEmailForm.controls['email_id'].setValue(response.email_id)
        this.mobileEmailForm.controls['alternate_email_id'].setValue(response.alternate_email_id);
        this.mobileEmailForm.disable();

      },
      error:()=>{
        this.loader = false
        console.error('Caught in GetAthletePersonalInfo API')
      }
    });
  }


  editButton() {
    // this.enableDisableService.enableField(this.mobileEmailForm,'name',true)
    if(this.isAtheltePBIF){
      this.alertService.swalPopWarning('PBIF form is already filled!')
    }else{
        this.mobileEmailForm.enable();
        this.readonlyEdit = !this.readonlyEdit
    }
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
    this.counter=0;
  }
  
  resendotp(){
    this.getgenerateOtp(
      this.encryptionService.encryptionAES(this.mobileEmailForm.get('mobile_number')?.value),
      this.encryptionService.encryptionAES(this.mobileEmailForm.get('email_id')?.value)
    );
  }

  getgenerateOtp(mobile_number:any,email_id:any){    
    const opt_type = 1;
    const nsrsId = this.userDetails.nsrs_id;
    this.loaderGenarateotp = true;
    this.mobileEmailService.generateOtp(opt_type,nsrsId,mobile_number,email_id).subscribe({
      next: (generateOtpRes) => { 
        this.generateOtpIdRes = generateOtpRes;
        this.loaderGenarateotp = false;  
        if(this.generateOtpIdRes){
          this.activeModal.close(); 
          if(!this.isVerifyModalOpen) {
            this.OtpPopupModalRef = this.modalService.open(this.otpPopup, { size: 'md',centered: true ,backdrop: 'static',keyboard: false });
            this.startCounter();                                 
          }
          this.isVerifyModalOpen = true;
          if(this.OtpPopupModalRef) {
            this.OtpPopupModalRef.result.then(()=>{
              this.isVerifyModalOpen = false
            }).catch(()=>{
              this.isVerifyModalOpen = false
            })
          }
        }
      },
      error: (err) => {
        this.loaderGenarateotp = false;
        console.error(err)
      }
    })

  }

  save() {
    if(this.mobileEmailForm.valid){
      if (this.mobileEmailForm.get('mobile_number')?.value && this.mobileEmailForm.get('email_id')?.value) {
        if (this.mobileEmailForm.get('mobile_number')?.value) {
          const mobile_type = 1;
          this.mobileEmailService.checkMobileEmail(
            this.mobileEmailForm.get('mobile_number')?.value, 
            mobile_type, 
            this.userDetails.user_id, 
            this.userDetails.role_id)
            .pipe(first(),
            switchMap((response) => {
              if (response) {
                this.readonlyEdit = !this.readonlyEdit;
                this.alertService.swalPopError('Mobile number already Exists');
                return EMPTY;
              }
              return this.mobileEmailService.checkMobileEmail(
                this.mobileEmailForm.get('email_id')?.value, 2, this.userDetails.user_id, this.userDetails.role_id
              );
            }),
            switchMap((response) => {
              if (response) {
                this.alertService.swalPopError('Email ID already Exists');
                return EMPTY;
              }
              return of(response);
            }))
            .subscribe({
              next:(emailResponse)=>{
                if (!emailResponse) this.getgenerateOtp(
                  this.encryptionService.encryptionAES(this.mobileEmailForm.get('mobile_number')?.value),
                  this.encryptionService.encryptionAES(this.mobileEmailForm.get('email_id')?.value)
                );
              },
              error:()=>{
                this.alertService.swalPopError('Something went wrong! Please try again.');
                console.error('Caught in IsAlreadyExistCheck API');
              }
            })
        }
      }
    }else{
      this.mobileEmailForm.markAllAsTouched()
    }
  }

  otpVerify(){
    this.otpVerifyForm.value.otpID = this.generateOtpIdRes;
    this.otpVerifyForm.value.otp = Number(this.otpVerifyForm.value.otp);
    this.otpVerifyForm.value.mobile_number = this.encryptionService.encryptionAES(this.mobileEmailForm.get('mobile_number')?.value);
    this.otpVerifyForm.value.email_id = this.encryptionService.encryptionAES(this.mobileEmailForm.get('email_id')?.value);
    this.loader = true
    this.mobileEmailService.ConfirmOtp(this.otpVerifyForm.value).subscribe({
      next:(otpverifyRes)=>{
        this.loader = false;
        this.mobileEmailForm.value[this.isOfficialModal ? 'official_detail_id' : 'player_detail_id'] = this.userDetails.user_id;
        if(otpverifyRes){
          this.mobileEmailForm.value.mobile_number = (this.mobileEmailForm.value.mobile_number).toString()
          if(this.mobileEmailForm.value.alternate_mobile_number !=null){
            this.mobileEmailForm.value.alternate_mobile_number = (this.mobileEmailForm.value.alternate_mobile_number).toString()
          }else{
            this.mobileEmailForm.value.alternate_mobile_number = ''
          }

          this.mobileEmailService[
            this.isOfficialModal 
              ? 'saveOfficialContactDetails' 
              : 'saveAthleteMobileEmail'
            ](this.mobileEmailForm.value).subscribe({
              next:(saveRes: boolean)=>{
                if(saveRes) {
                  this.OtpPopupModalRef.close();
                  this.alertService.swalPopSuccess('Contact details updated successfully!');
                } else {
                  this.alertService.swalPopError('Something went wrong! Please try again.');
                }
              },
              error:()=>{
                this.alertService.swalPopError('Something went wrong! Please try again.');
                console.error('Caught in SaveAthlete_MobileEmail_Info API')
              }
            })
        }else{
          Swal.fire({
            icon:'error',
            text:'Please enter valid OTP'
          }).then((dialogval)=>{
            if(dialogval.isConfirmed){
              this.otpVerifyForm.controls['otp'].reset();
            }
          })
        }
      },
      error:(err)=>{
        this.loader = false
        console.error('caught in ConfirmOtp API')
      }
    })
  }   
}