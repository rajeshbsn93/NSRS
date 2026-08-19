import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { CommonSharableService } from "src/app/_common/services/common-services/commonSharable.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import Swal from "sweetalert2";

@Component({
    selector:'app-edit-official-mapping-date',
    templateUrl:'./edit-official-mapping-date.component.html',
    styleUrls:['./edit-official-mapping-date.component.css'],
    standalone:true,
imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
providers: [
  {provide: DateAdapter, useClass: MomentDateAdapter},
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  DatePipe
],
})
export class EditOfficialMappingDateComponent implements OnInit{
    editDateForm!:FormGroup;
    rowData:any;
    loader:boolean = false;
    maxDate:any;
    minDate:any;
    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,private datePipe:DatePipe,
                private commonSharableService:CommonSharableService){}

    ngOnInit(): void {
        this.maxDate = new Date();
        let getMinData = this.rowData.period.split('-')[0].split('/');
        this.minDate = new Date(getMinData[2],(getMinData[1] - 1),getMinData[0]);
        //console.log(this.minDate)
        this.editDateForm = this.fb.group({
            todate:['',Validators.required]
        })
    }

    save(){
        //console.log(this.editDateForm.value);
        let mappingType = 0
        if(this.editDateForm.valid){
            if(this.rowData.checkType == 'coach'){
                mappingType = 2
            }else if(this.rowData.checkType == 'ss'){
                mappingType = 103
            }
            this.loader = true
            this.commonSharableService.weedoutOtherOfficialMapping(
                mappingType,
                this.datePipe.transform(this.editDateForm.value.todate,'yyyy-MM-dd'),
                this.rowData.mapId
                ).subscribe({
                    next:(response)=>{
                        this.loader = false;
                        if(response){
                            this.activeModal.close(mappingType)
                            Swal.fire({
                                icon:'success',
                                text:'Updated Successfully!',
                                showConfirmButton:true
                            });

                        }
                    },
                    error:(err)=>{
                        this.loader = false
                        console.error(err)
                    }
                })
        }else{
            this.editDateForm.markAllAsTouched();
        }
        
    }
}