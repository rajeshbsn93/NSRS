import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import {MemberScientificBodiesDetailsEntity, researchExperienceService } from "src/app/_common/services/role-inner-pages-services/sport-scientist-services/research-experience.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-sport-scientist-popup-pfrofile-membership-scientific',
    templateUrl:'./sport-scientist-popup-pfrofile-membership-scientific.component.html',
    styleUrls:['./sport-scientist-popup-pfrofile-membership-scientific.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,LoaderComponent],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
      ]
})

export class SportScientistPopupProfileMembershipSpecificComponent implements OnInit{
    loader:boolean = false;
    userDetails:any;
    @ViewChild('deleteExperience') deleteExperience:any;
    deleteExperienceModalRef:any
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    experienceTableData = new MatTableDataSource<MemberScientificBodiesDetailsEntity>();
    experienceTableColumns:string[] = ['sl','body_type','body_name','body_year','remark'];

    deleteRowData:any;

    official_detail_id:any;


    constructor(public activeModal:NgbActiveModal,
        private experienceService:researchExperienceService,private storageService:StorageService,){}

    ngOnInit(): void {
        this.userDetails=this.storageService.getUserDetails();
        this.get_member_scientific_bodies_details()
             
    }

    get_member_scientific_bodies_details(){
        this.loader = true;
        this.experienceService.member_scientific_bodies_details(this.official_detail_id).subscribe({
            next:(response:any)=>{
                this.loader = false;
                this.experienceTableData = new MatTableDataSource<MemberScientificBodiesDetailsEntity>(response);
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