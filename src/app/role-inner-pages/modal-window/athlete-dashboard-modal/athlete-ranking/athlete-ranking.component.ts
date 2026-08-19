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
    selector:'app-athlete-ranking',
    templateUrl:'./athlete-ranking.component.html',
    styleUrls:['./athlete-ranking.component.css'],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
      ],
      standalone:true,
      imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
})

export class AthleteRankingComponent implements OnInit{
    athleteRankForm!:FormGroup;

    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,private aletService:AlertService,
        private storageService:StorageService,private enableDisableService:Enable_disableFormService) { }

    ngOnInit(): void {
        this.athleteRankForm = this.fb.group({
            athleteRankFormControl:this.fb.array([])            
        });
        this.athleteRankFormArray.push(this.initathleteRankArray())
    }
    get athleteRankFormArray():FormArray{
        return this.athleteRankForm.get('athleteRankFormControl') as FormArray
    }

    initathleteRankArray(){
        return this.fb.group({
            category:[''],
            competition_level:[''],
            name_of_competition:[''],
            from_date:[null],
            to_date:[null],
            venue:[''],
            represente:[''],
        })
    }
    addMore(){
        this.athleteRankFormArray.push(this.initathleteRankArray())
    }
    removeRow(i:number){
        this.athleteRankFormArray.removeAt(i)
    }

}