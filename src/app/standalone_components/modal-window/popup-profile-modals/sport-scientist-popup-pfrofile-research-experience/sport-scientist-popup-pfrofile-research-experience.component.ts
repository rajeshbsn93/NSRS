import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { resarch_ExperienceEntity, researchExperienceService } from "src/app/_common/services/role-inner-pages-services/sport-scientist-services/research-experience.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-sport-scientist-popup-pfrofile-research-experience',
    templateUrl:'./sport-scientist-popup-pfrofile-research-experience.component.html',
    styleUrls:['./sport-scientist-popup-pfrofile-research-experience.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent]
})

export class SportScientistPopupProfileResearchExperienceComponent implements OnInit{
    loader:boolean = false;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    experienceTableData = new MatTableDataSource<resarch_ExperienceEntity>();
    experienceTableColumns:string[] = ['sl','year_of_experience','institute_of_research','remark'];
    official_detail_id:any;


    constructor(public activeModal:NgbActiveModal,
        private experienceService:researchExperienceService){}

    ngOnInit(): void {
        this.getResarchExperience()
             
    }

    getResarchExperience(){
        this.loader = true;
        this.experienceService.resarch_Experience(this.official_detail_id).subscribe({
            next:(response:any)=>{
                this.loader = false;
                this.experienceTableData = new MatTableDataSource<resarch_ExperienceEntity>(response);
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