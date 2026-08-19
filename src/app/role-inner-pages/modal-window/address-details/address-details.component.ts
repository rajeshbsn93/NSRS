import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { Enable_disableFormService } from 'src/app/_common/services/common-services/enable_disableForm.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { ProfileService } from 'src/app/_common/services/role-inner-pages-services/academy-services/profile.service';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.css'],
  standalone:true,
  imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent]
})
export class AddressDetailsComponent implements OnInit, OnDestroy {

  addressForm!:FormGroup;
  academyDetails:any;
  academyAddressData:any;
  readonlyEdit:boolean=true;
  stateListData:any;
  districtListData:any;
  blockListData:any;
  pincodeListData:any;
  mainLoader:boolean=false;
  mainLoaderState:boolean=false;
 private unSubscription:Subscription | undefined ;

  constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,private storageService:StorageService,private profileService:ProfileService,
    private alertService:AlertService, private enableDisableService:Enable_disableFormService) { }

  ngOnInit() {
    this.academyDetails=this.storageService.getAcademyDetails()
    //console.log('academyDetails',this.academyDetails)
    this.addressReactiveFormControl();
    this.setaddressReactiveForm();
    this.getStateList()
  }

  addressReactiveFormControl(){
  this.addressForm =   this.fb.group({
    address_name:['', Validators.required],
    address_line1:['',Validators.required],
      address_street:['',Validators.required],
      address_landmark:['',Validators.required],
      address_area:['',Validators.required],
      address_state_id:['',Validators.required],
      address_district_id:['',Validators.required],
      address_block_id:['',Validators.required],
      // address_city_id:[''],
      address_pincode_id:['',[Validators.maxLength(6),Validators.required]],
      contact_person_name:['',Validators.required],
      contact_person_designation:['',Validators.required],
      email_id:['',[Validators.email,Validators.required]],
      mobile_number:['',Validators.required],
      contact_person_alt_mobile_no:[''],
    },
    {
      validators: ConfirmedValidatorMobile('mobile_number','contact_person_alt_mobile_no')
    }
    )
  }

  setaddressReactiveForm(){
    this.mainLoader = true;
   this.unSubscription = this.profileService.getAcademyAddress(this.academyDetails.user_id).subscribe({
      next:(res)=>{
        this.mainLoader = false;
        this.academyAddressData = res;
        //console.log(res,this.academyAddressData.address_state_id);
        this.getDistrictList(this.academyAddressData.address_state_id)
        this.getBlockList(this.academyAddressData.address_district_id)
        this.getPincodeList(this.academyAddressData.address_district_id)
        this.addressForm.controls['address_name'].setValue(this.academyAddressData.address_name)
        this.addressForm.controls['address_line1'].setValue(this.academyAddressData.address_line1)
        this.addressForm.controls['address_street'].setValue(this.academyAddressData.address_street)
        this.addressForm.controls['address_landmark'].setValue(this.academyAddressData.address_landmark)
        this.addressForm.controls['address_area'].setValue(this.academyAddressData.address_area)
        this.addressForm.controls['address_state_id'].setValue(this.academyAddressData.address_state_id)
        this.addressForm.controls['address_district_id'].setValue(this.academyAddressData.address_district_id)
        this.addressForm.controls['address_block_id'].setValue(this.academyAddressData.address_block_id)
        // this.addressForm.controls['address_city_id'].setValue(this.academyAddressData.address_city_id)
        this.addressForm.controls['address_pincode_id'].setValue(this.academyAddressData.address_pincode_id)
        this.addressForm.controls['contact_person_name'].setValue(this.academyAddressData.contact_person_name)
        this.addressForm.controls['contact_person_designation'].setValue(this.academyAddressData.contact_person_designation)
        this.addressForm.controls['email_id'].setValue(this.academyAddressData.email_id)
        this.addressForm.controls['mobile_number'].setValue(this.academyAddressData.mobile_number)
        this.addressForm.controls['contact_person_alt_mobile_no'].setValue(this.academyAddressData.contact_person_alt_mobile_no)
        this.enableDisableService.DisableField(this.addressForm,'address_name',true);
        this.enableDisableService.DisableField(this.addressForm,'address_line1',true);
        this.enableDisableService.DisableField(this.addressForm,'address_street',true);
        this.enableDisableService.DisableField(this.addressForm,'address_landmark',true);
        this.enableDisableService.DisableField(this.addressForm,'address_area',true);
        this.enableDisableService.DisableField(this.addressForm,'address_state_id',true);
        this.enableDisableService.DisableField(this.addressForm,'address_district_id',true);
        // this.DisableField('address_city_id',true);
        this.enableDisableService.DisableField(this.addressForm,'address_block_id',true);
        this.enableDisableService.DisableField(this.addressForm,'address_pincode_id',true);
        this.enableDisableService.DisableField(this.addressForm,'contact_person_name',true);
        this.enableDisableService.DisableField(this.addressForm,'contact_person_designation',true);
        this.enableDisableService.DisableField(this.addressForm,'email_id',true);
        this.enableDisableService.DisableField(this.addressForm,'mobile_number',true);
        this.enableDisableService.DisableField(this.addressForm,'contact_person_alt_mobile_no',true);
      },
      error:()=>{
        this.mainLoader = false
        console.error('error caught in getting academy address')
      }
    })
  }

  editButton(){
    this.readonlyEdit = !this.readonlyEdit
     this.enableDisableService.enableField(this.addressForm,'address_name',true);
     this.enableDisableService.enableField(this.addressForm,'address_line1',true);
     this.enableDisableService.enableField(this.addressForm,'address_street',true);
     this.enableDisableService.enableField(this.addressForm,'address_landmark',true);
     this.enableDisableService.enableField(this.addressForm,'address_area',true);
     this.enableDisableService.enableField(this.addressForm,'address_state_id',true);
     this.enableDisableService.enableField(this.addressForm,'address_district_id',true);
    // this.EnableField('address_city_id',true);
     this.enableDisableService.enableField(this.addressForm,'address_block_id',true);
     this.enableDisableService.enableField(this.addressForm,'address_pincode_id',true);
     this.enableDisableService.enableField(this.addressForm,'contact_person_name',true);
     this.enableDisableService.enableField(this.addressForm,'contact_person_designation',true);
     this.enableDisableService.enableField(this.addressForm,'email_id',true);
     this.enableDisableService.enableField(this.addressForm,'mobile_number',true);
     this.enableDisableService.enableField(this.addressForm,'contact_person_alt_mobile_no',true);
  }

  getStateList(){
    this.mainLoaderState = true
   this.unSubscription = this.profileService.StateMasterList().subscribe({
      next:(res)=>{
        this.mainLoaderState = false;
        this.stateListData = res;
        //console.log(res)
      },
      error:()=>{
        this.mainLoaderState = false
        console.error('error caught in getting state')
      }
    })
  }
  onChangeState(event:any){  
    //console.log(event) 
    this.addressForm.controls['address_district_id'].reset()
    this.addressForm.controls['address_block_id'].reset()
    this.addressForm.controls['address_pincode_id'].reset()
    this.blockListData = [];
    this.pincodeListData = [];
    this.getDistrictList(event)
  }
  
  getDistrictList(state_id:any){
    this.mainLoader = true
  this.unSubscription =  this.profileService.DistrictMasterList(state_id).subscribe({
      next:(res)=>{
        this.mainLoader = false
        this.districtListData = res;
        //console.log(res)
      },
      error:()=>{
        console.error('error caught in getting city')
      }
    })
  }
  onChangeDistrict(event:any){  
    //console.log(event) 
    this.addressForm.controls['address_block_id'].reset()
    this.addressForm.controls['address_pincode_id'].reset()
    this.getBlockList(event)
    this.getPincodeList(event)
  }
  getBlockList(districtId:any){
    if(districtId !=null){
      this.mainLoaderState = true
  this.unSubscription =  this.profileService.BlockMasterList(districtId).subscribe({
      next:(res)=>{
        this.mainLoaderState = false
        this.blockListData = res;
        //console.log(res)
      },
      error:()=>{
        this.mainLoaderState = false
        console.error('error caught in getting city')
      }
    })
    }else{
      return
    }
  }
  getPincodeList(districtId:any){
    if(districtId !=null){
      this.mainLoader = true
      this.unSubscription =  this.profileService.PincodeMasterList(districtId).subscribe({
          next:(res)=>{
            this.mainLoader = false
            this.pincodeListData = res;
            //console.log(res)
          },
          error:()=>{
            this.mainLoader = false
            console.error('error caught in getting city')
          }
        })
    }else{
      return
    }
  }

  get f(){
    return this.addressForm.controls
  }

  saveAcademyAddress(){
    const addressFormObj = this.addressForm.value
    addressFormObj.academy_detail_id = this.academyDetails.user_id
    //console.log(addressFormObj)
    //delete addressFormObj.address_name
    if(this.addressForm.valid){
    this.mainLoader = true
      this.unSubscription =   this.profileService.UpdateAcademyAddress(addressFormObj).subscribe({
          next:(res)=>{
            this.mainLoader = false;
            if(res === true){
              let msg = 'Record Updated Successfully!';
              this.alertService.swalPopSuccess(msg);
              this.activeModal.close();
              this.readonlyEdit = !this.readonlyEdit;
              this.addressForm.disable();
            }
          },
          error:()=>{
            this.mainLoader = false;
            this.alertService.swalPopError('Record Updation Failed!');
            console.error('error caught in update academy address');
          }
        })
      }else{
        this.addressForm.markAllAsTouched()
      }
  }

  ngOnDestroy(): void {
    this.unSubscription?.unsubscribe();
   }

}

export function ConfirmedValidatorMobile(mobile:any, alternate_mobile: any):ValidatorFn{

  return (control:AbstractControl):ValidationErrors | null => {
      const mobile_number = control.get(mobile)?.value
      const mob_alternet = control.get(alternate_mobile)?.value
      
      if(mobile_number == mob_alternet && mob_alternet == mobile_number){
          return { "Matched" : true}
      }
      return null
  }

}
