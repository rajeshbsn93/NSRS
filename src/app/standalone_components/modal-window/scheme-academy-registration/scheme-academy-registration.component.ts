import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Moment } from "moment";
import { Observable, first, map } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { SharableService } from "src/app/_common/services/innerPagesServices/innerpagesSharable.service";
import { ConfirmedValidatorNew } from "src/app/outer-pages/forgot-password/confirmedValidator";
import { LoaderComponent } from "../../loader/loader.component";
import { YearFormatDirective } from "../../directives/year-format.directive";
import { CommonMobileEmailService } from "src/app/_common/services/role-inner-pages-services/common-role-services/common-mobile-email.service";
import Swal from "sweetalert2";
import { SchemeAcademyRegistrationService } from "src/app/_common/services/innerPagesServices/scheme-academy-registration.service";
import { EncryptionService } from "src/app/_common/services/innerPagesServices/encryption.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";

@Component({
    selector:'app-scheme-academy-registration',
    templateUrl:'./scheme-academy-registration.component.html',
    styleUrls:['./scheme-academy-registration.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,ReactiveFormsModule, LoaderComponent,YearFormatDirective]
})

export class SchemeAcademyRegistrationComponent implements OnInit{
    academyRegForm!:FormGroup;
    passwordPattern:string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$";
    yearOfEstablishment:any;
    passwordhide:Boolean=true;
    confirmPasswordhide:Boolean=true;
    SportList$:Observable<any> = new Observable();
    stateList:any;
    filteredStateList$!: Observable<any>;
    loader:boolean = false;
    academyRoleValue!:any;
    userDetails:any
    addSateId:any

    constructor(public activeModal:NgbActiveModal, private formBuilder:FormBuilder,
        private innerSharableService:SharableService,
        private commmonEmailMobileService:CommonMobileEmailService,
        private schemeRegService:SchemeAcademyRegistrationService,
        private encryptionService:EncryptionService,
        private storageService:StorageService){}

    ngOnInit(): void {
        this.userDetails = this.storageService.getUserDetails()
        this.loader =true
        this.innerSharableService.stateList().pipe(first()).subscribe({
            next:(response:any)=>{
                this.loader = false
                if(this.userDetails.role_id == 1005){
                    this.stateList = response.filter((item:any)=>item.apI_State_id == this.addSateId)
                }else{
                    this.stateList = response;
                }
                
                this.academyRegForm.get('stateId')?.updateValueAndValidity();
            },
            error:(err)=>{
                this.loader = false;
                console.error(err)
            }
        });
        this.academyRegForm=this.formBuilder.group({
            username:['',[Validators.required]],
            user_display_name:['',[Validators.required]],
            email:['',[Validators.required,Validators.email]],
            mobile:['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            stateId:['',[Validators.required, this.stateValidator.bind(this)]],
            yearOfEstablishment:['',[Validators.required]],      
            password:['',Validators.compose([Validators.required,Validators.pattern(this.passwordPattern)])],
            confirmPassword:['',Validators.compose([Validators.required,Validators.pattern(this.passwordPattern)])],
            sportId:this.sportId,
          },{
            validator:ConfirmedValidatorNew('password', 'confirmPassword')
          });
          this.getSportList();
          this.filteredStateList$ = this.academyRegForm.get('stateId')!.valueChanges.pipe(map(value => this._stateFilter(value || '')));
    }
    sportId = new FormControl('',[Validators.required]);

    getSportList(){
        this.SportList$ = this.innerSharableService.sportList();       
    }
    get f(){
        return this.academyRegForm.controls;
    }
    handleYearSelected(event:Moment,yearEstablish: MatDatepicker<Moment>) {
        // console.log(event.toDate().getFullYear())
        this.yearOfEstablishment = event.toDate().getFullYear()
        this.academyRegForm.controls['yearOfEstablishment'].setValue(event)
        if (yearEstablish.opened) {
            yearEstablish.close();
        }
    }
    private _stateFilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.stateList.filter((item: any) => item.state_name.toLowerCase().includes(filterValue));
    }

    private stateValidator(control: AbstractControl): ValidationErrors | null {
        return control.value && !this.stateList.some((item: any) => item.state_name === control.value)
        ? {state: true}
        : null;
    }
    checkIsAlreadyExistCheck(event:any,type:number,controlName:string){
        if(event.target.value != '' && this.academyRegForm.get(controlName)?.valid){ 
            // console.log(event.target.value,type,controlName)
            const userId  = 0;
            const roleId  = 0;
            this.commmonEmailMobileService.checkMobileEmail(event.target.value,type,userId,roleId).subscribe({
                next:async (response)=>{
                    if(response){
                        let textMsg = ''
                        switch(type) {
                            case 1 : textMsg = 'Mobile Number Already Exist';
                            break;
                            case 2 : textMsg = 'Email Already Exist';
                            break;
                            case 3 : textMsg = 'User Name Already Exist';
                            break;                            
                        }
                        const swalRef = await this.swalAlert(textMsg,'warning')
                        if(swalRef.isConfirmed){
                            this.academyRegForm.get(controlName)?.reset()
                        }
                    }
                },
                error:(err)=>{
                    console.error(err)
                }
            })
        }
    }

    swalAlert(textMsg:string,iconText:any){
        return Swal.fire({
            position: 'center',
            icon: iconText,
            text: textMsg,
            showConfirmButton:true
        })
    }


    registrationSave(){
        let mappedUser = this.userDetails?.user_id;
        if(this.academyRegForm.valid){
            let state_Id = this.stateList.filter((item:any)=>item?.state_name === this.academyRegForm.value?.stateId)?.[0]?.state_id;
            let enc_email = '';
            let sportId = this.academyRegForm.value.sportId?.toString();
            let academyRole = Number(this.academyRoleValue?.scheme_id);
            let mobile_number = (this.academyRegForm.value.mobile).toString();  
            this.loader= true;
            this.schemeRegService.schemeAcademyRegistration(
                this.academyRegForm.value.user_display_name, this.academyRegForm.value.email, enc_email,
                mobile_number, state_Id, this.yearOfEstablishment,
                this.encryptionService.encryptionAES(this.academyRegForm.value.password), sportId ,academyRole, this.academyRegForm.value.username,
                mappedUser
            ).subscribe({
                next:(response:any)=>{
                    this.loader = false;
                    if(response.nsrsId !=''){
                        this.activeModal.close(true);
                        let messageText  = `${this.academyRoleValue.scheme_name} Scheme Academy Has Been Successfully Registered With NSRSID ${response?.nsrsId}` 
                        this.swalAlert(messageText,'success');
                    }else{
                        this.swalAlert(response?.msg,'error');
                    }
                },
                error:(err)=>{
                    this.loader = false;
                }
            })
        }else{
            this.academyRegForm.markAllAsTouched();
        }
    }

    
}