import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { first } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { CampAdminService } from "src/app/_common/services/camp-services/camp-admin.service";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { CommonSharableService } from "src/app/_common/services/common-services/commonSharable.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { SharableService } from "src/app/_common/services/innerPagesServices/innerpagesSharable.service";
import { ManageUserService } from "src/app/_common/services/superuser-services/manage-user.service";
import { ConfirmedValidatorNew } from "src/app/outer-pages/forgot-password/confirmedValidator";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-add-assesment-camp',
    templateUrl:'./add-assesment-camp.component.html',
    styleUrls:['./add-assesment-camp.component.css'],
    standalone:true,
    imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent],
    providers:[
      {provide:DateAdapter,useClass:MomentDateAdapter, deps:[MAT_DATE_LOCALE]},
      {provide:MAT_DATE_FORMATS,useValue:MY_DATE_FORMATS},
      DatePipe
    ]
})
export class AddAssesmentCampComponent implements OnInit{
    campForm!:FormGroup;
    passwordhide = true;
    confirmPasswordhide = true;
    passwordPattern:string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$";
    loader:boolean = false;
    loaderDiscipline:boolean = false;
    loaderState:boolean = false;
    sportListData:any;
    stateListData:any;
    districtListData:any;
    pincodeListData:any;
    campType:any;
    userDetail:any

    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,private sharableService:SharableService,
      private commonSharableService:CommonSharableService,private alertService:AlertService,
      private campAdminService:CampAdminService,private datePipe:DatePipe,private storageService:StorageService,
      private manageUserService:ManageUserService){}
    ngOnInit(): void {
        //console.log(this.campType)
        this.userDetail = this.storageService.getUserDetails();
        this.getSportList();
        this.getStateList();
        this.campForm = this.fb.group({
            camp_name:['', Validators.required],
            from_date:['', Validators.required],
            to_date:['', Validators.required],
            sport_display_name:['', Validators.required],
            state:['', Validators.required],
            district:['', Validators.required],
            pincode:['', Validators.required],
            venue:['', Validators.required],
            userName:['', Validators.required],
            password:['',[Validators.required,Validators.pattern(this.passwordPattern)]],
            confirm_password:['',[Validators.required,Validators.pattern(this.passwordPattern)]],
            mob_no:['',[Validators.required,Validators.pattern('^[0-9]*$'), Validators.minLength(10)]],
            email:['',[Validators.required,Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]]
        },
        {
            validator:ConfirmedValidatorNew('password', 'confirm_password')
        }
        )
    }
    getSportList(){
        this.loaderDiscipline = true;
        this.sharableService.sportList().pipe(first()).subscribe({
          next:(response)=>{
            this.loaderDiscipline = false
            this.sportListData = response;
          },
          error:(err)=>{
            this.loaderDiscipline = false;
            console.error(err)
          }
        })
    }
    getStateList(){
        this.loaderState = true;
        this.commonSharableService.stateMasterList(1).pipe(first()).subscribe({
          next:(response)=>{
            this.loaderState = false;
            this.stateListData = response;
          },
          error:(err)=>{
            this.loaderState = false;
            console.error(err);
          }
        })
    }
    getDistrictList(stateVal:number){
        this.loaderState = true;
        this.commonSharableService.districtMasterList(stateVal).subscribe({
          next:(response)=>{
            this.loaderState = false;
            this.districtListData = response;
          },
          error:(err)=>{
            this.loaderState = false;
            console.error(err);
          }
        })
    }
    getPincode(districtVal:number){
        this.loaderState = true;
        this.commonSharableService.pincodeMasterList(districtVal).subscribe({
          next:(response)=>{
            this.loaderState = false;
            this.pincodeListData = response;
          },
          error:(err)=>{
            this.loaderState = false;
            console.error(err);
          }
        })
    }
    changeStartDate(event:any){
      // console.log(event.target.value)
      this.campForm.get('to_date')?.reset(null)
    }
    onChangeState(event:any){
      this.campForm.get('district')?.reset('')
      this.campForm.get('pincode')?.reset('');
      this.pincodeListData = []
      this.getDistrictList(event)
    }
    onChangeDistrict(event:any){
      this.campForm.get('pincode')?.reset('');
      this.pincodeListData = []
      this.getPincode(event)
    }
    checkState(stateVal:any){
      if(stateVal == ''){
        this.alertService.swalPopWarning('Please Select State!')
      }
    }
    checkDidtrict(districtVal:any){
      if(districtVal == ''){
        this.alertService.swalPopWarning('Please Select District!')
      }
    }

    checkUser(event:any){
      // console.log(event.target.value)
      if(event.target.value){
        this.loader =true;
      this.manageUserService.isAlreadyExistCheck(event.target.value,3).subscribe({
        next:(response)=>{
          this.loader =false;
          //console.log(response);
          if(response){
            this.alertService.swalPopWarning(` ${event.target.value} user already exists`)
            this.campForm.get('userName')?.reset('')
          }
        },
        error:(err)=>{
          this.loader =false;
          console.error(err)
        }
      })
      }
    }

  save(){
    if(this.campForm.valid){
      console.log(this.campForm.value)
      const type = '';
      this.loader = true
      this.campAdminService.SaveCampDetails(this.campForm.value.camp_name,this.campForm.value.sport_display_name,
      this.datePipe.transform(this.campForm.value.from_date,'yyyy-MM-dd'),
      this.datePipe.transform(this.campForm.value.to_date,'yyyy-MM-dd'),this.campForm.value.venue,
      this.campForm.value.pincode.toString(),this.campForm.value.state,this.campForm.value.district,this.campForm.value.mob_no,this.campForm.value.email,this.userDetail.user_id,type, this.campType,
      this.campForm.value.userName,this.campForm.value.password).subscribe({
        next:(response)=>{
          if(response){
            this.activeModal.close(true);
            this.alertService.swalPopSuccess('Save Successfully!')
          }
        },
        error:(err)=>{
          this.loader = false;
          console.error(err)
        }
      })
    }else{
      this.campForm.markAllAsTouched();
    }
  }
}
