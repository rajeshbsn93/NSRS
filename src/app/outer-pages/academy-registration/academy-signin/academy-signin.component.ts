import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import Swal from 'sweetalert2';
import {ConfirmedValidatorNew } from '../../forgot-password/confirmedValidator';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/_common/material.module';
import { YearFormatDirective } from 'src/app/standalone_components/directives/year-format.directive';
import { ActivatedRoute, Router } from '@angular/router';
import {map, Observable, Subject, takeUntil } from 'rxjs';
import { RegistrationService } from 'src/app/_common/services/innerPagesServices/registration.service';
import { AuthenticationService } from 'src/app/_common/services/innerPagesServices/authentication.service';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { EncryptionService } from 'src/app/_common/services/innerPagesServices/encryption.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  selector: 'app-academy-signin',
  templateUrl: './academy-signin.component.html',
  styleUrls: ['./academy-signin.component.css'],
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule,MaterialModule,YearFormatDirective,LoaderComponent]
})

export class AcademySigninComponent implements OnInit {
  passwordhide:Boolean=true;
  confirmPasswordhide:Boolean=true;
  generateNsrsIdForm!:FormGroup;
  yearOfEstablishment:any
  passwordPattern:string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$";
  stateList$:Observable<any>  = new Observable()
  stateListData:any;
  subject:Subject<any> = new Subject();
  loader:boolean = false;
  unSubscribeSubject:Subject<any> = new Subject();
  mulUserData:any=[];
  SportList$:Observable<any>  = new Observable()
  SportListData:any
  maxDate = new Date(2023, 0, 1);
  today = new Date();
  urlfieldData:any
  urlTypeData:any;
  mobileFieldDisabled:boolean = false
  emailFieldDisabled:boolean = false;
  loginOtpData:any;
  mulUserCheck:boolean=false;
  otpDataVerify:any

  constructor(private formBuilder:FormBuilder,private router:Router,private registrationService:RegistrationService,
    private authenticationService:AuthenticationService,private alertService:AlertService,private encryptionService:EncryptionService,
    private route:ActivatedRoute) { }

  ngOnInit() {

    this.generateNsrsIdForm=this.formBuilder.group({
      nameofAcademy:['',[Validators.required]],
      academyEmail:['',[Validators.required,Validators.email]],
      academyPhoneNo:['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      academyState:['',[Validators.required]],
      academyYearofEstablish:['',[Validators.required]],      
      password:['',Validators.compose([Validators.required,Validators.pattern(this.passwordPattern)])],
      confirmPassword:['',Validators.compose([Validators.required,Validators.pattern(this.passwordPattern)])],
      academyDiscipline:this.academyDiscipline,
      //entity:['',[Validators.required]],
      //category:['',[Validators.required]],
      // academyType:['']
    },{
      // validator:ConfirmedValidator('password', 'confirmPassword')
       validator:ConfirmedValidatorNew('password', 'confirmPassword')
    })  
    this.getStateList();
    this.getSportList();
    this.urlfieldData = this.encryptionService.decryptionAES(this.route.snapshot.paramMap.get('fieldVal'));
    this.urlTypeData = this.encryptionService.decryptionAES(this.route.snapshot.paramMap.get('Type'));
    console.log('routedata',this.urlfieldData,this.urlTypeData)
    if(this.urlTypeData == 1){
      this.mobileFieldDisabled = true
      this.generateNsrsIdForm.controls['academyPhoneNo'].setValue(this.urlfieldData)
    }else{
      this.generateNsrsIdForm.controls['academyEmail'].setValue(this.urlfieldData)
      this.emailFieldDisabled = true
    }
  }

  getStateList(){
  this.stateList$ =   this.registrationService.StateList().pipe(takeUntil(this.subject), map(res=>{
      this.stateListData = res
      //console.log(this.stateListData)
      return true
    }))
  }
  getSportList(){
   this.SportList$ = this.registrationService.SportList().pipe(takeUntil(this.subject),map(res=>{
    //console.log(res)
    this.SportListData = res;
    return true
  }))
  
  }

  academyDiscipline = new FormControl('',[Validators.required]);
  
  get f(){
    return this.generateNsrsIdForm.controls;
  }

  handleYearSelected(event:Moment,yearEstablish: MatDatepicker<Moment>) {
    // console.log(event.toDate().getFullYear())
    this.yearOfEstablishment = event.toDate().getFullYear()
    this.generateNsrsIdForm.controls['academyYearofEstablish'].setValue(event)
    if (yearEstablish.opened) {
      yearEstablish.close();
    }
  }
  
  generateNsrsId(){
    console.log(this.generateNsrsIdForm)
    let name = this.generateNsrsIdForm.value.nameofAcademy
    let email = this.generateNsrsIdForm.value.academyEmail
    let mobile = this.generateNsrsIdForm.value.academyPhoneNo
    let stateId = this.generateNsrsIdForm.value.academyState
    let EstablishmentYear = this.yearOfEstablishment
    let password = this.generateNsrsIdForm.value.password
    let sportId = (this.generateNsrsIdForm.value.academyDiscipline).toString()
    console.log(this.generateNsrsIdForm.value)
    console.log(this.generateNsrsIdForm.controls['academyYearofEstablish'].value)
    if(this.generateNsrsIdForm.valid){
      this.loader = true
      this.registrationService.AcademyRegisteration(name,email,mobile,stateId,EstablishmentYear,this.encryptionService.encryptionAES(password),sportId).subscribe({
        next:(res)=>{
          this.loader = false
          console.log(res)
          if(res){
            Swal.fire({
              confirmButtonText:'Click here to continue',
              customClass:{
                container: 'swal2-htmlcontainer-academysignin',
                htmlContainer: 'htmlcontainer-academysignin',
                popup: 'swal2-show-academysignin',
              },
              html:'<h3>NSRS ID Generated</h3>' +
              '<p>Notification has been sent to your registered email id and Mobile Number. You can Login using your email id or NSRSID and selected Password</p>' +
              `<p class="mb-0">
              <table>
              <tr>
              <td><strong>User Name :</strong></td>
              <td>${email}</td>
              </tr>
              <tr>
              <td><strong>NSRS ID (Identification Number) : </strong></td>
              <td>${res}</td>
              </tr>
              </table
              </p>`
            }).then(resultthen=>{
              if(resultthen.isConfirmed){
                this.loader = true
                  localStorage.clear()
                    this.authenticationService.login(
                    res,this.encryptionService.encryptionAES(password),'username'
                    ).subscribe({
                      next:data=>{
                      this.loader = false
                      if(data.length == 1 && data[0].isPasswordValidated == false){
                        this.alertService.swalPopErrorTimer("You have entered wrong Password")
                        setInterval(()=>{
                          window.location.reload();
                        },1500)
                      }else if(data.length == 0){
                        this.alertService.swalPopErrorTimer("You have entered wrong Username")
                        setInterval(()=>{
                          window.location.reload();
                        },1500)
                      }else if(data.length == 1 && data[0].isPasswordValidated == true){
                        localStorage.clear()
                        localStorage.setItem('token', JSON.stringify(data[0].token));
                        localStorage.setItem('loginUserdata', JSON.stringify(data));
                        this.loader = true
                        this.authenticationService.generateSessionData(data[0].role_id,data[0].user_id).subscribe({
                          next:(res:any)=>{
                            this.loader = false
                            localStorage.setItem('sessiondata', JSON.stringify(res));
                            // this.router.navigate(['/sdo-dashboard'])
                            this.router.navigate([`/${res.userData.dashboard}`])
                          },
                          error:()=>{
                              this.loader = false
                              console.error('error caught in generateSessionData')
                            }
                          })
                      } 
                    },
                    error:()=>{
                      console.error('error caught in Login')
                      this.loader = false;
                    }
                  })

                //this.router.navigate(['/academy-dashboard'])
              }        
            })
          }else{}
        },
        error:()=>{
          this.loader = false
          console.error('error caught in getting AcademyRegisteration')
        }
      })      
    }else{
      this.generateNsrsIdForm.markAllAsTouched()
    }
  }
  ngOnDestroy(){
    this.subject.unsubscribe()
  }
}


