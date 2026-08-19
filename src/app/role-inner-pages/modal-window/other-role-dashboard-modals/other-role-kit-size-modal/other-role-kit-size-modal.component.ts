import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { Enable_disableFormService } from "src/app/_common/services/common-services/enable_disableForm.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { OtherRoleService } from "src/app/_common/services/other-role-service/other-role.service";
import { AthleteDashboardService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-dashboard.service";
import { CommonSportsKittingService } from "src/app/_common/services/role-inner-pages-services/common-role-services/common-sports-kitting.service";
import { SideBarNavStateService } from "src/app/_common/sidebar.state";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
selector:'app-other-role-kit-size-modal',
templateUrl:'./other-role-kit-size-modal.component.html',
styleUrls:['./other-role-kit-size-modal.component.css'],
standalone:true,
imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
providers: [
  {provide: DateAdapter, useClass: MomentDateAdapter},
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  DatePipe
],
})
export class OtherRoleKitSizeModalComponent implements OnInit{
    readonlyEdit:boolean = true
    kitSizeForm!:FormGroup;
    userDetails:any;
    loader:boolean = false;
    loader2:boolean = false;
    subscription:Subscription = new Subscription();
    blazerShirtList:Array<any> = [];
    paintList:Array<any> = [];


    constructor(
        public activeModal:NgbActiveModal,
        private formBuilder:FormBuilder,
        private enableDisableService:Enable_disableFormService,
        private storageService:StorageService,
        private athleteDashboardService:AthleteDashboardService,
        private alertService:AlertService,
        private _sideBarState:SideBarNavStateService,
        private _commonSportKittingService:CommonSportsKittingService,
        private _otherRoleService:OtherRoleService

      ){}

    ngOnInit(): void {
      this.userDetails=this.storageService.getUserDetails()
      this.getBlazerShirtSize();
      this.getPainttSize();
      this.basicDetailsReactiveForm();
      this.setFormValues()
    }
    getBlazerShirtSize(){
        this.loader = true
        this._commonSportKittingService.blazerTshirtSize().subscribe({
            next:(res:any)=>{
                this.loader = false;
                this.blazerShirtList = res
            },
            error:(err)=>{
                this.loader = false
            }
        })
    }
    getPainttSize(){
        this.loader2 = true
        this._commonSportKittingService.pantSize().subscribe({
            next:(res:any)=>{
                this.loader2 = false;
                this.paintList = res
            },
            error:(err)=>{
                this.loader2 = false
            }
        })
    }
    
    basicDetailsReactiveForm(){
        this.kitSizeForm=this.formBuilder.group({
            Track_Suit_Size:['',[Validators.required]],
            T_shirt_Size:['',[Validators.required]],          
            Pant_Size:['',[Validators.required]],          
        })
      }

      setFormValues(){
        this.loader = true
        this._otherRoleService.getOtherOfficial_KitInfo(this.userDetails.user_id).subscribe({
          next:(response:any)=>{
            this.loader=false
            //console.log(response)
            this.kitSizeForm.controls['Track_Suit_Size'].setValue(response[0]?.blazer_size)
            this.kitSizeForm.controls['T_shirt_Size'].setValue(response[0]?.tshirt_size)
            this.kitSizeForm.controls['Pant_Size'].setValue(response[0]?.pant_size)
            this.kitSizeForm.disable();
          },
          error:()=>{
            this.loader = false
            console.error('Caught in GetAthletePersonalInfo API')
          }
        })
        
      }


      editButton(){
        this.kitSizeForm.enable();
        this.kitSizeForm.updateValueAndValidity();
        this.readonlyEdit = !this.readonlyEdit
      }
      save(){
        //console.log( this.kitSizeForm.valid)
        if(this.kitSizeForm.valid){     
          // console.log(this.kitSizeForm.value);
          const payload = {
            official_detail_id:this.userDetails.user_id,
            blazer_size:this.kitSizeForm.get('Track_Suit_Size')?.value,
            tshirt_size:this.kitSizeForm.get('T_shirt_Size')?.value,
            pant_size:this.kitSizeForm.get('Pant_Size')?.value,
          }
          this._otherRoleService.saveOtherOfficialkitInfo(payload).subscribe({
            next:(response)=>{
              if(response){
                this.readonlyEdit = !this.readonlyEdit;
                this.alertService.swalPopSuccess('Saved Successfully!');
                this.activeModal.close();
              }
            },
            error:()=>{
              console.error('Caught in EditAthletePersonalInfo API')
            }
          })
          //this.activeModal.close()
        }else{
          this.kitSizeForm.markAllAsTouched();
          this.enableDisableService.DisableField(this.kitSizeForm,'gender',true)
        }
      }
}