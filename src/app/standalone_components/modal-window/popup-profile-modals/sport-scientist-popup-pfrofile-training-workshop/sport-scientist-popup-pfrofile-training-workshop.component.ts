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
import { teaching_ExperienceEntity, researchExperienceService } from "src/app/_common/services/role-inner-pages-services/sport-scientist-services/research-experience.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-sport-scientist-popup-pfrofile-training-workshop',
    templateUrl:'./sport-scientist-popup-pfrofile-training-workshop.component.html',
    styleUrls:['./sport-scientist-popup-pfrofile-training-workshop.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class SportScientistPopupProfileTrainingWorkshopComponent implements OnInit{
    loader:boolean = false;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    experienceTableData = new MatTableDataSource<teaching_ExperienceEntity>();
    experienceTableColumns:string[] = ['sl','type','level','name','date'];
    official_detail_id:any;

    constructor(public activeModal:NgbActiveModal,
        private experienceService:researchExperienceService){}

    ngOnInit(): void {
        this.get_training_workshop_conference_details()
             
    }

    get_training_workshop_conference_details(){
        this.loader = true;
        this.experienceService.training_workshop_conference_details(this.official_detail_id).subscribe({
            next:(response:any)=>{
                this.loader = false;
                this.experienceTableData = new MatTableDataSource<teaching_ExperienceEntity>(response);
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