import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { first, map } from 'rxjs';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { AthletePbifService } from 'src/app/_common/services/common-services/athlete-pbif.service';
import { CommonSharableService } from 'src/app/_common/services/common-services/commonSharable.service';
import { Enable_disableFormService } from 'src/app/_common/services/common-services/enable_disableForm.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AthleteAddressInfoService } from 'src/app/_common/services/role-inner-pages-services/athlete-services/athelete_address-info.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  selector:'app-athlete-communication-address',
  templateUrl:'./athlete-communication-address.component.html',
  styleUrls:['./athlete-communication-address.component.css'],
  standalone:true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, NgbTooltipModule, LoaderComponent]
})

export class AthleteCommunicationAddressComponent implements OnInit{
  communicationAddressForm!: FormGroup;
  userDetails: any;
  stateListDataCommunication: any;
  stateListDataPermanent: any;
  districtListDataCommunication: any;
  districtListDataPermanent: any;
  cityListDataCommunication: any;
  cityListDataPermanent: any;
  blockListDataCommunication: any;
  blockListDataPermanent: any;
  pinCodeListDataCommunication: any;
  pinCodeListDataPermanent: any;
  athleteAddressInfoData: any;
  loader: boolean = false;
  isAtheltePBIF:boolean = false

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private enableDisableService: Enable_disableFormService,
    private storageService: StorageService,
    private athleteAddressService: AthleteAddressInfoService,
    private commonSharableService: CommonSharableService,
    private alertService: AlertService,
    private athletepbfiService:AthletePbifService
  ) {}
  ngOnInit(): void {
    this.userDetails = this.storageService.getUserDetails();
    this.communicationAddressReactiveForm();
    this.getStateCommunication();
    this.getStatePermanent();
    if (this.userDetails.user_id) this.getOfficialAddressInfo();
    this.getAthletePbif();
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
  communicationAddressReactiveForm() {
    this.communicationAddressForm = this.formBuilder.group({
      comm_add_line_1: [null, Validators.required],
      comm_add_line_2: [null, Validators.required],
      comm_state_id: [null, Validators.required],
      comm_add_district_id: [null, Validators.required],
      comm_add_block_id: [null, Validators.required],
      comm_city_id: [null, Validators.required],
      comm_pincode: [null, Validators.required],
      //23/10/23 comm_add_landmark: [null],
      comm_add_landmark: [''],
      perm_comm_add_same: [false],
      perm_add_line_1: [null, Validators.required],
      perm_add_line_2: [null, Validators.required],
      perm_state_id: [null, Validators.required],
      perm_add_district_id: [null, Validators.required],
      perm_add_block_id: [null, Validators.required],
      perm_city_id: [null, Validators.required],
      perm_pincode: [null, Validators.required],
      //23/10/23 perm_add_landmark: [null]
      perm_add_landmark: ['']
    });
    this.communicationAddressForm.disable();
  }
  getOfficialAddressInfo() {
    this.loader = true;
    this.athleteAddressService
      .athleteAddressInfo(this.userDetails.user_id)
      .subscribe({
        next: (response: any) => {
          this.athleteAddressInfoData = response;
          this.communicationAddressForm.controls['comm_add_line_1'].setValue(response.comm_add_line_1);
          this.communicationAddressForm.controls['comm_add_line_2'].setValue(response.comm_add_line_2);
          this.communicationAddressForm.controls['comm_state_id'].setValue(response.comm_state_id);
          this.communicationAddressForm.controls['comm_add_landmark'].setValue(response.comm_add_landmark);
          this.communicationAddressForm.controls['perm_add_line_1'].setValue(response.perm_add_line_1);
          this.communicationAddressForm.controls['perm_add_line_2'].setValue(response.perm_add_line_2);
          this.communicationAddressForm.controls['perm_state_id'].setValue(response.perm_state_id);
          this.communicationAddressForm.controls['perm_add_landmark'].setValue(response.perm_add_landmark);
          if (response.perm_comm_add_same)
            this.communicationAddressForm.controls['perm_comm_add_same'].setValue(response.perm_comm_add_same);
          if (response?.comm_state_id) this.getDistrictCommunication(response.comm_state_id);
          if (response?.comm_state_id) this.getCityCommunication(response.comm_state_id);
          if (response?.perm_state_id) this.getDistrictPermanent(response.perm_state_id);
          if (response?.perm_state_id) this.getCityPermanent(response.perm_state_id);
          this.loader = false;
        },
        error: (err) => {
          this.loader = false;
          this.alertService.swalPopError('Something went wrong!');
          console.error(err);
        },
      });
  }
  getStateCommunication() {
    this.commonSharableService.stateMasterList(1).subscribe({
      next: (response) => {
        this.stateListDataCommunication = response;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getDistrictCommunication(stateId: number) {
    if (!this.communicationAddressForm.dirty)
      this.communicationAddressForm.controls['comm_add_district_id'].setValue(
        Number(this.athleteAddressInfoData?.comm_add_district_id)
      );

    return this.commonSharableService.districtMasterList(stateId).subscribe({
      next: (response) => {
        this.districtListDataCommunication = response;
        if (!this.communicationAddressForm.dirty) {
          this.getBlocktCommunication(Number(this.athleteAddressInfoData?.comm_add_district_id));
          this.getPinCodeCommunication(Number(this.athleteAddressInfoData?.comm_add_district_id));
        }
      },
      error: (err) => {
        console.error(err);
        this.communicationAddressForm.controls['comm_add_district_id'].setValue(null);
      }
    });
  }
  getCityCommunication(stateId: number) {
    if (!this.communicationAddressForm.dirty)
      this.communicationAddressForm.controls['comm_city_id'].setValue(
        Number(this.athleteAddressInfoData?.comm_city_id)
      );

    return this.commonSharableService.cityMasterList(stateId).subscribe({
      next: (response) => {
        this.cityListDataCommunication = response;
      },
      error: (err) => {
        console.error(err);
        this.communicationAddressForm.controls['comm_city_id'].setValue(null);
      }
    });
  }
  getBlocktCommunication(districtId: number) {
    if (!this.communicationAddressForm.dirty)
      this.communicationAddressForm.controls['comm_add_block_id'].setValue(
        Number(this.athleteAddressInfoData?.comm_add_block_id)
      );

    return this.commonSharableService.blockMasterList(districtId).subscribe({
      next: (response) => {
        this.blockListDataCommunication = response;
      },
      error: (err) => {
        console.error(err);
        this.communicationAddressForm.controls['comm_add_block_id'].setValue(null);
      }
    });
  }

  getPinCodeCommunication(districtId: number) {
    if (!this.communicationAddressForm.dirty)
      this.communicationAddressForm.controls['comm_pincode'].setValue(this.athleteAddressInfoData?.comm_pincode);

    return this.commonSharableService.pincodeMasterList(districtId).pipe(map((res: any) => {
      return res.map((item: any) => {
        return {...item, pinCode: item.pinCode?.toString()};
      });
    })).subscribe({
      next: (response) => {
        this.pinCodeListDataCommunication = response;
      },
      error: (err) => {
        console.error(err);
        this.communicationAddressForm.controls['comm_pincode'].setValue(null);
      }
    });
  }

  getStatePermanent() {
    this.commonSharableService.stateMasterList(1).subscribe({
      next: (response) => {
        this.stateListDataPermanent = response;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getDistrictPermanent(stateId: number) {
    if (!stateId) return;
    return this.commonSharableService.districtMasterList(stateId).subscribe({
      next: (response) => {
        this.districtListDataPermanent = response;
        if (this.communicationAddressForm.controls['perm_comm_add_same'].value) {
          this.communicationAddressForm.controls[
            'perm_add_district_id'
          ].setValue(this.communicationAddressForm.controls['comm_add_district_id'].value);
          this.getBlocktPermanent(this.communicationAddressForm.controls['perm_add_district_id'].value);
          this.getPinCodePermanent(this.communicationAddressForm.controls['perm_add_district_id'].value);
        } else {
          if (!this.communicationAddressForm.get('perm_state_id')?.dirty)
            this.communicationAddressForm.controls[
              'perm_add_district_id'
            ].setValue(Number(this.athleteAddressInfoData?.perm_add_district_id));
          if (this.communicationAddressForm.getRawValue().perm_add_district_id) {
            this.getBlocktPermanent(this.communicationAddressForm.getRawValue().perm_add_district_id);
            this.getPinCodePermanent(this.communicationAddressForm.getRawValue().perm_add_district_id);
          }
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getCityPermanent(stateId: number) {
    if (!stateId) return;
    return this.commonSharableService.cityMasterList(stateId).subscribe({
      next: (response) => {
        this.cityListDataPermanent = response;
        if (this.communicationAddressForm.controls['perm_comm_add_same'].value) {
          this.communicationAddressForm.controls['perm_city_id'].setValue(
            this.communicationAddressForm.controls['comm_city_id'].value
          );
        } else if (!this.communicationAddressForm.dirty) {
          this.communicationAddressForm.controls['perm_city_id'].setValue(
            Number(this.athleteAddressInfoData?.perm_city_id)
          );
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getBlocktPermanent(districtId: number) {
    if (!districtId) return;
    return this.commonSharableService.blockMasterList(districtId).subscribe({
      next: (response) => {
        this.blockListDataPermanent = response;
        if (this.communicationAddressForm.controls['perm_comm_add_same'].value) {
          this.communicationAddressForm.controls['perm_add_block_id'].setValue(
            Number(
              this.communicationAddressForm.controls['comm_add_block_id'].value
            )
          );
        } else if (!this.communicationAddressForm.dirty) {
          this.communicationAddressForm.controls['perm_add_block_id'].setValue(
            Number(this.athleteAddressInfoData?.perm_add_block_id)
          );
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getPinCodePermanent(districtId: number) {
    if (!districtId) return;
    return this.commonSharableService.pincodeMasterList(districtId).pipe(map((res: any) => {
      return res.map((item: any) => {
        return {...item, pinCode: item.pinCode?.toString()};
      });
    })).subscribe({
      next: (response) => {
        this.pinCodeListDataPermanent = response;
        if (
          this.communicationAddressForm.controls['perm_comm_add_same'].value
        ) {
          this.communicationAddressForm.controls['perm_pincode'].setValue(
            this.communicationAddressForm.controls['comm_pincode'].value
          );
        } else {
          if (!this.communicationAddressForm.dirty)
            this.communicationAddressForm.controls['perm_pincode'].setValue(this.athleteAddressInfoData?.perm_pincode);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  changeStateComm(event: any) {
    this.communicationAddressForm.markAsDirty();
    this.communicationAddressForm.get('comm_add_district_id')?.setValue(null);
    this.communicationAddressForm.get('comm_city_id')?.setValue(null);
    this.communicationAddressForm.get('comm_add_block_id')?.setValue(null);
    this.communicationAddressForm.get('comm_pincode')?.setValue(null);
    this.cityListDataCommunication = [];
    this.pinCodeListDataCommunication = [];
    this.blockListDataCommunication = [];
    this.getDistrictCommunication(event);
    this.getCityCommunication(event);
    if (this.communicationAddressForm.controls['perm_comm_add_same'].value) {
      this.resetAndEnablePermanentAddressForm();
    }
  }
  changeDistrictComm(event: any) {
    this.communicationAddressForm.markAsDirty();
    this.communicationAddressForm.get('comm_add_block_id')?.setValue(null);
    this.communicationAddressForm.get('comm_city_id')?.setValue(null);
    this.communicationAddressForm.get('comm_pincode')?.setValue(null);
    this.getBlocktCommunication(event);
    this.getPinCodeCommunication(event);
    if (this.communicationAddressForm.controls['perm_comm_add_same'].value) {
      this.resetAndEnablePermanentAddressForm();
    }
  }

  changeBlockComm() {
    if (this.communicationAddressForm.controls['perm_comm_add_same'].value)
      this.resetAndEnablePermanentAddressForm();
  }

  changeCityComm() {
    if (this.communicationAddressForm.controls['perm_comm_add_same'].value)
      this.resetAndEnablePermanentAddressForm();
  }
  
  changePincodeComm() {
    if (this.communicationAddressForm.controls['perm_comm_add_same'].value) 
      this.resetAndEnablePermanentAddressForm();
  }

  changeStatePermanent(event: any) {
    this.communicationAddressForm.markAsDirty();
    this.communicationAddressForm.get('perm_add_district_id')?.setValue(null);
    this.communicationAddressForm.get('perm_city_id')?.setValue(null);
    this.communicationAddressForm.get('perm_add_block_id')?.setValue(null);
    this.communicationAddressForm.get('perm_pincode')?.setValue(null);
    this.cityListDataPermanent = [];
    this.blockListDataPermanent = [];
    this.pinCodeListDataPermanent = [];
    this.getDistrictPermanent(event);
    this.getCityPermanent(event);
  }

  changeDistrictPermanent(event?: any) {
    this.communicationAddressForm.markAsDirty();
    this.communicationAddressForm.get('perm_add_block_id')?.setValue(null);
    this.communicationAddressForm.get('perm_city_id')?.setValue(null);
    this.communicationAddressForm.get('perm_pincode')?.setValue(null);
    this.getBlocktPermanent(event);
    this.getPinCodePermanent(event);
  }

  editButton() {
    if(this.isAtheltePBIF){
      this.alertService.swalPopWarning('PBIF form is already filled!')
    }else{
        this.communicationAddressForm.enable();
        if (this.communicationAddressForm.controls['perm_comm_add_same'].value) {
          this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_add_line_1', true);
          this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_add_line_2', true);
          this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_state_id', true);
          this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_add_district_id', true);
          this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_add_block_id', true);
          this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_city_id', true);
          this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_pincode', true);
          this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_add_landmark', true);
        } else {
          this.enableDisableService.enableField(this.communicationAddressForm, 'perm_add_line_1', true);
          this.enableDisableService.enableField(this.communicationAddressForm, 'perm_add_line_2', true);
          this.enableDisableService.enableField(this.communicationAddressForm, 'perm_state_id', true);
          this.enableDisableService.enableField(this.communicationAddressForm, 'perm_add_district_id', true);
          this.enableDisableService.enableField(this.communicationAddressForm, 'perm_add_block_id', true);
          this.enableDisableService.enableField(this.communicationAddressForm, 'perm_city_id', true);
          this.enableDisableService.enableField(this.communicationAddressForm, 'perm_pincode', true);
          this.enableDisableService.enableField(this.communicationAddressForm, 'perm_add_landmark', true);
        }
      }
  }

  changeSameAs(event: any) {
    if (event.checked) {
      this.communicationAddressForm.controls[
        'perm_add_line_1'
      ].setValue(this.communicationAddressForm.controls['comm_add_line_1'].value);
      this.communicationAddressForm.controls[
        'perm_add_line_2'
      ].setValue(this.communicationAddressForm.controls['comm_add_line_2'].value);
      this.communicationAddressForm.controls[
        'perm_state_id'
      ].setValue(this.communicationAddressForm.controls['comm_state_id'].value);
      this.communicationAddressForm.controls[
        'perm_add_landmark'
      ].setValue(this.communicationAddressForm.controls['comm_add_landmark'].value);
      this.getDistrictPermanent(this.communicationAddressForm.controls['comm_state_id'].value);
      this.getCityPermanent(this.communicationAddressForm.controls['comm_state_id'].value);
      this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_add_line_1', true);
      this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_add_line_2', true);
      this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_state_id', true);
      this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_add_district_id', true);
      this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_add_block_id', true);
      this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_city_id', true);
      this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_pincode', true);
      this.enableDisableService.DisableField(this.communicationAddressForm, 'perm_add_landmark', true);
    } else {
      this.communicationAddressForm.controls['perm_add_line_1'].reset();
      this.communicationAddressForm.controls['perm_add_line_2'].reset();
      this.communicationAddressForm.controls['perm_state_id'].reset();
      this.communicationAddressForm.controls['perm_add_district_id'].reset();
      this.communicationAddressForm.controls['perm_add_block_id'].reset();
      this.communicationAddressForm.controls['perm_pincode'].reset();
      this.communicationAddressForm.controls['perm_city_id'].reset();
      this.communicationAddressForm.controls['perm_add_landmark'].reset('');
      this.enableDisableService.enableField(this.communicationAddressForm, 'perm_add_line_1',true);
      this.enableDisableService.enableField(this.communicationAddressForm, 'perm_add_line_2',true);
      this.enableDisableService.enableField(this.communicationAddressForm, 'perm_state_id',true);
      this.enableDisableService.enableField(this.communicationAddressForm, 'perm_add_district_id',true);
      this.enableDisableService.enableField(this.communicationAddressForm, 'perm_add_block_id',true);
      this.enableDisableService.enableField(this.communicationAddressForm, 'perm_city_id',true);
      this.enableDisableService.enableField(this.communicationAddressForm, 'perm_pincode',true);
      this.enableDisableService.enableField(this.communicationAddressForm, 'perm_add_landmark',true);
      this.communicationAddressForm.updateValueAndValidity();
      this.districtListDataPermanent = [];
      this.blockListDataPermanent = [];
      this.cityListDataPermanent = [];
      this.pinCodeListDataPermanent = [];
    }
  }

  save() {
    if (this.communicationAddressForm.invalid) {
      this.communicationAddressForm.markAllAsTouched();
      this.alertService.swalPopWarning('Invalid fields found! Please check.');
      return;
    }
    this.loader = true;
    this.athleteAddressService.saveAthleteAddressInfo({
      ...this.communicationAddressForm.getRawValue(),
      player_detail_id: this.userDetails.user_id
    }).subscribe({
      next: (response) => {
        this.loader = false;
        if (response) {
          this.alertService.swalPopSuccess('Address Saved Successfully!');
          this.activeModal.close();
        } else {
          this.alertService.swalPopError('Something went wrong! Please try again.');
        }
      },
      error: (err) => {
        this.loader = false;
        this.alertService.swalPopError('Something went wrong! Please try again.');
        console.error(err);
      },
    });
  }

  resetAndEnablePermanentAddressForm() {
    this.communicationAddressForm.get('perm_comm_add_same')?.setValue(false);
    this.communicationAddressForm.get('perm_add_line_1')?.reset();
    this.communicationAddressForm.get('perm_add_line_2')?.reset();
    this.communicationAddressForm.get('perm_state_id')?.reset();
    this.communicationAddressForm.get('perm_add_district_id')?.reset();
    this.communicationAddressForm.get('perm_add_block_id')?.reset();
    this.communicationAddressForm.get('perm_pincode')?.reset();
    this.communicationAddressForm.get('perm_city_id')?.reset();
    this.communicationAddressForm.get('perm_add_landmark')?.reset('');
    this.communicationAddressForm.enable();
    this.districtListDataPermanent = [];
    this.blockListDataPermanent = [];
    this.cityListDataPermanent = [];
    this.pinCodeListDataPermanent = [];
  }

  onHouseOrStreetChange() {
    if (this.communicationAddressForm.controls['perm_comm_add_same'].value) {
      this.communicationAddressForm.get('perm_comm_add_same')?.setValue(false);
      this.communicationAddressForm.enable();
    }
  }
}