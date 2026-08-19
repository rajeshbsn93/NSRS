import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { AcademySharableService } from "src/app/_common/services/role-inner-pages-services/academy-services/academySharable.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-edit-athlete-official-mapping-date',
    templateUrl:'./edit-athlete-official-mapping-date.component.html',
    styleUrls: ['./edit-athlete-official-mapping-date.component.css'],
    standalone:true,
    imports: [CommonModule,MaterialModule, LoaderComponent, FormsModule],
    providers: [
        {provide:DateAdapter, useClass:MomentDateAdapter},
        {provide:MAT_DATE_FORMATS, useValue:MY_DATE_FORMATS},
        DatePipe
    ]
})

export class EditAthleteOfficialMappingDateComponent implements OnInit{
    minDate:any;
    loader:boolean = false;
    EndDateModel:any;
    rowData:any

    constructor(public activeModal:NgbActiveModal, private datePipe:DatePipe,
        private academySharableService:AcademySharableService,
        private alertService:AlertService){}

    ngOnInit(): void {
        //console.log(this.rowData)
        let getMinDate = this.rowData.coach_fromDate.split('/');
        this.minDate = new Date(getMinDate[2],getMinDate[1] - 1,getMinDate[0])
        
    }

    save(){
        if(this.EndDateModel !=null){
            // console.log(this.datePipe.transform(this.EndDateModel,'yyyy-MM-dd'))
            this.loader = true
            this.academySharableService.UpdateAcademy_Official_Mapping(this.rowData.mapId,this.datePipe.transform(this.EndDateModel,'yyyy-MM-dd'),this.rowData.roleId).subscribe({
                next:(response)=>{
                    //console.log(response);
                    this.loader = false;
                    this.activeModal.close(response);
                    this.alertService.swalPopSuccess('Update successfully!')
                },
                error:(err)=>{
                    this.loader = false;
                    console.error(err)
                }
            })
        }else{
            this.alertService.swalPopError('Please select date!')
        }
    }
}