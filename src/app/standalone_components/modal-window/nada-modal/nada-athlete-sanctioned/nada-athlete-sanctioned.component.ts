import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { NadaAtheleteListDataEntity, NadaService } from 'src/app/_common/services/nada-service/nada.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  selector: 'app-nada-athlete-sanctioned',
  templateUrl: './nada-athlete-sanctioned.component.html',
  styleUrls: ['./nada-athlete-sanctioned.component.css'],
  standalone:true,
  imports:[CommonModule, ReactiveFormsModule, MaterialModule, LoaderComponent],
  providers:[
    {provide:DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {
      provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS
    },
    DatePipe
  ]
})
export class NadaAthleteSanctionedComponent implements OnInit {
  sanctionedForm!:FormGroup;
  loader:boolean = false;
  elementRowData!:NadaAtheleteListDataEntity | any
  constructor(
    public activeModal: NgbActiveModal,
    private _fb:FormBuilder,
    private nadaService:NadaService,
    private _datePipe:DatePipe,
    private _alertService:AlertService
  ) { }

  ngOnInit() {
    this.sanctionedFormInitiate()
  }

  sanctionedFormInitiate(){
    this.sanctionedForm = this._fb.group({
      nsrsId: [{value:this.elementRowData.elementData.nsrsId, disabled: true}, Validators.required],   
      name: [{value: this.elementRowData.elementData.ath_Name, disabled: true}],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
      remark: ['', Validators.required]   
    })
  }
  save(){
    const payload = {
        nsrsId: this.elementRowData.elementData.nsrsId,
        blockingAgencyId: 2,
        from_date: this._datePipe.transform(this.sanctionedForm.getRawValue().from_date, 'yyyy-MM-dd'),
        to_date: this._datePipe.transform(this.sanctionedForm.getRawValue().to_date, 'yyyy-MM-dd'),
        remark: this.sanctionedForm.getRawValue().remark
    }
    if(this.sanctionedForm.valid){
      this.loader = true;
      this.nadaService.Save_Nada_Block_Athlete_Detail(payload).subscribe({
        next:(res:any)=>{
          this.loader = false;
          if(res.code===200){
            this._alertService.swalPopSuccess(res.message || 'Save Successfully');
            this.activeModal.close(1)
          }
        },
        error:(err)=>{
          this.loader = false;
        }
      })
    }    
  }

}
