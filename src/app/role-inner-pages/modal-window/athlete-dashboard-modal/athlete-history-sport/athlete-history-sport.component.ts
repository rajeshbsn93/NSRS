import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { Enable_disableFormService } from "src/app/_common/services/common-services/enable_disableForm.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-athlete-history-sport',
    templateUrl:'./athlete-history-sport.component.html',
    styleUrls:['./athlete-history-sport.component.css'],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
      ],
      standalone:true,
      imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
})

export class AthleteHistorySportComponent implements OnInit{
    historySportForm!:FormGroup;

    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,private aletService:AlertService,
        private storageService:StorageService,private enableDisableService:Enable_disableFormService) { }

    ngOnInit(): void {
        this.historySportForm = this.fb.group({
            historyArrayControl:this.fb.array([])            
        });
        this.historyArray.push(this.initHistoryArray())
    }
get historyArray():FormArray{
    return this.historySportForm.get('historyArrayControl') as FormArray
}

initHistoryArray(){
    return this.fb.group({
        training_center:[''],
        training_center_nsrsid:[''],
        coach_nsrsid:[''],
        coach:[''],
        from_date:[null],
        to_date:[null],
    })
}
addMore(){
    this.historyArray.push(this.initHistoryArray())
}
removeRow(i:number){
    this.historyArray.removeAt(i)
}

}