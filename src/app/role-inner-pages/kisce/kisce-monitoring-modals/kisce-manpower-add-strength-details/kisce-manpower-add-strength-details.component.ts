import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';

@Component({
  selector: 'app-kisce-manpower-add-strength-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './kisce-manpower-add-strength-details.component.html',
  styleUrls: ['./kisce-manpower-add-strength-details.component.css']
})
export class KisceManpowerAddStrengthDetailsComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
    private _fb: FormBuilder,
    private _alert: AlertService,
    public _equimentProcurementService: EquipmentProcurementService,
    private _storageService: StorageService,) { }


  manpowerStrengthUpdateModalViewData: any
  strengthForm!: FormGroup
  userDetails!: IUserDetails
  academyId!: number


  ngOnInit(): void {
    this.userDetails = this._storageService.getUserDetails()
    console.log('updated values', this.manpowerStrengthUpdateModalViewData);
    console.log('academyID', this.academyId);

    this.updateform()
  }

  updateform() {
    this.strengthForm = this._fb.group({
      designation_id: [this.manpowerStrengthUpdateModalViewData.id || 0],
      academy_detail_id: [this.academyId || 0],
      user_id: [this.userDetails.user_id || 0],
      roll_id: [this.userDetails.role_id || 0],
      designation: [{ value: this.manpowerStrengthUpdateModalViewData.designation, disabled: true }, Validators.required],
      sanctioned_Strength: [this.manpowerStrengthUpdateModalViewData.sanctioned_Strength, [Validators.required, Validators.min(0), Validators.max(1000)]],
      currentStength: [{ value: this.manpowerStrengthUpdateModalViewData.current_Strength, disabled: true }, Validators.required],
      scheme_Roll_Id: [80]
    });
  }


  updateStrength() {
    console.log(this.strengthForm.value);
    if (this.strengthForm.valid) {
      const formdataValue = this.strengthForm.getRawValue();
      delete formdataValue.currentStength;
      delete formdataValue.designation;
      console.log(formdataValue);
      
      this._equimentProcurementService.updateKisceManpowerStrengthDetails(formdataValue).subscribe({
        next: (res: any) => {
          if (res.value == true) {
            this._alert.swalPopSuccess('Details updated successfully!');
            this.activeModal.close(res.value);
          } else {
            this._alert.swalPopError('something went wrong!')
          }

        },
        error: (err) => {
          console.log(err);
        }
      })

    } else {
      this.strengthForm.markAllAsTouched();
      this._alert.swalPopError('please fill valid input');
    }
  }

}
