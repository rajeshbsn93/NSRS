import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { first } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { AthletePbifService } from "src/app/_common/services/common-services/athlete-pbif.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CommonSportsKittingService } from "src/app/_common/services/role-inner-pages-services/common-role-services/common-sports-kitting.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
selector:'app-common-sport-kitting-details',
templateUrl:'./common-sport-kitting-details.component.html',
styleUrls:['./common-sport-kitting-details.component.css'],
standalone:true,
imports:[CommonModule, MaterialModule, ReactiveFormsModule, LoaderComponent]
})
export class CommonSportKittingDetailsComponent implements OnInit{
  readonlyEdit:boolean = true;
  kittingDetailsForm!:FormGroup;
  userDetails:any;
  loader:boolean = false;
  shoesListData:any
  blazerListData:any;
  tshirtListData:any;
  pantListData:any;
  loaderShoesSize:boolean = false;
  loaderblazerSize:boolean = false;
  loadertshirtSize:boolean = false;
  loaderpaintSize:boolean = false;
  isOfficialModal = false;
  isAtheltePBIF:boolean = false

  constructor(
    public activeModal:NgbActiveModal,private formBuilder:FormBuilder,
    private storageService:StorageService,
    private commonSportKittingService:CommonSportsKittingService,
    private alertService:AlertService,
    private athletepbfiService:AthletePbifService
  ) {}

  ngOnInit(): void {
    this.userDetails=this.storageService.getUserDetails()
      this.basicDetailsReactiveForm();
      this.getShoeList();
      this.getBlazerSize();
      this.getTshirtSize();
      this.getPantSize();
      this.setFormValues();
      if(this.userDetails.role_id===1)this.getAthletePbif();
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

  basicDetailsReactiveForm(){
    this.kittingDetailsForm=this.formBuilder.group({
      shoe_size:[null],
      blazer_size:[''],
      tshirt_size:[''],
      pant_size:[''],
      // kitting_updated_date:[null],
    })
  }

  setFormValues() {
    this.loader = true;
    this.commonSportKittingService[
      this.isOfficialModal 
        ? 'getOfficialKittingInfo'
        : 'getAthleteKittingInfo'
      ](this.userDetails.user_id).subscribe({
        next:(response:any)=>{
          this.loader=false;
          if(response?.shoe_size ==null) this.kittingDetailsForm.controls['shoe_size'].setValue(0);
          this.kittingDetailsForm.disable();
          if(response !=null){
            if(response?.shoe_size !=null) this.kittingDetailsForm.controls['shoe_size'].setValue((response?.shoe_size).toString())            
            this.kittingDetailsForm.controls['blazer_size'].setValue(response?.blazer_size)
            this.kittingDetailsForm.controls['tshirt_size'].setValue(response?.tshirt_size)
            this.kittingDetailsForm.controls['pant_size'].setValue(response?.pant_size);              
          }
        },
        error:()=>{
          this.loader = false
          console.error('Error Caught in KittingInfo API')
        }
      });
    
  }

  getShoeList(){
    this.loaderShoesSize = true
    this.commonSportKittingService.shoesSize().pipe(first()).subscribe({
      next:(response)=>{
        this.shoesListData = response;
        this.loaderShoesSize = false
      },
      error:()=>{
        console.error('Caught in get GetShoeList');
        this.loaderShoesSize = false
      }
    })
  }

  getBlazerSize(){
    this.loaderblazerSize = true
    this.commonSportKittingService.blazerTshirtSize().pipe(first()).subscribe({
      next:(response)=>{
        this.blazerListData = response;
          this.loaderblazerSize = false;
      },
      error:()=>{
        console.error('Caught in get Get_Blazer_Shirt_Size');
        this.loaderblazerSize= false;
      }
    })
  }

  getTshirtSize(){
    this.loadertshirtSize = true;
    this.commonSportKittingService.blazerTshirtSize().pipe(first()).subscribe({
      next:(response)=>{
        this.tshirtListData = response;
        this.loadertshirtSize = false;
      },
      error:()=>{
        console.error('Caught in get Get_Blazer_Shirt_Size');
        this.loadertshirtSize = false;
      }
    })
  }

  getPantSize(){
    this.loaderpaintSize = true;
    this.commonSportKittingService.pantSize().pipe(first()).subscribe({
      next:(response)=>{
        this.pantListData = response;
        this.loaderpaintSize = false;
      },
      error:()=>{
        console.error('Caught in get GetPantSize');
        this.loaderpaintSize = false;
      }
    })
  }

  editButton(){
    if(this.isAtheltePBIF){
      this.alertService.swalPopWarning('PBIF form is already filled!')
    }else{
      this.kittingDetailsForm.enable()
      this.readonlyEdit = !this.readonlyEdit
    }
  }

  save(){
    if(this.kittingDetailsForm.valid) {
      this.kittingDetailsForm.value[this.isOfficialModal ? 'official_detail_id' : 'player_detail_id'] = this.userDetails.user_id;
      this.commonSportKittingService[
        this.isOfficialModal
        ? 'saveOfficialKittingInfo'
        : 'saveAthleteKittingInfo'
      ](this.kittingDetailsForm.value).subscribe({
        next:(response: boolean) => {
          if (response) {
            this.readonlyEdit = !this.readonlyEdit;
            this.alertService.swalPopSuccess('Sports & Kitting Details Saved Successfully!');
            this.activeModal.close();
          } else {
            this.alertService.swalPopError('Something went wrong! Please try again.');
          }
        },
        error:() => {
          this.alertService.swalPopError('Something went wrong! Please try again.');
          console.error('Error Caught in SaveKittingInfo API')
        }
      })
      //this.activeModal.close()
    }else{
      this.kittingDetailsForm.markAllAsTouched()
    }
  }
}