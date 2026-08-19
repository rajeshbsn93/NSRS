import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import {OfficialsAwardListEntity, researchExperienceService } from "src/app/_common/services/role-inner-pages-services/sport-scientist-services/research-experience.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-coach-popup-pfrofile-award-received',
    templateUrl:'./coach-popup-pfrofile-award-received.component.html',
    styleUrls:['./coach-popup-pfrofile-award-received.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class CoachPopupProfileAwardReceivedComponent implements OnInit{
    loader:boolean = false;
    official_detail_id:any;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    experienceTableData = new MatTableDataSource<OfficialsAwardListEntity>();
    experienceTableColumns:string[] = ['sl','award_recieved_from','award_name','award_year'];


    constructor(public activeModal:NgbActiveModal,
        private experienceService:researchExperienceService,){}

    ngOnInit(): void {
        this.get_officials_award_list()
             
    }

    get_officials_award_list(){
        this.loader = true;
        this.experienceService.officials_award_list(this.official_detail_id).subscribe({
            next:(response:any)=>{
                this.loader = false;
                this.experienceTableData = new MatTableDataSource<OfficialsAwardListEntity>(response);
                this.experienceTableData.paginator = this.paginator
                this.experienceTableData.sort = this.sort
            },
            error:(err)=>{
                this.loader = false
                console.error(err)
            }
        })
    }
}