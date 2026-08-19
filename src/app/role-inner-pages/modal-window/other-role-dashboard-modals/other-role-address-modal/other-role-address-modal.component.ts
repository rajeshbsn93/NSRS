import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { NgbActiveModal, NgbModal, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { EMPTY, Subscription, first, forkJoin, interval, of, switchMap, takeUntil } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { CommonSharableService } from "src/app/_common/services/common-services/commonSharable.service";
import { Enable_disableFormService } from "src/app/_common/services/common-services/enable_disableForm.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { EncryptionService } from "src/app/_common/services/innerPagesServices/encryption.service";
import { RegistrationService } from "src/app/_common/services/innerPagesServices/registration.service";
import { OtherRoleService } from "src/app/_common/services/other-role-service/other-role.service";
import { CommonMobileEmailService } from "src/app/_common/services/role-inner-pages-services/common-role-services/common-mobile-email.service";
import { ManageUserService } from "src/app/_common/services/superuser-services/manage-user.service";
import { MobileNumberDirective } from "src/app/standalone_components/directives/mobile-number.directive";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import Swal from "sweetalert2";

@Component({
selector:'app-other-role-address-modal',
templateUrl:'./other-role-address-modal.component.html',
styleUrls:['./other-role-address-modal.component.css'],
standalone:true,
imports:[
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    LoaderComponent,
    NgbTooltipModule,
    MobileNumberDirective,
],
providers: [
  {provide: DateAdapter, useClass: MomentDateAdapter},
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
],
})
export class OtherRoleAddressModalComponent implements OnInit{
  @ViewChild('phoneOtp') otpPopup:any;
    readonlyEdit:boolean = true
    addressForm!:FormGroup;
    otpVerifyForm!:FormGroup;
    userDetails:any;
    loader:boolean = false;
    loader2:boolean = false;
    loaderGenarate:boolean = false;
    subscription:Subscription = new Subscription();
    communicationStateList:Array<any> = [];
    permanentStateList:Array<any> = [];
    communicationDistrictList:Array<any> = [];
    permanentDistrictList:Array<any> = [];
    communicationCityList:Array<any> = [];
    permanentCityList:Array<any> = [];
    communicationBlockList:Array<any> = [];
    permanentBlockList:Array<any> = [];
    communicationPincodeList:Array<any> = [];
    permanentPincodeList:Array<any> = [];
    contactInfoData:any;

    OtpPopupModalRef:any
    counter:any;
    interval$:any;
    resendOtpButton:boolean=false;
    generateOtpIdRes:any;
    isVerifyModalOpen = false;


    constructor(
        public activeModal:NgbActiveModal,
        private formBuilder:FormBuilder,
        private enableDisableService:Enable_disableFormService,
        private storageService:StorageService,
        private alertService:AlertService,
        private _commonSharableService:CommonSharableService,
        private _otherRoleService:OtherRoleService,
        private _manageUserService:ManageUserService,
        private _registrationService:RegistrationService,
        private encryptionService:EncryptionService,
        private mobileEmailService:CommonMobileEmailService,
        private modalService:NgbModal
      ){}

    ngOnInit(): void {
      this.userDetails=this.storageService.getUserDetails()
        this.basicDetailsReactiveForm();
        this.getState('communication')
        this.getState('permanent')
        this.setFormValues();
        this.otpVerifyForm = this.formBuilder.group({
          otp:['', Validators.required],
        });
    }
    basicDetailsReactiveForm(){
        this.addressForm=this.formBuilder.group({
        //   name:['',[Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
          mobile_no:['',[Validators.required]],
          alternate_mobile_number:[''],
          email:['',[Validators.required,Validators.email]],
          comm_add1:['',[Validators.required]],
          comm_add2:[''],
          comm_state:['',[Validators.required]],
          comm_district:['',[Validators.required]],
          comm_block:[''],
          comm_city:['',[Validators.required]],
          comm_pincode:['',[Validators.required]],
          perm_sameas: [false],
          permanent_add1:['',[Validators.required]],
          permanent_add2:[''],
          permanent_state:['',[Validators.required]],
          permanent_district:['',[Validators.required]],
          permanent_block:[''],
          permanent_city:['',[Validators.required]],
          permanent_pincode:['',[Validators.required]],
        })
      }

    getState(type:string){
        this.loader = true
        this._commonSharableService.stateMasterList(1).subscribe({
            next:(res:any)=>{
                this.loader = false
                if(type=='communication'){
                    this.communicationStateList= res;
                }
                if(type=='permanent'){
                    this.permanentStateList = res;
                }               
                
            },
            error:(err)=>{
                this.loader = false
            }
        })
    }
    getDistrict(stateid:number, type:string){
        this.loader = true
        this._commonSharableService.districtMasterList(stateid).subscribe({
            next:(res:any)=>{
                this.loader = false
                if(type=='communication'){
                    this.communicationDistrictList= res;
                }
                if(type=='permanent'){
                    this.permanentDistrictList = res;
                }
            },
            error:(err)=>{
                this.loader = false
            }
        })
    }
    getCity(stateid:number, type:string){
        this.loader2 = true
        this._commonSharableService.cityMasterList(stateid).subscribe({
            next:(res:any)=>{
                this.loader2 = false
                if(type=='communication'){
                    this.communicationCityList= res
                }
                if(type=='permanent'){
                    this.permanentCityList = res;
                }
            },
            error:(err)=>{
                this.loader2 = false
            }
        })
    }
    getBlock(districtId :number, type:string){
        console.log(districtId)
        this.loader = true
        this._commonSharableService.blockMasterList(districtId ).subscribe({
            next:(res:any)=>{
                this.loader = false
                if(type=='communication'){
                    this.communicationBlockList= res
                }
                if(type=='permanent'){
                    this.permanentBlockList = res;
                }
            },
            error:(err)=>{
                this.loader = false
            }
        })
    }
    getPincode(districtId :number, type:string){
        this.loader2 = true
        this._commonSharableService.pincodeMasterList(districtId).subscribe({
            next:(res:any)=>{
                this.loader2 = false
                if(type=='communication'){
                    this.communicationPincodeList= res
                }
                if(type=='permanent'){
                    this.permanentPincodeList = res;
                }
            },
            error:(err)=>{
                this.loader2 = false
            }
        })
    }
      setFormValues(){
        this.loader = true
        this._otherRoleService.getOtherOfficial_ContactInfo(this.userDetails.user_id).subscribe({
          next:(response:any)=>{
            this.loader=false
            console.log(response)
            this.contactInfoData = response;
            this.addressForm.controls['mobile_no'].setValue(response[0]?.mobile_number)
            this.addressForm.controls['alternate_mobile_number'].setValue(response[0]?.alternate_mobile_number)
            this.addressForm.controls['email'].setValue(response[0]?.email_id)
            this.addressForm.controls['comm_add1'].setValue(response[0]?.communication_address_line_1)
            this.addressForm.controls['comm_add2'].setValue(response[0]?.communication_address_line_2);
            this.addressForm.controls['comm_state'].setValue(response[0]?.communication_address_state_id);
            this.getDistrict(response[0].communication_address_state_id,'communication')
            this.getCity(response[0].communication_address_state_id,'communication')
            this.getPincode(response[0].communication_address_district_id,'communication')
            this.getBlock(response[0].communication_address_district_id,'communication');
            this.addressForm.controls['comm_district'].setValue(response[0]?.communication_address_district_id);
            this.addressForm.controls['comm_block'].setValue(response[0]?.communication_address_block_id);
            this.addressForm.controls['comm_city'].setValue(response[0]?.communication_address_city_id);
            this.addressForm.controls['comm_pincode'].setValue(+response[0]?.communication_address_pincode);
            this.addressForm.controls['perm_sameas'].setValue(response[0]?.permanent_same_as_communication);
            this.addressForm.controls['permanent_add1'].setValue(response[0]?.permanent_address_line_1)
            this.addressForm.controls['permanent_add2'].setValue(response[0]?.permanent_address_line_2);
            this.addressForm.controls['permanent_state'].setValue(response[0]?.permanent_address_state_id);
            this.getDistrict(response[0].permanent_address_state_id,'permanent')
            this.getCity(response[0].permanent_address_state_id,'permanent')
            this.getPincode(response[0].permanent_address_district_id,'permanent')
            this.getBlock(response[0].permanent_address_district_id,'permanent');
            this.addressForm.controls['permanent_district'].setValue(response[0]?.permanent_address_district_id);
            this.addressForm.controls['permanent_block'].setValue(response[0]?.permanent_address_block_id);
            this.addressForm.controls['permanent_city'].setValue(response[0]?.permanent_address_city_id);
            this.addressForm.controls['permanent_pincode'].setValue(+response[0]?.permanent_address_pincode);
            this.addressForm.disable()
            // this.enableDisableService.DisableField(this.addressForm,'name',true)
          },
          error:()=>{
            this.loader = false
            console.error('Caught in GetAthletePersonalInfo API')
          }
        })
        
      }


      editButton(){        
        this.addressForm.enable();
        if(this.addressForm.get('perm_sameas')?.getRawValue()){ 
          this.disableField('permanent_add1')        
          this.disableField('permanent_add2')        
          this.disableField('permanent_state')        
          this.disableField('permanent_district')        
          this.disableField('permanent_block')        
          this.disableField('permanent_city')        
          this.disableField('permanent_pincode')        
        }
        this.addressForm.updateValueAndValidity();
        this.readonlyEdit = !this.readonlyEdit
      }
      onKeyDown(event?: any) {
        if (this.addressForm.get('perm_sameas')?.value) {
          this.resetsameAddressValues()
        }
    
      }
      disableField(controlName?:String){
        this.addressForm.get(`${controlName}`)?.disable();
      }
      enableField(controlName?:String){
        this.addressForm.get(`${controlName}`)?.enable();
      }
      changeSameAs(event:any){
        if(this.addressForm.value.perm_sameas){
            this.sameAddressValues()
        }else{
            this.resetsameAddressValues()
        }
      }
      sameAddressValues(){
        this.permanentStateList = this.communicationStateList
        this.permanentDistrictList = this.communicationDistrictList;
        this.permanentCityList = this.communicationCityList;
        this.permanentBlockList = this.communicationBlockList;
        this.permanentPincodeList = this.communicationPincodeList;
        this.addressForm.patchValue({
            permanent_add1:this.addressForm.value.comm_add1,
            permanent_add2:this.addressForm.value.comm_add2,
            permanent_state:this.addressForm.value.comm_state,
            permanent_district:this.addressForm.value.comm_district,
            permanent_block:this.addressForm.value.comm_block,
            permanent_city:this.addressForm.value.comm_city,
            permanent_pincode:this.addressForm.value.comm_pincode,
        })
        this.disableField('permanent_add1');
        this.disableField('permanent_add2');

      }
      updateFieldStatus() {
        if (!this.addressForm.value.comm_add1 && !this.addressForm.value.comm_pincode && !this.addressForm.value.comm_state && !this.addressForm.value.comm_district && !this.addressForm.value.comm_city && !this.addressForm.value.comm_block) {
          return true
        } else {
          return false
        }
      }
      resetsameAddressValues(){
        this.permanentDistrictList = [];
        this.permanentCityList = [];
        this.permanentBlockList = [];
        this.permanentPincodeList = [];
        this.addressForm.patchValue({
            perm_sameas: false,
            permanent_add1: null,
            permanent_add2:null,
            permanent_state:'',
            permanent_district:'',
            permanent_block:'',
            permanent_city:'',
            permanent_pincode:'',
        })
        this.addressForm.enable();
        this.addressForm.updateValueAndValidity();

      }
      changeStateComm(type:string){
        if(type=='communication'){
          this.addressForm.patchValue({
            comm_district:'',
            comm_block:'',
            comm_city:'',
            comm_pincode:'',
          })
        }else{
          this.addressForm.patchValue({
            permanent_district:'',
            permanent_block:'',
            permanent_city:'',
            permanent_pincode:''
          })
        }                
      }
      changeDistrictComm(type:string){
        if(type=='communication'){
          this.addressForm.patchValue({
            comm_block:'',
            comm_pincode:'',
          })
        }else{
          this.addressForm.patchValue({
            permanent_block:'',
            permanent_pincode:''
          })
        }                
      }

      save(){
        // console.log( this.addressForm.value)
        if(this.addressForm.valid){ 
          if (this.addressForm.get('mobile_no')?.value) {
            const mobile_type = 1;
            this.mobileEmailService.checkMobileEmail(
              this.addressForm.get('mobile_no')?.value, 
              mobile_type, 
              this.userDetails.user_id, 
              this.userDetails.role_id)
              .pipe(first(),
              switchMap((response) => {
                if (response) {
                  // this.readonlyEdit = !this.readonlyEdit;
                  this.alertService.swalPopError('Mobile number already Exists');
                  return EMPTY;
                }
                return this.mobileEmailService.checkMobileEmail(
                  this.addressForm.get('email')?.value, 2, this.userDetails.user_id, this.userDetails.role_id
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
                    this.encryptionService.encryptionAES(this.addressForm.get('mobile_no')?.value),
                    this.encryptionService.encryptionAES(this.addressForm.get('email')?.value)
                  );
                },
                error:()=>{
                  this.alertService.swalPopError('Something went wrong! Please try again.');
                  console.error('Caught in IsAlreadyExistCheck API');
                }
              })
          } 
        }else{
          this.addressForm.markAllAsTouched();
        }
      }
      startCounter(){
        this.counter=60
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
        this.loaderGenarate = true;
        this.getgenerateOtp(
          this.encryptionService.encryptionAES(this.addressForm.get('mobile_no')?.value),
          this.encryptionService.encryptionAES(this.addressForm.get('email')?.value)
        );
      }
    
      getgenerateOtp(mobile_no:any,email:any){ 
        const opt_type = 1;
        const nsrsId = this.userDetails.nsrs_id;
        this.loaderGenarate = true;
        this.mobileEmailService.generateOtp(opt_type,nsrsId,mobile_no,email).subscribe({
          next: (generateOtpRes) => { 
            this.generateOtpIdRes = generateOtpRes;
            this.loaderGenarate = false;  
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
            this.loaderGenarate = false;
            console.error(err)
          }
        })
    
      }
      otpVerify(){
        const payload = {
          otpID:this.generateOtpIdRes,
          otp:Number(this.otpVerifyForm.value.otp),
          mobile_number:this.encryptionService.encryptionAES(this.addressForm.get('mobile_no')?.value),
          email_id:this.encryptionService.encryptionAES(this.addressForm.get('email')?.value)          
        }
        this.loader = true
        this.mobileEmailService.ConfirmOtp(payload).subscribe({
          next:(otpverifyRes)=>{
            this.loader = false;
            if(otpverifyRes){

              //Save API call Here
              this.savePersonalInfo();
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


      savePersonalInfo(){
        console.log(this.addressForm.getRawValue())
        const payload = {
          official_detail_id:this.userDetails.user_id,
          mobile_number:this.addressForm.getRawValue().mobile_no,
          alternate_mobile_number:this.addressForm.getRawValue().alternate_mobile_number,
          email_id:this.addressForm.getRawValue().email,
          alternate_email_id:"",
          communication_address_line_1:this.addressForm.getRawValue().comm_add1,
          communication_address_line_2:this.addressForm.getRawValue().comm_add2,
          communication_address_state_id:this.addressForm.getRawValue().comm_state,
          communication_address_district_id:this.addressForm.getRawValue().comm_district,
          communication_address_block_id:this.addressForm.getRawValue().comm_block,
          communication_address_city_id:this.addressForm.getRawValue().comm_city,
          communication_address_pincode:(this.addressForm.getRawValue().comm_pincode).toString(),
          permanent_same_as_communication:(this.addressForm.getRawValue().perm_sameas).toString(),
          permanent_address_line_1:this.addressForm.getRawValue().permanent_add1,
          permanent_address_line_2:this.addressForm.getRawValue().permanent_add2,
          permanent_address_state_id:this.addressForm.getRawValue().permanent_state,
          permanent_address_district_id:this.addressForm.getRawValue().permanent_district,
          permanent_address_block_id:this.addressForm.getRawValue().permanent_block,
          permanent_address_city_id:this.addressForm.getRawValue().permanent_city,
          permanent_address_pincode:(this.addressForm.getRawValue().permanent_pincode).toString(),
        }
        console.log(payload)
        this.loader = true;
        this._otherRoleService.saveOtherOfficialContactInfo(payload).subscribe({
          next:(response)=>{
            this.loader = false;
            console.log(response)
            if(response){
              this.readonlyEdit = !this.readonlyEdit
              this.OtpPopupModalRef.close();
              this.alertService.swalPopSuccess('Save successfully!')
            }else{
              this.alertService.swalPopError('Can not save!')
            }
          },
          error:(err)=>{
            this.loader = false;
            console.error(err)
          }
        })
      }
}